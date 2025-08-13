import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormData } from "./types";

interface StatusSectionProps {
  form: UseFormReturn<FormData>;
}

export function StatusSection({ form }: StatusSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>상품 노출 여부</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="product.status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>상품 노출 활성화</FormLabel>
                <FormDescription>
                  활성화 시 상품 목록에 노출됩니다.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
