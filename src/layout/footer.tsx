import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-border bg-background py-4 px-6",
        className
      )}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wooilyo. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          Made with{" "}
          <Heart className="h-3 w-3 fill-destructive text-destructive" /> by{" "}
          <span className="font-medium">kyoeuiseok</span>
        </div>
      </div>
    </footer>
  );
}
