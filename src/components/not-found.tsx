import { NotFoundRouteProps } from "@tanstack/react-router";
import { Button } from "./ui/button";

export function NotFound(props: NotFoundRouteProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4 text-lg mb-2">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <a href="/">Go to Home</a>
      </Button>
    </div>
  );
}
