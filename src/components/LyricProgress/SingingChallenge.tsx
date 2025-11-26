import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, ChevronRight, RotateCcw, Volume2 } from "lucide-react";
import { speakKorean } from "@/utils/speechUtils";

interface SingingChallengeProps {
    lyricText: string;
    reading: string;
    translation: string;
    onComplete: () => void;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    onerror: (event: Event) => void;
}

declare global {
    interface Window {
        SpeechRecognition: {
            new(): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new(): SpeechRecognition;
        };
    }
}

export const SingingChallenge = ({
    lyricText,
    reading,
    translation,
    onComplete,
}: SingingChallengeProps) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = "ko-KR";

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const lastResult = event.results[event.results.length - 1];
                const text = lastResult[0].transcript;
                setTranscript(text);

                if (lastResult.isFinal) {
                    checkPronunciation(text);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setError("音声認識エラーが発生しました。もう一度試してください。");
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            setError("お使いのブラウザは音声認識をサポートしていません。");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [lyricText]);

    const startListening = () => {
        if (recognitionRef.current) {
            setError(null);
            setTranscript("");
            setFeedback("idle");
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Failed to start recognition", e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const checkPronunciation = (spokenText: string) => {
        const cleanSpoken = spokenText.trim().toLowerCase().replace(/\s+/g, "");
        const cleanTarget = lyricText.trim().toLowerCase().replace(/\s+/g, "");

        // Simple fuzzy matching: check if at least 50% of the target characters are present in the spoken text
        // This is very basic. For better results, we'd use Levenshtein distance.
        // But for "singing", maybe just checking if it's non-empty and has some overlap is enough for a prototype.

        // Let's try a slightly better approach: Word overlap
        const targetWords = lyricText.toLowerCase().split(/\s+/);
        const spokenWords = spokenText.toLowerCase().split(/\s+/);

        let matchCount = 0;
        targetWords.forEach(tWord => {
            if (spokenWords.some(sWord => sWord.includes(tWord) || tWord.includes(sWord))) {
                matchCount++;
            }
        });

        const matchRate = matchCount / targetWords.length;

        if (matchRate >= 0.5 || cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) {
            setFeedback("correct");
        } else {
            setFeedback("incorrect");
        }
    };

    const handleRetry = () => {
        setTranscript("");
        setFeedback("idle");
        startListening();
    };

    const handlePlayAudio = () => {
        speakKorean(lyricText);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            {/* Header */}
            <div className="w-full glass-card p-4 rounded-2xl text-center">
                <p className="text-sm text-gray-700 font-semibold">
                    歌詞を歌ってみよう！
                </p>
            </div>

            {/* Card */}
            <Card className="w-full glass-card border-0 shadow-2xl relative overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center p-8 min-h-[300px]">

                    <div className="flex flex-col items-center gap-4 mb-6 w-full">
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-gradient-primary text-center leading-relaxed">
                                {lyricText}
                            </p>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePlayAudio}
                                className="rounded-full hover:bg-purple-100 text-purple-600 shrink-0"
                            >
                                <Volume2 className="w-6 h-6" />
                            </Button>
                        </div>

                        <p className="text-lg text-purple-600 font-medium">
                            {reading}
                        </p>
                        <p className="text-sm text-gray-500">
                            {translation}
                        </p>
                    </div>

                    {/* Feedback Area */}
                    <div className="min-h-[80px] w-full flex flex-col items-center justify-center mb-6">
                        {transcript && (
                            <p className="text-lg text-gray-800 font-medium mb-2 text-center">
                                "{transcript}"
                            </p>
                        )}

                        <AnimatePresence mode="wait">
                            {feedback === "correct" && (
                                <motion.div
                                    key="correct"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="text-green-600 font-bold text-xl flex items-center gap-2"
                                >
                                    <span>Great Singing! 🎤</span>
                                </motion.div>
                            )}

                            {feedback === "incorrect" && (
                                <motion.div
                                    key="incorrect"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="text-red-500 font-bold text-lg"
                                >
                                    もう一度トライ！
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4">
                        {feedback !== "correct" ? (
                            <Button
                                size="lg"
                                onClick={isListening ? stopListening : startListening}
                                className={`rounded-full w-20 h-20 flex items-center justify-center transition-all duration-300 ${isListening
                                        ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50"
                                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-purple-500/50"
                                    } shadow-lg`}
                            >
                                {isListening ? (
                                    <MicOff className="w-10 h-10 text-white" />
                                ) : (
                                    <Mic className="w-10 h-10 text-white" />
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={onComplete}
                                className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                次へ進む
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        )}

                        {feedback === "incorrect" && (
                            <Button
                                variant="outline"
                                onClick={handleRetry}
                                className="h-12 w-12 rounded-full glass-panel border-0"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Skip button for testing/fallback */}
            <Button
                variant="ghost"
                onClick={onComplete}
                className="text-gray-400 hover:text-gray-600 text-sm"
            >
                スキップ (音声認識が使えない場合)
            </Button>
        </div>
    );
};
