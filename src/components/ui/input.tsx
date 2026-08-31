import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
  showLeftBorder?: boolean;
};

function Input({
  className,
  type,
  showLeftBorder = true,
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "peer file:text-foreground text-foreground placeholder:text-sm 4xl:placeholder:text-base placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border-1 bg-surface-soft/9 py-1 pr-3 text-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium  disabled:cursor-not-allowed disabled:opacity-50 4xl:text-base",
          showLeftBorder ? "pl-7" : "pl-3",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />

      {showLeftBorder && (
        <div
          className={cn(
            "absolute left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-sm",
            "bg-[#6BBE66]",
            "peer-aria-invalid:bg-red-500",
          )}
        />
      )}
    </div>
  );
}

export { Input };