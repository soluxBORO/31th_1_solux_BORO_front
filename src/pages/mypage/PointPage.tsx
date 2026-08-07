// 포인트 안내 페이지

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPointHistories, getMemberInfo } from "../../api/member-gm";
import type { PointHistory } from "../../types/member-gm";
import BottomNav from "../../components/BottomNav";
import Tab from "../../components/Tab";

export default function PointPage() {
    const navigate = useNavigate();
    
    const [userPoint, setUserPoint] = useState<number>(0);

    const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
    const [historyList, setHistoryList] = useState<PointHistory[]>([]);

    useEffect(() => {
        // 백엔드 API 연동하여 유저 정보 및 포인트 데이터 조회
        getMemberInfo()
            .then((res) => {
                if (res.isSuccess && res.result?.point !== undefined) {
                    setUserPoint(res.result.point);
                }
            })
            .catch((err) => console.error("멤버 정보 로딩 실패:", err));

        // 백엔드 API 연동하여 포인트 이력 데이터 조회
        getPointHistories()
            .then((res) => {
                if (res.isSuccess && Array.isArray(res.result)) {
                    setHistoryList(res.result);
                }
            })
            .catch((err) => console.error("포인트 이력 로드 실패:", err));
    }, []);

    // 포인트 클릭 시 팝업 토글 (켜기 / 끄기)
    const toggleHistoryModal = () => {
        setShowHistoryModal((prev) => !prev);
    };

    // 포인트 적립 조건
    const earnConditions = [
        { label: "거래 완료 후 '좋았어요' 후기 받음", value: "+300p" },
        { label: "빈자리 양도 완료", value: "+100p" },
        { label: "물품 대여 완료 (1일당)", value: "+50p" },
        { label: "신규 가입", value: "+500p" },
        { label: "프로필 인증 완료", value: "+200p" },
    ];

    // 포인트 차감 조건
    const loseConditions = [
        { label: "거래 완료 후 '별로였어요' 후기 받음", value: "-350p" },
        { label: "노쇼 (약속 불이행)", value: "-500p" },
        { label: "물품 파손/훼손", value: "-400p" },
        { label: "신고 누적 (3회)", value: "-1000p" },
    ];

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-height-[874px] max-height-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white mx-auto">
            
            {/* 상단 공통 헤더 구역 */}
            <div className="pl-8 pr-8 pt-[25px] pb-[16px] flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/mypage")} className="cursor-pointer flex items-center justify-center">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 8.36377C14.5523 8.36377 15 7.91605 15 7.36377C15 6.81148 14.5523 6.36377 14 6.36377V7.36377V8.36377ZM0.292893 6.65666C-0.0976315 7.04719 -0.0976315 7.68035 0.292893 8.07088L6.65685 14.4348C7.04738 14.8254 7.68054 14.8254 8.07107 14.4348C8.46159 14.0443 8.46159 13.4111 8.07107 13.0206L2.41421 7.36377L8.07107 1.70692C8.46159 1.31639 8.46159 0.683226 8.07107 0.292702C7.68054 -0.0978227 7.04738 -0.0978227 6.65685 0.292702L0.292893 6.65666ZM14 7.36377V6.36377L1 6.36377V7.36377V8.36377L14 8.36377V7.36377Z" fill="#1A1A1A"/>
                        </svg>
                    </button>
                    <h1 className="text-[16px] font-bold leading-none text-[#1A1A1A]">포인트 / 상점</h1>
                </div>
                
                <div
                    onClick={toggleHistoryModal} 
                    className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <div className="flex items-center justify-center gap-1.5">
                        <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.5 16.25C25.961 16.25 32.5 14.0173 32.5 9.75C32.5 5.48275 25.961 3.25 19.5 3.25C13.039 3.25 6.5 5.48275 6.5 9.75C6.5 14.0173 13.039 16.25 19.5 16.25Z" fill="#9996FF"/>
                            <path d="M6.26782 16.4819C6.26782 20.7492 12.8068 22.9819 19.2678 22.9819C25.7288 22.9819 32.2678 20.7492 32.2678 16.4819V13.2319C32.2678 17.4992 25.7288 19.7319 19.2678 19.7319C12.8068 19.7319 6.26782 17.4992 6.26782 13.2319V16.4819Z" fill="#9996FF"/>
                            <path d="M6.26782 22.9819C6.26782 27.2492 12.8068 29.4819 19.2678 29.4819C25.7288 29.4819 32.2678 27.2492 32.2678 22.9819V19.7319C32.2678 23.9992 25.7288 26.2319 19.2678 26.2319C12.8068 26.2319 6.26782 23.9992 6.26782 19.7319V22.9819Z" fill="#9996FF"/>
                        </svg>
                        <span className="text-[#9996FF] font-bold text-[16px]">{userPoint.toLocaleString()} p</span>
                    </div>
                </div>
            </div>

            {/* 상점/포인트 탭 */}
            <Tab 
                activeTab="second"
                firstLabel="상점"
                firstPath="/mypage/store"
                secondLabel="포인트 안내"
                secondPath="/mypage/point"
            />

            {/* 메인 스크롤 안내 영역 */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto vertical-scroll px-[17px] space-y-5 pt-2.5 pb-[90px]">
                
                {/* 1. 포인트 적립 조건 섹션 */}
                <div className="w-[370px] border border-[#CCCCCC] rounded-[40px] p-7 pl-6 flex flex-col gap-3 bg-white">
                    <div className="flex items-center gap-3">
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.1721 21.5749C2.82363 21.9233 2.35099 22.1191 1.85818 22.1191C1.36536 22.1191 0.892723 21.9233 0.544247 21.5749C0.195772 21.2264 0 20.7537 0 20.2609C0 19.7681 0.195772 19.2955 0.544247 18.947L6.7341 12.759L6.7471 12.746C7.25284 12.2507 7.93256 11.9732 8.64046 11.9732C9.34837 11.9732 10.0281 12.2507 10.5338 12.746L10.5468 12.759L13.7058 15.918L18.0645 11.3086L16.1331 9.37714C15.9386 9.18235 15.8061 8.93428 15.7525 8.66425C15.6988 8.39423 15.7264 8.11436 15.8317 7.86C15.937 7.60564 16.1154 7.38819 16.3442 7.23513C16.573 7.08206 16.8421 7.00024 17.1174 7H23.9015C24.2709 7 24.6252 7.14675 24.8864 7.40796C25.1476 7.66917 25.2944 8.02345 25.2944 8.39286V15.1751C25.2941 15.4504 25.2123 15.7195 25.0593 15.9483C24.9062 16.1772 24.6888 16.3555 24.4344 16.4608C24.18 16.5661 23.9002 16.5937 23.6301 16.5401C23.3601 16.4864 23.112 16.354 22.9172 16.1594L20.6924 13.9346L15.6707 19.2479L15.6205 19.298C15.1148 19.7933 14.4351 20.0708 13.7272 20.0708C13.0193 20.0708 12.3396 19.7933 11.8338 19.298L11.8208 19.285L8.63953 16.1056L3.1721 21.5749Z" fill="#43A860"/>
                        </svg>
                        <h2 className="text-[16px] font-bold text-[#000000]">포인트 적립 조건</h2>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {earnConditions.map((item, index) => (
                            <div key={index} className="w-[316px] h-[40px] bg-[#D2FFE5] rounded-[40px] pl-4 pr-2.5 flex items-center justify-between">
                                <span className="text-[12px] text-[#1A1A1A]">{item.label}</span>
                                <span className="w-[68px] h-[26px] bg-[#43A860] rounded-[40px] text-white font-semibold text-[12px] flex items-center justify-center">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. 포인트 차감 조건 섹션 */}
                <div className="w-[370px] border border-[#CCCCCC] rounded-[40px] p-7 pl-6 flex flex-col gap-3 bg-white">
                    <div className="flex items-center gap-3">
                        <svg className="mt-[-7px]" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.52464 7.9837C3.3521 7.81115 3.14725 7.67428 2.92181 7.5809C2.69636 7.48752 2.45473 7.43945 2.21071 7.43945C1.7179 7.43945 1.24526 7.63522 0.896786 7.9837C0.548311 8.33218 0.352539 8.80481 0.352539 9.29763C0.352539 9.79045 0.548311 10.2631 0.896786 10.6116L7.08664 16.7996L7.09964 16.8126C7.60538 17.3079 8.2851 17.5853 8.993 17.5853C9.70091 17.5853 10.3806 17.3079 10.8864 16.8126L10.8994 16.7996L14.0584 13.6406L18.4171 18.25L16.4856 20.1814C16.2911 20.3762 16.1586 20.6243 16.105 20.8943C16.0513 21.1643 16.0789 21.4442 16.1843 21.6986C16.2896 21.9529 16.4679 22.1704 16.6967 22.3234C16.9256 22.4765 17.1946 22.5583 17.4699 22.5586H24.2541C24.6235 22.5586 24.9778 22.4118 25.239 22.1506C25.5002 21.8894 25.6469 21.5351 25.6469 21.1657V14.3871C25.6467 14.1118 25.5649 13.8428 25.4118 13.6139C25.2587 13.3851 25.0413 13.2068 24.7869 13.1015C24.5326 12.9961 24.2527 12.9686 23.9827 13.0222C23.7126 13.0758 23.4646 13.2083 23.2698 13.4028L21.0449 15.6258L16.0232 10.3144L15.9731 10.2624C15.4673 9.76652 14.7871 9.48874 14.0788 9.48874C13.3704 9.48874 12.6903 9.76652 12.1845 10.2624L12.1734 10.2754L8.99207 13.4548L3.52464 7.9837Z" fill="#FF5E00"/>
                        </svg>
                        <h2 className="text-[16px] font-bold text-[#000000]">포인트 차감 조건</h2>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {loseConditions.map((item, index) => (
                            <div key={index} className="w-[316px] h-[40px] bg-[#FFD4BB] rounded-[40px] pl-4 pr-2.5 flex items-center justify-between">
                                <span className="text-[12px] text-[#1A1A1A]">{item.label}</span>
                                <span className="w-[68px] h-[26px] bg-[#FF5E00] rounded-[40px] text-white font-semibold text-[12px] flex items-center justify-center">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. 포인트 팁 박스 */}
                <div className="w-[369px] h-[199px] bg-[#F0F0FF] rounded-[40px] p-6 pl-8 flex flex-col gap-3">
                    <span className="text-[#9996FF] font-bold text-[14px]">포인트 팁</span>
                    <ul className="text-[#000000] text-[12px] leading-[22px] flex flex-col gap-0.5">
                        <li>• 신규 가입 시 500P가 기본 지급됩니다</li>
                        <li>• 거래를 성실히 완료하면 포인트를 적립할 수 있습니다</li>
                        <li>• 빈자리 양도도 포인트 적립 대상입니다</li>
                        <li>• 약속 준수와 친절한 응대로 좋은 후기를 받을 수 있습니다</li>
                        <li>• 포인트는 캐릭터 아이템 구매에 사용됩니다</li>
                    </ul>
                </div>

            </div>

            {/* 하단 공통 네비게이션 */}
            <BottomNav />

            {/* 포인트 이력 조회 팝업 모달 */}
            {showHistoryModal && (
                <div 
                    onClick={toggleHistoryModal}
                    className="absolute inset-0 bg-black/45 flex items-center justify-center z-50 px-6"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-[40px] w-[350px] max-h-[401px] flex flex-col items-center pt-7 pb-6 overflow-hidden"
                    >
                        <h3 className="text-[20px] font-bold text-center text-black mb-7 px-5 flex-shrink-0">
                            나의 포인트 이력 조회
                        </h3>

                        <div className="w-full flex-1 flex flex-col gap-3.5 overflow-x-hidden overflow-y-auto px-5 pb-5 vertical-scroll">
                            {historyList.length === 0 ? (
                                <div className="text-center text-gray-400 text-[12px]">
                                    적립 / 차감된 포인트가 없습니다.
                                </div>
                            ) : (
                                historyList.map((item, idx) => {
                                    const isNegative = item.point < 0;

                                    return (
                                        <div 
                                            key={idx}
                                            className={`w-full h-[60px] rounded-[40px] p-3.5 pl-5 flex items-center justify-between flex-shrink-0 ${
                                                isNegative ? "bg-[#FFD4BB]" : "bg-[#D2FFE5]"
                                            }`}
                                        >
                                            <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                                                <span className="text-[12px] text-[#7F7F7F]">
                                                    {item.createdAt}
                                                </span>
                                                <span className="text-[12px] text-[#1A1A1A] truncate">
                                                    {item.pointDescription}
                                                </span>
                                            </div>

                                            <span 
                                                className={`min-w-[68px] h-[26px] rounded-[40px] text-white font-semibold text-[12px] flex items-center justify-center flex-shrink-0 ${
                                                    isNegative ? "bg-[#FF5E00]" : "bg-[#43A860]"
                                                }`}
                                            >
                                                {isNegative ? `${item.point}p` : `+${item.point}p`}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}