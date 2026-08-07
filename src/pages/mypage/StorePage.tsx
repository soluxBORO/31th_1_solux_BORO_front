// 상점 페이지

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoreAssets, purchaseAsset } from "../../api/assets";
import type { StoreAsset } from "../../types/assets";
import { getMemberInfo } from "../../api/member-gm";
import BottomNav from "../../components/BottomNav";
import Tab from "../../components/Tab";

import bagImg from "../../assets/bag.png";
import coffeeImg from "../../assets/coffee.png";
import glassesImg from "../../assets/glasses.png";
import hatImg from "../../assets/hat.png";
import headsetImg from "../../assets/headset.png";
import hoodieImg from "../../assets/hoodie.png";
import maskImg from "../../assets/mask.png";
import princessSongImg from "../../assets/princess_song.png";
import suitSongImg from "../../assets/suit_song.png";
import suitImg from "../../assets/suit.png";

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

// itemName에 맞게 이미지를 매칭해주는 객체
const imageMap: Record<string, string> = {
    "가방": bagImg,
    "커피": coffeeImg,
    "안경": glassesImg,
    "모자": hatImg,
    "헤드셋": headsetImg,
    "후드티": hoodieImg,
    "마스크": maskImg,
    "프린세스 송이": princessSongImg,
    "정장 송이": suitSongImg,
    "정장": suitImg,
};

// 아이템별 맞춤 너비 클래스 매칭
const widthMap: Record<string, string> = {
    "가방": "w-[42px]",
    "커피": "w-[40px]",
    "안경": "w-[86px]",
    "모자": "w-[90px]",
    "헤드셋": "w-[89px]",
    "후드티": "w-[95px]",
    "마스크": "w-[89px]",
    "프린세스 송이": "w-[66px]",
    "정장 송이": "w-[66px]",
    "정장": "w-[104px]",
};

// 아이템 카테고리
const categoryNameMap: Record<string, string> = {
    CLOTHING: "의상",
    ACCESSORY: "악세사리",
    ETC: "기타",
};

