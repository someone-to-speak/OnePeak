import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Typography } from "../typography";

const buttonVariants = cva(
  "flex w-full p-[10px] justify-center items-center gap-[10px] cursor-pointer rounded-[10px]",
  {
    variants: {
      variant: {
        default: [
          "bg-primary-500",
          "hover:bg-primary-600",
          "focus:bg-[#9CDD64]",
          "active:bg-primary-400",
          "disabled:opacity-40 disabled:bg-primary-500 disabled:cursor-not-allowed"
        ],
        stroke: ["border border-primary-500 bg-[#FDFDFD]", "disabled:opacity-40 disabled:cursor-not-allowed"]
      },
      size: {
        large: "max-w-[343px] h-[54px]",
        small: "max-w-[165px] h-[54px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "large"
    }
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  text: string;
  className?: string;
}

const Button = ({ text, className, variant, size, ...props }: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
      <Typography size={18} className={cn(variant === "stroke" ? "text-primary-400" : "text-white")}>
        {text}
      </Typography>
    </button>
  );
};

export default Button;
