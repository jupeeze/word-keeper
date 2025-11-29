import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
import { motion } from "motion/react"

interface ProgressProps {
  className?: string,
  current: number
  total: number
  completed?: number
  showCompleted?: boolean
  label?: string
  completedLabel?: string
  barColor?: string
  barClassName?: string
}

export const Progress = ({
  className,
  current,
  total,
  completed,
  showCompleted,
  label,
  completedLabel,
  barColor,
  barClassName
}: ProgressProps) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="flex flex-col gap-4 w-full px-4">
      <div className="flex justify-between text-sm text-gray-700 font-semibold">
        <span>{label}</span>
        <span className="text-purple-600">
          {current} / {total} {completedLabel}
        </span>
      </div>
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "bg-gray-200 relative h-3 w-full overflow-hidden rounded-full shadow-inner",
          className
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full shadow-glow"
        >
          <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
          />
        </motion.div>
      </ProgressPrimitive.Root>
    </div>
  )
}
