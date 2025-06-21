import React from "react";
import {
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur backdrop-saturate-150">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-64 rounded-full border border-border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Smartphone className="h-5 w-5" />
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-destructive">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            </span>
          </Button>
        </div>

        <div className="ml-2 flex items-center gap-2 border-l border-border pl-4">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-primary/20">
            <img
              src="https://ui-avatars.com/api/?name=Admin+User"
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
