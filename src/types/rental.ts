// 공통 API 응답 구조
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}

// 공통 Enum / Sub 타입
export type ReviewSentiment = 'GOOD' | 'BAD';
export type RentalRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
export type PostCategory = 'DEPARTMENT_JACKET' | 'MAJOR_BOOKS' | 'ELECTRONICS' | 'LIVING_SUPPLIES' | 'ETC' | 'EMPTY_SPOTS';
export type RentalPriceUnit = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'SEMESTER';
export type DecisionType = 'APPROVE' | 'REJECT';

export interface ItemDetail {
    title: string;
    rentalStartTime: string;
    rentalEndTime: string;
    rentalPrice: number;
    rentalPriceUnit: RentalPriceUnit;
}

export interface SeatDetail {
    location: string;
    floor: number;
    seatNumber: number;
    expectedCheckoutTime: string;
    hasPowerOutlet: boolean;
    hasWindowSeat: boolean;
}

// 1. 빌려준 물품 대여 현황 조회 & 내가 빌린 물품 대여 현황 조회
// responses
export interface RentalRequestPreview {
    rentalRequestId: number;
    postId: number;
    chatRoomId: number;
    imageUrl: string;
    rentalRequestStatus: RentalRequestStatus;
    postCategory: PostCategory;
    ownerNickname: string;
    createdAt: string;
    borrowerReturned: boolean;
    ownerReturned: boolean;
    itemDetail?: ItemDetail;
    seatDetail?: SeatDetail;
}

export type GetLentListResponse = ApiResponse<RentalRequestPreview[]>;
export type GetBorrowedListResponse = ApiResponse<RentalRequestPreview[]>;

// 2. 대여 요청 승인/거절 & 반납 완료 처리
// query parameters
export interface DecisionParams {
    decide: DecisionType;
}

// responses
export interface DecisionResult {
    rentalRequestStatus: RentalRequestStatus;
    borrowerReturned: boolean;
    ownerReturned: boolean;
}

export type DecisionResultResponse = ApiResponse<DecisionResult>;

// 3. 대여 반납 완료 후, 리뷰 생성
// request body
export interface ReviewRequest {
    reviewSentiment: ReviewSentiment;
    content: string;
}

// responses
export interface CreatedReview {
    reviewId: number;
    reviewSentiment: ReviewSentiment;
    content: string;
    writerId: number;
    receiverId: number;
    rentalRequestId: number;
}

export type CreatedReviewResponse = ApiResponse<CreatedReview>;