import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const scrollBarVariants = cva(
  "flex touch-none p-px transition-colors select-none",
  {
    variants: {
      scrollbarSize: {
        default: "",
        thin: "p-0",
      },
    },
    defaultVariants: {
      scrollbarSize: "default",
    },
  }
)

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  hideScrollbar?: boolean
  smoothScroll?: boolean
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, hideScrollbar = false, smoothScroll = false, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
          smoothScroll && "scroll-smooth"
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {!hideScrollbar && <ScrollBar />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})

ScrollArea.displayName = "ScrollArea"

export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  >,
  VariantProps<typeof scrollBarVariants> { }

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", scrollbarSize, ...props }, ref) => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        scrollBarVariants({ scrollbarSize }),
        orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent",
        scrollbarSize === "thin" &&
        (orientation === "vertical" ? "w-1.5" : "h-1.5"),
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
})

ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar, scrollBarVariants }
