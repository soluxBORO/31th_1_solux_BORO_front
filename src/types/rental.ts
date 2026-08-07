export type RequestStatus = "요청중" | "대여중" | "대여가능" | "반납완료" // 백엔드 확인 필요
export type ReviewSentiment = 'GOOD' | 'BAD';


// 빌려준 것
export interface LentRentalResponse {
    requestStatus: RequestStatus
    rentalStartTime: string
    borrower: string
    title: string
    //category: string              // 백엔드에게 요청 필요
}

// 빌린 것
export interface BorrowedRentalResponse {
    requestStatus: RequestStatus
    rentalStartTime: string
    rentalEndTime: string
    lender: string
    title: string
    //category: string              // 백엔드에게 요청 필요
}

export interface CreateReviewRequest {
    reviewSentiment: ReviewSentiment
}

export interface ReviewResponse {
    author: string
    title: string
    createdAt: string
    reviewSentiment: ReviewSentiment
}