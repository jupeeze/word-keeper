import { describe, it, expect } from "vitest";
import { shuffleArray, getRandomItems } from "../arrayUtils";

describe("arrayUtils", () => {
  describe("shuffleArray", () => {
    it("should return an array with the same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      expect(result).toHaveLength(input.length);
    });

    it("should contain all original elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      input.forEach((item) => {
        expect(result).toContain(item);
      });
    });

    it("should not mutate the original array", () => {
      const input = [1, 2, 3, 4, 5];
      const original = [...input];
      shuffleArray(input);
      expect(input).toEqual(original);
    });

    it("should handle empty arrays", () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });

    it("should handle single-element arrays", () => {
      const result = shuffleArray([1]);
      expect(result).toEqual([1]);
    });

    it("should work with different data types", () => {
      const input = ["a", "b", "c"];
      const result = shuffleArray(input);
      expect(result).toHaveLength(3);
      expect(result).toContain("a");
      expect(result).toContain("b");
      expect(result).toContain("c");
    });
  });

  describe("getRandomItems", () => {
    it("should return requested number of items", () => {
      const input = [1, 2, 3, 4, 5];
      const result = getRandomItems(input, 3);
      expect(result).toHaveLength(3);
    });

    it("should return all items if count exceeds array length", () => {
      const input = [1, 2, 3];
      const result = getRandomItems(input, 10);
      expect(result).toHaveLength(3);
    });

    it("should return subset of original array", () => {
      const input = [1, 2, 3, 4, 5];
      const result = getRandomItems(input, 2);
      result.forEach((item) => {
        expect(input).toContain(item);
      });
    });

    it("should not mutate the original array", () => {
      const input = [1, 2, 3, 4, 5];
      const original = [...input];
      getRandomItems(input, 3);
      expect(input).toEqual(original);
    });

    it("should handle count of 0", () => {
      const input = [1, 2, 3];
      const result = getRandomItems(input, 0);
      expect(result).toEqual([]);
    });

    it("should handle empty arrays", () => {
      const result = getRandomItems([], 5);
      expect(result).toEqual([]);
    });
  });
});
