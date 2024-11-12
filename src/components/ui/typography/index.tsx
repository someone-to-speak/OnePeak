import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("font-suit leading-normal inline-block align-middle antialiased", {
  variants: {
    size: {
      12: "text-sm tracking-[-0.24px]",
      14: "text-base tracking-[-0.28px]",
      16: "text-lg tracking-[-0.32px]",
      18: "text-xl tracking-[-0.36px]",
      20: "text-2xl tracking-[-0.4px]",
      22: "text-3xl tracking-[-0.44px]",
      24: "text-4xl tracking-[-0.48px]",
      26: "text-5xl tracking-[-0.52px]",
      28: "text-6xl tracking-[-0.56px]"
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
