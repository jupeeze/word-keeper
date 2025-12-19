import { useState, useEffect, useRef, useCallback } from "react";
import type { Language } from "@/types";
import type { SpeechRecognition } from "../types";
import { toast } from "sonner";

interface UseSpeechRecognitionOptions {
  language: Language;
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  continuous?: boolean;
}

interface UseSpeechRecognitionResult {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
}

/**
 * Web Speech APIのラッパーフック
 * SingingChallengeで使用される音声認識機能を抽出
 */
export const useSpeechRecognition = ({
  language,
  onResult,
  onEnd,
  continuous = false,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionResult => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const currentTranscript = event.results[event.results.length - 1][0].transcript;
      setTranscript(currentTranscript);
      
      if (event.results[event.results.length - 1].isFinal) {
        onResult?.(currentTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      if (event.error === "not-allowed") {
        toast.error("マイクへのアクセスが拒否されました", {
          description: "ブラウザの設定でマイクの使用を許可してください",
        });
      } else if (event.error === "no-speech") {
        toast.warning("音声が検出されませんでした", {
          description: "もう一度お試しください",
        });
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, continuous, onResult, onEnd]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    try {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      toast.error("音声認識の開始に失敗しました");
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error("Failed to stop speech recognition:", error);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
};
