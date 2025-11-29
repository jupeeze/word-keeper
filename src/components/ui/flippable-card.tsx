import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, type CardProps } from "./card"

import { cn } from "@/lib/utils"

export interface FlippableCardProps extends Omit<CardProps, "onClick"> {
    isFlipped: boolean
    onFlip?: () => void
    frontContent: React.ReactNode
    backContent: React.ReactNode
    flipDirection?: "horizontal" | "vertical"
    flipDuration?: number
    disabled?: boolean
}

const FlippableCard = React.forwardRef<HTMLDivElement, FlippableCardProps>(
    (
        {
            className,
            isFlipped,
            onFlip,
            frontContent,
            backContent,
            flipDirection = "horizontal",
            flipDuration = 0.4,
            disabled = false,
            variant = "default",
            size = "md",
            ...props
        },
        ref
    ) => {
        const rotateAxis = flipDirection === "horizontal" ? "rotateY" : "rotateX"

        return (
            <div
                ref={ref}
                className={cn(
                    "relative w-full h-full cursor-pointer perspective-1000",
                    disabled && "cursor-not-allowed opacity-60",
                    className
                )}
                onClick={disabled ? undefined : onFlip}
                {...props}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isFlipped ? "back" : "front"}
                        initial={{ [rotateAxis]: 90, opacity: 0 }}
                        animate={{ [rotateAxis]: 0, opacity: 1 }}
                        exit={{ [rotateAxis]: -90, opacity: 0 }}
                        transition={{ duration: flipDuration, type: "spring" }}
                        className="w-full h-full"
                    >
                        <Card
                            variant={variant}
                            size={size}
                            className="w-full h-full glass-card border-0 shadow-2xl hover:shadow-glow transition-all duration-300"
                        >
                            <CardContent className="flex flex-col items-center justify-center h-full p-8">
                                {isFlipped ? backContent : frontContent}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        )
    }
)

FlippableCard.displayName = "FlippableCard"

export { FlippableCard }
