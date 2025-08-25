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
  useUpdateProduct,
  CategorySection,
} from "@/components/product/create";
import { getCategories } from "@/client";
import { useQuery } from "@tanstack/react-query";
import { CategoryTreeItem } from "@/components/category/type";
import { buildCategoryTree } from "@/lib/category";

export const Route = createFileRoute("/product/edit/$id")({
  component: UpdateProduct,
});

function UpdateProduct() {
  const { id } = Route.useParams();
  const productId = parseInt(id);

  const {
    form,
    loading,
    productImages,
    setProductImages,
    onSubmit,
    isLoadingProduct,
    productData,
  } = useUpdateProduct(productId);

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
      setCategories(categoryTree);
    }
  }, [categoriesData]);

  // 제품 데이터 로딩 중
  if (isLoadingProduct) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Container>
    );
  }

  // 제품을 찾을 수 없는 경우
  if (!productData) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            제품을 찾을 수 없습니다
          </h1>
          <Link to="/product">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              제품 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6">
        <Link to="/product/$id" params={{ id }}>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product Detail
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">제품 수정</h1>
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
            <Link to="/product/$id" params={{ id }}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  );
}
