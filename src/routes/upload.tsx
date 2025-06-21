import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { useForm } from "@tanstack/react-form";

const uploadSearchSchema = z.object({
  redirect: fallback(z.string(), "/").default("/"),
});

export const Route = createFileRoute("/upload")({
  component: RouteComponent,
  validateSearch: zodSearchValidator(uploadSearchSchema),
});

function RouteComponent() {
  const search = Route.useSearch();
  const form = useForm();

  return <div>Hello "/upload"!</div>;
}
