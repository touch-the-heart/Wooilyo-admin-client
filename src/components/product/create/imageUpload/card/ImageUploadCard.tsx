import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { UploadDropzone } from "./UploadDropzone";
import { ImageGrid } from "./ImageGrid";
import { UploadedImage } from "../type";

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

export function ImageUploadCard({
  title,
  description,
  uploadedImages,
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
            <UploadDropzone
              inputId={inputId}
              isDragOver={isDragOver}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onImageUpload={onImageUpload}
            />
          ) : (
            <ImageGrid
              uploadedImages={uploadedImages}
              onImageRemove={onImageRemove}
              onImageUpload={onImageUpload}
              inputId={inputId}
              maxImages={maxImages}
            />
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
