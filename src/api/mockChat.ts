import type { ChatRoomListResponse, ChatMessageResponse, CreateChatRoomResponse } from '../types/chat';

// Mock 데이터: 채팅방 리스트
export const mockChatRooms: ChatRoomListResponse[] = [
    {
        roomId: 101,
        otherUserId: 1,
        otherUserNickname: '코딩왕',
        lastMessage: '네! 내일 2시에 정문 앞 스타벅스에서 뵐게요!',
        lastMessageAt: '2026-07-11T23:30:00',
        unreadCount: 2,
    },
    {
        roomId: 102,
        otherUserId: 2,
        otherUserNickname: '공대생활',
        lastMessage: '감사합니다~',
        lastMessageAt: '2024-03-08T18:20:00',
        unreadCount: 0,
    },
    {
        roomId: 103,
        otherUserId: 3,
        otherUserNickname: '열공러',
        lastMessage: '네 거래 가능합니다!',
        lastMessageAt: '2026-04-04T11:00:00',
        unreadCount: 0,
    },
    {
        roomId: 101,
        otherUserId: 1,
        otherUserNickname: '코딩왕',
        lastMessage: '네! 내일 2시에 정문 앞 스타벅스에서 뵐게요!',
        lastMessageAt: '2026-04-09T16:30:00',
        unreadCount: 2,
    },
    {
        roomId: 102,
        otherUserId: 2,
        otherUserNickname: '공대생활',
        lastMessage: '감사합니다~',
        lastMessageAt: '2026-04-08T18:20:00',
        unreadCount: 0,
    },
    {
        roomId: 103,
        otherUserId: 3,
        otherUserNickname: '열공러',
        lastMessage: '네 거래 가능합니다!',
        lastMessageAt: '2026-04-04T11:00:00',
        unreadCount: 0,
    },
    {
        roomId: 101,
        otherUserId: 1,
        otherUserNickname: '코딩왕',
        lastMessage: '네! 내일 2시에 정문 앞 스타벅스에서 뵐게요!',
        lastMessageAt: '2026-04-09T16:30:00',
        unreadCount: 2,
    },
    {
        roomId: 102,
        otherUserId: 2,
        otherUserNickname: '공대생활',
        lastMessage: '감사합니다~',
        lastMessageAt: '2026-04-08T18:20:00',
        unreadCount: 0,
    },
    {
        roomId: 103,
        otherUserId: 3,
        otherUserNickname: '열공러',
        lastMessage: '네 거래 가능합니다!',
        lastMessageAt: '2026-04-04T11:00:00',
        unreadCount: 0,
    }
];

// Mock 데이터: 특정 채팅방(코딩왕 방)의 메시지 상세 내역
export const mockChatMessages: Record<number, ChatMessageResponse[]> = {
    101: [
        {
        roomId: 101,
        messageId: 1,
        senderId: 1, // 상대방 (코딩왕)
        senderNickName: '코딩왕',
        content: '안녕하세요! 과잠 대여 문의 드립니다 혹시 지금도 대여 하시나요?',
        createdAt: '2026-04-09T14:30:00',
        },
        {
        roomId: 101,
        messageId: 2,
        senderId: 999, // 나 (로그인 유저라 가정)
        senderNickName: '나',
        content: '네 안녕하세요! 아직 가능합니다 사이즈는 L이고 상태 좋습니다~',
        createdAt: '2026-04-09T14:33:00',
        },
        {
        roomId: 101,
        messageId: 3,
        senderId: 1,
        senderNickName: '코딩왕',
        content: '좋아요! 내일 하루만 빌릴게요!',
        createdAt: '2026-04-09T14:35:00',
        },
        {
        roomId: 101,
        messageId: 4,
        senderId: 999,
        senderNickName: '나',
        content: '네! 내일 2시에 정문 앞 스타벅스에서 뵐게요!',
        createdAt: '2026-04-09T16:30:00',
        },
        {
        roomId: 101,
        messageId: 5,
        senderId: 999,
        senderNickName: '나',
        content: 'test',
        createdAt: '2026-04-09T16:30:00',
        },
        {
        roomId: 101,
        messageId: 6,
        senderId: 5,
        senderNickName: '코딩왕',
        content: 'test',
        createdAt: '2026-04-10T17:30:00',
        },
    ],
};

// Mock API 함수 객체
export const mockChatApi = {
    createChatRoom: async (targetId: number): Promise<CreateChatRoomResponse> => {
        await new Promise((resolve) => setTimeout(resolve, 300)); // 딜레이 레이턴시 구현
        return {
        roomId: Math.floor(Math.random() * 1000) + 200,
        receiverId: targetId,
        createdAt: new Date().toISOString(),
        };
    },

    getChatRoomList: async (): Promise<ChatRoomListResponse[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockChatRooms;
    },

    getChatRoomDetail: async (roomId: number): Promise<ChatMessageResponse[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockChatMessages[roomId] || [];
    },
};