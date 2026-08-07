// 눈송이 꾸미기

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMemberAssets, equipMemberAsset } from "../../api/member-gm";
import type { MemberAsset, ItemCategory } from "../../types/member-gm";
import baseNoonsong from "../../assets/noonsong.png";

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

// UI 표시용 확장 아이템 타입
interface DisplayItem {
    itemId: number;
    itemName: string;
    itemCategory: ItemCategory;
    isPurchased: boolean; // 보유 여부
}

// 1. 아이템 이름 - 이미지 매칭
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

// 2. 아이템 오버레이 세부 위치 및 크기 조정 객체
const positionMap: Record<string, React.CSSProperties> = {
    "후드티": { top: "66.5%", left: "51%", transform: "translate(-50%, -50%)", width: "100px", zIndex: 5 },
    "정장": { top: "66.5%", left: "51%", transform: "translate(-50%, -50%)", width: "99.8px", zIndex: 10 },
    "헤드셋": { top: "39%", left: "50%", transform: "translate(-50%, -50%)", width: "152px", zIndex: 20 },
    "모자": { top: "33%", left: "50%", transform: "translate(-50%, -50%)", width: "126px", zIndex: 15 },
    "안경": { top: "47%", left: "49%", transform: "translate(-50%, -50%)", width: "86px", zIndex: 30 },
    "가방": { top: "67%", left: "60%", transform: "translate(-50%, -50%)", width: "34px", zIndex: 15 },
    "마스크": { top: "53%", left: "50%", transform: "translate(-50%, -50%)", width: "89px", zIndex: 30 },
    "커피": { top: "65%", left: "35%", transform: "translate(-50%, -50%) rotate(-20deg)", width: "25px", zIndex: 25 },
};

// 3. 전체 아이템 정적 데이터 (기본 의상은 항상 보유중=true)
const INITIAL_ITEMS: DisplayItem[] = [
    // 의상 (CLOTHING)
    { itemId: 0, itemName: "기본 의상", itemCategory: "CLOTHING", isPurchased: true },
    { itemId: -1, itemName: "후드티", itemCategory: "CLOTHING", isPurchased: false },
    { itemId: -2, itemName: "정장", itemCategory: "CLOTHING", isPurchased: false },
    { itemId: -3, itemName: "프린세스 송이", itemCategory: "CLOTHING", isPurchased: false },
    { itemId: -4, itemName: "정장 송이", itemCategory: "CLOTHING", isPurchased: false },
    
    // 악세사리 (ACCESSORY)
    { itemId: -5, itemName: "헤드셋", itemCategory: "ACCESSORY", isPurchased: false },
    { itemId: -6, itemName: "모자", itemCategory: "ACCESSORY", isPurchased: false },
    { itemId: -7, itemName: "안경", itemCategory: "ACCESSORY", isPurchased: false },
    { itemId: -8, itemName: "가방", itemCategory: "ACCESSORY", isPurchased: false },
    
    // 기타 (ETC)
    { itemId: -9, itemName: "마스크", itemCategory: "ETC", isPurchased: false },
    { itemId: -10, itemName: "커피", itemCategory: "ETC", isPurchased: false },
];

