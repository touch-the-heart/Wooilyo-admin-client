import { Upload } from "lucide-react";

interface UploadDropzoneProps {
  inputId: string;
  isDragOver: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onImageUpload: (files: FileList) => void;
}

export function UploadDropzone({
  inputId,
  isDragOver,
  onImageUpload,
}: UploadDropzoneProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    onImageUpload(files);
  };

  return (
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
          {isDragOver ? "여기에 이미지를 놓으세요!" : "이미지를 여기에 놓거나"}
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
  );
}
