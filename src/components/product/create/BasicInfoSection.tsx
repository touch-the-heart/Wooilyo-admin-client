import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormData } from "./types";

interface BasicInfoSectionProps {
  form: UseFormReturn<FormData>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>상품 관련 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="product.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상품 이름</FormLabel>
              <FormControl>
                <Input placeholder="ex) 모란봉우리 밥그릇" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product.sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상품 간단 설명</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex) 감각적이고 세련된 모란 디자인의 밥 그릇"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상품 상세 설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ex) 일상적인 식사부터 특별한 식사까지 다양한 용도로 사용할 수 있는 클래식한 디자인의 밥그릇 입니다. 깔끔한 디자인과 적절한 크기로 어떤 식사와도 잘 어울립니다."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
