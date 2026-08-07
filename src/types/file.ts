export interface PresignedUrlRequest {
  fileName: string
  contentType: string
}

export interface PresignedUrlResult {
  presignedUrl: string
  fileUrl: string
}