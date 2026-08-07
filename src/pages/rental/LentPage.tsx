// 대여현황 (빌려준 탭)

import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { mockLentRentals } from "../../api/mockRental";
import type { LentRentalResponse, RequestStatus } from "../../types/rental";
import BottomNav from "../../components/BottomNav";
import Tab from "../../components/Tab";

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

// 상태별 배경색 반환
function getStatusStyle(status: RequestStatus) {
    const styles = {
        "요청중": { bg: "bg-[#FFF4AB]", text: "text-[#1A1A1A]" },
        "대여중": { bg: "bg-[#FFD4BB]", text: "text-[#1A1A1A]" },
        "대여가능": { bg: "bg-[#E9F5EE]", text: "text-[#1A1A1A]" },
        "반납완료": { bg: "bg-[#E4E4FF]", text: "text-[#1A1A1A]" }
    }
    return styles[status] || styles["요청중"]
}

export default function LentPage() {
    const navigate = useNavigate(); // navigate 훅 초기화

    // roomId 매핑을 위해 목데이터 개별 고유 ID 설정
    const [rentals, setRentals] = useState<(LentRentalResponse & { roomId?: number; category?: string; isReturnWaiting?: boolean })[]>([
        { ...mockLentRentals, roomId: 101, category: "과잠", title: "컴퓨터 공학과 과잠 대여하고 싶어요", borrower: "코딩왕" },
        { ...mockLentRentals, roomId: 101, category: "과잠", title: "컴퓨터 공학과 과잠 대여하고 싶어요", borrower: "코딩왕" },
        { 
            ...mockLentRentals, 
            roomId: 202,
            category: "빈자리", 
            title: "중앙도서관", 
            borrower: "스터디마스터", 
            rentalStartTime: "4층 / A- 23",
            requestStatus: "요청중"
        },
        { ...mockLentRentals, roomId: 203, category: "전공서적", title: "데이터구조 전공서적 빌릴 수 있을까요", borrower: "책벌레99" }
    ]);

    const [modalState, setModalState] = useState<{
        show: boolean
        index: number | null
        action: 'approve' | 'reject' | 'confirmReturn' | null
    }>({ show: false, index: null, action: null })

    const [toast, setToast] = useState<string | null>(null)

    const handleApprove = (index: number) => {
        setModalState({ show: true, index, action: 'approve' })
    }

    const handleReject = (index: number) => {
        setModalState({ show: true, index, action: 'reject' })
    }

    const handleConfirmReturn = (index: number) => {
        setModalState({ show: true, index, action: 'confirmReturn' })
    }

    const confirmAction = () => {
        if (modalState.index === null) return

        const newRentals = [...rentals]
        
        if (modalState.action === 'confirmReturn') {
            newRentals[modalState.index].isReturnWaiting = true;
            setRentals(newRentals)
            setModalState({ show: false, index: null, action: null })

            setToast('요청자 처리시 마이페이지에서 확인 가능합니다.')
            setTimeout(() => setToast(null), 2000)
        } else {
            const newStatus: RequestStatus = modalState.action === 'approve' ? '대여중' : '대여가능'
            newRentals[modalState.index].requestStatus = newStatus

            setRentals(newRentals)
            setModalState({ show: false, index: null, action: null })

            setToast(`상태가 "${newStatus}"으로 변경되었습니다.`)
            setTimeout(() => setToast(null), 2000)
        }
    }

    const cancelAction = () => {
        setModalState({ show: false, index: null, action: null })
    }

    // 상세 채팅방 페이지로 이동 핸들러
    const handleStartChat = (item: typeof rentals[0]) => {
        const targetRoomId = item.roomId || 999;
        const chatType = item.category === "빈자리" ? "SPACE" : "TRADE";
        
        navigate(`/chat/${targetRoomId}`, {
            state: {
                type: chatType,
                title: item.title
            }
        });
    };

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-height-[874px] max-height-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white">
            <div className="pl-[30px] pt-[30px] pb-5 flex-shrink-0">
                <h1 className="text-2xl font-bold leading-none text-black">대여현황</h1>
            </div>

            {/* 개수 노출을 포기하고 군더더기 없는 이동 패스만 전달 */}
            <Tab 
                activeTab="first"
                firstLabel="내가 빌려준 것"
                firstCount=""
                firstPath="/rental/"
                secondLabel="내가 빌린 것"
                secondCount=""
                secondPath="/rental/borrowed"
            />

            <div className="flex-1 overflow-x-hidden overflow-y-auto px-4 space-y-4 pt-2 pb-[75px]">                
                {rentals.map((item, index) => {
                    const isBlankCategory = item.category === "빈자리";
                    const statusStyle = getStatusStyle(item.requestStatus);

                    return (
                        <div 
                            key={index} 
                            className={`w-[370px] ${isBlankCategory ? 'h-[282px]' : 'h-[254px]'} border ${isBlankCategory ? 'border-[#FF5E00]' : 'border-[#CCCCCC]'} rounded-[40px] p-5 bg-white mb-5`}
                        >
                            <div className="flex gap-4 mb-4">
                                <div className="w-[90px] h-[90px] bg-[#E6E6E6] rounded-[20px] flex items-center justify-center flex-shrink-0">
                                    <div className="" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex gap-2 mb-1.5 items-center">
                                        <span className={`text-[12px] px-3 py-1.5 rounded-[40px] ${statusStyle.bg} ${statusStyle.text}`}>
                                            {item.requestStatus}
                                        </span>
                                        <span className="text-[12px] px-3 py-1.5 rounded-[40px] bg-[#E4E4FF] text-[#000000]">
                                            {item.category || "과잠"}
                                        </span>
                                        {isBlankCategory && (
                                            <span className="text-[14px] px-4 py-0.5 bg-[#FF5E00] text-white rounded-[7px] font-bold">
                                                5분 후
                                            </span>
                                        )}
                                    </div>

                                    {isBlankCategory ? (
                                        <>
                                            <div className="flex items-center gap-2 mt-2.5 mb-1">
                                                <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18C7 18 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 9.5C5.62 9.5 4.5 8.38 4.5 7C4.5 5.62 5.62 4.5 7 4.5C8.38 4.5 9.5 5.62 9.5 7C9.5 8.38 8.38 9.5 7 9.5Z" fill="#43A860"/>
                                                </svg>
                                                <span className="text-[16px] font-bold text-[#43A860]">{item.title}</span>
                                            </div>
                                            <p className="text-[12px] text-black mb-1">
                                                요청자 : {item.borrower}
                                            </p>
                                            <p className="text-[12px] text-black mt-[-6px] mb-2">
                                                {item.rentalStartTime}
                                            </p>
                                            <div className="flex gap-2 ml-[-5px]">
                                                <span className="text-[12px] px-2.5 py-1.5 bg-[#E6E6E6] rounded-[40px] text-[#000000]">콘센트</span>
                                                <span className="text-[12px] px-2.5 py-1.5 bg-[#E6E6E6] rounded-[40px] text-[#000000]">창가</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-[14px] font-bold text-black mt-3.5 mb-3 truncate leading-none">
                                                {item.title}
                                            </h2>
                                            <p className="text-[12px] text-[#000000]-600 mb-2.5">
                                                요청자 : {item.borrower}
                                            </p>
                                            <p className="text-[12px] text-[#43A860]">
                                                대여 신청일 : {item.rentalStartTime}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 items-center">
                                {item.isReturnWaiting ? (
                                    <div className="flex flex-col gap-2 items-center w-full">
                                        <button 
                                            disabled
                                            className="w-[300px] h-[34px] bg-[#CCCCCC] text-white rounded-[40px] text-[14px] font-bold cursor-not-allowed"
                                        >
                                            반납 대기
                                        </button>
                                        <button 
                                            onClick={() => handleStartChat(item)}
                                            className="w-[300px] h-[34px] bg-white border border-black rounded-[40px] text-sm flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
                                        >
                                            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                                                <path d="M14.6667 6.33333C14.6667 9.46294 11.6819 12 8 12C7.3065 12 6.6433 11.9016 6.02428 11.7171L3 13V10.3837C1.76185 9.33642 1 7.91719 1 6.33333C1 3.20372 3.98477 0.666664 7.66667 0.666664C11.3486 0.666664 14.6667 3.20372 14.6667 6.33333Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            채팅하기
                                        </button>
                                    </div>
                                ) : item.requestStatus === "대여중" ? (
                                    <div className="flex flex-col gap-2 items-center w-full">
                                        <button 
                                            onClick={() => handleConfirmReturn(index)}
                                            className="w-[300px] h-[34px] bg-[#9996FF] text-white rounded-[40px] text-[14px] font-bold active:bg-[#8582eb] transition-colors"
                                        >
                                            반납 확인
                                        </button>
                                        <button 
                                            onClick={() => handleStartChat(item)}
                                            className="w-[300px] h-[34px] bg-white border border-black rounded-[40px] text-[14px] mt-0.5 flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
                                        >
                                            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                                                <path d="M14.6667 6.33333C14.6667 9.46294 11.6819 12 8 12C7.3065 12 6.6433 11.9016 6.02428 11.7171L3 13V10.3837C1.76185 9.33642 1 7.91719 1 6.33333C1 3.20372 3.98477 0.666664 7.66667 0.666664C11.3486 0.666664 14.6667 3.20372 14.6667 6.33333Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            채팅하기
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 items-center">
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => handleApprove(index)}
                                                className="w-[142px] h-[34px] py-1 bg-[#9996FF] text-white rounded-[40px] text-[14px] font-bold active:bg-[#8e7dd1] transition-colors"
                                            >
                                                {isBlankCategory ? "승인" : "대여 승인"}
                                            </button>
                                            <button 
                                                onClick={() => handleReject(index)}
                                                className="w-[142px] h-[34px] py-1 bg-white border border-[#7F7F7F] text-[#1A1A1A] text-[14px] rounded-[40px] active:bg-gray-50 transition-colors"
                                            >
                                                거절
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => handleStartChat(item)}
                                            className="w-[304px] h-[40px] bg-white border border-black rounded-[40px] text-[14px] flex items-center justify-center mt-0.5 mb-1 gap-2 active:bg-gray-50 transition-colors"
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
                    )
                })}
            </div>

            <BottomNav />

            {modalState.show && (
                <ConfirmModal
                    message={
                        modalState.action === 'approve' 
                        ? '대여를 승인하시겠어요?' 
                        : modalState.action === 'reject' 
                        ? '대여 요청을 거절하시겠어요?' 
                        : '반납 완료 처리하시겠어요?'
                    }
                    subMessage={
                        modalState.action === 'approve' 
                        ? '승인 후 거래가 시작됩니다.' 
                        : modalState.action === 'reject' 
                        ? '거절 후 상태가 대여 가능으로 변경됩니다.' 
                        : '요청자의 상호 확인 후 정상처리되며,\n완료 후 상대방에세 후기를 남길 수 있습니다.'
                    }
                    onConfirm={confirmAction}
                    onCancel={cancelAction}
                />
            )}

            {toast && <Toast message={toast} />}
        </div>
    );
}