import "@testing-library/jest-dom";
import { beforeAll, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Speech API
beforeAll(() => {
  // Mock SpeechSynthesisUtterance
  global.SpeechSynthesisUtterance = class MockSpeechSynthesisUtterance {
    text = "";
    lang = "";
    rate = 1;
    pitch = 1;
    volume = 1;
    voice = null;
    onstart = null;
    onend = null;
    onerror = null;
    onpause = null;
    onresume = null;
    onmark = null;
    onboundary = null;

    constructor(text?: string) {
      this.text = text || "";
    }
  } as any;

  // Mock SpeechSynthesis
  if (!window.speechSynthesis) {
    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn(() => []),
      pending: false,
      speaking: false,
      paused: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as any;
  }

  // Mock SpeechRecognition
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    class MockSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = "ko-KR";
      onresult = vi.fn();
      onend = vi.fn();
      onerror = vi.fn();
      start = vi.fn();
      stop = vi.fn();
      abort = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();
    }

    window.SpeechRecognition = MockSpeechRecognition as any;
    window.webkitSpeechRecognition = MockSpeechRecognition as any;
  }
});
