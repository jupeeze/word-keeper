// Import all individual song files
import payphoneData from "./songs/payphone_maroon-5.json";
import whatMakesYouBeautifulData from "./songs/what-makes-you-beautiful_one-direction.json";
import type { Song } from "@/types";

// Type assertions for JSON imports
const payphone = payphoneData as Song;
const whatMakesYouBeautiful = whatMakesYouBeautifulData as Song;

// Export as array
export const songs: Song[] = [payphone, whatMakesYouBeautiful];

export default songs;
