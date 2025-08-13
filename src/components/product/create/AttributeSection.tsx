import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Info } from "lucide-react";
import { FormData, mockCategories } from "./types";

interface AttributeSectionProps {
  form: UseFormReturn<FormData>;
}

export function AttributeSection({ form }: AttributeSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attribute</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
            onValueChange={(value) =>
              form.setValue("categoryIds", [parseInt(value)])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {mockCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Add tags for product..." />
              </FormControl>
              <FormDescription className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                <span>Separate tags with commas</span>
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="Product brand" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
