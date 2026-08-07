// 대여현황 (빌려준 탭)

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import BottomNav from "../../components/BottomNav";
import Tab from "../../components/Tab";
import { getLentRentalRequests, decideRentalRequest, completeRentalReturn } from "../../api/rental";
import type { RentalRequestPreview, RentalRequestStatus } from "../../types/rental";
import { getChatRooms } from "../../api/chat";
import type { ChatRoomPreview } from "../../types/chat";


// 팝업 컴포넌트 (취소/확인)
function ConfirmModal({ 
    message, 
    subMessage,
    onConfirm, 
    onCancel 
}: { 
    message: string
    subMessage: string
    onConfirm: () => void
    onCancel: () => void 
}) {
    return (
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-50 px-[26px]">
            <div className="absolute top-[336px] left-1/2 -translate-x-1/2 bg-white rounded-[40px] shadow-lg w-[350px] h-[190px] flex flex-col items-center justify-center pt-9 pb-5 px-6">
                <h3 className="text-[20px] font-bold text-center text-black mb-3 leading-tight whitespace-pre-line">
                    {message}
                </h3>
                <p className="text-[14px] text-[#7F7F7F] text-center leading-normal whitespace-pre-line">
                    {subMessage}
                </p>
                <div className="flex justify-center gap-4.5 w-full mt-5">
                    <button 
                        onClick={onCancel}
                        className="w-[120px] h-[40px] border border-[#7F7F7F] text-[#1A1A1A] rounded-[40px] text-sm font-medium cursor-pointer bg-white active:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="w-[128px] h-[40px] bg-[#9996FF] text-white rounded-[40px] text-sm font-bold cursor-pointer active:bg-[#8582eb] transition-colors"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    )
}

// Toast 메시지 컴포넌트
function Toast({ message }: { message: string }) {
    return (
        <div className="absolute top-[755px] left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white pl-[15px] pr-4 w-[332px] h-[46px] rounded-[40px] flex items-center gap-[10px] z-50 shadow-md">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="9" fill="#FFFFFF"/>
                <path d="M5.5 9L8 11.5L12.5 6.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[14px] text-[#FFFFFF] truncate leading-none flex-1 text-center">
                {message}
            </span>
        </div>
    )
}

// 카테고리 한글 라벨 맵핑
const CATEGORY_LABEL_MAP: Record<string, string> = {
    DEPARTMENT_JACKET: "과잠",
    MAJOR_BOOKS: "전공서적",
    ELECTRONICS: "전자기기",
    LIVING_SUPPLIES: "생활용품",
    ETC: "기타",
    EMPTY_SPOTS: "빈자리",
};

// UI 레이블용 대여 상태
type UIStatus = "요청중" | "대여중" | "대여가능" | "반납완료";

function getStatusInfo(status: RentalRequestStatus): { label: UIStatus; bg: string; text: string } {
    switch (status) {
        case 'PENDING':
            return { label: "요청중", bg: "bg-[#FFF4AB]", text: "text-[#1A1A1A]" };
        case 'APPROVED':
            return { label: "대여중", bg: "bg-[#FFD4BB]", text: "text-[#1A1A1A]" };
        case 'REJECTED':
            return { label: "대여가능", bg: "bg-[#E9F5EE]", text: "text-[#1A1A1A]" };
        case 'COMPLETED':
            return { label: "반납완료", bg: "bg-[#E4E4FF]", text: "text-[#1A1A1A]" };
        default:
            return { label: "요청중", bg: "bg-[#FFF4AB]", text: "text-[#1A1A1A]" };
    }
}

// 날짜 포맷 변환 함수 (YYYY-MM-DD -> YY.MM.DD)
function formatDateShort(dateStr?: string) {
    if (!dateStr) return "";
    
    const normalizedIso = dateStr.endsWith("Z") || dateStr.includes("+")
        ? dateStr
        : `${dateStr}Z`;

    const d = new Date(normalizedIso);
    
    if (isNaN(d.getTime())) return dateStr;

    const year = d.getFullYear().toString().slice(-2);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");

    return `${year}.${month}.${day}`;
}

// 남은 시간을 계산하여 "X분 후" 배지 텍스트를 만들어주는 함수
const getRemainingTimeBadge = (dateTimeStr?: string): string => {
    if (!dateTimeStr) return "미정";

    const normalizedIso = dateTimeStr.endsWith("Z") || dateTimeStr.includes("+")
        ? dateTimeStr
        : `${dateTimeStr}Z`;

    const target = new Date(normalizedIso);
    const now = new Date();

    const diffMs = target.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / (1000 * 60));

    if (diffMins <= 0) return "마감";

    return `${diffMins}분 후`;
};

const getTargetChatName = (
    item: RentalRequestPreview,
    tradeRooms: ChatRoomPreview[],
    spotRooms: ChatRoomPreview[]
): string => {
    // 1. chatRoomId가 존재하면 가장 먼저 ID로 정확히 매칭
    if (item.chatRoomId) {
        const matchedRoom = [...tradeRooms, ...spotRooms].find(
            (room) => room.chatRoomId === item.chatRoomId
        );
        if (matchedRoom?.chatName) return matchedRoom.chatName;
    }

    // 2. ID 매칭 실패 시 기존 조건(제목/장소)으로 Fallback
    const isBlankCategory = item.postCategory === "EMPTY_SPOTS";

    if (isBlankCategory) {
        const matchedSpot = spotRooms.find(
            (spot) => spot.location && item.seatDetail?.location && spot.location === item.seatDetail.location
        );
        return matchedSpot?.chatName || item.ownerNickname || "요청자 정보 없음";
    } else {
        const matchedTrade = tradeRooms.find(
            (room) => room.postTitle && item.itemDetail?.title && room.postTitle === item.itemDetail.title
        );
        return matchedTrade?.chatName || item.ownerNickname || "대여자 정보 없음";
    }
};


export default function LentPage() {
    const navigate = useNavigate();
    const [rentals, setRentals] = useState<RentalRequestPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 채팅 목록 상태 추가
    const [tradeRooms, setTradeRooms] = useState<ChatRoomPreview[]>([]);
    const [spotRooms, setSpotRooms] = useState<ChatRoomPreview[]>([]);

    const [modalState, setModalState] = useState<{
        show: boolean;
        item: RentalRequestPreview | null;
        action: 'approve' | 'reject' | 'confirmReturn' | 'returnFailed' | null;
    }>({ show: false, item: null, action: null });

    const [toast, setToast] = useState<string | null>(null);

    const fetchAllData = useCallback(async () => {
        try {
            setIsLoading(true);
            
            // 대여 현황, 거래 채팅, 빈자리 채팅 3개 요청 병렬 수행
            const [lentRes, tradeRes, spotRes] = await Promise.all([
                getLentRentalRequests(),
                getChatRooms("ITEM"),
                getChatRooms("EMPTY_SPOT"),
            ]);

            if (lentRes.isSuccess) setRentals(lentRes.result);
            if (tradeRes.isSuccess && tradeRes.result?.chatRoomList) {
                setTradeRooms(tradeRes.result.chatRoomList);
            }
            if (spotRes.isSuccess && spotRes.result?.chatRoomList) {
                setSpotRooms(spotRes.result.chatRoomList);
            }
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 최초 마운트 시 실행되는 Effect (isMounted 관리)
    useEffect(() => {
        let isMounted = true;

        const initData = async () => {
            try {
                const [lentRes, tradeRes, spotRes] = await Promise.all([
                    getLentRentalRequests(),
                    getChatRooms("ITEM"),
                    getChatRooms("EMPTY_SPOT"),
                ]);

                if (isMounted) {
                    if (lentRes.isSuccess) setRentals(lentRes.result);
                    if (tradeRes.isSuccess && tradeRes.result?.chatRoomList) {
                        setTradeRooms(tradeRes.result.chatRoomList);
                    }
                    if (spotRes.isSuccess && spotRes.result?.chatRoomList) {
                        setSpotRooms(spotRes.result.chatRoomList);
                    }
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        initData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleApprove = (item: RentalRequestPreview) => {
        setModalState({ show: true, item, action: 'approve' });
    };

    const handleReject = (item: RentalRequestPreview) => {
        setModalState({ show: true, item, action: 'reject' });
    };

    const handleConfirmReturn = (item: RentalRequestPreview) => {
        setModalState({ show: true, item, action: 'confirmReturn' });
    };

    const confirmAction = async () => {
        if (!modalState.item || !modalState.action) return;
        const currentItem = modalState.item;

        try {
            if (modalState.action === 'confirmReturn') {
                const res = await completeRentalReturn(currentItem.rentalRequestId);
                
                if (res.isSuccess) {
                    setModalState({ show: false, item: null, action: null });
                    setToast('대여자 처리시 마이페이지에서 확인 가능합니다.');
                    setTimeout(() => setToast(null), 2000);
                    fetchAllData();
                } else {
                    // 반납 실패 시 실패 안내 팝업으로 변경
                    setModalState(prev => ({
                        ...prev,
                        action: 'returnFailed'
                    }));
                }
            } else if (modalState.action === 'returnFailed') {
                // 실패 안내 팝업에서 확인/취소 클릭 시 모달 닫기
                setModalState({ show: false, item: null, action: null });
            } else {
                const decideType = modalState.action === 'approve' ? 'APPROVE' : 'REJECT';
                const res = await decideRentalRequest(currentItem.rentalRequestId, decideType);
                if (res.isSuccess) {
                    const newStatusLabel = modalState.action === 'approve' ? '대여중' : '대여가능';
                    setModalState({ show: false, item: null, action: null });
                    setToast(`상태가 "${newStatusLabel}"으로 변경되었습니다.`);
                    setTimeout(() => setToast(null), 2000);
                    fetchAllData();
                }
            }
        } catch (error) {
            console.error("요청 처리 실패:", error);
            // HTTP 에러(400 등) 발생 시에도 실패 팝업으로 모달 상태 변경
            setModalState(prev => ({
                ...prev,
                action: 'returnFailed'
            }));
        }
    };

    const cancelAction = () => {
        setModalState({ show: false, item: null, action: null });
    };

    const handleStartChat = (item: RentalRequestPreview) => {
        const chatType = item.postCategory === "EMPTY_SPOTS" ? "SPACE" : "TRADE";

        const seatTitle = item.seatDetail 
            ? `${item.seatDetail.location || ''} ${item.seatDetail.floor ? `${item.seatDetail.floor}층` : ''} ${item.seatDetail.seatNumber || ''}`.trim().replace(/\s+/g, ' ')
            : "";

        const title = item.postCategory === "EMPTY_SPOTS"
            ? (seatTitle || "빈자리 정보")
            : (item.itemDetail?.title || "게시글 제목");

        navigate(`/chat/${item.chatRoomId}`, {
            state: {
                type: chatType,
                title: title,
            }
        });
    };

    const getModalText = () => {
        if (!modalState.item || !modalState.action) return { message: "", subMessage: "" };

        const isBlankCategory = modalState.item.postCategory === "EMPTY_SPOTS";

        if (modalState.action === 'returnFailed') {
            return {
                message: "반납 확인 불가",
                subMessage: "대여자가 반납한 경우에만\n반납 확인이 가능합니다."
            };
        }

        if (modalState.action === 'approve') {
            return isBlankCategory
                ? { message: "양도를 승인하시겠어요?", subMessage: "양도 후 빈자리 거래가 시작됩니다." }
                : { message: "대여를 승인하시겠어요?", subMessage: "승인 후 거래가 시작됩니다." };
        }

        if (modalState.action === 'reject') {
            return isBlankCategory
                ? { message: "양도 요청을 거절하시겠어요?", subMessage: "거절 후 상태가 대여 가능으로 변경됩니다." }
                : { message: "대여 요청을 거절하시겠어요?", subMessage: "거절 후 상태가 대여 가능으로 변경됩니다." };
        }

        if (modalState.action === 'confirmReturn') {
            return {
                message: "반납 완료 처리하시겠어요?",
                subMessage: "대여자의 상호 확인 후 정상처리되며,\n완료 후 상대방에세 후기를 남길 수 있습니다."
            };
        }

        return { message: "", subMessage: "" };
    };

    const { message: modalMessage, subMessage: modalSubMessage } = getModalText();

    // LentPage 필터링 규칙 적용
    const filteredRentals = rentals.filter((item) => {
        const isBlankCategory = item.postCategory === "EMPTY_SPOTS";
        if (isBlankCategory) {
            // 빈자리 게시물: 요청중, 대여중 상태
            return item.rentalRequestStatus === "PENDING" || item.rentalRequestStatus === "APPROVED";
        } else {
            // 물품 게시물: 대여중 상태
            return item.rentalRequestStatus === "APPROVED";
        }
    });

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-height-[874px] max-height-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white">
            <div className="pl-[30px] pt-[30px] pb-5 flex-shrink-0">
                <h1 className="text-2xl font-bold leading-none text-black">대여현황</h1>
            </div>

            <Tab 
                activeTab="first"
                firstLabel="내가 빌려준 것"
                firstCount=""
                firstPath="/rental/"
                secondLabel="내가 빌린 것"
                secondCount=""
                secondPath="/rental/borrowed"
            />

            <div className="flex-1 overflow-x-hidden overflow-y-scroll vertical-scroll px-4 space-y-4 pt-2 pb-[75px]">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-400">불러오는 중...</div>
                ) : filteredRentals.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">빌려준 내역이 없습니다.</div>
                ) : (
                    filteredRentals.map((item) => {
                        const isBlankCategory = item.postCategory === "EMPTY_SPOTS";
                        const statusInfo = getStatusInfo(item.rentalRequestStatus);
                        const categoryLabel = CATEGORY_LABEL_MAP[item.postCategory] || item.postCategory;

                        const hasTags = item.seatDetail?.hasPowerOutlet || item.seatDetail?.hasWindowSeat;

                        // 내가 반납해서 대기 상태인지 판단하는 조건 (물품 게시물일 때: ownerReturned가 true일 때, 빈자리 게시물일 때: borrowerReturned가 true일 때)
                        const isReturnWaiting = isBlankCategory ? item.borrowerReturned : item.ownerReturned;
                        // 매칭 헬퍼 함수를 통한 닉네임 구하기
                        const targetNickname = getTargetChatName(item, tradeRooms, spotRooms);
                        return (
                            <div 
                                key={item.rentalRequestId} 
                                className={`w-[370px] h-auto border ${isBlankCategory ? 'border-[#FF5E00]' : 'border-[#CCCCCC]'} rounded-[40px] p-5 bg-white mb-5 flex flex-col justify-between`}
                            >
                                <div className="flex gap-4 mb-4">
                                    <div className="w-[90px] h-[90px] bg-[#E6E6E6] rounded-[20px] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt="물품/자리 이미지" className="w-full h-full object-cover" />
                                        ) : (
                                            <img 
                                                src="/logo187.png" 
                                                alt="기본 로고"
                                                className="w-12 h-12 object-contain" 
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1.5 w-full">
                                            <div className="flex gap-2 items-center">
                                                <span className={`text-[12px] px-3 py-1.5 rounded-[40px] ${statusInfo.bg} ${statusInfo.text}`}>
                                                    {statusInfo.label}
                                                </span>
                                                <span className="text-[12px] px-3 py-1.5 rounded-[40px] bg-[#E4E4FF] text-[#000000]">
                                                    {categoryLabel}
                                                </span>
                                            </div>

                                            {isBlankCategory && (
                                                <div className="bg-[#FF5E00] w-[80px] h-[25px] pt-[2px] mt-0.5 mr-4 text-center text-white rounded-[7px] font-bold text-[14px] flex-shrink-0">
                                                    {getRemainingTimeBadge(item.seatDetail?.expectedCheckoutTime)}
                                                </div>
                                            )}
                                        </div>

                                        {isBlankCategory ? (
                                            <>
                                                <div className="flex items-center gap-2 mt-2 mb-1">
                                                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18C7 18 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 9.5C5.62 9.5 4.5 8.38 4.5 7C4.5 5.62 5.62 4.5 7 4.5C8.38 4.5 9.5 5.62 9.5 7C9.5 8.38 8.38 9.5 7 9.5Z" fill="#43A860"/>
                                                    </svg>
                                                    <span className="text-[16px] font-bold text-[#43A860] truncate">
                                                        {item.seatDetail?.location || "위치 설명 참조"}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-black mb-0.5">
                                                    요청자 : {targetNickname}
                                                </p>
                                                <p className="text-[12px] text-black mb-1">
                                                    {item.seatDetail?.floor ? `${item.seatDetail.floor}층` : "층"} / {item.seatDetail?.seatNumber ? `${item.seatDetail.seatNumber}` : "자리 설명 참조"}
                                                </p>
                                                {hasTags && (
                                                    <div className="flex gap-2 ml-[-2px] mt-1">
                                                        {item.seatDetail?.hasPowerOutlet && (
                                                            <span className="text-[12px] px-2.5 py-1 bg-[#E6E6E6] rounded-[40px] text-[#000000]">콘센트</span>
                                                        )}
                                                        {item.seatDetail?.hasWindowSeat && (
                                                            <span className="text-[12px] px-2.5 py-1 bg-[#E6E6E6] rounded-[40px] text-[#000000]">창가</span>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <h2 className="text-[14px] font-bold text-black mt-3 mb-2.5 truncate leading-none">
                                                    {item.itemDetail?.title || "대여 물품"}
                                                </h2>
                                                <p className="text-[12px] text-black mb-2">
                                                    대여자 : {targetNickname}
                                                </p>

                                                <p className="text-[12px] text-[#43A860] leading-[16px]">
                                                    <span>
                                                        대여 신청일 : {formatDateShort(item.itemDetail?.rentalStartTime)}
                                                    </span>
                                                    <br />
                                                    {item.rentalRequestStatus === "APPROVED" 
                                                        ? `반납 예정: ${formatDateShort(item.itemDetail?.rentalEndTime)}`
                                                        : `제안 가격: ${item.itemDetail?.rentalPrice ? item.itemDetail.rentalPrice.toLocaleString() : 0}원`
                                                    }
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* 하단 버튼 영역 */}
                                <div className="flex flex-col gap-2 items-center w-full">
                                    {isReturnWaiting ? (
                                        <div className="flex flex-col gap-2 items-center w-full">
                                            <button 
                                                disabled
                                                className="w-[304px] h-[34px] bg-[#CCCCCC] text-white rounded-[40px] text-[14px] font-bold cursor-not-allowed"
                                            >
                                                반납 대기
                                            </button>
                                            <button 
                                                onClick={() => handleStartChat(item)}
                                                className="w-[304px] h-[34px] bg-white border border-black rounded-[40px] text-sm flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
                                            >
                                                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                                                    <path d="M14.6667 6.33333C14.6667 9.46294 11.6819 12 8 12C7.3065 12 6.6433 11.9016 6.02428 11.7171L3 13V10.3837C1.76185 9.33642 1 7.91719 1 6.33333C1 3.20372 3.98477 0.666664 7.66667 0.666664C11.3486 0.666664 14.6667 3.20372 14.6667 6.33333Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                채팅하기
                                            </button>
                                        </div>
                                    ) : item.rentalRequestStatus === "APPROVED" ? (
                                        <div className="flex flex-col gap-2 items-center w-full">
                                            <button 
                                                onClick={() => handleConfirmReturn(item)}
                                                className="w-[304px] h-[34px] bg-[#9996FF] text-white rounded-[40px] text-[14px] font-bold active:bg-[#8582eb] transition-colors"
                                            >
                                                반납 확인
                                            </button>
                                            <button 
                                                onClick={() => handleStartChat(item)}
                                                className="w-[304px] h-[34px] bg-white border border-black rounded-[40px] text-[14px] flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
                                            >
                                                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                                                    <path d="M14.6667 6.33333C14.6667 9.46294 11.6819 12 8 12C7.3065 12 6.6433 11.9016 6.02428 11.7171L3 13V10.3837C1.76185 9.33642 1 7.91719 1 6.33333C1 3.20372 3.98477 0.666664 7.66667 0.666664C11.3486 0.666664 14.6667 3.20372 14.6667 6.33333Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                채팅하기
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2 items-center w-full">
                                            <div className="flex gap-4 w-full justify-center">
                                                <button 
                                                    onClick={() => handleApprove(item)}
                                                    className="w-[144px] h-[34px] py-1 bg-[#9996FF] text-white rounded-[40px] text-[14px] font-bold active:bg-[#8e7dd1] transition-colors"
                                                >
                                                    {isBlankCategory ? "승인" : "승인"}
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(item)}
                                                    className="w-[144px] h-[34px] py-1 bg-white border border-[#7F7F7F] text-[#1A1A1A] text-[14px] rounded-[40px] active:bg-gray-50 transition-colors"
                                                >
                                                    거절
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => handleStartChat(item)}
                                                className="w-[304px] h-[34px] bg-white border border-black rounded-[40px] text-[14px] flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
                                            >
                                                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                                                    <path d="M14.6667 6.33333C14.6667 9.46294 11.6819 12 8 12C7.3065 12 6.6433 11.9016 6.02428 11.7171L3 13V10.3837C1.76185 9.33642 1 7.91719 1 6.33333C1 3.20372 3.98477 0.666664 7.66667 0.666664C11.3486 0.666664 14.6667 3.20372 14.6667 6.33333Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                채팅하기
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <BottomNav />

            {modalState.show && (
                <ConfirmModal
                    message={modalMessage}
                    subMessage={modalSubMessage}
                    onConfirm={confirmAction}
                    onCancel={cancelAction}
                />
            )}

            {toast && <Toast message={toast} />}
        </div>
    );
}