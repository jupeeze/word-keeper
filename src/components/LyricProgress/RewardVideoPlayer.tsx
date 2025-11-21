import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ArrowRight } from "lucide-react";
import ReactPlayer from "react-player";

interface RewardVideoPlayerProps {
    youtubeUrl: string;
    startTime: number;
    nextStartTime: number;
    lyricText: string;
    translation: string;
    onNext: () => void;
}

export const RewardVideoPlayer = ({
    youtubeUrl,
    startTime,
    nextStartTime,
    lyricText,
    translation,
    onNext,
}: RewardVideoPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const playerRef = useRef<HTMLVideoElement>(null);

    const handleTimeUpdate = () => {
        if (!playerRef.current) return;
        if (playerRef.current.currentTime >= nextStartTime) {
            setIsPlaying(false);
        }
    };

    const handleStart = () => {
        if (playerRef.current) {
            playerRef.current.currentTime = startTime;
        }
    };

    const handleReplay = () => {
        setIsPlaying(true);
        handleStart();
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
            {/* Congratulations message */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
            >
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl mb-2">🎉</p>
                        <h3 className="text-2xl font-bold text-orange-800 mb-2">
                            おめでとうございます！
                        </h3>
                        <p className="text-gray-700">
                            この歌詞行を完全にマスターしました！
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Lyric display */}
            <Card className="w-full">
                <CardContent className="p-6 text-center">
                    <p className="text-2xl font-bold text-blue-800 mb-2">{lyricText}</p>
                    <p className="text-lg text-gray-600">{translation}</p>
                </CardContent>
            </Card>

            {/* Video player */}
            <Card className="w-full overflow-hidden">
                <CardContent className="p-0">
                    <div className="relative aspect-video">
                        <ReactPlayer
                            ref={playerRef}
                            src={youtubeUrl}
                            playing={isPlaying}
                            controls={false}
                            width="100%"
                            height="100%"
                            onStart={handleStart}
                            onTimeUpdate={handleTimeUpdate}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Control buttons */}
            <div className="flex gap-4 w-full">
                <Button
                    onClick={handleReplay}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                >
                    <Play className="w-5 h-5 mr-2" />
                    もう一度再生
                </Button>
                <Button onClick={onNext} size="lg" className="flex-1">
                    次の行へ進む
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>

            {/* Info */}
            <div className="text-center text-sm text-gray-500">
                <p>✨ 報酬として、この歌詞行の動画を視聴できます</p>
            </div>
        </div>
    );
};
