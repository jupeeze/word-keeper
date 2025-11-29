import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "./card"
import { ProgressIndicator } from "./progress-indicator"

import { cn } from "@/lib/utils"

export interface QuizContainerProps extends React.ComponentPropsWithoutRef<"div"> {
    question?: string
    questionContent: React.ReactNode
    progress?: {
        current: number
        total: number
    }
    showProgress?: boolean
    instructions?: React.ReactNode
    children?: React.ReactNode
    animationKey?: string | number
}

const QuizContainer = React.forwardRef<HTMLDivElement, QuizContainerProps>(
    (
        {
            className,
            question,
            questionContent,
            progress,
            showProgress = true,
            instructions,
            children,
            animationKey,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn("flex flex-col items-center gap-6 w-full max-w-md mx-auto", className)}
                {...props}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={animationKey}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <Card className="w-full shadow-lg">
                            {showProgress && progress && (
                                <CardContent>
                                    <ProgressIndicator
                                        current={progress.current}
                                        total={progress.total}
                                        variant="minimal"
                                        label="問題"
                                    />
                                </CardContent>
                            )}
                            <CardContent className="p-8">
                                {question && (
                                    <p className="text-center text-sm text-gray-600 mb-4">
                                        {question}
                                    </p>
                                )}
                                <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg text-center mb-6">
                                    {questionContent}
                                </div>
                                {children}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                {instructions && (
                    <div className="text-center text-sm text-gray-500">
                        {instructions}
                    </div>
                )}
            </div>
        )
    }
)

QuizContainer.displayName = "QuizContainer"

export { QuizContainer }
