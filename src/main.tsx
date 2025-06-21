import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import "./global.css";
import { NotFound } from "./components/not-found";
import { ErrorComponent } from "./components/error-component";

const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { queryClient },
  defaultPendingComponent: () => (
    <div className="mx-auto flex flex-col items-center justify-center">
      <Loader2Icon className="animate-spin text-gray-500" />
      <p className="text-gray-500">Loading...</p>
    </div>
  ),
  defaultNotFoundComponent: NotFound,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
