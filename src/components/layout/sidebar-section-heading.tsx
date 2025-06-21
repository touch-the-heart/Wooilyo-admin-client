import React from "react";
import { cn } from "@/lib/utils";

interface SidebarSectionHeadingProps {
  title: string;
  isOpen?: boolean;
  className?: string;
}

export function SidebarSectionHeading({
  title,
  isOpen = true,
  className,
}: SidebarSectionHeadingProps) {
  return (
    <div className={cn("py-2", className)}>
      <h3
        className={cn(
          "px-3 text-xs font-medium text-sidebar-foreground/50",
          !isOpen && "sr-only"
        )}
      >
        {title}
      </h3>
    </div>
  );
}
