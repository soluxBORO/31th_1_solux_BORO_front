import type { BorrowedRentalResponse, LentRentalResponse, ReviewResponse } from "../types/rental";


// 1. 빌려준 것 mock 데이터
export const mockLentRentals: LentRentalResponse = {
    requestStatus: "요청중",
    rentalStartTime: "2026.4.8",
    borrower: "코딩왕",
    title: "컴퓨터 공학과 과잠 대여하고 싶어요"
    //category: "과잠"
};

// 2. 빌린 것 mock 데이터
export const mockBorrowedRentals: BorrowedRentalResponse = {
    requestStatus: "대여중",
    rentalStartTime: "2026.4.8",
    rentalEndTime: "2026.4.18",
    lender: "책벌레99",
    title: "데이터구조 전공서적 빌릴 수 있을까요",
    //category: "전공서적"
};

// 7. 대여 후기 mock 데이터
export const mockReview: ReviewResponse = {
    author: "새송이",
    title: "우산 빌려주실 분 있나요",
    createdAt: "2026.3.20",
    reviewSentiment: "GOOD"
};