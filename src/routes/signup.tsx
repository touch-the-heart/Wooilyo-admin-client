import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { fallback } from "@tanstack/router-zod-adapter";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const signupSearchSchema = z.object({
  redirect: fallback(z.string(), "/").default("/"),
});
const signupSchema = z.object({
  id: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(3).max(255),
});

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
  validateSearch: signupSearchSchema,
});

function RouteComponent() {
  const search = Route.useSearch();
  const form = useForm({
    defaultValues: {
      id: "",
      password: "",
    },
    validators: {
      onChange: signupSchema,
    },
  });
  return (
    <div className="w-full">
      <Card className="mx-auto mt-12 max-w-sm border-border/25">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl">계정추가</CardTitle>
            <CardDescription className="text-center">
              계정정보를 넣어주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <form.Field
                name="id"
                children={(field) => (
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor={field.name}>ID</Label>
                    <Input
                      id={field.name}
                      placeholder="아이디"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
