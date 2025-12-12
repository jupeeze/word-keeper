import { describe, it, expect, vi, beforeEach } from "vitest";
import { speak, cancelSpeech, initializeSpeech } from "../speechUtils";

describe("speechUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("speak", () => {
    it("should call speechSynthesis.speak with correct parameters", () => {
      const speakMock = vi.spyOn(window.speechSynthesis, "speak");
      const cancelMock = vi.spyOn(window.speechSynthesis, "cancel");

      speak("안녕하세요", { lang: "ko-KR" });

      expect(cancelMock).toHaveBeenCalled();
      expect(speakMock).toHaveBeenCalled();

      const utterance = speakMock.mock.calls[0][0] as SpeechSynthesisUtterance;
      expect(utterance.text).toBe("안녕하세요");
      expect(utterance.lang).toBe("ko-KR");
    });

    it("should use default rate of 0.9", () => {
      const speakMock = vi.spyOn(window.speechSynthesis, "speak");

      speak("Hello", { lang: "en-US" });

      const utterance = speakMock.mock.calls[0][0] as SpeechSynthesisUtterance;
      expect(utterance.rate).toBe(0.9);
    });

    it("should allow custom rate, pitch, and volume", () => {
      const speakMock = vi.spyOn(window.speechSynthesis, "speak");

      speak("Hello", {
        lang: "en-US",
        rate: 1.5,
        pitch: 1.2,
        volume: 0.8,
      });

      const utterance = speakMock.mock.calls[0][0] as SpeechSynthesisUtterance;
      expect(utterance.rate).toBe(1.5);
      expect(utterance.pitch).toBe(1.2);
      expect(utterance.volume).toBe(0.8);
    });

    it("should handle missing speechSynthesis gracefully", () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      // @ts-ignore
      delete window.speechSynthesis;

      const consoleWarnSpy = vi.spyOn(console, "warn");

      speak("Hello", { lang: "en-US" });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "音声合成はサポートされていません。",
      );

      window.speechSynthesis = originalSpeechSynthesis;
      consoleWarnSpy.mockRestore();
    });
  });

  describe("cancelSpeech", () => {
    it("should call speechSynthesis.cancel", () => {
      const cancelMock = vi.spyOn(window.speechSynthesis, "cancel");

      cancelSpeech();

      expect(cancelMock).toHaveBeenCalled();
    });

    it("should handle missing speechSynthesis gracefully", () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      // @ts-ignore
      delete window.speechSynthesis;

      expect(() => cancelSpeech()).not.toThrow();

      window.speechSynthesis = originalSpeechSynthesis;
    });
  });

  describe("initializeSpeech", () => {
    it("should speak empty utterance for initialization", () => {
      const speakMock = vi.spyOn(window.speechSynthesis, "speak");

      initializeSpeech();

      expect(speakMock).toHaveBeenCalled();
      const utterance = speakMock.mock.calls[0][0] as SpeechSynthesisUtterance;
      expect(utterance.text).toBe("");
    });

    it("should handle missing speechSynthesis gracefully", () => {
      const originalSpeechSynthesis = window.speechSynthesis;
      // @ts-ignore
      delete window.speechSynthesis;

      expect(() => initializeSpeech()).not.toThrow();

      window.speechSynthesis = originalSpeechSynthesis;
    });
  });
});
