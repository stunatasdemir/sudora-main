import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export const GlassCard = ({ children, className, hover = true, style }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "backdrop-blur-luxury bg-glass-primary border border-border/30 rounded-luxury shadow-elegant",
        "transition-all duration-700 ease-luxury relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-card before:opacity-0 before:transition-opacity before:duration-500",
        hover && "hover:shadow-luxury hover:scale-105 hover:bg-glass-accent hover:before:opacity-20 hover:border-primary/40",
        "group cursor-pointer",
        className
      )}
      style={style}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};