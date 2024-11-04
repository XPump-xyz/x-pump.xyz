import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startAdornment, endAdornment, ...props }, ref) => {
    const hasAdornment = Boolean(startAdornment) || Boolean(endAdornment);
    return (
      <>
        {hasAdornment ? (
          <div
            className={cn(
              "flex items-center justify-center py-3 px-4 gap-2 h-12 border border-[#1f1f1f] bg-[#141414] bg-transparent ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
              className
            )}
            data-disabled={props.disabled}
          >
            {startAdornment && (
              <div className={cn("text-muted-foreground")}>
                {startAdornment}
              </div>
            )}
            <input
              type={type}
              className={cn(
                "flex w-full rounded-md  rounded-lg bg-[#141414] file:text-sm file:font-medium placeholder:text-muted-foreground shadow-none outline-none border-none focus-visible:outline-none focus-visible:border-none focus-visible:shadow-none",
                className
              )}
              ref={ref}
              {...props}
            />
            {endAdornment && (
              <div className={cn("text-muted-foreground")}>{endAdornment}</div>
            )}
          </div>
        ) : (
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-md py-3 px-4 rounded-lg border border-[#1f1f1f] bg-[#141414] text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
        )}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
