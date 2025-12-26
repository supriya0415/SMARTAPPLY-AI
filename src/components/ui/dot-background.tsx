import React from "react";
import { cn } from "@/lib/utils";

interface DotBackgroundProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  dotColor?: string;
  opacity?: number;
}

export const DotBackground = ({
  children,
  className,
  size = 60,
  dotColor = "rgba(255, 255, 255, 0.1)",
  opacity = 0.3,
}: DotBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative h-full w-full bg-black [background-image:radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]",
        className
      )}
      style={{
        backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};
