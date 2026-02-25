"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({className = "", ...props}, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={`dialog__overlay ${className}`}
        {...props}
    />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({className = "", children, ...props}, ref) => (
    <DialogPortal>
      <DialogOverlay/>
      <DialogPrimitive.Content
          ref={ref}
          className={`dialog__content ${className}`}
          {...props}
      >
        {children}
        <DialogPrimitive.Close className="dialog__close">
          ×
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
                        className = "",
                        ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`dialog__header ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
                        className = "",
                        ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`dialog__footer ${className}`} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({className = "", ...props}, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={`dialog__title ${className}`}
        {...props}
    />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({className = "", ...props}, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={`dialog__description ${className}`}
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
