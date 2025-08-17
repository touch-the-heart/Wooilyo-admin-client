import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProducts, postProducts } from "@/client/sdk.gen";
import { CreateProductSchema, FormData } from "./types";

export function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState<File[]>([]);
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
      const result = await getProducts();
      const res = await postProducts({ body: params });
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
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
  };
}
