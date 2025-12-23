// Import all individual song files
import elevenData from "./songs/eleven-ive.json";
import fiestaData from "./songs/fiesta-iz*one.json";
import payphoneData from "./songs/payphone_maroon-5.json";
import whatMakesYouBeautifulData from "./songs/what-makes-you-beautiful_one-direction.json";
import type { Song } from "@/types";

// Type assertions for JSON imports
const eleven = elevenData as Song;
const fiesta = fiestaData as Song;
const payphone = payphoneData as Song;
const whatMakesYouBeautiful = whatMakesYouBeautifulData as Song;

// Export as array
export const songs: Song[] = [eleven, fiesta, payphone, whatMakesYouBeautiful];

export default songs;
