import { useLibraryStore } from "@/stores/libraryStore";
import type { LyricLine } from "@/types";
import songData from "../data/song_data.json";

export const useWordAction = () => {
    const { addWord } = useLibraryStore();

    const handleWordClick = (
        word: string,
        reading: string,
        meaning: string,
        lyricLine: LyricLine
    ) => {
        // ストアに保存
        addWord(word, meaning, reading, {
            songTitle: songData.title || "Unknown Title",
            artistName: songData.artist || "Unknown Artist",
            youtubeUrl: songData.youtubeUrl,
            timestamp: lyricLine.startTime, // その歌詞行の開始時間を保存
            sourceLyric: lyricLine.text, // 文脈としてその行の歌詞を保存
        });

        // 簡易的なフィードバック（本来はToastコンポーネント推奨）
        console.log(`「${word}」を単語帳に保存しました！📖`);
        alert(`「${word}」を単語帳に保存しました！📖`);
    };

    return { handleWordClick };
};
