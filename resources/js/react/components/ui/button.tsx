import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-squircle shadow-button hover:shadow-lg hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-squircle",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-squircle",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-squircle",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground rounded-squircle",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground hover:bg-forest-light rounded-squircle-lg shadow-button hover:shadow-lg hover:-translate-y-1 text-base",
        heroOutline: "border-2 border-primary/30 bg-background/80 backdrop-blur-sm text-primary hover:border-primary hover:bg-primary/5 rounded-squircle-lg text-base",
        lime: "bg-lime text-foreground hover:bg-lime-glow rounded-squircle shadow-glow hover:shadow-lg hover:-translate-y-0.5 font-extrabold",
        limeLg: "bg-lime text-foreground hover:bg-lime-glow rounded-squircle-lg shadow-glow hover:shadow-lg hover:-translate-y-1 font-extrabold text-lg",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-14 px-8",
        xl: "h-16 px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
