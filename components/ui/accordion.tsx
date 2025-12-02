"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; isOpen?: boolean; onToggle?: () => void }
>(({ className, children, value, isOpen, onToggle, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("border rounded-lg overflow-hidden", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isOpen, onToggle });
        }
        return child;
      })}
    </div>
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isOpen?: boolean; onToggle?: () => void }
>(({ className, children, isOpen, onToggle, ...props }, ref) => (
  <button
    ref={ref}
    onClick={onToggle}
    className={cn(
      "flex flex-1 items-center justify-between w-full py-4 px-5 font-medium transition-all hover:bg-gray-50 text-left [&[data-state=open]>svg]:rotate-180",
      className
    )}
    data-state={isOpen ? "open" : "closed"}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
  </button>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isOpen?: boolean }
>(({ className, children, isOpen, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
    )}
    data-state={isOpen ? "open" : "closed"}
    {...props}
  >
    <div className={cn("pb-4 pt-0 px-5 text-gray-600", className)}>{children}</div>
  </div>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };




