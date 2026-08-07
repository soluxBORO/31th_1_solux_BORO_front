import api from '../lib/axios';
import type {
    GetLentListResponse,
    GetBorrowedListResponse,
    DecisionResultResponse,
    CreatedReviewResponse,
    ReviewRequest,
    DecisionType,
} from '../types/rental';

// 1. 빌려준 물품 대여 현황 조회
export const getLentRentalRequests = async (): Promise<GetLentListResponse> => {
    const response = await api.get<GetLentListResponse>('/api/v1/rental-requests/lent');
    return response.data;
};

// 2. 내가 빌린 물품들의 대여 현황 조회
export const getBorrowedRentalRequests = async (): Promise<GetBorrowedListResponse> => {
    const response = await api.get<GetBorrowedListResponse>('/api/v1/rental-requests/borrowed');
    return response.data;
};

// 3. 대여 요청 승인/거절
export const decideRentalRequest = async (
    rentalId: number,
    decide: DecisionType
): Promise<DecisionResultResponse> => {
    const response = await api.patch<DecisionResultResponse>(
        `/api/v1/rental-requests/${rentalId}`,
        null,
        {
        params: { decide },
        }
    );
    return response.data;
};

// 4. 대여 중인 물품의 반납 완료 처리
export const completeRentalReturn = async (
    rentalId: number
): Promise<DecisionResultResponse> => {
    const response = await api.patch<DecisionResultResponse>(
        `/api/v1/rentals/${rentalId}`
    );
    return response.data;
};

// 5. 대여 반납 완료 후, 리뷰 생성
export const createRentalReview = async (
    rentalId: number,
    data: ReviewRequest
): Promise<CreatedReviewResponse> => {
    const response = await api.post<CreatedReviewResponse>(
        `/api/v1/rentals/${rentalId}/review`,
        data
    );
    return response.data;
};