import React, { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { FormData } from "../types";
import { postImages } from "@/client/sdk.gen";
import { UploadedImage } from "./type";
import { ImageUploadCard } from "./card/ImageUploadCard";

interface ImageUploadSectionProps {
  form: UseFormReturn<FormData>;
  productImages: File[];
  setProductImages: React.Dispatch<React.SetStateAction<File[]>>;
}

type ImageType = "main" | "description";

interface ImageConfig {
  maxImages: number;
  errorMessage: string;
  formField: string;
  shouldUpdateProductImages: boolean;
  updateProductImages: (
    files: File[],
    currentProductImages: File[],
    setProductImages: React.Dispatch<React.SetStateAction<File[]>>
  ) => void;
}

export function ImageUploadSection({
  form,
  productImages,
  setProductImages,
}: ImageUploadSectionProps) {
  // 드래그앤드롭 상태 관리
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [mainImages, setMainImages] = useState<UploadedImage[]>([]);
  const [descriptionImages, setDescriptionImages] = useState<UploadedImage[]>(
    []
  );
  // 전체 이미지 순서를 추적하는 상태 추가
  const [totalImageCount, setTotalImageCount] = useState(0);

  // productImages 전체 업데이트 유틸리티 함수
  const updateProductImagesFromStates = useCallback(() => {
    const mainFiles = mainImages.map((img) => img.file);
    const descriptionFiles = descriptionImages.map((img) => img.file);
    setProductImages([...mainFiles, ...descriptionFiles]);
  }, [mainImages, descriptionImages, setProductImages]);

  // 이미지 타입별 설정
  const imageConfigs: Record<ImageType, ImageConfig> = {
    main: {
      maxImages: 1,
      errorMessage: "메인 이미지는 한 개만 업로드 가능합니다",
      formField: "images",
      shouldUpdateProductImages: true,
      updateProductImages: (files, currentProductImages, setProductImages) => {
        // 단순히 전체 상태 재동기화 트리거
        setTimeout(updateProductImagesFromStates, 0);
      },
    },
    description: {
      maxImages: 5,
      errorMessage: "최대 5장까지 업로드 가능합니다",
      formField: "images",
      shouldUpdateProductImages: true,
      updateProductImages: (files, currentProductImages, setProductImages) => {
        // 단순히 전체 상태 재동기화 트리거
        setTimeout(updateProductImagesFromStates, 0);
      },
    },
  };

  // State getter/setter 매핑
  const imageStates = {
    main: { images: mainImages, setImages: setMainImages },
    description: { images: descriptionImages, setImages: setDescriptionImages },
  };

  // 이미지 업로드 mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await postImages({ body: { file } });
      if (!response.data) {
        throw new Error("Upload failed");
      }
      return response.data.url;
    },
    onError: (error, file) => {
      console.error("Image upload failed:", error);
      // 모든 이미지 상태에서 에러 처리
      Object.values(imageStates).forEach(({ setImages }) => {
        setImages((prev) =>
          prev.map((img) =>
            img.file === file
              ? { ...img, error: "업로드 실패", isUploading: false }
              : img
          )
        );
      });
    },
  });

  // 이미지 처리 고차 함수 (커링 사용)
  const createImageProcessor = (imageType: ImageType) =>
    useCallback(
      async (files: FileList) => {
        if (!files) return;

        const config = imageConfigs[imageType];
        const { images, setImages } = imageStates[imageType];

        // 메인 이미지는 기존 이미지를 먼저 확인
        if (imageType === "main" && images.length >= config.maxImages) {
          alert(config.errorMessage);
          return;
        }

        const maxNewFiles = config.maxImages - images.length;
        const newFiles = Array.from(files).slice(0, maxNewFiles);

        if (images.length + newFiles.length > config.maxImages) {
          alert(config.errorMessage);
          return;
        }

        const newUploadedImages: UploadedImage[] = newFiles.map(
          (file, index) => ({
            file,
            isUploading: true,
            type: imageType,
            displayOrder: totalImageCount + index,
          })
        );

        setImages((prev) => [...prev, ...newUploadedImages]);
        setTotalImageCount((prev) => prev + newFiles.length);

        // 정책 함수를 사용하여 productImages 업데이트
        if (config.shouldUpdateProductImages) {
          config.updateProductImages(newFiles, productImages, setProductImages);
        }

        const uploadPromises = newFiles.map(async (file) => {
          try {
            const url = await uploadImageMutation.mutateAsync(file);
            setImages((prev) =>
              prev.map((img) =>
                img.file === file ? { ...img, url, isUploading: false } : img
              )
            );
            return url;
          } catch (error) {
            throw error;
          }
        });

        try {
          await Promise.allSettled(uploadPromises);
          // PostProductsData 형식에 맞춰서 저장
          // useState setter를 사용해서 최신 상태를 가져옴
          setMainImages((currentMainImages) => {
            setDescriptionImages((currentDescriptionImages) => {
              const allImages = [
                ...currentMainImages,
                ...currentDescriptionImages,
              ];
              const successfulImages = allImages
                .filter((img) => img.url && !img.isUploading)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((img) => ({
                  url: img.url!,
                  displayOrder: img.displayOrder,
                  type: img.type,
                }));

              form.setValue("images", successfulImages);
              return currentDescriptionImages;
            });
            return currentMainImages;
          });
        } catch (error) {
          console.error("Some uploads failed:", error);
        }
      },
      [
        imageType,
        imageConfigs,
        imageStates,
        form,
        uploadImageMutation,
        setProductImages,
        totalImageCount,
        mainImages,
        descriptionImages,
      ]
    );

  // 각 이미지 타입별 프로세서 생성
  const processMainImages = createImageProcessor("main");
  const processDescriptionImages = createImageProcessor("description");

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

  // 드롭 핸들러 고차 함수
  const createDropHandler = (processor: (files: FileList) => Promise<void>) =>
    useCallback(
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

          processor(dataTransfer.files);
        }
      },
      [processor]
    );

  // 각 이미지 타입별 드롭 핸들러 생성
  const handleMainDrop = createDropHandler(processMainImages);
  const handleDescriptionDrop = createDropHandler(processDescriptionImages);

  // 이미지 제거 고차 함수
  const createImageRemover = (imageType: ImageType) =>
    useCallback(
      (index: number) => {
        const config = imageConfigs[imageType];
        const { images, setImages } = imageStates[imageType];
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        setTotalImageCount((prev) => prev - 1);

        // productImages 전체 재동기화
        const updatedProductImages = [...productImages];
        const removedImage = images[index];
        const imageIndex = updatedProductImages.findIndex(
          (file) => file === removedImage.file
        );
        if (imageIndex !== -1) {
          updatedProductImages.splice(imageIndex, 1);
          setProductImages(updatedProductImages);
        }

        // PostProductsData 형식에 맞춰서 저장
        setMainImages((currentMainImages) => {
          setDescriptionImages((currentDescriptionImages) => {
            const allImages = [
              ...currentMainImages,
              ...currentDescriptionImages,
            ];
            const successfulImages = allImages
              .filter((img) => img.url && !img.isUploading)
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((img) => ({
                url: img.url!,
                displayOrder: img.displayOrder,
                type: img.type,
              }));

            form.setValue("images", successfulImages);
            return currentDescriptionImages;
          });
          return currentMainImages;
        });
      },
      [
        imageType,
        imageConfigs,
        imageStates,
        mainImages,
        descriptionImages,
        setProductImages,
        form,
      ]
    );

  // 각 이미지 타입별 제거 함수 생성
  const removeMainImage = createImageRemover("main");
  const removeDescriptionImage = createImageRemover("description");

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
