// 빈자리 채팅 목록

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChatRooms } from "../../api/chat";
import type { ChatRoomPreview } from "../../types/chat";
import BottomNav from "../../components/BottomNav";
import Tab from "../../components/Tab";


// 공통 타임존 정규화 헬퍼 함수
const normalizeIsoString = (isoString: string): string => {
    if (!isoString) return "";
    return isoString.endsWith("Z") || isoString.includes("+") 
        ? isoString 
        : `${isoString}Z`;
};

// 날짜 포맷 함수 (YYYY. MM. DD)
const formatDate = (dateTimeStr?: string): string => {
    if (!dateTimeStr) return "";
    
    // 1. Z를 붙여 UTC 시각으로 인식하게 만듦
    const normalizedIso = normalizeIsoString(dateTimeStr);
    
    // 2. Date 객체 변환 시 한국 시간(+9시간)으로 자동 변환됨
    const d = new Date(normalizedIso);

    // 날짜 변환 실패 예외 처리
    if (isNaN(d.getTime())) return "";

    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");

    return `${year}. ${month}. ${day}`;
};

// 남은 시간을 계산하여 배지 텍스트를 만들어주는 함수
const getRemainingTimeBadge = (dateTimeStr?: string): string => {
    if (!dateTimeStr) return "시간 미정";

    const normalizedIso = normalizeIsoString(dateTimeStr);
    const target = new Date(normalizedIso);
    const now = new Date();

    // 두 시간의 차이 (밀리초 -> 분 변환)
    const diffMs = target.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / (1000 * 60));

    // 이미 시간이 지났거나 exact 타임이면 "마감"
    if (diffMins <= 0) return "마감";

    if (diffMins < 60) {
        return `${diffMins}분 후`;
    } 
    
    const diffHours = Math.floor(diffMins / 60);
    const remainMins = diffMins % 60;

    if (diffHours < 24) {
        return remainMins > 0 ? `${diffHours}시간 ${remainMins}분 후` : `${diffHours}시간 후`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 후`;
};

export default function EmptySpotChatListPage() {
    const navigate = useNavigate();
    const [spots, setSpots] = useState<ChatRoomPreview[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleStartChat = (spot: ChatRoomPreview) => {
        const locationTitle = [
            spot.location,
            spot.floor ? `${spot.floor}층` : "",
            spot.seatNumber ? `${spot.seatNumber}` : ""
        ].filter(Boolean).join(" ") || "빈자리 대여건";

        navigate(`/chat/${spot.chatRoomId}`, {
            state: {
                type: "SPOT",
                ownerNickname: spot.chatName, // 상대 아이디
                title: locationTitle,          // 게시글 제목 (위치 + 층 + 자리번호)
                profileUrl: spot.profileUrl       // 프로필 이미지 URL
            }
        });
    };

    useEffect(() => {
        const fetchSpotRooms = async () => {
            try {
                setLoading(true);
                const res = await getChatRooms("EMPTY_SPOT");
                if (res.isSuccess && res.result?.chatRoomList) {
                    // 최신 날짜순 정렬 (내림차순)
                    const sortedList = [...res.result.chatRoomList].sort((a, b) => {
                        const dateA = new Date(normalizeIsoString(a.lastMessageAt || a.expectedCheckoutTime || "")).getTime();
                        const dateB = new Date(normalizeIsoString(b.lastMessageAt || b.expectedCheckoutTime || "")).getTime();
                        return dateB - dateA;
                    });

                    setSpots(sortedList);
                }
            } catch (error) {
                console.error("빈자리 채팅 목록 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpotRooms();
    }, []);

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-height-[874px] max-height-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white select-none">
            {/* 상단 헤더 */}
            <div className="pl-[30px] pt-[30px] pb-5 flex-shrink-0">
                <h1 className="text-2xl font-bold leading-none text-black">채팅</h1>
            </div>

            {/* 탭 메뉴 */}
            <Tab 
                activeTab="second"
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
                            <path d="M9.90776 1.46182C10.266 1.06642 9.92838 0.500017 9.333 0.500017H4.71566C4.59063 0.49922 4.46747 0.526508 4.35802 0.579258C4.24858 0.632007 4.15652 0.708444 4.09071 0.801217L0.596763 5.87483C0.32107 6.27443 0.667577 6.77303 1.22102 6.77303H3.57851L1.35784 11.612C1.03677 12.224 1.90441 12.7838 2.48742 12.341L11.5 4.89862H6.79126L9.90776 1.46182Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                fill="#FFFFFF"
                            />
                        </svg>
                        <span>빈자리 채팅</span>
                    </div>
                )}
                secondPath="/chat/spot"
            />

            {/* 빈자리 채팅 카드 리스트 영역 */}
            <div className="flex-1 overflow-y-auto vertical-scroll pl-[16px] pr-[10px] space-y-6 pt-6 pb-[90px]">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">빈자리 채팅 목록을 불러오는 중...</div>
                ) : spots.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">참여중인 빈자리 채팅방이 없습니다.</div>
                ) : (
                    spots.map((spot) => (
                        <div key={spot.chatRoomId} 
                            className="w-[370px] mt-[-10px] border-2 border-[#FF5E00] rounded-[40px] p-[30px] flex flex-col bg-white">
                        
                            {/* 1. 상단행 (닉네임 & 생성 날짜 & 시간 배지) */}
                            <div className="flex justify-between items-stretch w-full mb-4">
                                <div className="flex items-center gap-[14px] mb-1">
                                    <div className="text-[#FF5E00] flex-shrink-0 mt-[-20px]">
                                        <svg width="22" height="26" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.90776 1.46182C10.266 1.06642 9.92838 0.500017 9.333 0.500017H4.71566C4.59063 0.49922 4.46747 0.526508 4.35802 0.579258C4.24858 0.632007 4.15652 0.708444 4.09071 0.801217L0.596763 5.87483C0.32107 6.27443 0.667577 6.77303 1.22102 6.77303H3.57851L1.35784 11.612C1.03677 12.224 1.90441 12.7838 2.48742 12.341L11.5 4.89862H6.79126L9.90776 1.46182Z" fill="currentColor"/>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <span className="font-bold text-[16px] text-black leading-none">
                                            {spot.chatName}
                                        </span>
                                        <span className="text-[12px] text-[#000000] leading-none mt-1">
                                            {formatDate(spot.lastMessageAt || spot.expectedCheckoutTime)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-[#FF5E00] w-[80px] h-[25px] pt-[2px] text-center text-white rounded-[7px] font-bold text-[14px]">
                                        {getRemainingTimeBadge(spot.expectedCheckoutTime)}
                                    </div>
                                </div>
                            </div>

                            {/* 2. 중단행 (장소 / 상세위치) */}
                            <div className="flex items-start gap-[16px] mb-[16px]">
                                <div className="text-[#43A860] mt-0.5 flex-shrink-0">
                                    <svg width="19" height="23" viewBox="0 0 19 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.5 0C4.26319 0 0.000111789 4.12644 0.000111789 9.1954C-0.0355128 16.5977 8.45501 22.5287 8.81126 22.7816C9.01313 22.9195 9.2625 23 9.5 23C9.7375 23 9.98687 22.931 10.1887 22.7816C10.545 22.5287 19.0355 16.6092 18.9999 9.1954C18.9999 4.12644 14.7368 0 9.5 0ZM9.5 13.7931C6.87566 13.7931 4.75006 11.7356 4.75006 9.1954C4.75006 6.65517 6.87566 4.5977 9.5 4.5977C12.1243 4.5977 14.2499 6.65517 14.2499 9.1954C14.2499 11.7356 12.1243 13.7931 9.5 13.7931Z" fill="#43A860"/>
                                    </svg>
                                </div>
                                <div className="flex flex-col gap-1.5 mt-[6px]">
                                    <span className="font-bold text-[16px] text-[#43A860] leading-none">
                                        {spot.location ? `${spot.location}` : "위치 설명 참조"}
                                    </span>
                                    <span className="text-[12px] text-[#000000] mt-1.5">
                                        {spot.floor ? `${spot.floor}층` : "층"} / {spot.seatNumber ? `${spot.seatNumber}` : "자리 설명 참조"}
                                    </span>
                                </div>
                            </div>

                            {/* 3. 태그 그룹 행 (boolean 값이 true인 경우에만 출력) */}
                            {(() => {
                                // 백엔드 응답 데이터가 없을 경우 사용할 임시 기본 boolean 값 (테스트용)
                                const hasPowerOutlet = spot.hasPowerOutlet ?? false;
                                const hasWindowSeat = spot.hasWindowSeat ?? false;

                                // true인 조건만 담을 태그 배열
                                const activeTags: string[] = [];
                                if (hasPowerOutlet) activeTags.push("콘센트");
                                if (hasWindowSeat) activeTags.push("창가");

                                // true인 태그가 하나도 없을 때
                                if (activeTags.length === 0) {
                                    return <div className="mb-0 h-[0px]" />;
                                }

                                return (
                                    <div className="flex gap-2 mb-5 pl-1">
                                        {activeTags.map((tag, idx) => (
                                            <span 
                                                key={idx} 
                                                className="bg-[#E6E6E6] text-[#000000] px-3 py-1 rounded-[40px] text-[12px]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                );
                            })()}

                            {/* 4. 하단 버튼 행 */}
                            <button 
                                onClick={() => handleStartChat(spot)}
                                className="w-[300px] h-[34px] ml-1 mb-[-5px] border border-[#7F7F7F] rounded-[40px] flex items-center justify-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors mt-auto"
                            >
                                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.97679 13.504L4.29821 12.7325L4.71786 12.9352C5.74299 13.4192 6.86548 13.6641 8 13.6515C11.9946 13.6515 14.8571 10.8092 14.8571 7.39457C14.8571 3.96747 12.0161 1.13763 8 1.13763C3.98393 1.13763 1.14286 3.96747 1.14286 7.39457C1.14916 8.70628 1.58277 9.98057 2.37857 11.0261L2.76786 11.5362L1.97679 13.504ZM1.16964 14.9704C1.06627 15.005 0.955134 15.0093 0.84935 14.983C0.743566 14.9567 0.647551 14.9008 0.572641 14.822C0.49773 14.7431 0.447051 14.6446 0.426586 14.5379C0.40612 14.4313 0.416723 14.3211 0.457143 14.2203L1.46607 11.7104C0.520898 10.4677 0.00643473 8.95324 0 7.39457C0 3.62441 3.06429 0 8 0C12.9357 0 16 3.62441 16 7.39457C16 11.1647 12.9036 14.7891 8 14.7891C6.69284 14.8024 5.39988 14.5185 4.21964 13.959L1.16964 14.9704Z" fill="black"/>
                                </svg>
                                <span className="text-[14px] text-black">채팅하기</span>
                            </button>

                        </div>
                    ))
                )}
            </div>

            {/* 하단 공통 네비게이션 */}
            <BottomNav/>
        </div>
    );
}