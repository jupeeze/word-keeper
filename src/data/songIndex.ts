// Import all individual song files
import elevenData from './songs/eleven-ive.json';
import twinkletwinkleData from './songs/twinkle-twinkle-korean.json';
import springdayData from './songs/spring-day-bts.json';
import dynamiteData from './songs/dynamite-bts.json';
import type { Song } from '@/types';

// Type assertions for JSON imports
const eleven = elevenData as Song;
const twinkletwinkle = twinkletwinkleData as Song;
const springday = springdayData as Song;
const dynamite = dynamiteData as Song;

// Export as array
export const songs: Song[] = [
    eleven,
    twinkletwinkle,
    springday,
    dynamite,
];

export default songs;
