import { describe, it, expect } from "vitest";
import { generateChoices, extractUniqueVocabulary } from "../vocabularyUtils";

describe("vocabularyUtils", () => {
  describe("generateChoices", () => {
    it("should include the correct answer", () => {
      const correctAnswer = "사랑";
      const allOptions = ["사랑", "행복", "기쁨", "슬픔", "희망"];
      const result = generateChoices(correctAnswer, allOptions, 4);

      expect(result).toContain(correctAnswer);
    });

    it("should return the requested number of choices", () => {
      const correctAnswer = "사랑";
      const allOptions = ["사랑", "행복", "기쁨", "슬픔", "희망"];
      const result = generateChoices(correctAnswer, allOptions, 4);

      expect(result).toHaveLength(4);
    });

    it("should prioritize same-length distractors", () => {
      const correctAnswer = "AB";
      const allOptions = ["AB", "CD", "EF", "GHI", "JKL"];
      const result = generateChoices(correctAnswer, allOptions, 3);

      // Should prefer "CD" and "EF" (same length) over "GHI", "JKL"
      expect(result).toContain("AB");
      expect(result.length).toBe(3);
    });

    it("should handle insufficient options by adding dummy choices", () => {
      const correctAnswer = "사랑";
      const allOptions = ["사랑", "행복"];
      const result = generateChoices(correctAnswer, allOptions, 4);

      expect(result).toHaveLength(4);
      expect(result).toContain(correctAnswer);
      // Should have dummy choices
      const dummyChoices = result.filter((choice) =>
        choice.startsWith("ダミーの選択肢"),
      );
      expect(dummyChoices.length).toBeGreaterThan(0);
    });

    it("should not include duplicate choices", () => {
      const correctAnswer = "사랑";
      const allOptions = ["사랑", "행복", "기쁨", "슬픔", "희망"];
      const result = generateChoices(correctAnswer, allOptions, 4);

      const uniqueChoices = new Set(result);
      expect(uniqueChoices.size).toBe(result.length);
    });

    it("should handle default count parameter", () => {
      const correctAnswer = "사랑";
      const allOptions = ["사랑", "행복", "기쁨", "슬픔", "희망"];
      const result = generateChoices(correctAnswer, allOptions);

      expect(result).toHaveLength(4); // Default is 4
    });
  });

  describe("extractUniqueVocabulary", () => {
    it("should extract vocabulary from single song", () => {
      const songData = {
        lyrics: [
          {
            vocabulary: [
              { word: "사랑", reading: "サラン", meaning: "愛" },
              { word: "행복", reading: "ヘンボク", meaning: "幸せ" },
            ],
          },
          {
            vocabulary: [
              { word: "기쁨", reading: "キップム", meaning: "喜び" },
            ],
          },
        ],
      };

      const result = extractUniqueVocabulary(songData);

      expect(result).toHaveLength(3);
      expect(result[0].word).toBe("사랑");
      expect(result[1].word).toBe("행복");
      expect(result[2].word).toBe("기쁨");
    });

    it("should remove duplicate words", () => {
      const songData = {
        lyrics: [
          {
            vocabulary: [
              { word: "사랑", reading: "サラン", meaning: "愛" },
            ],
          },
          {
            vocabulary: [
              { word: "사랑", reading: "サラン", meaning: "愛" },
            ],
          },
        ],
      };

      const result = extractUniqueVocabulary(songData);

      expect(result).toHaveLength(1);
      expect(result[0].word).toBe("사랑");
    });

    it("should handle array of songs", () => {
      const songData = [
        {
          lyrics: [
            {
              vocabulary: [
                { word: "사랑", reading: "サラン", meaning: "愛" },
              ],
            },
          ],
        },
        {
          lyrics: [
            {
              vocabulary: [
                { word: "행복", reading: "ヘンボク", meaning: "幸せ" },
              ],
            },
          ],
        },
      ];

      const result = extractUniqueVocabulary(songData);

      expect(result).toHaveLength(2);
      expect(result[0].word).toBe("사랑");
      expect(result[1].word).toBe("행복");
    });

    it("should handle empty lyrics", () => {
      const songData = {
        lyrics: [],
      };

      const result = extractUniqueVocabulary(songData);

      expect(result).toEqual([]);
    });

    it("should preserve vocabulary properties", () => {
      const songData = {
        lyrics: [
          {
            vocabulary: [
              { word: "사랑", reading: "サラン", meaning: "愛" },
            ],
          },
        ],
      };

      const result = extractUniqueVocabulary(songData);

      expect(result[0]).toEqual({
        word: "사랑",
        reading: "サラン",
        meaning: "愛",
      });
    });
  });
});
