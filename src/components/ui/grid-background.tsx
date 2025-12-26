import React from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  lineWidth?: number;
  lineColor?: string;
  opacity?: number;
}

export const GridBackground = ({
  children,
  className,
  size = 60,
  lineWidth = 1,
  lineColor = "rgba(255, 255, 255, 0.1)",
  opacity = 0.3,
}: GridBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative h-full w-full bg-black [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px), linear-gradient(to bottom, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

export const GridBackgroundSmall = ({
  children,
  className,
  size = 20,
  lineWidth = 1,
  lineColor = "rgba(255, 255, 255, 0.1)",
  opacity = 0.3,
}: GridBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative h-full w-full bg-black [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px), linear-gradient(to bottom, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};