export default function StorePage() {
    const navigate = useNavigate();
    
    // 초기값을 빈 배열로 설정하고 서버 데이터를 세팅할 수 있도록 수정
    const [assets, setAssets] = useState<StoreAsset[]>([]);
    const [userPoint, setUserPoint] = useState<number>(0);
    
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    const [modalState, setModalState] = useState<{ show: boolean; item: StoreAsset | null }>({ show: false, item: null });
    const [toast, setToast] = useState<string | null>(null);

    // 멤버 정보 조회를 통해 API 포인트 데이터 반영
    useEffect(() => {
        getMemberInfo()
            .then((res) => {
                if (res.isSuccess && res.result?.point !== undefined) {
                    setUserPoint(res.result.point);
                }
            })
            .catch((err) => console.error("멤버 정보 로딩 실패:", err));
    }, []);

    // 백엔드에서 상점 아이템 로드
    useEffect(() => {
        const fetchStoreAssets = async () => {
            try {
                const response = await getStoreAssets();
                if (response?.isSuccess && Array.isArray(response.result)) {
                    setAssets(response.result);
                }
            } catch (err) {
                console.error("상품 목록 로딩 실패:", err);
            }
        };

        fetchStoreAssets();
    }, []);

    // 상품 상태 재조회
    const reloadStoreAssets = async () => {
        try {
            const response = await getStoreAssets();
            if (response?.isSuccess && Array.isArray(response.result)) {
                setAssets(response.result);
            }
        } catch (err) {
            console.error("상품 재조회 실패:", err);
        }
    };

    const openPurchaseModal = (item: StoreAsset) => {
        setModalState({ show: true, item });
    };

    // 구매 확인 시 백엔드로 POST 요청 및 상태 업데이트
    const confirmPurchase = async () => {
        if (!modalState.item) return;
        const { itemId, itemPrice, itemName } = modalState.item;

        try {
            const response = await purchaseAsset(itemId);
            
            if (response.isSuccess) {
                // 1. 프론트엔드 상태에서 1회 차감 (API 성공 시에만)
                setUserPoint((prev) => prev - itemPrice);
                setModalState({ show: false, item: null });

                setToast(`${itemName}을(를) 구매했습니다!`);
                setTimeout(() => setToast(null), 2000);

                // 2. 상품 소유 정보(owned) 갱신을 위해 목록만 재조회
                reloadStoreAssets();
            }
        } catch (err) {
            console.error("상품 구매 실패:", err);
            setToast("상품 구매에 실패했습니다.");
            setTimeout(() => setToast(null), 2000);
            setModalState({ show: false, item: null });
        }
    };

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-height-[874px] max-height-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white mx-auto">
            
            {/* 상단 헤더 */}
            <div className="pl-8 pr-8 pt-[25px] pb-[16px] flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/mypage")} className="cursor-pointer flex items-center justify-center">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 8.36377C14.5523 8.36377 15 7.91605 15 7.36377C15 6.81148 14.5523 6.36377 14 6.36377V7.36377V8.36377ZM0.292893 6.65666C-0.0976315 7.04719 -0.0976315 7.68035 0.292893 8.07088L6.65685 14.4348C7.04738 14.8254 7.68054 14.8254 8.07107 14.4348C8.46159 14.0443 8.46159 13.4111 8.07107 13.0206L2.41421 7.36377L8.07107 1.70692C8.46159 1.31639 8.46159 0.683226 8.07107 0.292702C7.68054 -0.0978227 7.04738 -0.0978227 6.65685 0.292702L0.292893 6.65666ZM14 7.36377V6.36377L1 6.36377V7.36377V8.36377L14 8.36377V7.36377Z" fill="#1A1A1A"/>
                        </svg>
                    </button>
                    <h1 className="text-[16px] font-bold leading-none text-[#1A1A1A]">포인트 / 상점</h1>
                </div>
                
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center justify-center">
                        <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.5 16.25C25.961 16.25 32.5 14.0173 32.5 9.75C32.5 5.48275 25.961 3.25 19.5 3.25C13.039 3.25 6.5 5.48275 6.5 9.75C6.5 14.0173 13.039 16.25 19.5 16.25Z" fill="#9996FF"/>
                            <path d="M6.26782 16.4819C6.26782 20.7492 12.8068 22.9819 19.2678 22.9819C25.7288 22.9819 32.2678 20.7492 32.2678 16.4819V13.2319C32.2678 17.4992 25.7288 19.7319 19.2678 19.7319C12.8068 19.7319 6.26782 17.4992 6.26782 13.2319V16.4819Z" fill="#9996FF"/>
                            <path d="M6.26782 22.9819C6.26782 27.2492 12.8068 29.4819 19.2678 29.4819C25.7288 29.4819 32.2678 27.2492 32.2678 22.9819V19.7319C32.2678 23.9992 25.7288 26.2319 19.2678 26.2319C12.8068 26.2319 6.26782 23.9992 6.26782 19.7319V22.9819Z" fill="#9996FF"/>
                        </svg>
                    </div>
                    <span className="text-[#9996FF] font-bold text-[16px]">{userPoint.toLocaleString()} p</span>
                </div>
            </div>

            {/* 상단 탭 메뉴 */}
            <Tab 
                activeTab="first"
                firstLabel="상점"
                firstPath="/store"
                secondLabel="포인트 안내"
                secondPath="/mypage/point"
            />

            {/* 메인 스크롤 영역 */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto vertical-scroll pl-[17px] space-y-5 pt-1.5 pb-[90px]">
                
                {/* 상점 안내 */}
                <div className="w-[369px] h-[90px] bg-[#F0F0FF] rounded-[40px] p-5 pl-7 flex flex-col gap-1.5">
                    <span className="text-[#9996FF] font-bold text-[14px]">상점 안내</span>
                    <span className="text-[#1A1A1A] text-[12px] font-medium leading-relaxed">
                        • 포인트로 캐릭터 아이템을 구매하여 나만의 캐릭터를 꾸며보세요!
                    </span>
                </div>

                {/* 상품 리스트 */}
                <div className="grid grid-cols-2 gap-x-0 gap-y-2 pr-1">
                    {assets.map((item) => {
                        const isSelected = selectedItemId === item.itemId;
                        const isPurchased = item.owned;
                        const isAffordable = userPoint >= item.itemPrice;

                        return (
                            <div 
                                key={item.itemId}
                                onClick={() => setSelectedItemId(item.itemId)}
                                className={`border rounded-[30px] pt-2 pb-4 flex flex-col items-center justify-between w-[176px] min-h-[200px] cursor-pointer transition-all ${
                                    isPurchased ? "bg-[#F0F0FF]" : "bg-white"
                                } ${
                                    isSelected ? "border-[#9996FF] border-[2px]" : "border-[#CCCCCC]"
                                }`}
                            >
                                {/* 이미지 구역 */}
                                <div className="w-full h-[90px] flex items-center justify-center relative">
                                    <img 
                                        src={imageMap[item.itemName]}
                                        alt={item.itemName} 
                                        className={`${widthMap[item.itemName] || "w-[66px]"} h-auto max-h-full object-contain`}
                                    />
                                </div>

                                {/* 아이템 정보 */}
                                <div className="text-center flex flex-col gap-0.5">
                                    <span className="font-bold text-[14px] text-[#1A1A1A] pt-2">{item.itemName}</span>
                                    <span className="text-[12px] text-[#7F7F7F]">
                                        {categoryNameMap[item.itemCategory] || "의상"}
                                    </span>
                                </div>

                                {/* 구매 버튼 */}
                                <button
                                    disabled={!isAffordable || isPurchased}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openPurchaseModal(item);
                                    }}
                                    className={`w-[114px] h-[40px] mt-2 rounded-[40px] text-[12px] transition-colors ${
                                        isPurchased
                                            ? "bg-[#9996FF] text-white !font-semibold cursor-default"
                                            : !isAffordable
                                            ? "bg-[#B3B3B3] text-white cursor-not-allowed"
                                            : isSelected 
                                            ? "bg-[#9996FF] text-white !font-semibold" 
                                            : "bg-[#F0F0FF] text-[#1A1A1A] border-[1px] border-[#9996FF]"
                                    }`}
                                >
                                    {isPurchased ? "보유중" : `${item.itemPrice}p 구매`}
                                </button>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* 하단 공통 네비게이션 */}
            <BottomNav />

            {/* 팝업 */}
            {modalState.show && modalState.item && (
                <ConfirmModal
                    message="아이템을 구매하시겠어요?"
                    subMessage={`${modalState.item.itemName}을(를) ${modalState.item.itemPrice}P에 구매합니다.`}
                    onConfirm={confirmPurchase}
                    onCancel={() => setModalState({ show: false, item: null })}
                />
            )}

            {/* 토스트 출력 */}
            {toast && <Toast message={toast} />}
        </div>
    );
}