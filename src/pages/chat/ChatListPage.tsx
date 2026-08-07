// 거래 채팅 목록 (기본)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { getChatRoomList } from "../../api/chat"; // 실제 API 연결 시 주석 해제
import { mockChatRooms } from "../../api/mockChat";
import type { ChatRoomListResponse } from "../../types/chat";
import BottomNav from "../../components/BottomNav";
import Tab from "../../components/Tab";


// LocalDateTime 문자열을 받아 오늘/어제/날짜 형식으로 변환하는 함수
const formatChatTime = (dateTimeStr: string): string => {
    const messageDate = new Date(dateTimeStr);
    const now = new Date();

    // 연, 월, 일 비교를 위해 시분초를 0으로 초기화한 Date 객체 생성
    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = today.getTime() - messageDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // 오늘이면: "오후 4:30" 또는 "오전 11:15" 형식
        let hours = messageDate.getHours();
        const minutes = messageDate.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "오후" : "오전";
        
        hours = hours % 12;
        hours = hours ? hours : 12; // 0시면 12시로 표시
        
        return `${ampm} ${hours} : ${minutes}`;
    } else if (diffDays === 1) {
        // 어제이면
        return "어제";
    } else {
        // 💡 오늘/어제 가 아닌 그 이전 날짜일 때 처리
        const currentYear = now.getFullYear(); // 현재 연도 (예: 2026)
        const messageYear = messageDate.getFullYear(); // 메시지 연도
        
        const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
        const day = messageDate.getDate().toString().padStart(2, "0");

        if (messageYear < currentYear) {
            // 1) 올해 이전 해(작년, 재작년 등)이면 YY.MM.DD 형식으로 반환
            const shortYear = messageYear.toString().slice(-2); // 뒤의 2자리만 자름 (예: '25')
            return `${shortYear}.${month}.${day}`;
        } else {
            // 2) 올해(그저께부터 12월 31일까지)이면 MM.DD 형식으로 반환
            return `${month}.${day}`;
        }
    }
};

export default function ChatListPage() {
    const navigate = useNavigate();
    // 초기 Mock 데이터를 가장 최근 메시지 시간순(내림차순)으로 정렬하여 상태에 저장합니다.  // setRooms
    const [rooms] = useState<ChatRoomListResponse[]>(() => 
        [...mockChatRooms].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    );

    useEffect(() => {
        /* [연결 후 적용 방법]
        실제 API가 연결되면 아래 주석을 풀고 사용하세요. 
        받아온 리스트 데이터를 시간 최신순으로 정렬해서 상태에 넣는 구조입니다.

        getChatRoomList().then(res => {
            const sorted = [...res].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
            setRooms(sorted);
        });
        */
    }, []);

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-height-[874px] max-height-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white">
            {/* 상단 헤더 */}
            <div className="pl-[30px] pt-[30px] pb-5 flex-shrink-0">
                <h1 className="text-2xl font-bold leading-none text-black">채팅</h1>
            </div>

            {/* 탭 메뉴 */}
            <Tab 
                activeTab="first"
                firstLabel="거래 채팅"
                firstPath="/chat/"
                secondLabel={(
                    <div className="flex items-center gap-1.5 justify-center">
                        <svg 
                            width="11" 
                            height="12" 
                            viewBox="0 0 11 12" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-shrink-0"
                        >
                            <path d="M9.90776 1.46182C10.266 1.06642 9.92838 0.500017 9.333 0.500017H4.71566C4.59063 0.49922 4.46747 0.526508 4.35802 0.579258C4.24858 0.632007 4.15652 0.708444 4.09071 0.801217L0.596763 5.87483C0.32107 6.27443 0.667577 6.77303 1.22102 6.77303H3.57851L1.35784 11.612C1.03677 12.224 1.90441 12.7838 2.48742 12.341L11.5 4.89862H6.79126L9.90776 1.46182Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                fill="none"
                            />
                        
                        </svg>
                        <span>빈자리 채팅</span>
                    </div>)}
                secondPath="/chat/spot"
            />

            {/* 거래 채팅 리스트 영역 */}
            <div className="flex-1 overflow-y-auto pl-[30px] pr-[20px] space-y-6 pt-6 pb-[70px]">
                {rooms.map((room) => (
                    <div key={room.roomId}
                        onClick={() => navigate(`/chat/${room.roomId}`, { state: { type: "TRADE" } })}
                        className="flex items-stretch justify-between cursor-pointer group w-full"
                    >
                        <div className="flex items-center gap-[13px] mb-[30px] flex-1">
                            {/* 프로필 이미지 구역 */}
                            <div className="w-[56px] h-[56px] rounded-full bg-[#E6E6E6] flex items-center justify-center flex-shrink-0">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.625 16.8125C0.625 15.5859 1.11228 14.4095 1.97963 13.5421C2.84699 12.6748 4.02337 12.1875 5.25 12.1875H14.5C15.7266 12.1875 16.903 12.6748 17.7704 13.5421C18.6377 14.4095 19.125 15.5859 19.125 16.8125C19.125 17.4258 18.8814 18.014 18.4477 18.4477C18.014 18.8814 17.4258 19.125 16.8125 19.125H2.9375C2.32419 19.125 1.73599 18.8814 1.30232 18.4477C0.868638 18.014 0.625 17.4258 0.625 16.8125Z" stroke="#7F7F7F" stroke-width="1.25" stroke-linejoin="round"/>
                                    <path d="M9.875 7.5625C11.7907 7.5625 13.3438 6.00949 13.3438 4.09375C13.3438 2.17801 11.7907 0.625 9.875 0.625C7.95926 0.625 6.40625 2.17801 6.40625 4.09375C6.40625 6.00949 7.95926 7.5625 9.875 7.5625Z" stroke="#7F7F7F" stroke-width="1.25"/>
                                </svg>
                            </div>

                            {/* 텍스트 구역 */}
                            <div className="flex flex-col gap-[9px] flex-1 min-w-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="font-bold text-[16px] text-[#000000] flex-shrink-0">{room.otherUserNickname}</span>
                                    <span className="text-[12px] text-[#9996FF] line-clamp-1 flex-1 ml-2 mb-0.5">{"컴공과 과잠 대여"}</span>    {/*room.title*/}
                                </div>
                                <span className="text-[12px] text-[#7F7F7F] line-clamp-1 pr-2">
                                    {room.lastMessage}
                                </span>
                            </div>
                        </div>

                        {/* 시간 및 알림 배지 구역 */}
                        <div className="flex flex-col items-end gap-3 flex-shrink-0 w-[80px] text-right">
                            {/* 시안 UI의 텍스트 매칭을 위해 조건부 매핑 (실제 데이터에선 그냥 lastMessageAt 파싱) */}
                            <span 
                                className={`text-[12px] ${
                                    new Date(room.lastMessageAt).toDateString() === new Date().toDateString()
                                        ? "text-[#1A1A1A]" // 오늘일 때
                                        : "text-[#7F7F7F]" // 어제나 그 이후일 때
                                }`}
                            >
                                {formatChatTime(room.lastMessageAt)}
                            </span>
                            {room.unreadCount > 0 ? (
                                <div className="w-[22px] h-[22px] rounded-full bg-[#FF5E00] flex items-center justify-center text-white text-[12px]">
                                    {room.unreadCount}
                                </div>
                            ) : (
                                <div className="h-[22px]" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 공통 네비게이션 */}
            <BottomNav/>
        </div>
    );
}