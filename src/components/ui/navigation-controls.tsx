import * as React from "react"
import { Button, type ButtonProps } from "./button"
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"

export interface NavigationControlsProps
    extends React.ComponentPropsWithoutRef<"div"> {
    onPrevious?: () => void
    onNext?: () => void
    onReset?: () => void
    onComplete?: () => void
    canGoPrevious?: boolean
    canGoNext?: boolean
    showComplete?: boolean
    showReset?: boolean
    previousLabel?: string
    nextLabel?: string
    resetLabel?: string
    completeLabel?: string
    layout?: "horizontal" | "vertical"
    buttonVariant?: ButtonProps["variant"]
    buttonSize?: ButtonProps["size"]
}

const NavigationControls = React.forwardRef<HTMLDivElement, NavigationControlsProps>(
    (
        {
            className,
            onPrevious,
            onNext,
            onReset,
            onComplete,
            canGoPrevious = true,
            canGoNext = true,
            showComplete = false,
            showReset = true,
            previousLabel = "前へ",
            nextLabel = "次へ",
            resetLabel,
            completeLabel = "学習完了 ✓",
            layout = "horizontal",
            buttonVariant = "outline",
            buttonSize = "default",
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex gap-4 w-full",
                    layout === "vertical" && "flex-col",
                    className
                )}
                {...props}
            >
                {onPrevious && (
                    <Button
                        onClick={onPrevious}
                        disabled={!canGoPrevious}
                        variant={buttonVariant}
                        size={buttonSize}
                        className={cn(
                            "glass-panel hover:bg-white/60 transition-all duration-300",
                            layout === "horizontal" && "flex-1"
                        )}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {previousLabel}
                    </Button>
                )}

                {onReset && showReset && (
                    <Button
                        onClick={onReset}
                        variant={buttonVariant}
                        size={buttonSize}
                        className="glass-panel hover:bg-white/60 transition-all duration-300"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {resetLabel && <span className="ml-2">{resetLabel}</span>}
                    </Button>
                )}

                {showComplete && onComplete ? (
                    <Button
                        onClick={onComplete}
                        size={buttonSize}
                        className={cn(
                            "h-full text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300",
                            layout === "horizontal" && "flex-1"
                        )}
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {completeLabel}
                    </Button>
                ) : (
                    onNext && (
                        <Button
                            onClick={onNext}
                            disabled={!canGoNext}
                            variant={buttonVariant}
                            size={buttonSize}
                            className={cn(
                                "glass-panel hover:bg-white/60 transition-all duration-300",
                                layout === "horizontal" && "flex-1"
                            )}
                        >
                            {nextLabel}
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )
                )}
            </div>
        )
    }
)

NavigationControls.displayName = "NavigationControls"

export { NavigationControls }
