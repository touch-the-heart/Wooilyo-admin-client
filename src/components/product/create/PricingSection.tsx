import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormData } from "./types";

interface PricingSectionProps {
  form: UseFormReturn<FormData>;
}

export function PricingSection({ form }: PricingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>가격 및 사이즈 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="product.price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>정가 가격</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1.5">₩</span>
                  <Input className="pl-7" placeholder="0.00" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product.cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>적용할 할인율</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1.5">%</span>
                  <Input
                    className="pl-7 bg-gray-100 cursor-not-allowed"
                    placeholder="0.00"
                    disabled
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="product.bulkPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사이즈 정보</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="ex) S: 100cm&#10;M: 105cm&#10;L: 110cm"
                    className="min-h-[120px]"
                    {...field}
                    onChange={(e) => {
                      // 엔터를 마크다운 줄바꿈으로 변환
                      const value = e.target.value.replace(/\n/g, "  \n");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  각 사이즈별 정보를 입력하세요. 엔터로 줄바꿈이 가능합니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
