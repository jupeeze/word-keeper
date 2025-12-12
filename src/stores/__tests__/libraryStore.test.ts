import { describe, it, expect, beforeEach } from "vitest";
import { useLibraryStore } from "../libraryStore";

describe("libraryStore", () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useLibraryStore.getState();
    store.savedWords.forEach((word) => {
      store.removeWord(word.id);
    });
  });

  describe("addWord", () => {
    it("should add a new word with context", () => {
      const { addWord } = useLibraryStore.getState();

      addWord("사랑", "愛", "サラン", {
        songId: "song1",
        songTitle: "Test Song",
        artistName: "Test Artist",
        youtubeUrl: "https://youtube.com/test",
        timestamp: 10,
        sourceLyric: "사랑해요",
      });

      const state = useLibraryStore.getState();
      expect(state.savedWords).toHaveLength(1);
      expect(state.savedWords[0].word).toBe("사랑");
      expect(state.savedWords[0].meaning).toBe("愛");
      expect(state.savedWords[0].pronunciation).toBe("サラン");
      expect(state.savedWords[0].contexts).toHaveLength(1);
      expect(state.savedWords[0].contexts[0].songTitle).toBe("Test Song");
    });

    it("should add context to existing word", () => {
      const { addWord } = useLibraryStore.getState();

      // Add first context
      addWord("사랑", "愛", "サラン", {
        songId: "song1",
        songTitle: "Song 1",
        artistName: "Artist 1",
        youtubeUrl: "https://youtube.com/test1",
        timestamp: 10,
        sourceLyric: "사랑해요",
      });

      // Add second context for the same word
      addWord("사랑", "愛", "サラン", {
        songId: "song2",
        songTitle: "Song 2",
        artistName: "Artist 2",
        youtubeUrl: "https://youtube.com/test2",
        timestamp: 20,
        sourceLyric: "사랑만이",
      });

      const state = useLibraryStore.getState();
      expect(state.savedWords).toHaveLength(1);
      expect(state.savedWords[0].contexts).toHaveLength(2);
      expect(state.savedWords[0].contexts[0].songTitle).toBe("Song 1");
      expect(state.savedWords[0].contexts[1].songTitle).toBe("Song 2");
    });

    it("should prevent duplicate context", () => {
      const { addWord } = useLibraryStore.getState();

      const context = {
        songId: "song1",
        songTitle: "Test Song",
        artistName: "Test Artist",
        youtubeUrl: "https://youtube.com/test",
        timestamp: 10,
        sourceLyric: "사랑해요",
      };

      addWord("사랑", "愛", "サラン", context);
      addWord("사랑", "愛", "サラン", context);

      const state = useLibraryStore.getState();
      expect(state.savedWords).toHaveLength(1);
      expect(state.savedWords[0].contexts).toHaveLength(1);
    });

    it("should set initial mastery level to 0", () => {
      const { addWord } = useLibraryStore.getState();

      addWord("사랑", "愛", "サラン", {
        songId: "song1",
        songTitle: "Test Song",
        artistName: "Test Artist",
        youtubeUrl: "https://youtube.com/test",
        timestamp: 10,
        sourceLyric: "사랑해요",
      });

      const state = useLibraryStore.getState();
      expect(state.savedWords[0].masteryLevel).toBe(0);
    });
  });

  describe("removeWord", () => {
    it("should remove a word by id", () => {
      const { addWord, removeWord } = useLibraryStore.getState();

      addWord("사랑", "愛", "サラン", {
        songId: "song1",
        songTitle: "Test Song",
        artistName: "Test Artist",
        youtubeUrl: "https://youtube.com/test",
        timestamp: 10,
        sourceLyric: "사랑해요",
      });

      const wordId = useLibraryStore.getState().savedWords[0].id;
      removeWord(wordId);

      const state = useLibraryStore.getState();
      expect(state.savedWords).toHaveLength(0);
    });
  });

  describe("removeContext", () => {
    it("should remove a specific context from a word", () => {
      const { addWord, removeContext } = useLibraryStore.getState();

      addWord("사랑", "愛", "サラン", {
        songId: "song1",
        songTitle: "Song 1",
        artistName: "Artist 1",
        youtubeUrl: "https://youtube.com/test1",
        timestamp: 10,
        sourceLyric: "사랑해요",
      });

      addWord("사랑", "愛", "サラン", {
        songId: "song2",
        songTitle: "Song 2",
        artistName: "Artist 2",
        youtubeUrl: "https://youtube.com/test2",
        timestamp: 20,
        sourceLyric: "사랑만이",
      });

      const word = useLibraryStore.getState().savedWords[0];
      const firstContextId = word.contexts[0].id;

      removeContext(word.id, firstContextId);

      const state = useLibraryStore.getState();
      expect(state.savedWords).toHaveLength(1);
      expect(state.savedWords[0].contexts).toHaveLength(1);
      expect(state.savedWords[0].contexts[0].songTitle).toBe("Song 2");
    });

    it("should remove word when last context is removed", () => {
      const { addWord, removeContext } = useLibraryStore.getState();

      addWord("사랑", "愛", "サラン", {
        songId: "song1",
        songTitle: "Test Song",
        artistName: "Test Artist",
        youtubeUrl: "https://youtube.com/test",
        timestamp: 10,
        sourceLyric: "사랑해요",
      });

      const word = useLibraryStore.getState().savedWords[0];
      const contextId = word.contexts[0].id;

      removeContext(word.id, contextId);

      const state = useLibraryStore.getState();
      expect(state.savedWords).toHaveLength(0);
    });
  });

  describe("toggleMastery", () => {
    it("should increment mastery level", () => {
      const { addWord, toggleMastery } = useLibraryStore.getState();

      addWord("사랑", "愛", "サラン", {
        songId: "song1",
        songTitle: "Test Song",
        artistName: "Test Artist",
        youtubeUrl: "https://youtube.com/test",
        timestamp: 10,
        sourceLyric: "사랑해요",
      });

      const wordId = useLibraryStore.getState().savedWords[0].id;

      toggleMastery(wordId);
      expect(useLibraryStore.getState().savedWords[0].masteryLevel).toBe(1);

      toggleMastery(wordId);
      expect(useLibraryStore.getState().savedWords[0].masteryLevel).toBe(2);
    });

    it("should reset mastery level to 0 after reaching 2", () => {
      const { addWord, toggleMastery } = useLibraryStore.getState();

      addWord("사랑", "愛", "サラン", {
        songId: "song1",
        songTitle: "Test Song",
        artistName: "Test Artist",
        youtubeUrl: "https://youtube.com/test",
        timestamp: 10,
        sourceLyric: "사랑해요",
      });

      const wordId = useLibraryStore.getState().savedWords[0].id;

      toggleMastery(wordId); // 0 -> 1
      toggleMastery(wordId); // 1 -> 2
      toggleMastery(wordId); // 2 -> 0

      expect(useLibraryStore.getState().savedWords[0].masteryLevel).toBe(0);
    });
  });
});
