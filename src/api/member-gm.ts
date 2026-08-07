import api from "../lib/axios";
import type {
    ApiResponseListMemberAsset,
    ApiResponseMemberAsset,
    MemberAssetEquipRequest,
    ReviewResponse,
    ReviewSentiment,
    ApiResponseListPointHistory,
    ApiResponseMemberInfo,
    ApiResponseVoid,
    WithdrawResponse,
} from "../types/member-gm";


// 1. GET /api/v1/members/assets (내가 보유한 캐릭터 아이템 조회 API)
export const getMemberAssets = async (): Promise<ApiResponseListMemberAsset> => {
    const response = await api.get<ApiResponseListMemberAsset>(
        "/api/v1/members/assets"
    );
    return response.data;
};

// 2. PATCH /api/v1/members/assets/{assetId}/equips (꾸미기 장착/해제 API)
export const equipMemberAsset = async (
    assetId: number,
    data: MemberAssetEquipRequest
): Promise<ApiResponseMemberAsset> => {
    const response = await api.patch<ApiResponseMemberAsset>(
        `/api/v1/members/assets/${assetId}/equips`,
        data
    );
    return response.data;
};


// 3. GET /api/v1/members/reviews/received (내가 받은 대여 후기 리스트 조회 API)
export const getReceivedReviews = async (
    reviewSentiment?: ReviewSentiment
): Promise<ReviewResponse> => {
    const response = await api.get<ReviewResponse>(
        "/api/v1/members/reviews/received",
        {
            params: { reviewSentiment },
        }
    );
    return response.data;
};

// 4. GET /api/v1/members/reviews/written (내가 작성한 대여 후기 리스트 조회 API)
export const getWrittenReviews = async (
    reviewSentiment?: ReviewSentiment
): Promise<ReviewResponse> => {
    const response = await api.get<ReviewResponse>(
        "/api/v1/members/reviews/written",
        {
            params: { reviewSentiment },
        }
    );
    return response.data;
};


// 5. GET /api/v1/members/points (포인트 이력 조회 API)
export const getPointHistories = async (): Promise<ApiResponseListPointHistory> => {
    const response = await api.get<ApiResponseListPointHistory>(
        "/api/v1/members/points"
    );
    return response.data;
};


// 6. GET /api/v1/members (멤버 정보 조회)
export const getMemberInfo = async (): Promise<ApiResponseMemberInfo> => {
    const response = await api.get<ApiResponseMemberInfo>('/api/v1/members');
    return response.data;
};


// 7. POST /api/v1/members/logout (로그아웃)
export const logoutMember = async (): Promise<ApiResponseVoid> => {
    const response = await api.post<ApiResponseVoid>('/api/v1/members/logout');
    return response.data;
};


// 8. PATCH /api/v1/members/withdraw (탈퇴)
export const withdrawMember = async (): Promise<WithdrawResponse> => {
    const response = await api.patch<WithdrawResponse>("/api/v1/members/withdraw");
    return response.data;
};