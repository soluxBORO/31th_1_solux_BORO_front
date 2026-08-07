import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import type { ReviewSentiment, ReviewRequest } from "../../types/rental";
import { createRentalReview } from "../../api/rental";

// ConfirmModal
function ConfirmModal({
    message,
    subMessage,
    onConfirm,
    onCancel,
}: {
    message: string;
    subMessage: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-50 px-[26px]">
            <div className="bg-white rounded-[40px] shadow-lg w-[350px] h-[190px] flex flex-col items-center justify-center pt-9 pb-5 px-6">
                <h3 className="text-[20px] font-bold text-center text-black mb-3 leading-tight whitespace-pre-line">
                    {message}
                </h3>
                <p className="text-[14px] text-[#7F7F7F] text-center leading-normal whitespace-pre-line">
                    {subMessage}
                </p>
                <div className="flex justify-center gap-4.5 w-full mt-4">
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
    );
}

// Toast
function Toast({ message }: { message: string }) {
    return (
        <div className="absolute top-[755px] left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white pl-[15px] pr-4 w-[332px] h-[46px] rounded-[40px] flex items-center gap-[10px] z-50 shadow-md">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="9" fill="#FFFFFF" />
                <path d="M5.5 9L8 11.5L12.5 6.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[14px] text-[#FFFFFF] truncate leading-none flex-1 text-center">
                {message}
            </span>
        </div>
    );
}

interface LocationState {
    rentalId?: number;
    title?: string;
    partnerName?: string;
    nickname?: string; // 거래내역에서 넘어오는 키 호환
}

