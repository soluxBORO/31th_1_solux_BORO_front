import api from "../lib/axios"
import type { BorrowedRentalResponse, LentRentalResponse, CreateReviewRequest, ReviewResponse } from "../types/rental"


// 1. 대여 현황 조회 - 빌린 것
export const getBorrowedRentals = () =>
    api.get<BorrowedRentalResponse>("/api/v1/rental-requests/borrowed")

// 2. 대여 현황 조회 - 빌려준 것
export const getLentRentals = () =>
    api.get<LentRentalResponse>("/api/v1/rental-requests/lent")

// 3. 대여 요청 승인/거절
export const updateRentalRequest = () =>
    api.patch("/api/v1/rental-requests")

// 4. 대연 반납 완료 처리
export const completeRentalReturn = () =>
    api.patch("/api/v1/rental")

// 5. 거래 내역 조회
export const getRentalHistory = () =>
    api.get("/api/v1/rental")

// 6. 대여 후기 작성
export const createReview = (rentalId: string | number, data: CreateReviewRequest) =>
    api.post(`/api/v1/rental/${rentalId}/review`, data);

// 7. 대여 후기 조회
export const getReview = (rentalId: string | number) =>
    api.get<ReviewResponse>(`/api/v1/rental/${rentalId}/review`);