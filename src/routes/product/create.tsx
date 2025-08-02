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
  price: z
    .number()
    .positive("Price must be positive")
    .or(z.string().transform((val) => parseFloat(val) || 0)),
  stock: z
    .number()
    .int()
    .nonnegative("Stock must be a positive number")
    .or(z.string().transform((val) => parseInt(val) || 0)),
  status: z.boolean().default(true),
  cost: z
    .number()
    .nonnegative()
    .optional()
    .or(z.string().transform((val) => parseFloat(val) || 0)),
  bulkPrice: z
    .number()
    .nonnegative()
    .optional()
    .or(z.string().transform((val) => parseFloat(val) || 0)),
  taxRate: z
    .number()
    .nonnegative()
    .optional()
    .or(z.string().transform((val) => parseFloat(val) || 0)),
});

const productVariantSchema = z.object({
  size: z.string(),
  price: z
    .number()
    .positive()
    .or(z.string().transform((val) => parseFloat(val) || 0)),
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
  const form = useForm<z.infer<typeof CreateProductSchema>>({
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
        bulkPrice: 0,
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

  const onSubmit = async (data: z.infer<typeof CreateProductSchema>) => {
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
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="product.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product name</FormLabel>
                        <FormControl>
                          <Input placeholder="Product Name" {...field} />
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
                        <FormLabel>Product code</FormLabel>
                        <FormControl>
                          <Input placeholder="Product Code" {...field} />
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter product description"
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
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="product.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">$</span>
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
                        <FormLabel>Cost price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">$</span>
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="product.bulkPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bulk discount price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5">$</span>
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
                      name="product.taxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax rate(%)</FormLabel>
                          <FormControl>
                            <Input placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="product.stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="product.status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Product will be visible to customers
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
