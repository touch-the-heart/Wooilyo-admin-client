import React, { useState, useCallback } from "react";
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
  // 드래그앤드롭 상태 관리
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  // 파일 처리 함수 (공통 로직)
  const processFiles = useCallback(
    (files: FileList) => {
      if (!files) return;

      // Convert FileList to array and limit to 5 images
      const newFiles = Array.from(files).slice(0, 5 - productImages.length);

      if (productImages.length + newFiles.length > 5) {
        alert("최대 5장까지 업로드 가능합니다");
        return;
      }

      setProductImages((prev) => [...prev, ...newFiles]);

      // Update form value
      const currentImages = form.getValues("images") || [];
      console.log("CURIMages", currentImages);
      form.setValue("images", [...currentImages, ...newFiles]);
    },
    [productImages.length, setProductImages, form]
  );

  // 파일 업로드 핸들러 (기존)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("FILES", files);
    if (!files) return;
    processFiles(files);
  };

  // 드래그앤드롭 이벤트 핸들러들
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);

    // 파일이 드래그되고 있는지 확인
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => prev - 1);

      if (dragCounter === 0) {
        setIsDragOver(false);
      }
    },
    [dragCounter]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragOver(false);
      setDragCounter(0);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        // 이미지 파일만 필터링
        const imageFiles = Array.from(files).filter((file) =>
          file.type.startsWith("image/")
        );

        if (imageFiles.length === 0) {
          alert("이미지 파일만 드롭해주세요");
          return;
        }

        // FileList를 FileList로 변환 (processFiles 함수와 호환되도록)
        const dataTransfer = new DataTransfer();
        imageFiles.forEach((file) => dataTransfer.items.add(file));

        processFiles(dataTransfer.files);
      }
    },
    [processFiles]
  );

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
          상품 사진을 선택하거나 최대 5장까지 드래그앤드롭으로 추가하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center transition-all duration-200 ${
            isDragOver
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {productImages.length === 0 ? (
            <>
              <div
                className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full mb-4 transition-colors duration-200 ${
                  isDragOver ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <Upload
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isDragOver ? "text-blue-600" : "text-gray-600"
                  }`}
                />
              </div>
              <div>
                <p className="mb-1">
                  {isDragOver
                    ? "여기에 이미지를 놓으세요!"
                    : "이미지를 여기에 놓거나"}
                </p>
                {!isDragOver && (
                  <label
                    htmlFor="file-upload"
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                  >
                    클릭하여 선택
                  </label>
                )}
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
                  className="h-20 w-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
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
          이미지 형식: .jpg, .jpeg, .png, 권장 크기: 1:1, 파일 크기는 최대
          500kb로 제한됩니다.
        </p>
      </CardContent>
    </Card>
  );
}
