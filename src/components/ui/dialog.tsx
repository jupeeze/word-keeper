import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const dialogContentVariants = cva(
  "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed top-[50%] left-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200",
  {
    variants: {
      size: {
        sm: "max-w-[calc(100%-2rem)] sm:max-w-sm",
        md: "max-w-[calc(100%-2rem)] sm:max-w-md",
        lg: "max-w-[calc(100%-2rem)] sm:max-w-lg",
        xl: "max-w-[calc(100%-2rem)] sm:max-w-xl",
        full: "max-w-[calc(100%-2rem)] sm:max-w-[90vw]",
      },
      animationVariant: {
        default: "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        slideUp:
          "data-[state=closed]:slide-out-to-bottom-[10%] data-[state=open]:slide-in-from-bottom-[10%]",
        slideDown:
          "data-[state=closed]:slide-out-to-top-[10%] data-[state=open]:slide-in-from-top-[10%]",
      },
    },
    defaultVariants: {
      size: "lg",
      animationVariant: "default",
    },
  }
)

export interface DialogProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> { }

const Dialog = ({ ...props }: DialogProps) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

Dialog.displayName = "Dialog"

export interface DialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> { }

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  DialogTriggerProps
>(({ ...props }, ref) => {
  return (
    <DialogPrimitive.Trigger
      ref={ref}
      data-slot="dialog-trigger"
      {...props}
    />
  )
})

DialogTrigger.displayName = "DialogTrigger"

export interface DialogPortalProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal> { }

const DialogPortal = ({ ...props }: DialogPortalProps) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

DialogPortal.displayName = "DialogPortal"

export interface DialogCloseProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> { }

const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  DialogCloseProps
>(({ ...props }, ref) => {
  return (
    <DialogPrimitive.Close ref={ref} data-slot="dialog-close" {...props} />
  )
})

DialogClose.displayName = "DialogClose"

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> { }

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
})

DialogOverlay.displayName = "DialogOverlay"

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  VariantProps<typeof dialogContentVariants> {
  showCloseButton?: boolean
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      size,
      animationVariant,
      ...props
    },
    ref
  ) => {
    return (
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          data-slot="dialog-content"
          className={cn(
            dialogContentVariants({ size, animationVariant }),
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)

DialogContent.displayName = "DialogContent"

export interface DialogHeaderProps
  extends React.ComponentPropsWithoutRef<"div"> { }

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="dialog-header"
        className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
        {...props}
      />
    )
  }
)

DialogHeader.displayName = "DialogHeader"

export interface DialogFooterProps
  extends React.ComponentPropsWithoutRef<"div"> { }

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="dialog-footer"
        className={cn(
          "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
          className
        )}
        {...props}
      />
    )
  }
)

DialogFooter.displayName = "DialogFooter"

export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> { }

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
})

DialogTitle.displayName = "DialogTitle"

export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> { }

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
})

DialogDescription.displayName = "DialogDescription"

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
}
