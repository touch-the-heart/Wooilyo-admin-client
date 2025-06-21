import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Header } from "@/layout/header";
import { Sidebar } from "@/layout/sidebar";
import { Footer } from "@/layout/footer";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        <main
          className={`transition-all duration-300 flex-1 p-6 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
      <Footer
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      />
      <ReactQueryDevtools position="left" />
      <TanStackRouterDevtools position="bottom-left" />
    </div>
  );
}
