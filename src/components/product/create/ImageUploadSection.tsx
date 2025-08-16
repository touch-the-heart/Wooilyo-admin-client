import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Upload } from "lucide-react";
import { FormData } from "./types";

interface ImageUploadSectionProps {
  form: UseFormReturn<FormData>;
  productImages: File[];
  setProductImages: React.Dispatch<React.SetStateAction<File[]>>;
}

export function ImageUploadSection({
  form,
  productImages,
  setProductImages,
}: ImageUploadSectionProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("FILES", files);
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
    console.log("CURIMages", currentImages);
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
    <Card>
      <CardHeader>
        <CardTitle>도자기 이미지</CardTitle>
        <CardDescription>
          Choose a product photo or simply drag and drop up to 5 photos here.
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
          Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file size is
          restricted to a maximum of 500kb.
        </p>
      </CardContent>
    </Card>
  );
}
