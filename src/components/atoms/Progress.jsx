import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Progress = forwardRef(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 ease-out"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`
      }}
    />
  </div>
));

Progress.displayName = "Progress";

export default Progress;