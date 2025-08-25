import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { getProductsById, patchProductsById } from "@/client/sdk.gen";
import { useQuery } from "@tanstack/react-query";
import { CreateProductSchema, FormData } from "./types";

export function useUpdateProduct(productId: number) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState<File[]>([]);

  // 기존 제품 데이터 가져오기
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductsById({ path: { id: productId } }),
    enabled: !!productId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      product: {
        name: "",
        description: "",
        sku: "",
        price: 0,
        stock: 0,
        status: true,
        cost: 0,
        bulkPrice: "",
        taxRate: 0,
      },
      details: [],
      categoryIds: [],
      images: [],
      brand: "",
      tags: [],
    },
  });

  // 제품 데이터가 로드되면 폼에 데이터 설정
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      const firstDetail = product.details?.[0];

      form.reset({
        product: {
          name: product.name || "",
          description: product.description || "",
          sku: product.subName || "",
          price: firstDetail?.price || 0,
          stock: 0, // API에서 stock 정보가 없으므로 기본값
          status: product.isVisible ?? true,
          cost: 0, // API에서 cost 정보가 없으므로 기본값
          bulkPrice: firstDetail?.size || "",
          taxRate: 0, // API에서 tax 정보가 없으므로 기본값
        },
        details: product.details || [],
        categoryIds: product.categories?.map((cat) => cat.categoryId) || [],
        images:
          product.images?.map((img) => ({
            url: img.url,
            displayOrder: img.displayOrder,
            type: img.type,
          })) || [],
        brand: "",
        tags: [],
      });
    }
  }, [productData, form]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const params = {
      product: {
        name: data.product.name,
        subName: data.product.sku || "",
        shortDescription: data.product.sku || "",
        description: data.product.description || "",
        isVisible: data.product.status,
      },
      details: [
        {
          size: data.product.bulkPrice || "",
          price: data.product.price,
        },
      ],
      categoryIds: data.categoryIds || [],
      images: data.images || [],
    };

    try {
      const res = await patchProductsById({
        path: { id: productId },
        body: params,
      });

      // HTTP 에러 상태 코드가 오면 예외 발생시켜 catch로 처리
      if (res.response.status >= 400) {
        throw new Error(
          (res.error as any)?.message ||
            "Failed to update product. Please try again."
        );
      }

      // 성공시 제품 상세 페이지로 이동
      navigate({ to: "/product/$id", params: { id: productId.toString() } });
    } catch (error: any) {
      console.error("Error updating product:", error);

      // 에러 메시지 추출
      let errorMessage = "Failed to update product. Please try again.";

      if (error?.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    productImages,
    setProductImages,
    onSubmit,
    isLoadingProduct,
    productData: productData?.data,
  };
}
