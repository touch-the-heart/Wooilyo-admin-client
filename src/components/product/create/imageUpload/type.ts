// 업로드된 이미지 정보 타입
export interface UploadedImage {
  file: File;
  url?: string;
  isUploading: boolean;
  error?: string;
}
