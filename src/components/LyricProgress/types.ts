import type { Language, Vocabulary } from "@/types";

// FlashcardStudy component props
export interface FlashcardStudyProps {
  language: Language;
  vocabulary: Vocabulary[];
  onComplete: () => void;
  isReviewMode?: boolean;
}

// VocabularyTest component props
export interface VocabularyTestProps {
  vocabulary: Vocabulary[];
  onComplete: () => void;
  onUpdateMastery: (word: string, isCorrect: boolean) => void;
  onBackToStudy?: () => void;
  onIncorrectAnswer?: (word: Vocabulary) => void;
  currentSongId?: string;
  currentLyricText?: string;
  currentLyricStartTime?: number;
}

// SingingChallenge component props
export interface SingingChallengeProps {
  language: Language;
  lyricText: string;
  reading: string;
  translation: string;
  onComplete: () => void;
}

// SentenceReorderPuzzle component props
export interface SentenceReorderPuzzleProps {
  sentence: string;
  translation: string;
  onComplete: () => void;
}

// RewardVideoPlayer component props
export interface RewardVideoPlayerProps {
  youtubeUrl: string;
  startTime: number;
  nextStartTime?: number;
  reading: string;
  lyricText: string;
  translation: string;
  onNext: () => void;
}

// Web Speech API types
export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognition extends EventTarget {
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
