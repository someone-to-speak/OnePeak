import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("font-suit leading-normal inline-block align-middle antialiased", {
  variants: {
    size: {
      10: "text-xs tracking-[-0.16px]",
      12: "text-sm tracking-[-0.24px]",
      14: "text-base tracking-[-0.28px]",
      16: "text-lg tracking-[-0.32px]",
      18: "text-xl tracking-[-0.36px]",
      20: "text-2xl tracking-[-0.4px]",
      22: "text-3xl tracking-[-0.44px]",
      24: "text-4xl tracking-[-0.48px]",
      26: "text-5xl tracking-[-0.52px]",
      28: "text-6xl tracking-[-0.56px]",
      30: "text-7xl tracking-[-0.6px]",
      32: "text-8xl tracking-[-0.64px]",
      34: "text-9xl tracking-[-0.68px]",
      36: "text-10xl tracking-[-0.72px]",
      38: "text-11xl tracking-[-0.76px]",
      40: "text-12xl tracking-[-0.8px]",
      42: "text-13xl tracking-[-0.84px]",
      44: "text-14xl tracking-[-0.88px]",
      46: "text-15xl tracking-[-0.92px]",
      48: "text-16xl tracking-[-0.96px]",
      50: "text-17xl tracking-[-1px]",
      52: "text-18xl tracking-[-1.04px]",
      54: "text-19xl tracking-[-1.08px]",
      56: "text-20xl tracking-[-1.12px]",
      58: "text-21xl tracking-[-1.16px]",
      60: "text-22xl tracking-[-1.2px]",
      62: "text-23xl tracking-[-1.24px]",
      64: "text-24xl tracking-[-1.28px]",
      66: "text-25xl tracking-[-1.32px]",
      68: "text-26xl tracking-[-1.36px]",
      70: "text-27xl tracking-[-1.4px]",
      72: "text-28xl tracking-[-1.44px]",
      74: "text-29xl tracking-[-1.48px]",
      76: "text-30xl tracking-[-1.52px]",
      78: "text-31xl tracking-[-1.56px]"
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      bold: "font-bold",
      extrabold: "font-extrabold"
    }
  },
  defaultVariants: {
    size: 14
  }
});

interface TypographyProps extends VariantProps<typeof typographyVariants> {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export const Typography = ({ children, size, weight, className, as: Component = "span" }: TypographyProps) => {
  return <Component className={cn(typographyVariants({ size, weight }), className)}>{children}</Component>;
};