export default function NoonsongDecoPage() {
    const navigate = useNavigate();
    const location = useLocation()

    const userPoint = (location.state as { point?: number })?.point ?? 0;
    const nickname = (location.state as { nickname?: string })?.nickname || "눈송이"

    // 하드코딩된 목록을 초기값으로 설정하여 화면이 텅 비는 것 방지
    const [itemList, setItemList] = useState<DisplayItem[]>(INITIAL_ITEMS);
    
    // 초기 선택값을 localStorage에서 가져오고, 없으면 [""] 기본값 적용
    const [selectedItemNames, setSelectedItemNames] = useState<string[]>(() => {
        const saved = localStorage.getItem("equippedItems");
        return saved ? JSON.parse(saved) : [""];
    });

    // 선택된 아이템 변경 시 localStorage에 저장
    useEffect(() => {
        localStorage.setItem("equippedItems", JSON.stringify(selectedItemNames));
    }, [selectedItemNames]);

    // API 통신: 보유한 아이템 목록을 받아와 isPurchased 및 실제 itemId만 동기화
    useEffect(() => {
        getMemberAssets()
            .then((res) => {
                if (res.isSuccess && Array.isArray(res.result)) {
                    const ownedAssets: MemberAsset[] = res.result;

                    setItemList((prevList) =>
                        prevList.map((item) => {
                            if (item.itemName === "기본 의상") return item; // 기본 의상은 항상 유지

                            const matchedAsset = ownedAssets.find(
                                (owned) => owned.itemName === item.itemName
                            );

                            if (matchedAsset) {
                                return {
                                    ...item,
                                    itemId: matchedAsset.itemId, // 실제 서버 아이템 ID 저장
                                    isPurchased: true,          // 보유 상태로 변경
                                };
                            }

                            return item;
                        })
                    );
                }
            })
            .catch((err) => {
                console.error("보유 아이템 조회 실패:", err);
            });
    }, []);

    // 카테고리별 필터링
    const clothesItems = itemList.filter((item) => item.itemCategory === "CLOTHING");
    const accessoryItems = itemList.filter((item) => item.itemCategory === "ACCESSORY");
    const etcItems = itemList.filter((item) => item.itemCategory === "ETC");

    // 풀세트 캐릭터 검사 헬퍼
    const isFullSetItem = (name: string) => name === "프린세스 송이" || name === "정장 송이";

    // 클릭 이벤트
    const handleItemClick = async (item: DisplayItem) => {
        if (!item.isPurchased) return; // 미보유 아이템 클릭 불가

        const isSelected = selectedItemNames.includes(item.itemName);
        const nextEquippedState = !isSelected;

        // 실제 서버에 있는 아이템(itemId > 0)일 경우 장착 PATCH API 호출
        if (item.itemId > 0) {
            try {
                const res = await equipMemberAsset(item.itemId, { equipped: nextEquippedState });
                if (!res.isSuccess) {
                    console.error("아이템 장착 상태 변경 실패:", res.message);
                    return;
                }
            } catch (err) {
                console.error("아이템 장착 상태 변경 중 오류 발생:", err);
                return;
            }
        }

        // 기본 의상 선택 시 풀세트 해제
        if (item.itemName === "기본 의상") {
            setSelectedItemNames((prev) => prev.filter((name) => !isFullSetItem(name)));
            return;
        }

        // 프린세스/정장 송이 클릭 시 기존 착용 아이템 전부 해제 후 단독 착용
        if (isFullSetItem(item.itemName)) {
            setSelectedItemNames((prev) =>
                prev.includes(item.itemName) ? [] : [item.itemName]
            );
            return;
        }

        // 일반 아이템 클릭 시 (프린세스/정장 송이가 껴져 있었다면 자동 해제)
        setSelectedItemNames((prev) => {
            const filtered = prev.filter((name) => !isFullSetItem(name));
            return filtered.includes(item.itemName)
                ? filtered.filter((name) => name !== item.itemName)
                : [...filtered, item.itemName];
        });
    };

    // 뒤로가기 / 마이페이지 이동 시 착용 상태 전달
    const handleGoBack = () => {
        navigate("/mypage", { state: { equippedItems: selectedItemNames } });
    };

    // 현재 선택된 풀세트 아이템 이름
    const activeFullSet = selectedItemNames.find(isFullSetItem);

    // 아이템 카드 렌더링
    const renderItemCard = (item: DisplayItem) => {
        const isSelected =
            item.itemName === "기본 의상"
                ? !activeFullSet
                : selectedItemNames.includes(item.itemName);

        const itemImg = imageMap[item.itemName];

        return (
            <button
                key={item.itemName}
                type="button"
                disabled={!item.isPurchased} // 미보유 시 비활성화
                onClick={() => handleItemClick(item)}
                className={`w-[90px] h-[138px] rounded-[10px] bg-white flex flex-col items-center justify-between p-2.5 border transition-all flex-shrink-0 ${
                    !item.isPurchased ? "opacity-90" : "cursor-pointer"
                } ${
                    isSelected
                        ? "border-[#9996FF] border-[2px] !bg-[#F0F0FF]"
                        : "border-[#CCCCCC]"
                }`}
            >
                {/* 아이템 이미지 미리보기 */}
                <div className="w-[60px] h-[55px] flex items-center justify-center relative">
                    {item.itemName === "기본 의상" ? (
                        <img src={baseNoonsong} alt="기본 의상" className="w-[45px] h-[50px] object-contain" />
                    ) : itemImg ? (
                        <img
                            src={itemImg}
                            alt={item.itemName}
                            className={`w-[60px] max-h-[50px] object-contain ${
                                !item.isPurchased ? "opacity-30 grayscale" : ""
                            }`}
                        />
                    ) : (
                        <div className="text-[10px] text-gray-400">이미지 없음</div>
                    )}
                </div>

                {/* 아이템 이름 */}
                <span className="text-[12px] text-[#000000] text-center truncate w-full">
                    {item.itemName}
                </span>

                {/* 보유 / 착용 / 미보유 버튼 */}
                <div
                    className={`w-[73px] h-[34px] rounded-[40px] flex items-center justify-center text-[12px] transition-colors ${
                        !item.isPurchased
                            ? "bg-[#B3B3B3] text-white"
                            : isSelected
                            ? "bg-[#9996FF] text-white font-semibold"
                            : "bg-[#F0F0FF] border border-[#9996FF] text-[#1A1A1A]"
                    }`}
                >
                    {!item.isPurchased ? "미보유" : isSelected ? "착용중" : "보유중"}
                </div>
            </button>
        );
    };

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-h-[874px] max-h-[874px] w-[402px] h-[874px] overflow-hidden flex flex-col bg-white mx-auto border border-gray-200">
            {/* 상단 헤더 */}
            <div className="pl-8 pr-8 pt-[25px] pb-[16px] flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={handleGoBack} className="cursor-pointer flex items-center justify-center">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 8.36377C14.5523 8.36377 15 7.91605 15 7.36377C15 6.81148 14.5523 6.36377 14 6.36377V7.36377V8.36377ZM0.292893 6.65666C-0.0976315 7.04719 -0.0976315 7.68035 0.292893 8.07088L6.65685 14.4348C7.04738 14.8254 7.68054 14.8254 8.07107 14.4348C8.46159 14.0443 8.46159 13.4111 8.07107 13.0206L2.41421 7.36377L8.07107 1.70692C8.46159 1.31639 8.46159 0.683226 8.07107 0.292702C7.68054 -0.0978227 7.04738 -0.0978227 6.65685 0.292702L0.292893 6.65666ZM14 7.36377V6.36377L1 6.36377V7.36377V8.36377L14 8.36377V7.36377Z" fill="#1A1A1A"/>
                        </svg>
                    </button>
                    <h1 className="text-[16px] font-bold leading-none text-[#1A1A1A]">캐릭터 꾸미기</h1>
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

            {/* 스크롤 메인 콘텐츠 */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto px-5 pb-8 space-y-6 vertical-scroll">
                
                {/* 캐릭터 미리보기 영역 */}
                <div className="flex flex-col items-center">
                    {/* 사용자 아이디 */}
                    <h2 className="text-[16px] font-bold text-black mb-3">{nickname}</h2>       {/* 여기! */}

                    <div className="w-[370px] h-[305px] bg-gradient-to-b from-[#9996FF]/30 to-[#E4E4FF]/15 rounded-[40px] relative flex items-center justify-center overflow-hidden">
                        {activeFullSet ? (
                            /* 프린세스 송이 또는 정장 송이 선택 시 baseNoonsong을 완전히 대체 */
                            <img
                                src={imageMap[activeFullSet]}
                                alt={activeFullSet}
                                className="w-[190px] h-[238px] object-contain relative z-0"
                            />
                        ) : (
                            /* 기본 눈송이 + 각 아이템별 독립 오버레이 위치 지정 */
                            <>
                                <img
                                    src={baseNoonsong}
                                    alt="기본 눈송이"
                                    className="w-[190px] h-[238px] object-contain relative z-0"
                                />

                                {selectedItemNames.map((itemName) => {
                                    const overlayImg = imageMap[itemName];
                                    const posStyle = positionMap[itemName];

                                    if (!overlayImg) return null;

                                    return (
                                        <img
                                            key={itemName}
                                            src={overlayImg}
                                            alt={itemName}
                                            style={posStyle}
                                            className="absolute object-contain pointer-events-none"
                                        />
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>

                {/* 의상 박스 */}
                <div className="w-[370px] border border-[#9996FF] rounded-[40px] p-5 pl-6 ml-[-5px] flex flex-col gap-3">
                    <span className="text-[14px] text-black pl-1">의상</span>
                    <div className="flex items-center gap-5 overflow-x-auto pb-1 horizontal-scroll scrollbar-none">
                        {clothesItems.map(renderItemCard)}
                    </div>
                </div>

                {/* 악세사리 박스 */}
                <div className="w-[370px] border border-[#9996FF] rounded-[40px] p-5 pl-6 ml-[-5px] flex flex-col gap-3">
                    <span className="text-[14px] text-black pl-1">악세사리</span>
                    <div className="flex items-center gap-5 overflow-x-auto pb-1 horizontal-scroll scrollbar-none">
                        {accessoryItems.map(renderItemCard)}
                    </div>
                </div>

                {/* 기타 박스 */}
                <div className="w-[370px] border border-[#9996FF] rounded-[40px] p-5 pl-6 ml-[-5px] flex flex-col gap-3">
                    <span className="text-[14px] text-black pl-1">기타</span>
                    <div className="flex items-center gap-5 overflow-x-auto pb-1 horizontal-scroll scrollbar-none">
                        {etcItems.map(renderItemCard)}
                    </div>
                </div>
            </div>
        </div>
    );
}