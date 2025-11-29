/**
 * Centralized exports for all UI components
 * Import components from here for cleaner imports:
 * import { Button, Card, Dialog } from "@/components/ui"
 */

// Button
export { Button, buttonVariants } from "./button"
export type { ButtonProps } from "./button"

// Card
export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
    cardVariants,
} from "./card"
export type {
    CardProps,
    CardHeaderProps,
    CardTitleProps,
    CardDescriptionProps,
    CardActionProps,
    CardContentProps,
    CardFooterProps,
} from "./card"

// Dialog
export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
    dialogContentVariants,
} from "./dialog"
export type {
    DialogProps,
    DialogTriggerProps,
    DialogPortalProps,
    DialogCloseProps,
    DialogOverlayProps,
    DialogContentProps,
    DialogHeaderProps,
    DialogFooterProps,
    DialogTitleProps,
    DialogDescriptionProps,
} from "./dialog"

// Input
export { Input, inputVariants } from "./input"
export type { InputProps } from "./input"

// Progress
export { Progress, progressVariants } from "./progress"
export type { ProgressProps } from "./progress"

// ScrollArea
export { ScrollArea, ScrollBar, scrollBarVariants } from "./scroll-area"
export type { ScrollAreaProps, ScrollBarProps } from "./scroll-area"

// Progress Indicator
export { ProgressIndicator, progressIndicatorVariants } from "./progress-indicator"
export type { ProgressIndicatorProps } from "./progress-indicator"

// Navigation Controls
export { NavigationControls } from "./navigation-controls"
export type { NavigationControlsProps } from "./navigation-controls"

// Flippable Card
export { FlippableCard } from "./flippable-card"
export type { FlippableCardProps } from "./flippable-card"

// Quiz Container
export { QuizContainer } from "./quiz-container"
export type { QuizContainerProps } from "./quiz-container"

// Shared types
export type { Size, ColorVariant, IconPosition } from "./types"
