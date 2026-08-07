import { Clock, Check, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getMemberRentals } from "../../api/member"
import { categoryLabel, priceUnitLabel } from "../../utils/postMapper"
import type { TradeHistoryItem } from "../../types/tradeHistory"
import type { PostCategory, RentalPriceUnit } from "../../types/post"

export default function TradeHistoryPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"all" | "lent">("all")
  const [trades, setTrades] = useState<TradeHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrades = async () => {
      setIsLoading(true)
    try {
        const res = await getMemberRentals(activeTab === "all" ? "ALL" : "PROVIDED")
        console.log("거래내역 전체 응답:", res.data.result)

        const completedOnly = res.data.result.filter((trade) => trade.postStatus === "COMPLETED")
        setTrades(completedOnly)
      } catch (err) {
        console.error("거래내역 조회 실패:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrades()
  }, [activeTab])

  const isSpot = (item: TradeHistoryItem) => !!item.location
  
  const statusColor = (status: string, spot: boolean) => {
    if (spot && status === "COMPLETED") {
        return { backgroundColor: "#FFD4BB", color: "#000000" }
    }
    return { backgroundColor: "#E4E4FF", color: "#000000" }
}

  const statusIcon = (status: string) => {
    if (status === "ACTIVE" || status === "RENTED") return <Clock size={15} className="text-[#8A6D00]" />
    return <Check size={15} className="text-[#1A1A1A]" />
  }

  const statusText = (status: string, spot: boolean) => {
    if (status === "ACTIVE" || status === "RENTED") return "대여중"
    if (spot) return "양도완료"
    return "반납완료"
  }

  return (
    <div className="w-full h-full relative bg-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden vertical-scroll">
        <div className="w-[402px] flex flex-col bg-white pb-10">
          {/* 상단 고정 헤더 */}
          <div className="sticky top-0 bg-white z-30 w-full" style={{ height: "80px" }}>
            <button onClick={() => navigate(-1)} style={{ position: "absolute", top: "35px", left: "30px" }}>
              <ArrowLeft size={20} strokeWidth={2} className="text-black" />
            </button>
            <span
              style={{
                position: "absolute",
                top: "35px",
                left: "60px",
                fontFamily: "Pretendard",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "1.2",
                color: "#1A1A1A",
              }}
            >
              거래 내역
            </span>
          </div>

          {/* 탭바 */}
          <div className="w-full flex justify-center mb-6" style={{ marginTop: "8px" }}>
            <div
              className="relative"
              style={{ width: "359px", height: "44px", borderRadius: "40px", backgroundColor: "#E6E6E6" }}
            >
              <button
                onClick={() => setActiveTab("all")}
                className="absolute flex items-center justify-center"
                style={{
                  top: "5px",
                  left: "10px",
                  width: "172px",
                  height: "34px",
                  fontFamily: "Pretendard",
                  fontWeight: activeTab === "all" ? 700 : 400,
                  fontSize: "14px",
                  lineHeight: "1.2",
                  color: activeTab === "all" ? "#FFFFFF" : "#1A1A1A",
                  borderRadius: "40px",
                  backgroundColor: activeTab === "all" ? "#9996FF" : "transparent",
                }}
              >
                전체
              </button>
              <button
                onClick={() => setActiveTab("lent")}
                className="absolute flex items-center justify-center"
                style={{
                  top: "5px",
                  right: "10px",
                  width: "172px",
                  height: "34px",
                  fontFamily: "Pretendard",
                  fontWeight: activeTab === "lent" ? 700 : 400,
                  fontSize: "14px",
                  lineHeight: "1.2",
                  color: activeTab === "lent" ? "#FFFFFF" : "#1A1A1A",
                  borderRadius: "40px",
                  backgroundColor: activeTab === "lent" ? "#9996FF" : "transparent",
                }}
              >
                대여 제공 목록
              </button>
            </div>
          </div>

          {/* 거래 목록 */}
          <div className="flex flex-col gap-4 px-4">
            {isLoading ? (
              <p className="text-center text-sm text-[#7F7F7F] py-10">불러오는 중...</p>
            ) : trades.length === 0 ? (
              <p className="text-center text-sm text-[#7F7F7F] py-10">거래 내역이 없어요</p>
            ) : (
              trades.map((trade) => {
                const spot = isSpot(trade)
                const colors = statusColor(trade.postStatus, spot)
                console.log("전체 데이터:", trade)
                return (
                  <div
                    key={trade.rentalRequestId}
                    onClick={() => (spot ? navigate(`/post/spot/${trade.postId}`) : navigate(`/post/${trade.postId}`))}
                    className="relative mx-auto cursor-pointer"
                    style={{
                      width: "370px",
                      minHeight: "194px",
                      borderRadius: "40px",
                      border: "1px solid #CCCCCC",
                      padding: "24px 28px",
                    }}
                  >
                    {/* 상단: 상태 아이콘 + 뱃지들 + 가격 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        {statusIcon(trade.postStatus)}
                        <span
                          className="flex items-center justify-center px-2.5 whitespace-nowrap"
                          style={{
                            height: "29px",
                            borderRadius: "40px",
                            backgroundColor: "#E4E4FF",
                            color: "#000000",
                            fontFamily: "Pretendard",
                            fontWeight: 400,
                            fontSize: "12px",
                          }}
                        >
                          {statusText(trade.postStatus, spot)}
                        </span>
                        <span
                          className="flex items-center justify-center px-2.5 whitespace-nowrap"
                          style={{
                            height: "29px",
                            borderRadius: "40px",
                            backgroundColor: "#E4E4FF",
                            color: "#1A1A1A",
                            fontFamily: "Pretendard",
                            fontWeight: 400,
                            fontSize: "12px",
                          }}
                        >
                          {spot ? "빈자리" : categoryLabel[trade.postCategory as PostCategory]}
                        </span>
                      </div>
                        <span
                          className="whitespace-nowrap"
                          style={{ fontFamily: "Pretendard", fontWeight: 700, fontSize: "14px", color: "#1A1A1A" }}
                        >
                          {spot
                            ? "빈자리 양도"
                            : `${trade.price.toLocaleString()}원 / ${priceUnitLabel[trade.priceUnit as RentalPriceUnit]}`}
                        </span>
                    </div>

                    {/* 제목 */}
                    <p
                      className="mb-2 px-5 overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ fontFamily: "Pretendard", fontWeight: 700, fontSize: "16px", color: "#1A1A1A" }}
                    >
                      {spot ? `${trade.location} ${trade.floor}층 ${trade.seatNumber}번` : trade.postTitle}
                    </p>

                    {/* 상대방 닉네임 */}
                    <p
                      className="mb-3 px-5"
                      style={{ fontFamily: "Pretendard", fontWeight: 400, fontSize: "12px", color: "#1A1A1A" }}
                    >
                      {spot ? "양도자" : "대여자"} : {trade.postMemberNickname}
                    </p>

                    {/* 하단: 날짜 + 후기 보내기 버튼 */}
                    <div className="flex items-end justify-between">
                      <div
                        style={{
                          fontFamily: "Pretendard",
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#1A1A1A",
                          lineHeight: "1.5",
                        }}
                      >
                        {spot ? (
                          <p style={{ marginLeft: "20px" }}>양도 완료일 : {trade.rentalEndTime}</p>
                        ) : (
                          <>
                            <p style={{ marginLeft: "20px" }}>대여 시작 : {trade.rentalStartTime}</p>
                            <p style={{ marginLeft: "20px" }}>반납 완료 : {trade.rentalEndTime}</p>
                          </>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // trade 객체의 실제 대여 ID 필드명(예: rentalId 또는 rentalRequestId)을 전달
                          const targetRentalId = trade.rentalId || trade.rentalRequestId || trade.postId;

                          navigate(`/mypage/review-create/${targetRentalId}`, {
                            state: {
                              rentalId: targetRentalId,
                              partnerName: trade.postMemberNickname,
                              title: spot ? `${trade.location} ${trade.floor}층 ${trade.seatNumber}번` : trade.postTitle,
                            },
                          })
                        }}
                        className="flex items-center justify-center"
                        style={{
                          width: "142px",
                          height: "34px",
                          borderRadius: "40px",
                          border: "1px solid #7F7F7F",
                          color: "#000000",
                          fontFamily: "Pretendard",
                          fontWeight: 400,
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        후기 보내기
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}