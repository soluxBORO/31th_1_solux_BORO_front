import api from "../lib/axios";
import type { ApiResponse } from "../types/assets";
import type {
  EmptySpotListResponse,
  EmptySpotDetailResponse,
  CreateEmptySpotRequest,
  UpdateEmptySpotRequest,
  EmptySpotCreateResponse,
} from "../types/emptySpot";

// 1. 빈자리 게시물 리스트 조회
export const getEmptySpotList = () =>
  api.get<EmptySpotListResponse>("/api/v1/empty-spot");

// 2. 빈자리 게시물 상세 조회
export const getEmptySpotDetail = (emptySpotId: string | number) =>
  api.get<EmptySpotDetailResponse>(`/api/v1/empty-spot/${emptySpotId}`);

// 3. 빈자리 작성 API
export const createEmptySpot = (data: CreateEmptySpotRequest) =>
  api.post<ApiResponse<EmptySpotCreateResponse>>("/api/v1/empty-spot", data);

// 4. 빈자리 수정 API
export const updateEmptySpot = (
  emptySpotId: string | number,
  data: UpdateEmptySpotRequest
) =>
  api.put<ApiResponse<{}>>(`/api/v1/empty-spot/${emptySpotId}`, data);

// 5. 빈자리 게시물 삭제
export const deleteEmptySpot = (emptySpotId: string | number) =>
  api.delete(`/api/v1/empty-spot/${emptySpotId}`);