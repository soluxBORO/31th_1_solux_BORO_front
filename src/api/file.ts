import api from "../lib/axios"
import type { ApiResponse } from "../types/post"
import type { PresignedUrlRequest, PresignedUrlResult } from "../types/file"

export const getPresignedUrl = (data: PresignedUrlRequest) =>
  api.post<ApiResponse<PresignedUrlResult>>("/api/v1/files/presigned-url", data)