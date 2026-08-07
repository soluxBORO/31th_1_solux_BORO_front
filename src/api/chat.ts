import api from "../lib/axios";
import type { CreateChatRoomResponse, ChatRoomListResponse, ChatMessageResponse } from "../types/chat";

// 대여 요청 및 채팅방 생성 (POST /api/v1/chat)
export const createChatRoom = async (targetId: number): Promise<CreateChatRoomResponse> => {
    const response = await api.post<CreateChatRoomResponse>("/api/v1/chat", { targetId });
    return response.data;
};

// 채팅방 리스트 조회 (GET /api/v1/chat)
export const getChatRoomList = async (): Promise<ChatRoomListResponse[]> => {
    const response = await api.get<ChatRoomListResponse[]>("/api/v1/chat");
    return response.data;
};

// 채팅방 상세 조회 (GET /api/v1/chat/{roomId})
export const getChatRoomDetail = async (roomId: number): Promise<ChatMessageResponse[]> => {
    const response = await api.get<ChatMessageResponse[]>(`/api/v1/chat/${roomId}`);
    return response.data;
};