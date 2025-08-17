import { Plus } from "lucide-react";
import { ImagePreview } from "./ImagePreview";
import { UploadedImage } from "../type";

interface AddImageButtonProps {
  inputId: string;
  onImageUpload: (files: FileList) => void;
}

function AddImageButton({ inputId, onImageUpload }: AddImageButtonProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    onImageUpload(files);
  };

  return (
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
  );
}

interface ImageGridProps {
  uploadedImages: UploadedImage[];
  onImageRemove: (index: number) => void;
  onImageUpload: (files: FileList) => void;
  inputId: string;
  maxImages: number;
}

export function ImageGrid({
  uploadedImages,
  onImageRemove,
  onImageUpload,
  inputId,
  maxImages,
}: ImageGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {uploadedImages.map((img, idx) => (
        <ImagePreview
          key={idx}
          image={img}
          index={idx}
          onRemove={onImageRemove}
        />
      ))}
      {uploadedImages.length < maxImages && (
        <AddImageButton inputId={inputId} onImageUpload={onImageUpload} />
      )}
    </div>
  );
}
