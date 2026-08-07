// 대여현황 (빌린 탭)

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import BottomNav from "../../components/BottomNav";
import Tab from "../../components/Tab";
import { getBorrowedRentalRequests, decideRentalRequest, completeRentalReturn } from "../../api/rental";
import type { RentalRequestPreview, RentalRequestStatus } from "../../types/rental";

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
        <div className="absolute top-[755px] left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white pl-[15px] pr-4 w-[332px] h-[46px] rounded-[40px] flex items-center gap-[15px] z-50 shadow-md">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="9" fill="#FFFFFF"/>
                <path d="M5.5 9L8 11.5L12.5 6.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[14px] text-[#FFFFFF] truncate leading-none">
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
    }
}

export default function BorrowedPage() {
    const navigate = useNavigate();
    const [rentals, setRentals] = useState<RentalRequestPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [modalState, setModalState] = useState<{
        show: boolean;
        item: RentalRequestPreview | null;
        action: 'approve' | 'reject' | 'return' | null;
    }>({ show: false, item: null, action: null });

    const [toast, setToast] = useState<string | null>(null);

    const fetchRentals = useCallback(async () => {
        try {
            const res = await getBorrowedRentalRequests();

            if (res.isSuccess) {
                setRentals(res.result);
            }
        } catch (error) {
            console.error("빌린 목록 로딩 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const res = await getBorrowedRentalRequests();

                if (res.isSuccess && isMounted) {
                    setRentals(res.result);
                }
            } catch (error) {
                console.error("빌린 목록 로딩 실패:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        })();

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

    const handleReturn = (item: RentalRequestPreview) => {
        setModalState({ show: true, item, action: 'return' });
    };

    const confirmAction = async () => {
        if (!modalState.item || !modalState.action) return;
        const currentItem = modalState.item;

        try {
            if (modalState.action === 'return') {
                const res = await completeRentalReturn(currentItem.rentalRequestId);
                if (res.isSuccess) {
                    setModalState({ show: false, item: null, action: null });
                    setToast('제공자 처리시 마이페이지에서 확인 가능합니다.');
                    setTimeout(() => setToast(null), 2000);
                    fetchRentals();
                }
            } else {
                const decideType = modalState.action === 'approve' ? 'APPROVE' : 'REJECT';
                const res = await decideRentalRequest(currentItem.rentalRequestId, decideType);
                if (res.isSuccess) {
                    const newStatusLabel = modalState.action === 'approve' ? '대여중' : '대여가능';
                    setModalState({ show: false, item: null, action: null });
                    setToast(`상태가 "${newStatusLabel}"으로 변경되었습니다.`);
                    setTimeout(() => setToast(null), 2000);
                    fetchRentals();
                }
            }
        } catch (error) {
            console.error("요청 처리 실패:", error);
            setModalState({ show: false, item: null, action: null });
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
                ownerNickname: item.ownerNickname,
            }
        });
    };

    const getModalText = () => {
        if (!modalState.item || !modalState.action) return { message: "", subMessage: "" };

        if (modalState.action === 'approve') {
            return { message: "대여를 승인하시겠어요?", subMessage: "승인 후 거래가 시작됩니다." };
        }

        if (modalState.action === 'reject') {
            return { message: "대여 요청을 거절하시겠어요?", subMessage: "거절 후 상태가 대여 가능으로 변경됩니다." };
        }

        if (modalState.action === 'return') {
            return {
                message: "반납 완료 처리하시겠어요?",
                subMessage: "제공자의 상호 확인 후 정상처리되며,\n완료 후 상대방에게 후기를 남길 수 있습니다."
            };
        }

        return { message: "", subMessage: "" };
    };

    const { message: modalMessage, subMessage: modalSubMessage } = getModalText();

    // BorrowedPage 필터링 규칙 적용
    const filteredRentals = rentals.filter((item) => {
        const isBlankCategory = item.postCategory === "EMPTY_SPOTS";
        if (isBlankCategory) {
            // 빈자리 게시물: 대여중 상태
            return item.rentalRequestStatus === "APPROVED";
        } else {
            // 물품 게시물: 요청중, 대여중 상태
            return item.rentalRequestStatus === "PENDING" || item.rentalRequestStatus === "APPROVED";
        }
    });

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-height-[874px] max-height-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white">
            <div className="pl-[30px] pt-[30px] pb-5 flex-shrink-0">
                <h1 className="text-2xl font-bold leading-none text-black">대여현황</h1>
            </div>

            <Tab 
                activeTab="second"
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
                    <div className="text-center py-10 text-gray-400">빌린 내역이 없습니다.</div>
                ) : (
                    filteredRentals.map((item) => {
                        const isBlankCategory = item.postCategory === "EMPTY_SPOTS";
                        const statusInfo = getStatusInfo(item.rentalRequestStatus);
                        const categoryLabel = CATEGORY_LABEL_MAP[item.postCategory] || item.postCategory;

                        const hasTags = item.seatDetail?.hasPowerOutlet || item.seatDetail?.hasWindowSeat;
                        
                        // 내가 반납해서 대기 상태인지 판단하는 조건
                        const isReturnWaiting = isBlankCategory ? item.ownerReturned : item.borrowerReturned;

                        return (
                            <div 
                                key={item.rentalRequestId} 
                                className={`w-[370px] h-auto border ${isBlankCategory ? 'border-[#FF5E00]' : 'border-[#CCCCCC]'} rounded-[40px] p-5 bg-white mb-5 flex flex-col justify-between`}
                            >
                                <div className="flex gap-4 mb-4">
                                    <div className="w-[90px] h-[90px] bg-[#E6E6E6] rounded-[20px] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt="물품 이미지" className="w-full h-full object-cover" />
                                        ) : (
                                            <img 
                                                src="/logo187.png" 
                                                alt="기본 로고"
                                                className="w-12 h-12 object-contain" 
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex gap-2 mb-1.5 items-center">
                                            <span className={`text-[12px] px-3 py-1.5 rounded-[40px] ${statusInfo.bg} ${statusInfo.text}`}>
                                                {statusInfo.label}
                                            </span>
                                            <span className="text-[12px] px-3 py-1.5 rounded-[40px] bg-[#E4E4FF] text-[#000000]">
                                                {categoryLabel}
                                            </span>
                                        </div>

                                        {isBlankCategory ? (
                                            <>  {/* 빈자리 게시물일 때 */}
                                                <div className="flex items-center gap-2 mt-2 mb-1">
                                                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18C7 18 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 9.5C5.62 9.5 4.5 8.38 4.5 7C4.5 5.62 5.62 4.5 7 4.5C8.38 4.5 9.5 5.62 9.5 7C9.5 8.38 8.38 9.5 7 9.5Z" fill="#43A860"/>
                                                    </svg>
                                                    <span className="text-[16px] font-bold text-[#43A860] truncate">
                                                        {item.seatDetail?.location || "위치 설명 참조"}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-black mb-0.5">
                                                    제공자 : {item.ownerNickname}
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
                                            <>  {/* 물품 게시물일 때 */}
                                                <h2 className="text-[14px] font-bold text-black mt-3 mb-2.5 truncate leading-none">
                                                    {item.itemDetail?.title || "대여 물품 설명 참조"}
                                                </h2>
                                                <p className="text-[12px] text-black mb-2">
                                                    제공자 : {item.ownerNickname}
                                                </p>
                                                <p className="text-[12px] text-[#43A860] leading-[16px]">
                                                    대여 시작 : {item.itemDetail?.rentalStartTime} <br />
                                                    {item.rentalRequestStatus === 'PENDING' ? (
                                                        <>대여 가격 : {item.itemDetail?.rentalPrice?.toLocaleString()}원</>
                                                    ) : (
                                                        <>반납 예정 : {item.itemDetail?.rentalEndTime}</>
                                                    )}
                                                    </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* 하단 버튼 영역 */}
                                <div className="flex flex-col gap-2 items-center w-full">
                                    {item.rentalRequestStatus === "APPROVED" ? (
                                        <div className="flex flex-col gap-2 items-center w-full">
                                            <button 
                                                onClick={() => handleReturn(item)}
                                                disabled={isReturnWaiting}
                                                className={`w-[304px] h-[34px] rounded-[40px] text-[14px] font-bold transition-colors ${
                                                    isReturnWaiting 
                                                    ? "bg-[#CCCCCC] text-white cursor-not-allowed" 
                                                    : "bg-[#9996FF] text-white active:bg-[#8582eb]"
                                                }`}
                                            >
                                                {isReturnWaiting ? "반납 대기" : "반납 하기"}
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
                                                    승인
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