import { create } from "zustand";
import { persist } from "zustand/middleware";
import songsData from "@/data/songIndex";
import type { Song } from "@/types";

interface SongStore {
    songs: Song[];
    selectedSongId: string | null;
    searchQuery: string;
    difficultyFilter: string | null;
    languageFilter: string | null;

    // Actions
    selectSong: (songId: string) => void;
    getSongById: (songId: string) => Song | undefined;
    setSearchQuery: (query: string) => void;
    setDifficultyFilter: (difficulty: string | null) => void;
    setLanguageFilter: (language: string | null) => void;
    getFilteredSongs: () => Song[];
}

export const useSongStore = create(
    persist<SongStore>(
        (set, get) => ({
            songs: songsData as Song[],
            selectedSongId: null,
            searchQuery: "",
            difficultyFilter: null,
            languageFilter: null,

            selectSong: (songId) => {
                set({ selectedSongId: songId });
            },

            getSongById: (songId) => {
                return get().songs.find((song) => song.id === songId);
            },

            setSearchQuery: (query) => {
                set({ searchQuery: query });
            },

            setDifficultyFilter: (difficulty) => {
                set({ difficultyFilter: difficulty });
            },

            setLanguageFilter: (language) => {
                set({ languageFilter: language });
            },

            getFilteredSongs: () => {
                const { songs, searchQuery, difficultyFilter, languageFilter } = get();

                return songs.filter((song) => {
                    const matchesSearch =
                        searchQuery === "" ||
                        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        song.artist.toLowerCase().includes(searchQuery.toLowerCase());

                    const matchesDifficulty =
                        !difficultyFilter || song.difficulty === difficultyFilter;

                    const matchesLanguage =
                        !languageFilter || song.language === languageFilter;

                    return matchesSearch && matchesDifficulty && matchesLanguage;
                });
            },
        }),
        {
            name: "song-storage",
        }
    )
);
