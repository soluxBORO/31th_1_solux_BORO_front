
// 포인트 이력 아이템 타입
export interface PointHistoryItem {
    pointDescription: string;
    point: number;
    createdAt: string;
}

// API 공통 응답 타입
export interface PointHistoryResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: PointHistoryItem[];
}

// 아이템 카테고리 타입
import type { ItemCategory } from "./assets";

// 보유 캐릭터 아이템 정보 타입
export interface CharacterItem {
    itemId: number;
    itemName: string;
    itemCategory: ItemCategory; // 'CLOTHING' | 'ACCESSORY' | 'ETC'
    equipped: boolean;           // 보유 여부
}

// GET /api/v1/members/assets 응답 규격
export interface MemberAssetsResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: CharacterItem[];
}

// 받은 후기
export interface ReceivedReviewItem {
    reviewerNickname: string;
    postTitle: string;
    createdAt: string; // "2026-07-10"
    content: string;
    type?: "GOOD" | "BAD"; // 프론트 엔드 분류용
}

export interface ReceivedReviewResponse {
    likeCount: number;
    dislikeCount: number;
    reviewDetailList: ReceivedReviewItem[];
}

// 회원 정보 타입
export interface MemberInfo {
    profileUrl: string
    email: string
    studentNumber: string
    name: string
    nickname: string
    point: number
}

// 회원 정보 수정 요청 타입
export interface UpdateMemberRequest {
    profileUrl: string
    nickname: string
    phoneNumber: string
}