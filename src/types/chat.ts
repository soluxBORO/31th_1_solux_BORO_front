// 공통 API 응답 구조
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}

export type ChatRoomType = "ITEM" | "EMPTY_SPOT";
export type ChatMessageType = "TEXT" | "IMAGE";
export type requestStatusType = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";


// 1. GET /api/v1/chat (채팅방 리스트 조회)
// responses
export interface ChatRoomPreview {
    chatRoomId: number;
    chatName: string;
    profileUrl: string;
    lastMessageContent: string;
    lastMessageAt: string;
    unreadCount: number;
    postTitle?: string;
    location?: string;
    floor?: number;
    seatNumber?: number;
    hasPowerOutlet?: boolean;
    hasWindowSeat?: boolean;
    expectedCheckoutTime?: string;
}

export interface ChatRoomList {
    chatRoomType: ChatRoomType;
    chatRoomList: ChatRoomPreview[];
}

export type ApiResponseChatRoomList = ApiResponse<ChatRoomList>;


// 2. POST /api/v1/chat/{postId} (대여 요청 및 채팅방 생성)
// request body
export interface ChatRoom {
    chatRoomType: ChatRoomType;
}

// responses
export interface CreatedRentalRequest {
    chatRoomId: number;
    rentalRequestId: number;
    requestStatus: requestStatusType;
    borrowerReturned: boolean;
    ownerReturned: boolean;
    memberId: number;
    postId: number;
}

export type ApiResponseCreatedRentalRequest = ApiResponse<CreatedRentalRequest>;


// 3. POST /api/v1/chat/health (채팅 테스트 - 채팅방 생성)
// request body
export interface ChatRoomTest {
    ownerId: number;
    postId: number;
    chatRoomName: string;
    chatRoomType: ChatRoomType;
}

// reponses
export type ApiResponseVoid = ApiResponse<Record<string, never>>;


// 4. GET /api/v1/chat/{chatRoomId} (채팅방 상세 조회)
// responses
export interface ChatMessageDetail {
    chatMessageType: ChatMessageType;
    memberId: number;
    content: string;
    imageUrls: string[];
    createdAt: string;
}

export interface ChatMessageList {
    chatRoomName: string;
    postName: string;
    profileUrl: string;
    chatMessageList: ChatMessageDetail[];
}

export type ApiResponseChatMessageList = ApiResponse<ChatMessageList>;


// 5. PATCH /api/v1/chat/{roomId}/read (채팅방 읽음 처리)
export type ApiResponseReadChatRoom = ApiResponse<Record<string, never>>;


// =============================
// WebSocket / STOMP 타입 정의

// 6. SUBSCRIBE /sub/chat/{roomId} (채팅방 메시지 구독)
export interface SubChatMessagePayload {
    roomId: number;
    chatMessageType: ChatMessageType;
    memberId: number;
    content: string;
    imageUrls: string[];
    createdAt: string;
}


// 7. SEND /pub/chat/{roomId} (채팅방 메시지 전송)
export interface SendChatMessagePayload {
    chatMessageType: ChatMessageType;
    content: string;
    imageUrls: string[];
}


// 8. SUBSCRIBE user/queue/unread (채팅방 생성 조회 - 업데이트된 채팅방 반영)
export interface UnreadChatUpdatePayload {
    memberId: number;
    chatRoomId: number;
    lastMessageContent: string;
    lastMessageAt: string;
    unreadCount: number;
}