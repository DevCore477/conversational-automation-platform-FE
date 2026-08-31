"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, ...props }, ref) => {
  const defaultRef = React.useRef<HTMLButtonElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLButtonElement>) || defaultRef;

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.dataset.state = indeterminate
        ? "indeterminate"
        : props.checked
          ? "checked"
          : "unchecked";
    }
  }, [indeterminate, props.checked, resolvedRef]);

  return (
    <CheckboxPrimitive.Root
      ref={resolvedRef}
      className={cn(
        "peer h-4 w-4 shrink-0 bg-surface-soft/20 rounded border-[0.5px] border-[#A3A3A3] ring-offset-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-surface-soft data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-surface-soft data-[state=indeterminate]:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        {indeterminate ? (
          <Minus className="size-3" />
        ) : (
          <Check className="size-3" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
