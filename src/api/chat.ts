import api from "../lib/axios";
import type {
    ApiResponseChatRoomList,
    ApiResponseCreatedRentalRequest,
    ApiResponseChatMessageList,
    ApiResponseVoid,
    ChatRoom,
    ChatRoomTest,
    ChatRoomType,
    ApiResponseReadChatRoom,
} from "../types/chat";

// 1. GET /api/v1/chat (채팅방 리스트 조회)
export const getChatRooms = async (
    chatRoomType?: ChatRoomType
): Promise<ApiResponseChatRoomList> => {
    const response = await api.get<ApiResponseChatRoomList>("/api/v1/chat", {
        params: { chatRoomType },
    });
    return response.data;
};

// 2. POST /api/v1/chat/{postId} (대여 요청 및 채팅방 생성)
export const createChatRoom = async (
    postId: number,
    data: ChatRoom
): Promise<ApiResponseCreatedRentalRequest> => {
    const response = await api.post<ApiResponseCreatedRentalRequest>(
        `/api/v1/chat/${postId}`,
        data
    );
    return response.data;
};

//* 3. POST /api/v1/chat/health (채팅 테스트 - 채팅방 생성)
export const createTestChatRoom = async (
    data: ChatRoomTest
): Promise<ApiResponseVoid> => {
    const response = await api.post<ApiResponseVoid>(
        "/api/v1/chat/health",
        data
    );
    return response.data;
};

// 4. GET /api/v1/chat/{chatRoomId} (채팅방 상세 조회)
export const getChatMessageList = async (
    chatRoomId: number
): Promise<ApiResponseChatMessageList> => {
    const response = await api.get<ApiResponseChatMessageList>(
        `/api/v1/chat/${chatRoomId}`
    );
    return response.data;
};

// 5. PATCH /api/v1/chat/{roomId}/read (채팅방 읽음 처리)
export const readChatRoom = async (
    roomId: number
): Promise<ApiResponseReadChatRoom> => {
    const response = await api.patch<ApiResponseReadChatRoom>(
        `/api/v1/chat/${roomId}/read`
    );
    return response.data;
};

// WebSocket / STOMP 엔드포인트 모음
export const CHAT_SOCKET_ENDPOINTS = {
    // 웹소켓 서버 연결 엔드포인트
    WS_CONNECT: "/ws-chat",

    // [SUBSCRIBE] 특정 채팅방 실시간 메시지 수신
    SUB_CHAT_ROOM: (roomId: number) => `/sub/chat/${roomId}`,

    // [SEND] 특정 채팅방 메시지 전송
    PUB_CHAT_MESSAGE: (roomId: number) => `/pub/chat/${roomId}`,

    // [SUBSCRIBE] 내 채팅방 목록 / 안읽은 개수 실시간 업데이트 수신
    SUB_UNREAD_QUEUE: "/user/queue/unread",
} as const;