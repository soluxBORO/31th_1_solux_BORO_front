import { ChevronRight, Clock, Star, Heart, ShoppingCart, UserCog, Settings, LogOut, AlertCircle } from "lucide-react"
import BottomNav from "../../components/BottomNav"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { isAxiosError } from "axios"

import { getMemberAssets, getMemberInfo, logoutMember, withdrawMember } from "../../api/member-gm"
import type { MemberAsset, MemberInfo } from "../../types/member-gm"


{/* 눈송이 꾸미기 */}
// 눈송이 관련 이미지 및 에셋 Import
import baseNoonsong from "../../assets/noonsong.png"
import bagImg from "../../assets/bag.png"
import coffeeImg from "../../assets/coffee.png"
import glassesImg from "../../assets/glasses.png"
import hatImg from "../../assets/hat.png"
import headsetImg from "../../assets/headset.png"
import hoodieImg from "../../assets/hoodie.png"
import maskImg from "../../assets/mask.png"
import princessSongImg from "../../assets/princess_song.png"
import suitSongImg from "../../assets/suit_song.png"
import suitImg from "../../assets/suit.png"

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
}

// 2. 아이템 오버레이 좌표
const positionMap: Record<string, React.CSSProperties> = {
  "후드티": { top: "71.5%", left: "52%", transform: "translate(-50%, -50%)", width: "46px", zIndex: 5 },
  "정장": { top: "72%", left: "52%", transform: "translate(-50%, -50%)", width: "46px", zIndex: 10 },
  "헤드셋": { top: "36%", left: "50%", transform: "translate(-50%, -50%)", width: "70px", zIndex: 20 },
  "모자": { top: "27%", left: "48%", transform: "translate(-50%, -50%)", width: "58px", zIndex: 15 },
  "안경": { top: "46.5%", left: "48%", transform: "translate(-50%, -50%)", width: "40px", zIndex: 30 },
  "가방": { top: "72%", left: "68%", transform: "translate(-50%, -50%)", width: "16px", zIndex: 15 },
  "마스크": { top: "53%", left: "49%", transform: "translate(-50%, -50%)", width: "41px", zIndex: 30 },
  "커피": { top: "72.5%", left: "18%", transform: "translate(-50%, -50%) rotate(-20deg)", width: "12px", zIndex: 25 },
}

// 이메일 마스킹 함수 (예: example@sookmyung.ac.kr -> ex*****@sookmyung.ac.kr)
const maskEmail = (email?: string) => {
  if (!email || !email.includes("@")) return email ?? "";
  
  const [localPart, domain] = email.split("@");
  
  if (localPart.length <= 2) {
    return `${localPart}*@${domain}`;
  }
  
  const visible = localPart.slice(0, 2);
  const masked = "*".repeat(localPart.length - 2);
  
  return `${visible}${masked}@${domain}`;
};


