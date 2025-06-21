import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

export function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter();
  const isDev = import.meta.env.MODE === "development";
  const queryClientErrorBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    queryClientErrorBoundary.reset();
  }, [queryClientErrorBoundary]);

  return (
    <div className="mt-8 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <p className="text-sm text-red-700">{error.message}</p>
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-sm text-gray-500">
          <Button
            className="w-full"
            onClick={() => {
              router.invalidate();
            }}
          >
            Try again
          </Button>
          <Button asChild className="w-full mt-2" variant="link">
            <Link to="/">
              <span className="text-blue-500">Go to Home</span>
            </Link>
          </Button>
          {isDev ? (
            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="error-details" className="mt-4">
                <AccordionTrigger className="text-sm text-gray-500">
                  Show error details
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-500">
                  <div className="overflow-x-auto whitespace-pre-wrap">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Error Message:
                    </h3>
                    <p className="text-sm text-red-700">{error.message}</p>
                    <h3 className="mt-2 text-sm font-semibold text-gray-700">
                      Stack Trace:
                    </h3>
                    <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-red-700">
                      {error.stack}
                    </pre>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : null}
        </div>
      </div>
    </div>
  );
}
