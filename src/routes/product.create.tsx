import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Info, Plus, Trash2, Upload } from "lucide-react";

// Schema definitions
const insertProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().nonnegative("Stock must be a positive number"),
  status: z.boolean(),
  cost: z.coerce.number().nonnegative().optional(),
  bulkPrice: z.string().optional(),
  taxRate: z.coerce.number().nonnegative().optional(),
});

const productVariantSchema = z.object({
  size: z.string(),
  price: z.coerce.number().positive(),
});

const CreateProductSchema = z.object({
  product: insertProductSchema,
  details: z.array(productVariantSchema).max(3).optional(),
  categoryIds: z.array(z.number()).optional(),
  images: z.array(z.any()).max(5).optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const Route = createFileRoute("/product/create")({
  component: CreateProduct,
});

// Mock data for demonstration
const mockCategories = [
  { id: 1, name: "Clothing" },
  { id: 2, name: "Accessories" },
  { id: 3, name: "Footwear" },
];

function CreateProduct() {
  type FormData = z.infer<typeof CreateProductSchema>;

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

  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState<File[]>([]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      // Here you would normally upload images and submit the form to your API
      console.log("Submitted data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Product created successfully!");
      // Navigate back or reset form
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to array and limit to 5 images
    const newFiles = Array.from(files).slice(0, 5 - productImages.length);

    if (productImages.length + newFiles.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setProductImages((prev) => [...prev, ...newFiles]);

    // Update form value
    const currentImages = form.getValues("images") || [];
    form.setValue("images", [...currentImages, ...newFiles]);
  };

  const removeImage = (index: number) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);

    // Update form value
    form.setValue("images", newImages);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - left side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
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
                          <Input
                            placeholder="ex) 모란봉우리 밥그릇"
                            {...field}
                          />
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

              {/* Pricing */}
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
                            <Input
                              className="pl-7"
                              placeholder="0.00"
                              {...field}
                            />
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
                                const value = e.target.value.replace(
                                  /\n/g,
                                  "  \n"
                                );
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            각 사이즈별 정보를 입력하세요. 엔터로 줄바꿈이
                            가능합니다.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - right side */}
            <div className="space-y-6">
              {/* Product Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>
                    Choose a product photo or simply drag and drop up to 5
                    photos here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    {productImages.length === 0 ? (
                      <>
                        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="mb-1">Drop your image here, or</p>
                          <label
                            htmlFor="file-upload"
                            className="text-blue-500 cursor-pointer hover:text-blue-700"
                          >
                            Click to browse
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {productImages.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Product ${idx + 1}`}
                              className="h-20 w-20 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hidden group-hover:block"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                        {productImages.length < 5 && (
                          <label
                            htmlFor="add-more-images"
                            className="h-20 w-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="h-6 w-6 text-gray-400" />
                            <input
                              id="add-more-images"
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file
                    size is restricted to a maximum of 500kb.
                  </p>
                </CardContent>
              </Card>

              {/* Attribute */}
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

              {/* Status Toggle */}
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
            </div>
          </div>

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
    </div>
  );
}
