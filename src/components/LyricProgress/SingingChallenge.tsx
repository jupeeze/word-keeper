import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Mic, MicOff, ChevronRight, RotateCcw, Volume2 } from "lucide-react";
import { speak } from "@/utils/speechUtils";
import type { Language } from "@/types";

interface SingingChallengeProps {
  language: Language;
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
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

const SingingChallenge = ({
  language,
  lyricText,
  reading,
  translation,
  onComplete,
}: SingingChallengeProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

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
      checkPronunciation(transcript);
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
    targetWords.forEach((tWord) => {
      if (
        spokenWords.some(
          (sWord) => sWord.includes(tWord) || tWord.includes(sWord),
        )
      ) {
        matchCount++;
      }
    });

    const matchRate = matchCount / targetWords.length;

    if (
      matchRate >= 0.5 ||
      cleanSpoken.includes(cleanTarget) ||
      cleanTarget.includes(cleanSpoken)
    ) {
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
    speak(lyricText, { lang: language });
  };

  return (
    <Card>
      <CardHeader className="text-sm font-semibold">
        歌詞を歌ってみよう！
      </CardHeader>
      <CardContent className="flex h-72 flex-col items-center justify-center px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayAudio}
          className="shrink-0 rounded-full text-purple-600 hover:bg-purple-100"
        >
          <Volume2 className="h-6 w-6" />
        </Button>

        <div className="mb-6 flex w-full justify-center gap-4">
          <div className="flex flex-col items-center">
            <p className="text-xs font-medium text-purple-600">{reading}</p>
            <p className="text-gradient-primary text-center text-xl leading-relaxed font-bold">
              {lyricText}
            </p>
            <p className="text-sm text-gray-500">{translation}</p>
          </div>
        </div>

        {/* Feedback Area */}
        <div className="mb-6 flex min-h-[80px] w-full flex-col items-center justify-center">
          {transcript && (
            <p className="text-center text-lg font-medium text-gray-800">
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
                className="flex items-center gap-2 text-xl font-bold text-green-600"
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
                className="text-lg font-bold text-red-500"
              >
                もう一度トライ！
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {feedback !== "correct" ? (
            <Button
              size="lg"
              onClick={isListening ? stopListening : startListening}
              className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${
                isListening
                  ? "animate-pulse bg-red-500 shadow-red-500/50 hover:bg-red-600"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 shadow-purple-500/50 hover:from-blue-600 hover:to-purple-700"
              } shadow-lg`}
            >
              {isListening ? (
                <MicOff className="h-10 w-10 text-white" />
              ) : (
                <Mic className="h-10 w-10 text-white" />
              )}
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className="h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
            >
              次へ進む
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {feedback === "incorrect" && (
            <Button
              variant="outline"
              onClick={handleRetry}
              className="glass-panel h-12 w-12 rounded-full border-0"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="h-9">
        {/* Footer */}
        <div className="glass-card w-full rounded-2xl text-center">
          {/* Skip button for testing/fallback */}
          <Button
            variant="ghost"
            onClick={onComplete}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            スキップ (音声認識が使えない場合)
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SingingChallenge;
