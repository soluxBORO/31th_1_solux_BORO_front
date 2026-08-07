// 공통 API 응답 타입
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}


// member/assets (캐릭터 아이템 관련)

// 아이템 카테고리 Enum
export type ItemCategory = "CLOTHING" | "ACCESSORY" | "ETC";

// 보유 캐릭터 아이템 정보
export interface MemberAsset {
    itemId: number;
    itemName: string;
    itemCategory: ItemCategory;
    equipped: boolean;
}

// 1. PATCH /api/v1/members/assets/{assetId}/equips (꾸미기 장착/해제)
// request body
export interface MemberAssetEquipRequest {
    equipped: boolean;
}

// responses
export type ApiResponseMemberAsset = ApiResponse<MemberAsset>;

// 2. GET /api/v1/members/assets (내가 보유한 캐릭터 아이템 조회 Response)
export type ApiResponseListMemberAsset = ApiResponse<MemberAsset[]>;



// member/reviews (대여 후기 관련)

// 후기 감정 Enum
export type ReviewSentiment = "GOOD" | "BAD";

// 개별 후기 상세 정보 타입
export interface ReviewDetail {
    memberId: number;
    memberNickname: string;
    postTitle: string;
    createdAt: string;
    content: string;
}

// 후기 조회 결과 메인 객체 타입
export interface Review {
    likeCount: number;
    dislikeCount: number;
    reviewDetailList: ReviewDetail[];
}

// 3. GET /api/v1/members/reviews/written (작성한 후기 조회)
// 4. GET /api/v1/members/reviews/received (받은 후기 조회)
// Request Query Parameter 타입 (필요 시 활용)
export interface ReviewParams {
    reviewSentiment?: ReviewSentiment;
}

// Responses 타입
export type ReviewResponse = ApiResponse<Review>;



// member/points (포인트 이력 관련)

// 포인트 이력 정보
export interface PointHistory {
    pointDescription: string;
    point: number;
    createdAt: string;
}

// 5. GET /api/v1/members/points (포인트 이력 조회)
// responses
export type ApiResponseListPointHistory = ApiResponse<PointHistory[]>;


// 6. GET /api/v1/members (멤버의 정보를 조회)
export interface MemberInfo {
    profileUrl: string;
    email: string;
    studentNumber: string;
    name: string;
    nickname: string;
    point: number;
}

export type ApiResponseMemberInfo = ApiResponse<MemberInfo>;


// 7. POST /api/v1/members/logout (로그아웃)
export type ApiResponseVoid = ApiResponse<Record<string, never> | null>;


// 8. PATCH /api/v1/members/withdraw (탈퇴)
export type WithdrawResponse = ApiResponse<Record<string, never> | null>;