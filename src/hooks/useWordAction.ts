import { useLibraryStore } from "@/stores/libraryStore";
import { useSongStore } from "@/stores/songStore";
import type { LyricLine } from "@/types";

export const useWordAction = (songId?: string) => {
  const { addWord } = useLibraryStore();
  const { getSongById } = useSongStore();

  const handleWordClick = (
    word: string,
    reading: string,
    meaning: string,
    lyricLine: LyricLine,
    note?: string,
  ) => {
    if (!songId) return;

    const song = getSongById(songId);
    if (!song) return;

    addWord(word, meaning, reading, {
      songId: song.id,
      songTitle: song.title,
      artistName: song.artist,
      youtubeUrl: song.youtubeUrl,
      timestamp: lyricLine.startTime,
      sourceLyric: lyricLine.text,
    }, note);

    alert(`「${word}」を単語帳に保存しました！📖`);
  };

  return { handleWordClick };
};
