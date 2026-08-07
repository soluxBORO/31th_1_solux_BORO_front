import { ArrowLeft, Share2, Clock, MessageCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getEmptySpotDetail } from "../../api/emptySpot"
import type { EmptySpotDetailResponse } from "../../types/emptySpot"

import { createChatRoom } from "../../api/chat"
import type { ChatRoom } from "../../types/chat"

export default function SpotDetailPage() {
  const navigate = useNavigate()
  const { spotId } = useParams()

  const [spot, setSpot] = useState<EmptySpotDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 공유하기 버튼 클릭 시
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert("링크가 복사되었습니다!")
    } catch (err) {
      console.error("링크 복사 실패:", err)
      alert("링크 복사에 실패했어요.")
    }
  }
  //API 호출하여 빈자리 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchSpotDetail = async () => {
      if (!spotId) return
      setIsLoading(true)
      try {
        const res = await getEmptySpotDetail(spotId)
        setSpot((res.data as any).result)
      } catch (err) {
        console.error("빈자리 상세 조회 실패:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSpotDetail()
  }, [spotId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-[#7F7F7F]">불러오는 중...</p>
      </div>
    )
  }

  if (!spot) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-[#7F7F7F]">게시글을 찾을 수 없어요</p>
      </div>
    )
  }



  {/* 경민: 채팅하기 버튼과 채팅방 생성 연결을 위한 코드 (나중에 이 주석 삭제하기) */}
  const handleStartChat = async () => {
    if (!spotId || !spot) return;

    try {
      // POST /api/v1/chat/{postId} 호출
      const requestData: ChatRoom = {
        chatRoomType: "EMPTY_SPOT",
      };

      const response = await createChatRoom(spot.postId, requestData);

      if (response.isSuccess && response.result) {
        const createdRoomId = response.result.chatRoomId;

        navigate(`/chat/${createdRoomId}`, {
          state: {
            ownerNickname: spot.authorNickname,
            title: spot.location + " " + spot.floor + "층 " + spot.seatNumber,
          },
        });
      } else {
        alert(response.message || "채팅방 생성에 실패했습니다.");
      }
    } catch (err) {
      console.error("채팅방 생성 중 오류 발생:", err);
      alert("채팅방을 생성할 수 없습니다.");
    }
  };


  return (
    /* 1. 최상단 컨테이너: relative와 flex-col, overflow-hidden 적용 */
    <div className="relative flex flex-col h-full bg-white overflow-hidden">
      
      {/* 2. 스크롤 가능한 콘텐츠 영역 (flex-1 & overflow-y-auto) */}
      <div className="flex-1 overflow-y-auto vertical-scroll pb-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} className="text-[#1A1A1A]" />
          </button>
          <button onClick={handleShare}>
            <Share2 size={20} className="text-[#1A1A1A]" />
          </button>
        </div>

        {/* 상세 정보 카드 */}
        <div className="px-4 mb-5">
          <div className="w-92.5 min-h-105.25 border border-[#9996FF] rounded-[40px] px-6 pt-5 pb-5">
            {/* 작성자 */}
            <div className="flex items-center gap-3 mb-5 my-4">
              <div className="w-11.25 h-11.25 bg-linear-to-br from-[#3A3A5C] to-[#1A1A2E] rounded-full flex-shrink-0" />
              <span
                className="text-[16px] text-[#1A1A1A]"
                style={{ fontFamily: "Pretendard", fontWeight: 700, lineHeight: "1.2" }}
              >
                {spot.authorNickname}
              </span>
            </div>

            {/* 상태 뱃지 */}
            <div className="flex gap-2 mb-4">
              <span className="text-[13px] bg-[#E9F5EE] text-[#1A1A1A] px-3 py-1.5 rounded-full">
                {spot.status === "ACTIVE"
                  ? "대여가능"
                  : spot.status === "RENTED"
                  ? "대여중"
                  : spot.status === "COMPLETED"
                  ? "대여완료"
                  : "삭제됨"}
              </span>
              <span className="text-[13px] bg-[#E9E8FF] text-[#1A1A1A] px-3 py-1.5 rounded-full">
                빈자리
              </span>
            </div>

            {/* 제목 */}
            <p className="text-[18px] font-bold text-[#1A1A1A] px-1 mb-3">
              {spot.location} {spot.floor}층 {spot.seatNumber}
            </p>

            {/* 위치 */}
            <div className="flex items-center gap-2 mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path
                  d="M12 2C7.58 2 4 5.58 4 10C4 16 12 22 12 22C12 22 20 16 20 10C20 5.58 16.42 2 12 2Z"
                  fill="#43A860"
                />
                <circle cx="12" cy="10" r="4" fill="white" />
              </svg>
              <span
                className="text-[14px] text-[#43A860]"
                style={{ fontFamily: "Pretendard", fontWeight: 500, lineHeight: "1.2" }}
              >
                {spot.location}
              </span>
            </div>

            {/* 세부 정보 */}
            <div
              className="text-[14px] text-[#7F7F7F] space-y-1 mb-4 mx-7.5"
              style={{ fontFamily: "Pretendard", fontWeight: 400, lineHeight: "1.2" }}
            >
              <p>층 : {spot.floor}</p>
              <p>창가 여부 : {spot.hasWindowSeat ? "O" : "X"}</p>
              <p>콘센트 여부 : {spot.hasPowerOutlet ? "O" : "X"}</p>
            </div>

            {/* 퇴실 예정 시간 */}
            <div className="flex items-center gap-2 mb-3 mx-0.5">
              <Clock size={18} style={{ color: "#7F7F7F" }} />
              <span
                style={{
                  fontFamily: "Pretendard",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#FF5E00",
                }}
              >
                {(() => {
                  const diffMinutes = Math.round(
                    (new Date(spot.expectedCheckoutTime).getTime() - new Date().getTime()) / (1000 * 60)
                  )
                  return diffMinutes > 0 ? `${diffMinutes}분 후` : "곧 퇴실"
                })()}
              </span>
            </div>

            {/* 등록 일시 */}
            <div className="flex items-center gap-2 mb-6 mx-7">
              <span className="text-[12px] text-[#7F7F7F]">
                {new Date(spot.createdAt).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>

            {/* 대여 비용 */}
            <div
              className="w-88 h-17 flex items-center justify-between px-4 -mx-2 mb-4"
              style={{ background: "linear-gradient(90deg, #FFFFFF 0%, #E4E4FF 100%)" }}
            >
              <span
                className="text-[16px] text-[#1A1A1A]"
                style={{ fontFamily: "Pretendard", fontWeight: 700 }}
              >
                대여 비용
              </span>
              <span
                className="text-[16px] text-[#1A1A1A]"
                style={{ fontFamily: "Pretendard", fontWeight: 700 }}
              >
                무료
              </span>
            </div>
          </div>
        </div>

        {/* 거래 안내 */}
        <div className="px-4 mb-6">
          <div className="w-92.5 min-h-42.75 bg-[#F0F0FF] rounded-[40px] px-5 py-5">
            <div className="flex items-center px-4 gap-4 mb-3">
              <svg
                width="20"
                height="23"
                viewBox="0 0 20 23"
                fill="none"
                className="shrink-0"
                style={{ transform: "scaleX(1.2)" }}
              >
                <path
                  d="M10 0L18 3V10C18 15.5 14.5 20.5 10 23C5.5 20.5 2 15.5 2 10V3L10 0Z"
                  fill="#9996FF"
                />
                <path
                  d="M7 11.5L9 13.5L13 9"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="text-[14px] text-[#9996FF]"
                style={{ fontFamily: "Pretendard", fontWeight: 700, lineHeight: "1.2" }}
              >
                거래 안내
              </span>
            </div>
            <ul
              className="text-[12px] text-[#000000] space-y-1 px-5 pt-2"
              style={{ fontFamily: "Pretendard", fontWeight: 500, lineHeight: "1.2" }}
            >
              <li className="w-70.75">• 보증금은 물품 가격의 30-50% 정도를 권장합니다</li>
              <li className="w-70.75">• 계좌 송금 또는 대면 직거래를 이용해주세요</li>
              <li className="w-70.75">• 반납 시 물품 상태를 확인해주세요</li>
              <li className="w-70.75">• 분실 또는 파손 시 보증금으로 처리됩니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. 하단 고정 채팅하기 바 (fixed 대신 flex-shrink-0 및 w-full 적용) */}
      <div className="w-full h-[61px] bg-white flex items-center justify-center shrink-0 border-t border-[#B3B3B3] z-20">
        <button
          onClick={handleStartChat}
          className="flex items-center justify-center gap-2 w-[304px] h-[40px] rounded-[35.9px] bg-[#D3D3FF]"
        >
          <MessageCircle size={19} strokeWidth={1.5} style={{ height: "18px" }} className="text-[#1A1A1A]" />
          <span
            className="text-[14px] text-[#1A1A1A]"
            style={{ fontFamily: "Pretendard", fontWeight: 400 }}
          >
            채팅하기
          </span>
        </button>
      </div>
    </div>
  )
}