export default function MyPage() {
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const location = useLocation()
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null)

  useEffect(() => {
    getMemberInfo()
      .then((res) => {
        if (res.isSuccess) {
          setMemberInfo(res.result)
        }
      })
      .catch((err) => {
        console.error("멤버 정보 조회 실패:", err)
      })
  }, [])

  const user = {
    name: memberInfo?.name,
    nickname: memberInfo?.nickname,
    isVerified: true,
    universityInfo: `숙명여대 ${String(memberInfo?.studentNumber)?.slice(0, 2)}학번 / 재학생`,
    departmentInfo: maskEmail(memberInfo?.email),
    points: memberInfo?.point !== undefined ? memberInfo.point.toLocaleString() : "0",
  }

  const menuItems = [
    { icon: Clock, label: "거래 내역", path: "/mypage/history" },
    { icon: Star, label: "후기", path: "/mypage/review" },
    { icon: Heart, label: "찜한 게시물 보기", path: "/mypage/liked" },
    { icon: ShoppingCart, label: "포인트 / 상점", path: "/mypage/store" },
    { icon: UserCog, label: "프로필 수정", path: "/mypage/edit" },
    { icon: Settings, label: "탈퇴하기", path: "withdraw" },
  ]

  // 경로 이동 핸들러
  const handleMenuClick = (path: string) => {
    if (path === "withdraw") {
      setShowWithdrawModal(true)
    } else if (path) {
      navigate(path)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutMember();
    } catch (err) {
      console.error("로그아웃 요청 실패:", err);
    } finally {
      localStorage.removeItem("accessToken"); 
      setShowLogoutModal(false);
      navigate("/login");
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await withdrawMember();
      
      if (res.isSuccess) {
        localStorage.removeItem("accessToken");
        setShowWithdrawModal(false);
        navigate("/login");
      } else {
        alert(res.message || "회원 탈퇴 처리 중 오류가 발생했습니다.");
        setShowWithdrawModal(false);
      }
    } catch (err) {
      console.error("탈퇴 요청 실패:", err);
      
      let errorMessage = "회원 탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

      if (isAxiosError(err)) {
        const backendMsg = err.response?.data?.message;
        
        if (backendMsg && !backendMsg.includes("foreign key constraint") && !backendMsg.includes("could not execute statement")) {
          errorMessage = backendMsg;
        } else {
          errorMessage = "진행 중인 거래가 존재하여 탈퇴할 수 없습니다.";
        }
      }
      
      alert(errorMessage);
      setShowWithdrawModal(false);
    }
  };

  {/* 눈송이 꾸미기 */}
  // 착용중인 아이템 상태 관리
  const [equippedItems, setEquippedItems] = useState<string[]>(() => {
    // 1. 뒤로가기(navigate)로 전달받은 state가 있는 경우 우선 적용
    if (location.state && (location.state as { equippedItems?: string[] }).equippedItems) {
      return (location.state as { equippedItems: string[] }).equippedItems
    }
    // 2. localStorage에서 캐시된 데이터 조회
    const saved = localStorage.getItem("equippedItems")
    return saved ? JSON.parse(saved) : []
  })

  // 백엔드 API 연동: 마이페이지 진입 시 서버에서 착용 중인 아이템 목록 동기화
  useEffect(() => {
    getMemberAssets()
      .then((res) => {
        if (res.isSuccess && Array.isArray(res.result)) {
          const equippedNames = res.result
            .filter((asset: MemberAsset) => asset.equipped)
            .map((asset: MemberAsset) => asset.itemName)

          setEquippedItems(equippedNames)
          localStorage.setItem("equippedItems", JSON.stringify(equippedNames))
        }
      })
      .catch((err) => {
        console.error("마이페이지 장착 아이템 조회 실패:", err)
      })
  }, [])

  // 풀세트 아이템 판별
  const isFullSetItem = (name: string) => name === "프린세스 송이" || name === "정장 송이"
  const activeFullSet = equippedItems.find(isFullSetItem)


  return (
    <div className="flex flex-col h-full overflow-y-auto vertical-scroll bg-white pb-24">      {/* 헤더: 마이페이지 (font 24 bold) */}
      <div className="px-[30px] pt-[30px] pb-3">
        <span
          className="text-[24px] text-[#1A1A1A]"
          style={{ fontFamily: "Pretendard", fontWeight: 700, lineHeight: "1.2" }}
        >
          마이페이지
        </span>
      </div>

      {/* 프로필 영역 */}
      <div className="flex items-center gap-[25px] px-[42px] mt-4 mb-6">
        {/* 원형 배경 105x105 */}
        <div className="w-[105px] h-[105px] bg-[#E6E6E6] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {memberInfo?.profileUrl ? (
            <img
              src={memberInfo.profileUrl}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
              onError={(e) => {
                // 이미지 로딩 실패 시 기본 처리 (예: 이미지 숨기기)
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            /* 기본 SVG 아이콘 */
            <svg width="37" height="37" viewBox="0 0 37 37" fill="none">
              <circle cx="18.5" cy="10" r="6.5" stroke="#7F7F7F" strokeWidth="2.5" />
              <path
                d="M6 32C6 24.5 11 20 18.5 20C26 20 31 24.5 31 32"
                stroke="#7F7F7F"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          {/* 이름/닉네임 + 인증완료 뱃지 */}
          <div className="flex items-center gap-4">
            <span
              className="text-[16px] text-[#1A1A1A]"
              style={{ fontFamily: "Pretendard", fontWeight: 700, lineHeight: "1.2" }}
            >
              {user.name} / {user.nickname}
            </span>
            {user.isVerified && (
              <span
                className="flex items-center justify-center"
                style={{
                  width: "69px",
                  height: "30px",
                  borderRadius: "40px",
                  backgroundColor: "#F0F0FF",
                }}
              >
                <span
                  style={{
                    fontFamily: "Pretendard",
                    fontWeight: 500,
                    fontSize: "12px",
                    lineHeight: "1",
                    color: "#8C86FF",
                  }}
                >
                  인증완료
                </span>
              </span>
            )}
          </div>

          {/* 학교/학번 정보 */}
          <span
            className="text-[13px] text-[#1A1A1A] mt-2"
            style={{ fontFamily: "Pretendard", fontWeight: 400, lineHeight: "1.2" }}
          >
            {user.universityInfo}
          </span>
          <span
            className="text-[13px] text-[#1A1A1A]"
            style={{ fontFamily: "Pretendard", fontWeight: 400, lineHeight: "1.2" }}
          >
            {user.departmentInfo}
          </span>
        </div>
      </div>

      {/* 캐릭터 꾸미기 카드 (370x180, radius 40, 그라데이션) */}
      <div className="px-4 mb-4 flex justify-center">
        <div
          className="flex flex-col items-center px-5"
          style={{
            width: "370px",
            height: "180px",
            borderRadius: "40px",
            background: "linear-gradient(180deg, rgba(153, 150, 255, 0.2) 0%, rgba(228, 228, 255, 0.2) 100%)",
            paddingTop: "16px",
          }}
        >
          <div className="w-full flex justify-between items-center mb-1">
            <span
              style={{
                width: "45px",
                height: "19px",
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "1.2",
                color: "#1A1A1A",
                marginTop: "8px",
                marginLeft: "12px",
              }}
            >
              {user.nickname}
            </span>
            <button
              onClick={() => navigate("/mypage/noonsong", { state: { nickname: user.nickname, point: memberInfo?.point } })}
              className="text-[15px] text-[#8E8E93] flex items-center gap-0.5"
              style={{ width: "80px", marginTop: "8px" }}
            >
              꾸미기
              <ChevronRight size={22} strokeWidth={3} className="flex-shrink-0" style={{ width: "22px", height: "22px" }} />
            </button>
          </div>

          {/* 캐릭터 프리뷰 영역 */}
          <div className="w-[150px] h-[120px] my-[-15px] flex items-center justify-center overflow-hidden">
            {activeFullSet ? (
              /* 풀세트 캐릭터 */
              <img
                src={imageMap[activeFullSet]}
                alt={activeFullSet}
                className="w-[88px] h-[110px] object-contain"
              />
            ) : (
              /* 기본 눈송이 기준 1:1 오버레이 래퍼 */
              <div className="relative w-[88px] h-[110px] flex items-center justify-center">
                {/* 기본 눈송이 */}
                <img
                  src={baseNoonsong}
                  alt="기본 눈송이"
                  className="w-full h-full object-contain absolute inset-0 z-0"
                />

                {/* 장착 아이템 */}
                {equippedItems.map((itemName) => {
                  const overlayImg = imageMap[itemName]
                  const posStyle = positionMap[itemName]

                  if (!overlayImg) return null

                  return (
                    <img
                      key={itemName}
                      src={overlayImg}
                      alt={itemName}
                      style={posStyle}
                      className="absolute object-contain pointer-events-none"
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 포인트 카드 (370x59, radius 40) */}
      <div className="px-4 mb-4 flex justify-center">
        <div
          className="flex items-center justify-between px-5"
          style={{
            width: "370px",
            height: "59px",
            borderRadius: "40px",
            backgroundColor: "#F2F0FF",
          }}
        >
          {/* 좌측: 아이콘 + 포인트 글자 */}
          <div className="flex items-center gap-2.5">
            <svg width="28" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2.5 6C2.5 3.79 6.75 2 12 2C17.25 2 21.5 3.79 21.5 6V8.5C21.5 10.71 17.25 12.5 12 12.5C6.75 12.5 2.5 10.71 2.5 8.5V6Z"
                fill="#9996FF"
              />
              <path
                d="M2.5 10.8C2.5 12.6 6.75 14.2 12 14.2C17.25 14.2 21.5 12.6 21.5 10.8V13.2C21.5 15.4 17.25 17 12 17C6.75 17 2.5 15.4 2.5 13.2V10.8Z"
                fill="#9996FF"
              />
              <path
                d="M2.5 15.3C2.5 17.1 6.75 18.7 12 18.7C17.25 18.7 21.5 17.1 21.5 15.3V17.7C21.5 19.9 17.25 21.5 12 21.5C6.75 21.5 2.5 19.9 2.5 17.7V15.3Z"
                fill="#9996FF"
              />
            </svg>
            <span
              style={{
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "1",
                color: "#1A1A1A",
              }}
            >
              포인트
            </span>
          </div>

          {/* 우측: 포인트 금액 + 충전 버튼 */}
          <div className="flex items-center gap-4">
            <span
              className="text-[16px] text-[#1A1A1A]"
              style={{ fontFamily: "Pretendard", fontWeight: 800 }}
            >
              {user.points} p
            </span>
            <button
              onClick={() => handleMenuClick("/mypage/point")}
              className="bg-[#9996FF] text-white text-[13px] font-medium px-4 py-1.5 rounded-full"
            >
              충전
            </button>
          </div>
        </div>
      </div>

      {/* 내 대여 기록 카드 (370x58, radius 40, border 1px solid #CCCCCC) */}
      <div className="px-4 mb-6 flex justify-center">
        <div
          className="flex items-center justify-between px-6 bg-white"
          style={{
            width: "370px",
            height: "58px",
            borderRadius: "40px",
            border: "1px solid #CCCCCC",
          }}
        >
          {/* 좌측: 내 대여 기록 + 화살표 */}
          <button
            onClick={() => navigate("/mypage/my-posts")}
            className="flex items-center gap-1"
          >
            <span
              style={{
                fontFamily: "Pretendard",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "100%",
                color: "#1A1A1A",
              }}
            >
              내가 작성한 게시글
            </span>
            <ChevronRight
              size={26}
              strokeWidth={2.5}
              style={{
                color: "#7F7F7F",
                marginLeft: "-2px",
                marginTop: "3px",
              }}
            />
          </button>

          {/* 우측: 새 게시글 작성 */}
          <button
            onClick={() => navigate("/post/create")}
            style={{
              fontFamily: "Pretendard",
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "100%",
              color: "#9996FF",
            }}
          >
            새 게시글 작성
          </button>
        </div>
      </div>

      {/* 메뉴 리스트 카드 (370x343, radius 40, border 1px solid #CCCCCC) */}
      <div className="px-4 mb-6 flex justify-center">
        <div
          className="flex flex-col justify-between bg-white py-3 px-3"
          style={{
            width: "370px",
            height: "343px",
            borderRadius: "40px",
            border: "1px solid #CCCCCC",
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item.path)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-[20px] transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-5">
                <item.icon size={20} strokeWidth={1.5} className="text-[#1A1A1A]" />
                <span
                  style={{
                    fontFamily: "Pretendard",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "100%",
                    color: "#1A1A1A",
                  }}
                >
                  {item.label}
                </span>
              </div>
              <ChevronRight size={18} strokeWidth={1.5} className="text-[#7F7F7F]" />
            </button>
          ))}
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="px-4 mb-40">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full h-[48px] rounded-[40px] border border-[#9996FF] bg-white flex items-center justify-center gap-2 text-[#9996FF] text-[14px]"
          style={{ fontFamily: "Pretendard", fontWeight: 500 }}
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>

      {/* 로그아웃 모달 */}
      {showLogoutModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 pr-3">
          <div
            className="bg-white flex flex-col items-center"
            style={{
              width: "350px",
              borderRadius: "40px",
              paddingTop: "24px",
              paddingBottom: "20px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            {/* 느낌표 아이콘 영역 */}
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#FFDBC8",
                borderRadius: "50%",
                marginBottom: "14px",
              }}
            >
              <AlertCircle style={{ width: "24px", height: "24px" }} className="text-[#FF5E00]" strokeWidth={2.2} />
            </div>

            <p
              className="text-[#1A1A1A] text-center"
              style={{ fontFamily: "Pretendard", fontWeight: 700, fontSize: "19px", marginBottom: "20px" }}
            >
              로그아웃 하시겠어요?
            </p>

            <p
              className="text-[#8E8E93] text-center whitespace-nowrap"
              style={{ fontSize: "12.5px", marginBottom: "30px" }}
            >
              로그아웃 후 다시 로그인해야 서비스를 이용할 수 있습니다.
            </p>

            <div className="flex justify-center gap-3 w-full mb-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-[128px] h-[44px] rounded-[40px] border border-[#A0A0A0] bg-white font-semibold text-[14px] text-[#1A1A1A]"
              >
                취소
              </button>
              <button
                onClick={handleLogout}
                className="w-[128px] h-[44px] rounded-[40px] bg-[#9996FF] font-semibold text-[14px] text-white"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 탈퇴 모달 */}
      {showWithdrawModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 pr-3">
          <div
            className="bg-white flex flex-col items-center"
            style={{
              width: "350px",
              borderRadius: "40px",
              paddingTop: "24px",
              paddingBottom: "20px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            {/* 느낌표 아이콘 영역 */}
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#FFDBC8",
                borderRadius: "50%",
                marginBottom: "14px",
              }}
            >
              <AlertCircle style={{ width: "24px", height: "24px" }} className="text-[#FF5E00]" strokeWidth={2.2} />
            </div>

            <p
              className="text-[#1A1A1A] text-center"
              style={{ fontFamily: "Pretendard", fontWeight: 700, fontSize: "19px", marginBottom: "20px" }}
            >
              서비스를 탈퇴하시겠어요?
            </p>

            <p
              className="text-[#8E8E93] text-center whitespace-normal break-words"
              style={{ fontSize: "12.5px", marginBottom: "30px" }}
            >
              탈퇴가 완료되면, 기존의 데이터나 로그는 되돌릴 수 없습니다.
              <br />
              그래도 탈퇴하시겠습니까?
            </p>

            <div className="flex justify-center gap-3 w-full mb-2">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-[128px] h-[44px] rounded-[40px] border border-[#A0A0A0] bg-white font-semibold text-[14px] text-[#1A1A1A]"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                className="w-[128px] h-[44px] rounded-[40px] bg-[#FF5E00] font-semibold text-[14px] text-white"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  )
}