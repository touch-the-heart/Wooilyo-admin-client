// 업로드된 이미지 정보 타입
export interface UploadedImage {
  file: File;
  url?: string;
  isUploading: boolean;
  error?: string;
  type: "main" | "description"; // 이미지 타입 추가
  displayOrder: number; // 표시 순서 추가
}
