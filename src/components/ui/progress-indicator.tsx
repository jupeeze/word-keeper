import * as React from "react"
import { motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressIndicatorVariants = cva(
    "w-full rounded-2xl transition-all",
    {
        variants: {
            variant: {
                default: "glass-card p-4",
                detailed: "glass-card p-4",
                minimal: "p-2",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface ProgressIndicatorProps
    extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof progressIndicatorVariants> {
    current: number
    total: number
    completed?: number
    showCompleted?: boolean
    label?: string
    completedLabel?: string
    barColor?: string
    barClassName?: string
}

const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
    (
        {
            className,
            variant,
            current,
            total,
            completed,
            showCompleted = false,
            label = "進捗",
            completedLabel = "確認済み",
            barColor,
            barClassName,
            ...props
        },
        ref
    ) => {
        const percentage = (current / total) * 100

        return (
            <div
                ref={ref}
                className={cn(progressIndicatorVariants({ variant }), className)}
                {...props}
            >
                {variant !== "minimal" && (
                    <div className="flex justify-between text-sm text-gray-700 font-semibold mb-3">
                        <span>
                            {label} {current} / {total}
                        </span>
                        {showCompleted && completed !== undefined && (
                            <span className="text-purple-600">
                                {completedLabel}: {completed} / {total}
                            </span>
                        )}
                    </div>
                )}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={cn(
                            "h-3 rounded-full shadow-glow",
                            barColor
                                ? barColor
                                : "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500",
                            barClassName
                        )}
                    />
                </div>
            </div>
        )
    }
)

ProgressIndicator.displayName = "ProgressIndicator"

export { ProgressIndicator, progressIndicatorVariants }
