import * as ProgressPrimitive from "@radix-ui/react-progress";

import { motion } from "motion/react";

interface ProgressProps {
  current: number;
  total: number;
  label: string;
}

export const Progress = ({ current, total, label }: ProgressProps) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between text-sm font-semibold text-gray-700">
        <span>{label}</span>
        <span className="text-purple-600">
          {current} / {total}
        </span>
      </div>
      <ProgressPrimitive.Root
        data-slot="progress"
        className="h-3 rounded-full bg-gray-200"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        >
          <ProgressPrimitive.Indicator data-slot="progress-indicator" />
        </motion.div>
      </ProgressPrimitive.Root>
    </div>
  );
};
