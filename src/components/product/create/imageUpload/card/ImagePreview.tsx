import { Trash2 } from "lucide-react";
import { UploadedImage } from "../type";

interface ImagePreviewProps {
  image: UploadedImage;
  index: number;
  onRemove: (index: number) => void;
}

export function ImagePreview({ image, index, onRemove }: ImagePreviewProps) {
  // 서버 이미지인지 로컬 이미지인지 판단
  const imageSrc = image.url || URL.createObjectURL(image.file);

  return (
    <div className="relative group">
      <img
        src={imageSrc}
        alt={`Product ${index + 1}`}
        className={`h-20 w-20 object-cover rounded ${
          image.isUploading ? "opacity-50" : ""
        }`}
      />

      {image.isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}

      {image.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20 rounded">
          <span className="text-red-600 text-xs">오류</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hidden group-hover:block"
        disabled={image.isUploading}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
}
