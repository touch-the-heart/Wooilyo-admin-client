import z from "zod";

// Schema definitions
export const insertProductSchema = z.object({
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

export const productVariantSchema = z.object({
  size: z.string(),
  price: z.coerce.number().positive(),
});

export const CreateProductSchema = z.object({
  product: insertProductSchema,
  details: z.array(productVariantSchema).max(3).optional(),
  categoryIds: z.array(z.number()).optional(),
  images: z.array(z.any()).max(5).optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type FormData = z.infer<typeof CreateProductSchema>;

// Mock data for demonstration
export const mockCategories = [
  { id: 1, name: "Clothing" },
  { id: 2, name: "Accessories" },
  { id: 3, name: "Footwear" },
];
