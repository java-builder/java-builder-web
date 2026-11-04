import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-all outline-none select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      shape: {
        default: "rounded-full",
        form: "rounded-full",
        pill: "rounded-full",
        square: "rounded-xl",
      },
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 active:scale-95",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 active:scale-95",
        secondary:
          "border border-border bg-surface text-foreground hover:bg-muted shadow-xs active:scale-95",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted active:scale-95",
        ghost:
          "text-foreground hover:bg-muted active:scale-95",
        destructive:
          "bg-error text-white hover:opacity-90 shadow-sm shadow-error/20 active:scale-95",
        link:
          "text-primary underline-offset-4 hover:underline",
        accent:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 active:scale-95",
        navy:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm shadow-secondary/20 active:scale-95",
        orange:
          "bg-warning text-white hover:opacity-90 shadow-sm shadow-warning/20 active:scale-95",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-9 px-4 py-2 text-sm",
        lg: "h-10 px-5 text-base [&_svg:not([class*='size-'])]:size-4.5",
        icon: "size-9 p-0",
        xs: "h-7 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 p-0 [&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs": "size-6 p-0 [&_svg:not([class*='size-'])]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      shape = "default",
      size = "default",
      loading = false,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.ComponentPropsWithRef<"button">
      >;
      return React.cloneElement(child, {
        ...props,
        ref,
        disabled: child.props?.disabled || isDisabled,
        "aria-disabled":
          child.props?.["aria-disabled"] ?? (isDisabled ? true : undefined),
        className: cn(
          buttonVariants({ variant, shape, size, className }),
          child.props?.className
        ),
        children: (
          <>
            {loading && <Loader2 className="animate-spin h-4 w-4 shrink-0" />}
            {child.props?.children}
          </>
        ),
      });
    }

    return (
      <button
        ref={ref}
        data-slot="button"
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, shape, size, className }))}
        {...props}
      >
        {loading && <Loader2 className="animate-spin h-4 w-4 shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
