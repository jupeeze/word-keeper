import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LibraryGrid } from "../components/Library/LibraryGrid";
import { Button } from "@/components/ui/button";
import type { PageNavigationProps } from "@/types";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export const LibraryPage = ({ setPage }: PageNavigationProps) => {
  return (
    <div className="gradient-primary relative overflow-hidden">
      <div className="relative space-y-4">
        {/* Header */}
        <Card>
          <CardHeader className="relative h-8 flex-row justify-start">
            <Button
              onClick={() => setPage("songList")}
              variant="ghost"
              size="sm"
              className="glass-panel shrink-0 transition-all duration-300 hover:bg-white/40"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <CardTitle className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2">
              <span className="truncate">単語辞書</span>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Library Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-3xl"
        >
          <LibraryGrid />
        </motion.div>
      </div>
    </div>
  );
};
