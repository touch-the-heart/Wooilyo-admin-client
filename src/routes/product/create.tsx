import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { Container, SplitScreen } from "@/components/layout";
import {
  BasicInfoSection,
  PricingSection,
  ImageUploadSection,
  StatusSection,
  useCreateProduct,
  CategorySection,
} from "@/components/product/create";
import { getCategories } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { CategoryTreeItem } from "@/components/category/type";
import { buildCategoryTree } from "@/lib/category";

export const Route = createFileRoute("/product/create")({
  component: CreateProduct,
});

function CreateProduct() {
  const { form, loading, productImages, setProductImages, onSubmit } =
    useCreateProduct();

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
  useEffect(() => {
    if (categoriesData && categoriesData.data) {
      const formattedCategories = categoriesData.data.map((cat: any) => ({
        id: cat.id,
        key: cat.key,
        name: cat.name,
        level: cat.level as 1 | 2 | 3,
        parentId: cat.parentId,
        expanded: false,
      }));
      const categoryTree = buildCategoryTree(formattedCategories);
      console.log("Category Tree:", categoryTree);
      setCategories(categoryTree);
    }
  }, [categoriesData]);

  return (
    <Container>
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create product</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SplitScreen leftRatio={2}>
            <SplitScreen.Left className="space-y-6">
              <BasicInfoSection form={form} />
              <PricingSection form={form} />
            </SplitScreen.Left>

            <SplitScreen.Right className="space-y-6">
              <ImageUploadSection
                form={form}
                productImages={productImages}
                setProductImages={setProductImages}
              />
              <CategorySection form={form} categories={categories} />
              <StatusSection form={form} />
            </SplitScreen.Right>
          </SplitScreen>

          <div className="flex justify-end gap-2">
            <Link to="/">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  );
}