export default function ReviewCreatePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams(); // URL 파라미터 추출

    const state = (location.state as LocationState) || {};

    // 1. URL 파라미터(rentalRequestId 또는 rentalId) 우선 추출
    const urlId = params.rentalRequestId || params.rentalId;
    const rentalId = urlId ? Number(urlId) : (state.rentalId ?? 1);

    // 2. 제목 및 닉네임 상태 바인딩
    const title = state.title || "게시글 제목";
    const partnerName = state.nickname || state.partnerName || "거래 상대 아이디";

    const [sentiment, setSentiment] = useState<ReviewSentiment>("GOOD");
    const [content, setContent] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [toast, setToast] = useState<string | null>(null);

    const handleSubmitConfirm = async () => {
        setShowModal(false);

        try {
            const payload: ReviewRequest = {
                reviewSentiment: sentiment,
                content,
            };

            // rental.ts의 createRentalReview(rentalId, payload) 호출
            await createRentalReview(rentalId, payload);

            setToast("후기가 전송되었습니다");
            setTimeout(() => {
                setToast(null);
                // 절대 경로 지정 (/mypage/history)
                navigate('/mypage/history');
            }, 1000);
        } catch (error) {
            console.error("후기 전송 실패:", error);
            setToast("후기 전송에 실패했습니다");
            setTimeout(() => setToast(null), 1000);
        }
    };

    const isGood = sentiment === "GOOD";

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-h-[874px] max-h-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white mx-auto shadow-md">
            {/* 상단 헤더 */}
            <div className="pl-8 pr-8 pt-[35px] pb-[16px] flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="cursor-pointer flex items-center justify-center"
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 8.36377C14.5523 8.36377 15 7.91605 15 7.36377C15 6.81148 14.5523 6.36377 14 6.36377V7.36377V8.36377ZM0.292893 6.65666C-0.0976315 7.04719 -0.0976315 7.68035 0.292893 8.07088L6.65685 14.4348C7.04738 14.8254 7.68054 14.8254 8.07107 14.4348C8.46159 14.0443 8.46159 13.4111 8.07107 13.0206L2.41421 7.36377L8.07107 1.70692C8.46159 1.31639 8.46159 0.683226 8.07107 0.292702C7.68054 -0.0978227 7.04738 -0.0978227 6.65685 0.292702L0.292893 6.65666ZM14 7.36377V6.36377L1 6.36377V7.36377V8.36377L14 8.36377V7.36377Z" fill="#1A1A1A"/>
                        </svg>
                    </button>
                    <h1 className="text-[16px] font-bold leading-none text-[#1A1A1A]">거래 후기 작성</h1>
                </div>
            </div>

            {/* 메인 내용 영역 */}
            <div className="flex-1 overflow-y-auto pl-4 pt-3 space-y-5 overflow-x-hidden">
                {/* 게시글 정보 카드 */}
                <div className="w-[370px] h-[121px] border border-[#CCCCCC] rounded-[40px] p-7 flex flex-col gap-3">
                    <h2 className="text-[16px] font-bold text-[#000000] leading-snug">{title}</h2>
                    <p className="text-[12px] text-[#000000]">거래 상대 : {partnerName}</p>
                </div>

                {/* 후기 작성 메인 카드 */}
                <div className="w-[370px] h-[329px] border border-[#CCCCCC] rounded-[40px] p-7 flex flex-col gap-4">
                    <h3 className="text-[16px] font-bold text-[#000000]">거래가 어떠셨나요?</h3>

                    {/* 감정 선택 버튼 그룹 */}
                    <div className="flex gap-4 ml-[-5px]">
                        {/* 좋았어요 */}
                        <button
                            type="button"
                            onClick={() => setSentiment("GOOD")}
                            className={`w-[157px] h-[114px] rounded-[40px] pt-2 border flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
                                isGood
                                ? "bg-[#D2FFE5] border-[#43A860] border-[2px]"
                                : "bg-white border-[#CCCCCC]"
                            }`}
                        >
                            <svg width="40" height="36" viewBox="0 0 40 36" fill={isGood ? "#43A860" : "#CCCCCC"} xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.1905 11.8978C37.2063 11.8978 38.0952 12.2686 38.8571 13.0102C39.619 13.7518 40 14.617 40 15.6058V19.3139C40 19.5302 39.9759 19.7619 39.9276 20.0091C39.8794 20.2563 39.8083 20.4881 39.7143 20.7044L34 33.7752C33.7143 34.3932 33.2381 34.9185 32.5714 35.3511C31.9048 35.7837 31.2063 36 30.4762 36H15.2381C14.1905 36 13.294 35.6372 12.5486 34.9117C11.8032 34.1862 11.4298 33.3129 11.4286 32.292V13.4274C11.4286 12.933 11.5321 12.462 11.739 12.0146C11.946 11.5672 12.2235 11.1729 12.5714 10.8317L22.9048 0.820046C23.381 0.387442 23.9448 0.12479 24.5962 0.0320888C25.2476 -0.060612 25.8743 0.0475388 26.4762 0.356541C27.0781 0.665544 27.5149 1.09815 27.7867 1.65435C28.0584 2.21056 28.1136 2.78221 27.9524 3.36932L25.8095 11.8978H36.1905ZM3.80952 36C2.7619 36 1.8654 35.6372 1.12 34.9117C0.374603 34.1862 0.00126984 33.3129 0 32.292V15.6058C0 14.5861 0.373333 13.7135 1.12 12.988C1.86667 12.2624 2.76317 11.899 3.80952 11.8978C4.85587 11.8966 5.75302 12.2599 6.50095 12.988C7.24889 13.716 7.62159 14.5886 7.61905 15.6058V32.292C7.61905 33.3117 7.24635 34.1849 6.50095 34.9117C5.75556 35.6385 4.85841 36.0012 3.80952 36Z" />
                            </svg>
                            <span className="text-[14px] text-[#000000]">좋았어요</span>
                        </button>

                        {/* 별로였어요 */}
                        <button
                            type="button"
                            onClick={() => setSentiment("BAD")}
                            className={`w-[157px] h-[114px] rounded-[40px] pt-3 border flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                                !isGood
                                ? "bg-[#FFD4BB] border-[#FF5E00] border-[2px]"
                                : "bg-white border-[#CCCCCC]"
                            }`}
                        >
                            <svg width="40" height="37" viewBox="0 0 40 37" fill={!isGood ? "#FF5E00" : "#CCCCCC"} xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.80952 24.7717C2.79365 24.7717 1.90476 24.3906 1.14286 23.6284C0.380952 22.8662 0 21.977 0 20.9607V17.1496C0 16.9273 0.0234919 16.6891 0.0704761 16.4351C0.11746 16.181 0.189206 15.9428 0.285714 15.7205L6 2.28662C6.28571 1.65145 6.7619 1.11155 7.42857 0.666931C8.09524 0.22231 8.79365 0 9.52381 0H24.7619C25.8095 0 26.7067 0.372846 27.4533 1.11854C28.2 1.86423 28.5727 2.76173 28.5714 3.81103V23.1997C28.5714 23.7078 28.4686 24.1924 28.2629 24.6536C28.0571 25.1147 27.779 25.5193 27.4286 25.8674L17.0952 36.1572C16.619 36.6018 16.0559 36.8717 15.4057 36.967C14.7556 37.0623 14.1283 36.9511 13.5238 36.6336C12.9194 36.316 12.4832 35.8713 12.2152 35.2997C11.9473 34.728 11.8914 34.1405 12.0476 33.5371L14.1905 24.7717H3.80952ZM36.1905 0C37.2381 0 38.1352 0.373481 38.8819 1.12044C39.6286 1.86741 40.0013 2.76427 40 3.81103V20.9607C40 22.0087 39.6273 22.9062 38.8819 23.6532C38.1365 24.4001 37.2394 24.773 36.1905 24.7717C35.1416 24.7704 34.2451 24.3976 33.5009 23.6532C32.7568 22.9088 32.3835 22.0113 32.381 20.9607V3.81103C32.381 2.763 32.7543 1.86614 33.5009 1.12044C34.2476 0.374752 35.1441 0.00127034 36.1905 0Z" />
                            </svg>
                            <span className="text-[14px] text-[#000000]">별로였어요</span>
                        </button>
                    </div>

                    {/* 상세 후기 입력 영역 */}
                    <div className="w-[320px] h-[109px] ml-[-5px] mt-2 mb-[-4px] py-4 pr-2 pl-6 bg-[#E6E6E6] rounded-[30px] flex items-center justify-center">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="상세한 거래 후기를 남겨주세요.&#10;단순 비방성, 사실이 아닌 내용은 이의 및 반려처리 될 수 있습니다."
                            className="w-full h-full bg-transparent text-[12px] text-[#000000] placeholder-[#000000] placeholder:text-[10px] focus:outline-none resize-none leading-relaxed overflow-y-auto vertical-scroll"
                        />
                    </div>
                </div>

                {/* 포인트 변동 안내 카드 */}
                <div
                    className={`w-[370px] h-[76px] rounded-[40px] p-4 pl-8 flex flex-col gap-1 ${
                        isGood ? "bg-[#D2FFE5]/50" : "bg-[#FFD4BB]/50"
                    }`}
                >
                    <span className="text-[14px] font-bold text-[#000000]">포인트 변동 안내</span>
                    <span className="text-[12px] text-[#000000]">
                        {isGood
                        ? "상대방에게 300p가 적립됩니다"
                        : "상대방으로부터 350p가 차감됩니다"}
                    </span>
                </div>

                {/* 후기 전송하기 버튼 */}
                <div className="pt-2 pl-7">
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="w-[304px] h-[40px] bg-[#9996FF] active:bg-[#8582eb] text-white rounded-[35.9px] text-[14px] !font-bold transition-colors cursor-pointer"
                    >
                        후기 전송하기
                    </button>
                </div>
            </div>

            {/* Confirm 모달 */}
            {showModal && (
                <ConfirmModal
                    message="후기를 전송하시겠어요?"
                    subMessage={
                        isGood
                        ? "전송된 후기는 수정할 수 없으며,\n상대방의 포인트에 반영됩니다. (+300P)"
                        : "전송된 후기는 수정할 수 없으며,\n상대방의 포인트에 반영됩니다. (-350P)"
                    }
                    onConfirm={handleSubmitConfirm}
                    onCancel={() => setShowModal(false)}
                />
            )}

            {/* Toast 메시지 */}
            {toast && <Toast message={toast} />}
        </div>
    );
}