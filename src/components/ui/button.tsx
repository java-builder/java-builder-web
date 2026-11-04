import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[8px] text-sm font-medium whitespace-nowrap transition-all outline-none select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F]/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF5A1F] text-white hover:bg-[#e04b16] shadow-xs active:scale-[0.98]",
        primary:
          "bg-[#FF5A1F] text-white hover:bg-[#e04b16] shadow-xs active:scale-[0.98]",
        secondary:
          "border border-[#E8E8E8] bg-white text-[#171717] hover:bg-[#FFF0E8]/60 dark:border-[#262d3d] dark:bg-[#181d28] dark:text-slate-100 dark:hover:bg-slate-800 shadow-xs",
        outline:
          "border border-[#E8E8E8] bg-transparent text-[#171717] hover:bg-[#FFF0E8]/60 dark:border-[#262d3d] dark:text-slate-100 dark:hover:bg-slate-800",
        ghost:
          "text-[#171717] hover:bg-[#FFF0E8]/60 dark:text-slate-300 dark:hover:bg-slate-800",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-xs",
        link:
          "text-[#FF5A1F] underline-offset-4 hover:underline",
        accent:
          "bg-[#FF5A1F] text-white hover:bg-[#e04b16] shadow-xs active:scale-[0.98]",
        navy:
          "bg-[#26344D] text-white hover:bg-[#1c273a] shadow-xs active:scale-[0.98]",
        orange:
          "bg-[#FF9900] text-white hover:bg-[#e68a00] shadow-xs active:scale-[0.98]",
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
          buttonVariants({ variant, size, className }),
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
        className={cn(buttonVariants({ variant, size, className }))}
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
