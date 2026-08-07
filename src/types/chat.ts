// 웹소켓


// 대여 요청 및 채팅방 생성
export interface CreateChatRoomResponse {
    roomId: number;
    receiverId: number;
    createdAt: string;
}

// 채팅방 리스트 조회 (리스트로 반환)
export interface ChatRoomListResponse {
    roomId: number;
    otherUserId: number;
    otherUserNickname: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

// 채팅방 상세 조회
export interface ChatMessageResponse {
    roomId: number;
    messageId: number;
    senderId: number;
    senderNickName: string;
    content: string;
    createdAt: string;
}