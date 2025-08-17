import React, { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Upload } from "lucide-react";
import { FormData } from "./types";
import { postImages } from "@/client/sdk.gen";

interface ImageUploadSectionProps {
  form: UseFormReturn<FormData>;
  productImages: File[];
  setProductImages: React.Dispatch<React.SetStateAction<File[]>>;
}

// 업로드된 이미지 정보 타입
interface UploadedImage {
  file: File;
  url?: string;
  isUploading: boolean;
  error?: string;
}

// 이미지 업로드 컴포넌트 타입
interface ImageUploadCardProps {
  title: string;
  description: string;
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  onImageUpload: (files: FileList) => void;
  onImageRemove: (index: number) => void;
  isDragOver: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  inputId: string;
  maxImages?: number; // 최대 이미지 개수 (기본값: 5)
}

// 이미지 업로드 카드 컴포넌트
function ImageUploadCard({
  title,
  description,
  uploadedImages,
  setUploadedImages,
  onImageUpload,
  onImageRemove,
  isDragOver,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  inputId,
  maxImages = 5, // 기본값 5
}: ImageUploadCardProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    onImageUpload(files);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center transition-all duration-200 ${
            isDragOver
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {uploadedImages.length === 0 ? (
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
                    htmlFor={inputId}
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                  >
                    클릭하여 선택
                  </label>
                )}
                <input
                  id={inputId}
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
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(img.file)}
                    alt={`Product ${idx + 1}`}
                    className={`h-20 w-20 object-cover rounded ${
                      img.isUploading ? "opacity-50" : ""
                    }`}
                  />
                  {img.isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  {img.error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20 rounded">
                      <span className="text-red-600 text-xs">오류</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onImageRemove(idx)}
                    className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hidden group-hover:block"
                    disabled={img.isUploading}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
              {uploadedImages.length < maxImages && (
                <label
                  htmlFor={`add-more-${inputId}`}
                  className="h-20 w-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Plus className="h-6 w-6 text-gray-400" />
                  <input
                    id={`add-more-${inputId}`}
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

export function ImageUploadSection({
  form,
  productImages,
  setProductImages,
}: ImageUploadSectionProps) {
  // 드래그앤드롭 상태 관리
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  // 메인 이미지 상태 관리
  const [mainImages, setMainImages] = useState<UploadedImage[]>([]);
  // 설명 이미지 상태 관리
  const [descriptionImages, setDescriptionImages] = useState<UploadedImage[]>(
    []
  );
  const [totalUploadedImages, setTotalUploadedImages] = useState<
    UploadedImage[]
  >([]);

  // 이미지 업로드 mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await postImages({ body: { file } });
      if (!response.data) {
        throw new Error("Upload failed");
      }
      return response.data.filename;
    },
    onError: (error, file) => {
      console.error("Image upload failed:", error);
      // 메인 이미지와 설명 이미지 모두에서 해당 파일 찾아서 에러 상태로 변경
      setMainImages((prev) =>
        prev.map((img) =>
          img.file === file
            ? { ...img, error: "업로드 실패", isUploading: false }
            : img
        )
      );
      setDescriptionImages((prev) =>
        prev.map((img) =>
          img.file === file
            ? { ...img, error: "업로드 실패", isUploading: false }
            : img
        )
      );
    },
  });

  // 메인 이미지 처리 함수
  const processMainImages = useCallback(
    async (files: FileList) => {
      if (!files) return;

      // 메인 이미지는 한 개만 허용
      if (mainImages.length >= 1) {
        alert("메인 이미지는 한 개만 업로드 가능합니다");
        return;
      }

      const newFiles = Array.from(files).slice(0, 1); // 최대 1개만

      const newUploadedImages: UploadedImage[] = newFiles.map((file) => ({
        file,
        isUploading: true,
      }));

      setMainImages((prev) => [...prev, ...newUploadedImages]);
      setProductImages((prev) => [...prev, ...newFiles]);

      const uploadPromises = newFiles.map(async (file) => {
        try {
          const filename = await uploadImageMutation.mutateAsync(file);
          setMainImages((prev) =>
            prev.map((img) =>
              img.file === file
                ? { ...img, url: filename, isUploading: false }
                : img
            )
          );
          return filename;
        } catch (error) {
          throw error;
        }
      });

      try {
        await Promise.allSettled(uploadPromises);
        const successfulUploads = mainImages
          .filter((img) => img.url && !img.isUploading)
          .map((img) => img.url!);
        form.setValue("images", successfulUploads);
      } catch (error) {
        console.error("Some uploads failed:", error);
      }
    },
    [mainImages.length, setProductImages, form, uploadImageMutation]
  );

  // 설명 이미지 처리 함수
  const processDescriptionImages = useCallback(
    async (files: FileList) => {
      if (!files) return;

      const newFiles = Array.from(files).slice(0, 5 - descriptionImages.length);

      if (descriptionImages.length + newFiles.length > 5) {
        alert("최대 5장까지 업로드 가능합니다");
        return;
      }

      const newUploadedImages: UploadedImage[] = newFiles.map((file) => ({
        file,
        isUploading: true,
      }));

      setDescriptionImages((prev) => [...prev, ...newUploadedImages]);

      const uploadPromises = newFiles.map(async (file) => {
        try {
          const filename = await uploadImageMutation.mutateAsync(file);
          setDescriptionImages((prev) =>
            prev.map((img) =>
              img.file === file
                ? { ...img, url: filename, isUploading: false }
                : img
            )
          );
          return filename;
        } catch (error) {
          throw error;
        }
      });

      try {
        await Promise.allSettled(uploadPromises);
        const successfulUploads = descriptionImages
          .filter((img) => img.url && !img.isUploading)
          .map((img) => img.url!);
        form.setValue("images", successfulUploads);
      } catch (error) {
        console.error("Some uploads failed:", error);
      }
    },
    [descriptionImages.length, form, uploadImageMutation]
  );

  // 메인 이미지 업로드 핸들러
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processMainImages(files);
  };

  // 설명 이미지 업로드 핸들러
  const handleDescriptionImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
    processDescriptionImages(files);
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

  // 메인 이미지 드롭 핸들러
  const handleMainDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragOver(false);
      setDragCounter(0);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const imageFiles = Array.from(files).filter((file) =>
          file.type.startsWith("image/")
        );

        if (imageFiles.length === 0) {
          alert("이미지 파일만 드롭해주세요");
          return;
        }

        const dataTransfer = new DataTransfer();
        imageFiles.forEach((file) => dataTransfer.items.add(file));

        processMainImages(dataTransfer.files);
      }
    },
    [processMainImages]
  );

  // 설명 이미지 드롭 핸들러
  const handleDescriptionDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragOver(false);
      setDragCounter(0);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const imageFiles = Array.from(files).filter((file) =>
          file.type.startsWith("image/")
        );

        if (imageFiles.length === 0) {
          alert("이미지 파일만 드롭해주세요");
          return;
        }

        const dataTransfer = new DataTransfer();
        imageFiles.forEach((file) => dataTransfer.items.add(file));

        processDescriptionImages(dataTransfer.files);
      }
    },
    [processDescriptionImages]
  );

  // 메인 이미지 삭제
  const removeMainImage = (index: number) => {
    const newImages = [...productImages];
    const newMainImages = [...mainImages];

    newImages.splice(index, 1);
    newMainImages.splice(index, 1);

    setProductImages(newImages);
    setMainImages(newMainImages);

    const successfulUploads = newMainImages
      .filter((img) => img.url && !img.isUploading)
      .map((img) => img.url!);

    form.setValue("images", successfulUploads);
  };

  // 설명 이미지 삭제
  const removeDescriptionImage = (index: number) => {
    const newDescriptionImages = [...descriptionImages];
    newDescriptionImages.splice(index, 1);
    setDescriptionImages(newDescriptionImages);

    const successfulUploads = newDescriptionImages
      .filter((img) => img.url && !img.isUploading)
      .map((img) => img.url!);

    form.setValue("images", successfulUploads);
  };

  return (
    <div className="space-y-6">
      {/* 메인 이미지 업로드 */}
      <ImageUploadCard
        title="상품 메인 이미지"
        description="상품의 대표 이미지를 선택하거나 드래그앤드롭으로 추가하세요. (한 개만 가능)"
        uploadedImages={mainImages}
        setUploadedImages={setMainImages}
        onImageUpload={processMainImages}
        onImageRemove={removeMainImage}
        isDragOver={isDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleMainDrop}
        inputId="main-image-upload"
        maxImages={1}
      />

      {/* 설명 이미지 업로드 */}
      <ImageUploadCard
        title="상품 설명 이미지"
        description="상품 설명에 들어갈 이미지를 선택하거나 최대 5장까지 드래그앤드롭으로 추가하세요."
        uploadedImages={descriptionImages}
        setUploadedImages={setDescriptionImages}
        onImageUpload={processDescriptionImages}
        onImageRemove={removeDescriptionImage}
        isDragOver={isDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDescriptionDrop}
        inputId="description-image-upload"
      />
    </div>
  );
}
