import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Shapes,
  CloudUpload,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarSectionHeading } from "../components/layout/sidebar-section-heading";

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive?: boolean;
  hasChildren?: boolean;
  isOpen?: boolean;
}

function SidebarItem({
  icon,
  title,
  href,
  isActive = false,
  hasChildren = false,
  isOpen = true,
}: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
      )}
      activeProps={{
        className: "bg-sidebar-primary text-sidebar-primary-foreground",
      }}
    >
      <div className="flex h-6 w-6 items-center justify-center">{icon}</div>
      {isOpen && (
        <>
          <span>{title}</span>
          {hasChildren && <span className="ml-auto">›</span>}
        </>
      )}
    </Link>
  );
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar transition-all duration-300 overflow-hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "hover:overflow-y-auto scrollbar-none hover:scrollbar-thin hover:scrollbar-thumb-gray-300 hover:scrollbar-thumb-rounded-md"
      )}
    >
      <div className="flex flex-col gap-1 p-3 h-full">
        {/* overview */}
        <SidebarSectionHeading title="Overview" isOpen={isOpen} />
        <SidebarItem
          icon={<Home className="h-5 w-5" />}
          title="Product"
          href="/product"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<Shapes className="h-5 w-5" />}
          title="Category"
          href="/category"
          isOpen={isOpen}
        />

        {/* settings */}
        <SidebarSectionHeading
          title="Settings"
          isOpen={isOpen}
          className="mt-3"
        />

        <SidebarItem
          icon={<Users className="h-5 w-5" />}
          title="Users"
          href="/users"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<Settings className="h-5 w-5" />}
          title="Settings"
          href="/settings"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<HelpCircle className="h-5 w-5" />}
          title="Help"
          href="/help"
          isOpen={isOpen}
        />
      </div>
    </aside>
  );
}
