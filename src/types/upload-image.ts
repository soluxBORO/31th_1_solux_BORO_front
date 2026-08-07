// POST /api/v1/files/presigned-url (S3 프리사인드 URL 발급 API)
// request body
export interface PresignedUrlRequestDTO {
    fileName: string;
    contentType: string;
}

// responses
export interface PresignedUrlResponseDTO {
    presignedUrl: string;
    fileUrl: string;
}

// 공통 API 응답 래퍼 타입
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}
