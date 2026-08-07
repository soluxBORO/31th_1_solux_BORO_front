import api from "../lib/axios";
import type { 
    PresignedUrlRequestDTO, 
    PresignedUrlResponseDTO, 
    ApiResponse 
} from "../types/upload-image";

// 타입 명시
export const getPresignedUrl = async (
    body: PresignedUrlRequestDTO
): Promise<ApiResponse<PresignedUrlResponseDTO>> => {
    const response = await api.post<ApiResponse<PresignedUrlResponseDTO>>(
        "/api/v1/files/presigned-url",
        body
    );
    return response.data;
};

// S3 업로드
export const uploadFileToS3 = async (
    presignedUrl: string, 
    file: File
): Promise<void> => {
    const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
        },
        body: file,
    });

    if (!response.ok) {
        throw new Error("S3 파일 업로드에 실패했습니다.");
    }
};

// 통합 업로드
export const uploadImage = async (file: File): Promise<string> => {
    const res = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
    });

    if (!res.isSuccess || !res.result) {
        throw new Error(res.message || "Presigned URL 발급 오류");
    }

    const { presignedUrl, fileUrl } = res.result;

    await uploadFileToS3(presignedUrl, file);

    return fileUrl;
};
