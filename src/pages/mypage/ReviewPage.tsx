// 받은 후기 (좋았어요/별로였어요)

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReceivedReviews } from "../../api/member-gm";
import type { ReviewDetail, ReviewSentiment } from "../../types/member-gm";

// 이의신청 구글 폼 URL
const APPEAL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf2VDNrRoVJaGDTOwpwLt2lb7ynHyfa91h54QGRJyne4np8bg/viewform";

export default function ReviewPage() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<ReviewSentiment>("GOOD");
    
    // 개별 후기 리스트 및 통계 상태
    const [reviewList, setReviewList] = useState<ReviewDetail[]>([]);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [dislikeCount, setDislikeCount] = useState<number>(0);

    useEffect(() => {
        getReceivedReviews(activeTab)           // 여기!
            .then((res) => {
                if (res.isSuccess && res.result) {
                    setLikeCount(res.result.likeCount);
                    setDislikeCount(res.result.dislikeCount);
                    setReviewList(res.result.reviewDetailList || []);
                } else {
                    setReviewList([]);
                }
            })
            .catch(() => {
                setReviewList([]);
            });
    }, [activeTab]);

    // 이의신청 버튼 클릭 시 구글 폼 새 창 열기
    const handleAppealClick = () => {
        window.open(APPEAL_FORM_URL, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-h-[874px] max-h-[874px] w-[402px] h-[874px] overflow-y-auto overflow-x-hidden flex flex-col bg-white mx-auto">
            {/* 상단 헤더 */}
            <div className="pl-8 pr-8 pt-[35px] pb-[16px] flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/mypage")}
                        className="cursor-pointer flex items-center justify-center"
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 8.36377C14.5523 8.36377 15 7.91605 15 7.36377C15 6.81148 14.5523 6.36377 14 6.36377V7.36377V8.36377ZM0.292893 6.65666C-0.0976315 7.04719 -0.0976315 7.68035 0.292893 8.07088L6.65685 14.4348C7.04738 14.8254 7.68054 14.8254 8.07107 14.4348C8.46159 14.0443 8.46159 13.4111 8.07107 13.0206L2.41421 7.36377L8.07107 1.70692C8.46159 1.31639 8.46159 0.683226 8.07107 0.292702C7.68054 -0.0978227 7.04738 -0.0978227 6.65685 0.292702L0.292893 6.65666ZM14 7.36377V6.36377L1 6.36377V7.36377V8.36377L14 8.36377V7.36377Z" fill="#1A1A1A"/>
                        </svg>
                    </button>
                    <h1 className="text-[16px] font-bold leading-none text-[#1A1A1A]">받은 후기</h1>
                </div>
                <div className="mt-[-5px]">
                    <button
                        onClick={() => navigate("/mypage/my-review")}
                        className="p-2 m-[-15px] px-3 bg-[#B3B3B3] rounded-[40px] text-[12px] text-[#FFFFFF] transition-all duration-150 active:scale-97 active:bg-[#9E9E9E] cursor-pointer select-none"
                    >
                        보낸 후기
                    </button>
                </div>
            </div>

            {/* 스크롤 영역 */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto vertical-scroll px-[20px] pt-2 pb-8 space-y-4">
                {/* 상단 통계 요약 카드 */}
                <div className="flex gap-3">
                    <div className="w-[172px] h-[116px] bg-[#D2FFE5] rounded-[40px] flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-2">
                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.5714 4.62692C13.9524 4.62692 14.2857 4.77112 14.5714 5.05952C14.8571 5.34793 15 5.6844 15 6.06893V7.51094C15 7.59506 14.991 7.68519 14.9729 7.78132C14.9548 7.87746 14.9281 7.96758 14.8929 8.0517L12.75 13.1348C12.6429 13.3751 12.4643 13.5794 12.2143 13.7476C11.9643 13.9159 11.7024 14 11.4286 14H5.71429C5.32143 14 4.98524 13.8589 4.70571 13.5768C4.42619 13.2946 4.28619 12.955 4.28571 12.558V5.22175C4.28571 5.02948 4.32452 4.84635 4.40214 4.67234C4.47976 4.49834 4.58381 4.34501 4.71429 4.21234L8.58928 0.318907C8.76786 0.150672 8.97929 0.0485293 9.22357 0.012479C9.46786 -0.0235714 9.70286 0.0184873 9.92857 0.138655C10.1543 0.258823 10.3181 0.427058 10.42 0.643359C10.5219 0.859661 10.5426 1.08197 10.4821 1.31029L9.67857 4.62692H13.5714ZM1.42857 14C1.03571 14 0.699524 13.8589 0.42 13.5768C0.140476 13.2946 0.00047619 12.955 0 12.558V6.06893C0 5.67238 0.14 5.33302 0.42 5.05087C0.7 4.76872 1.03619 4.6274 1.42857 4.62692C1.82095 4.62644 2.15738 4.76776 2.43786 5.05087C2.71833 5.33399 2.8581 5.67334 2.85714 6.06893V12.558C2.85714 12.9545 2.71738 13.2941 2.43786 13.5768C2.15833 13.8594 1.8219 14.0005 1.42857 14Z" fill="#43A860"/>
                            </svg>
                            <span className="text-[12px] text-[#000000]">좋았어요</span>
                        </div>
                        <span className="text-[24px] font-bold text-[#43A860]">{likeCount}</span>
                    </div>

                    <div className="w-[172px] h-[116px] bg-[#FFD4BB] rounded-[40px] flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.42857 9.37308C1.04762 9.37308 0.714286 9.22888 0.428571 8.94048C0.142857 8.65207 0 8.31561 0 7.93107V6.48906C0 6.40494 0.00880948 6.31481 0.0264285 6.21868C0.0440476 6.12254 0.0709524 6.03242 0.107143 5.9483L2.25 0.865207C2.35714 0.624872 2.53571 0.420587 2.78571 0.252352C3.03571 0.0841173 3.29762 0 3.57143 0H9.28571C9.67857 0 10.015 0.141077 10.295 0.423231C10.575 0.705384 10.7148 1.04498 10.7143 1.44201V8.77825C10.7143 8.97052 10.6757 9.1539 10.5986 9.32838C10.5214 9.50286 10.4171 9.65596 10.2857 9.78766L6.41071 13.6811C6.23214 13.8493 6.02095 13.9515 5.77714 13.9875C5.53333 14.0236 5.2981 13.9815 5.07143 13.8613C4.84476 13.7412 4.68119 13.5729 4.58071 13.3566C4.48024 13.1403 4.45929 12.918 4.51786 12.6897L5.32143 9.37308H1.42857ZM13.5714 0C13.9643 0 14.3007 0.141317 14.5807 0.423952C14.8607 0.706586 15.0005 1.04594 15 1.44201V7.93107C15 8.32762 14.8602 8.66722 14.5807 8.94985C14.3012 9.23249 13.9648 9.37356 13.5714 9.37308C13.1781 9.3726 12.8419 9.23152 12.5629 8.94985C12.2838 8.66818 12.1438 8.32858 12.1429 7.93107V1.44201C12.1429 1.04546 12.2829 0.706106 12.5629 0.423952C12.8429 0.141798 13.179 0.000480671 13.5714 0Z" fill="#FF5E00"/>
                            </svg>
                            <span className="text-[12px] text-[#000000]">별로였어요</span>
                        </div>
                        <span className="text-[24px] font-bold text-[#FF5E00]">{dislikeCount}</span>
                    </div>
                </div>

                {/* 탭 영역 */}
                <div className="relative w-full h-[44px] flex-shrink-0 my-4">
                    <div className="absolute left-[1px] top-0 bg-[#E6E6E6] rounded-[40px] w-[359px] h-[44px] p-1.5 flex items-center justify-between">
                        {/* 첫 번째 탭 (좋았어요) */}
                        <button
                            type="button"
                            onClick={() => setActiveTab("GOOD")}
                            className={`w-[172px] h-[32px] flex items-center justify-center text-[14px] rounded-[40px] transition-colors duration-150 cursor-pointer ${
                                activeTab === "GOOD"
                                    ? "bg-[#9996FF] text-[#FFFFFF] !font-bold"
                                    : "text-[#7F7F7F] hover:text-gray-600 font-normal"
                            }`}
                        >
                            좋았어요 ({likeCount})
                        </button>

                        {/* 두 번째 탭 (별로였어요) */}
                        <button
                            type="button"
                            onClick={() => setActiveTab("BAD")}
                            className={`w-[172px] h-[32px] flex items-center justify-center text-[14px] rounded-[40px] transition-colors duration-150 cursor-pointer ${
                                activeTab === "BAD"
                                    ? "bg-[#9996FF] text-[#FFFFFF] !font-bold"
                                    : "text-[#7F7F7F] hover:text-gray-600 font-normal"
                            }`}
                        >
                            별로였어요 ({dislikeCount})
                        </button>
                    </div>
                </div>

                {/* 후기 리스트 */}
                <div className="space-y-6 pt-1 min-h-[300px] flex flex-col justify-start">
                    {reviewList.length === 0 ? (
                        /* 후기가 없을 때 표시되는 영역 */
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-[14px] text-[#7F7F7F]">
                                받은 후기가 없습니다
                            </p>
                        </div>
                    ) : (
                        /* 후기가 존재할 때 리스트 렌더링 */
                        reviewList.map((review, idx) => (
                            <div
                                key={review.memberId || idx}
                                className={`w-[370px] h-auto border border-[2px] rounded-[32px] p-5 ml-[-5px] flex flex-col gap-2 ${
                                    activeTab === "GOOD" ? "border-[#43A860]" : "border-[#FF5E00]"
                                }`}
                            >
                                <div className="flex items-start justify-between pb-5">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-[55px] h-[55px] rounded-full flex items-center justify-center ${
                                                activeTab === "GOOD" ? "bg-[#D2FFE5]" : "bg-[#FFD4BB]"
                                            }`}
                                        >
                                            {activeTab === "GOOD" ? (
                                                <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20.8095 6.94038C21.3937 6.94038 21.9048 7.15668 22.3429 7.58928C22.781 8.02189 23 8.52659 23 9.1034V11.2664C23 11.3926 22.9861 11.5278 22.9584 11.672C22.9306 11.8162 22.8897 11.9514 22.8357 12.0775L19.55 19.7022C19.3857 20.0627 19.1119 20.3691 18.7286 20.6215C18.3452 20.8738 17.9436 21 17.5238 21H8.7619C8.15952 21 7.64403 20.7884 7.21543 20.3652C6.78683 19.9419 6.57216 19.4325 6.57143 18.837V7.83262C6.57143 7.54422 6.63094 7.26952 6.74995 7.00851C6.86897 6.74751 7.02851 6.51751 7.22857 6.31851L13.1702 0.47836C13.444 0.226008 13.7682 0.0727939 14.1428 0.0187184C14.5174 -0.035357 14.8777 0.027731 15.2238 0.207983C15.5699 0.388234 15.8211 0.640586 15.9773 0.965039C16.1336 1.28949 16.1653 1.62296 16.0726 1.96544L14.8405 6.94038H20.8095ZM2.19048 21C1.5881 21 1.0726 20.7884 0.644 20.3652C0.215397 19.9419 0.000730159 19.4325 0 18.837V9.1034C0 8.50857 0.214667 7.99954 0.644 7.57631C1.07333 7.15308 1.58883 6.9411 2.19048 6.94038C2.79213 6.93966 3.30798 7.15163 3.73805 7.57631C4.16811 8.00098 4.38241 8.51001 4.38095 9.1034V18.837C4.38095 19.4318 4.16665 19.9412 3.73805 20.3652C3.30944 20.7891 2.79359 21.0007 2.19048 21Z" fill="#43A860"/>
                                                </svg>
                                            ) : (
                                                <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.19048 14.0596C1.60635 14.0596 1.09524 13.8433 0.657143 13.4107C0.219048 12.9781 0 12.4734 0 11.8966V9.73358C0 9.60741 0.0135079 9.47222 0.0405237 9.32802C0.0675396 9.18382 0.108794 9.04863 0.164286 8.92245L3.45 1.29781C3.61429 0.937308 3.88809 0.63088 4.27143 0.378528C4.65476 0.126176 5.05635 0 5.47619 0H14.2381C14.8405 0 15.3563 0.211615 15.7857 0.634846C16.215 1.05808 16.4293 1.56747 16.4286 2.16302V13.1674C16.4286 13.4558 16.3694 13.7308 16.2511 13.9926C16.1329 14.2543 15.9729 14.4839 15.7714 14.6815L9.82976 20.5216C9.55595 20.774 9.23213 20.9272 8.85828 20.9813C8.48444 21.0354 8.12375 20.9723 7.77619 20.792C7.42863 20.6118 7.17782 20.3594 7.02376 20.035C6.8697 19.7105 6.83757 19.377 6.92738 19.0346L8.15952 14.0596H2.19048ZM20.8095 0C21.4119 0 21.9278 0.211976 22.3571 0.635928C22.7864 1.05988 23.0007 1.56891 23 2.16302V11.8966C23 12.4914 22.7857 13.0008 22.3571 13.4248C21.9285 13.8487 21.4126 14.0603 20.8095 14.0596C20.2064 14.0589 19.6909 13.8473 19.263 13.4248C18.8352 13.0023 18.6205 12.4929 18.619 11.8966V2.16302C18.619 1.56819 18.8337 1.05916 19.263 0.635928C19.6924 0.212697 20.2079 0.000721006 20.8095 0Z" fill="#FF5E00"/>
                                                </svg>
                                            )}
                                        </div>

                                        {/* 동적 작성자 정보 바인딩 */}
                                        <div className="mb-[-25px]">
                                            <h4 className="text-[14px] font-bold text-[#000000]">
                                                {review.memberNickname}
                                            </h4>
                                            <p className="text-[12px] text-[#000000] mt-1.5 mb-0.5">
                                                {review.postTitle}
                                            </p>
                                            <span className="text-[11px] text-[#666666]">
                                                {review.createdAt}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 이의신청 버튼 -> Google Form 링크 연결 */}
                                    {activeTab === "BAD" && (
                                        <button
                                            onClick={handleAppealClick}
                                            className="w-[73px] h-[34px] bg-[#FFD4BB] text-[#1A1A1A] text-[12px] !font-semibold px-3 py-1.5 rounded-[40px] cursor-pointer hover:bg-[#fae2d0] transition-colors"
                                        >
                                            이의신청
                                        </button>
                                    )}
                                </div>

                                {review.content && (
                                    <div className="w-[318px] h-auto bg-[#E6E6E6] rounded-[40px] p-6 pl-8 ml-1 text-[12px] text-[#000000] leading-relaxed whitespace-pre-line mt-1">
                                        {review.content}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}