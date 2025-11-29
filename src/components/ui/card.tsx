import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm transition-all",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "border-0 shadow-lg",
        outlined: "border-2 shadow-none",
        ghost: "border-0 shadow-none bg-transparent",
      },
      size: {
        sm: "gap-3 py-3",
        md: "gap-6 py-6",
        lg: "gap-8 py-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface CardProps
  extends React.ComponentPropsWithoutRef<"div">,
  VariantProps<typeof cardVariants> {
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(
          cardVariants({ variant, size }),
          interactive && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"

export interface CardHeaderProps extends React.ComponentPropsWithoutRef<"div"> { }

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(
          "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
          className
        )}
        {...props}
      />
    )
  }
)

CardHeader.displayName = "CardHeader"

export interface CardTitleProps extends React.ComponentPropsWithoutRef<"div"> { }

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-title"
        className={cn("leading-none font-semibold", className)}
        {...props}
      />
    )
  }
)

CardTitle.displayName = "CardTitle"

export interface CardDescriptionProps
  extends React.ComponentPropsWithoutRef<"div"> { }

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-description"
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
      />
    )
  }
)

CardDescription.displayName = "CardDescription"

export interface CardActionProps extends React.ComponentPropsWithoutRef<"div"> { }

const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-action"
        className={cn(
          "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
          className
        )}
        {...props}
      />
    )
  }
)

CardAction.displayName = "CardAction"

export interface CardContentProps
  extends React.ComponentPropsWithoutRef<"div"> { }

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn("px-6", className)}
        {...props}
      />
    )
  }
)

CardContent.displayName = "CardContent"

export interface CardFooterProps extends React.ComponentPropsWithoutRef<"div"> { }

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
        {...props}
      />
    )
  }
)

CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
