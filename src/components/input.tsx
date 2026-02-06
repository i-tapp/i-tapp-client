import * as React from "react";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { Input as BaseInput } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/utils/tailwind";

interface InputProps extends React.ComponentProps<"input"> {
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, wrapperClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";

    return (
      <div
        className={cn(
          "flex h-10 items-center gap-1 rounded border border-gray-300 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50",
          wrapperClassName,
        )}
      >
        <BaseInput
          ref={ref} // ✅ forward RHF ref
          type={isPasswordType ? (showPassword ? "text" : "password") : type}
          className={cn(
            "flex-1 border-none text-sm placeholder:text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 shadow-none",
            className,
          )}
          {...props}
        />

        {isPasswordType && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="p-0 hover:bg-transparent"
            onClick={() => setShowPassword((v) => !v)}
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
  },
);

Input.displayName = "Input";
export default Input;
