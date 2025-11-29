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
  ) => {
    if (!songId) {
      console.error("No song ID provided");
      return;
    }

    const song = getSongById(songId);
    if (!song) {
      console.error("Song not found");
      return;
    }

    // ストアに保存
    addWord(word, meaning, reading, {
      songId: song.id,
      songTitle: song.title,
      artistName: song.artist,
      youtubeUrl: song.youtubeUrl,
      timestamp: lyricLine.startTime, // その歌詞行の開始時間を保存
      sourceLyric: lyricLine.text, // 文脈としてその行の歌詞を保存
    });

    // 簡易的なフィードバック（本来はToastコンポーネント推奨）
    console.log(`「${word}」を単語帳に保存しました！📖`);
    alert(`「${word}」を単語帳に保存しました！📖`);
  };

  return { handleWordClick };
};
