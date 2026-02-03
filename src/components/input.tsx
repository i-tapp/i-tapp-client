import { Eye, EyeSlash } from "iconsax-reactjs";
import { Input as BaseInput } from "./ui/input";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/utils/tailwind";

interface InputProps extends React.ComponentProps<"input"> {
  type?: string;
  wrapperClassName?: string; // 👈 allow outer div customization
}

export default function Input({
  type,
  className,
  wrapperClassName,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordType = type === "password";

  return (
    <div
      className={cn(
        "flex h-10 items-center gap-1 rounded border border-gray-300 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50",
        wrapperClassName, // 👈 override or extend outer container
      )}
    >
      <BaseInput
        type={isPasswordType ? (showPassword ? "text" : "password") : type}
        className={cn(
          "flex-1 border-none  text-sm placeholder:text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 shadow-none",
          className, // 👈 allow additional input-level styling
        )}
        {...props}
      />

      {isPasswordType && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="p-0 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeSlash className="w-4 h-4 text-gray-500 cursor-pointer" />
          ) : (
            <Eye className="w-4 h-4 text-gray-500 cursor-pointer" />
          )}
        </Button>
      )}
    </div>
  );
}
