import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getMyPosts } from "../../api/member"
import { deletePost } from "../../api/post"
import { deleteEmptySpot } from "../../api/emptySpot"
import { categoryLabel, priceUnitLabel } from "../../utils/postMapper"
import type { MyPostItem } from "../../types/myPost"
import type { MemberPostItem } from "../../types/post"

export default function MyPostsPage() {
  const navigate = useNavigate()

  const [myPosts, setMyPosts] = useState<MyPostItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MyPostItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchMyPosts = async () => {
      setIsLoading(true)
      try {
        const res = await getMyPosts()
        console.log("내 게시글 목록:", res.data.result)
        const activeOnly = res.data.result.filter((item) => item.postStatus !== "DELETED")
        setMyPosts(activeOnly)
      } catch (err) {
        console.error("내가 작성한 게시글 조회 실패:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMyPosts()
  }, [])

  // location이 있으면 빈자리, 없으면 게시글로 구분
  const isSpot = (item: MyPostItem) => !!item.location

  const handleDeleteClick = (item: MyPostItem) => {
    setDeleteTarget(item)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return
    setIsDeleting(true)
    try {
      if (isSpot(deleteTarget)) {
        await deleteEmptySpot(deleteTarget.postId)
      } else {
        await deletePost(deleteTarget.postId)
      }
      setMyPosts((prev) => prev.filter((item) => item.postId !== deleteTarget.postId))
      setShowDeleteModal(false)
    } catch (err) {
      console.error("삭제 실패:", err)
      alert("삭제에 실패했어요. 다시 시도해주세요!")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full h-full relative bg-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden vertical-scroll">
        <div className="w-100.5 flex flex-col bg-white pb-10">
          {/* 상단 고정 헤더 */}
          <div className="sticky top-0 bg-white z-30 w-full" style={{ height: "70px" }}>
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
              내가 작성한 게시글
            </span>
          </div>

          {/* 게시글 목록 */}
          <div className="flex flex-col gap-4 pt-4">
            {isLoading ? (
              <p className="text-center text-sm text-[#7F7F7F] py-10">불러오는 중...</p>
            ) : myPosts.length === 0 ? (
              <p className="text-center text-sm text-[#7F7F7F] py-10">
                등록한 대여글이 없어요
              </p>
            ) : (
              myPosts.map((item) => {
                const spot = isSpot(item)
                const isExpired = spot && item.leftMinutes <= 0

                // 빈자리는 emptySpotId 또는 spotId, 일반 게시글은 postId 참조
                const currentId = spot ? (item.emptySpotId || item.spotId || item.postId) : item.postId

                // 상태 텍스트 판별 (대여가능 / 대여중 / 대여완료 / 시간만료)
                const statusText = isExpired
                  ? "시간만료"
                  : item.postStatus === "ACTIVE"
                  ? "대여가능"
                  : item.postStatus === "RENTED"
                  ? "대여중"
                  : "대여완료"

                                  // 수정 버튼 클릭 핸들러
                const handleEdit = (item: MemberPostItem) => {
                  if (item.postCategory === "EMPTY_SPOTS") {
                    // 빈자리 수정 페이지로 이동
                    navigate(`/spot/edit/${item.postId}`, { state: { item } })
                  } else {
                    // 일반 게시글 수정 페이지로 이동
                    navigate(`/post/edit/${item.postId}`, { state: { item } })
                  }
                }
                
                return (
                  <div
                    key={item.postId}
                    onClick={() =>
                      spot ? navigate(`/post/spot/${item.postId}`) : navigate(`/post/${item.postId}`)
                    }
                    className="relative mx-auto cursor-pointer"
                    style={{
                      width: "370px",
                      height: "194px",
                      borderRadius: "40px",
                      border: "1px solid #CCCCCC",
                      background: "linear-gradient(90deg, #FFFFFF 51.91%, #E4E4FF 114.12%)",
                    }}
                  >
                    {/* 상태 뱃지 */}
                    <div
                      className="absolute flex items-center justify-center whitespace-nowrap px-3"
                      style={{
                        height: "29px",
                        top: "26px",
                        left: "38px",
                        borderRadius: "40px",
                        backgroundColor:
                          statusText === "시간만료"
                            ? "#FFE1E1"
                            : item.postStatus === "ACTIVE"
                            ? "#E9F5EE"
                            : item.postStatus === "RENTED"
                            ? "#FFF3CD"
                            : "#FFE1E1",
                      }}
                    >
                      <span style={{ fontFamily: "Pretendard", fontWeight: 400, fontSize: "12px", color: "#1A1A1A" }}>
                        {statusText}
                      </span>
                    </div>

                    {/* 카테고리 뱃지 */}
                    <div
                      className="absolute flex items-center justify-center whitespace-nowrap px-3"
                      style={{ height: "29px", top: "26px", left: "109px", borderRadius: "40px", backgroundColor: "#E4E4FF" }}
                    >
                      <span style={{ fontFamily: "Pretendard", fontWeight: 400, fontSize: "12px", color: "#1A1A1A" }}>
                        {spot ? "빈자리" : categoryLabel[item.postCategory as keyof typeof categoryLabel] || item.postCategory}
                      </span>
                    </div>

                    {/* 가격 */}
                    <p
                      className="absolute text-right whitespace-nowrap"
                      style={{ top: "28px", right: "38px", fontFamily: "Pretendard", fontWeight: 700, fontSize: "14px", color: "#1A1A1A" }}
                    >
                      {spot ? "무료" : `${item.price?.toLocaleString() ?? 0}원 / ${priceUnitLabel[item.priceUnit as keyof typeof priceUnitLabel]}`}
                    </p>

                    {/* 제목 */}
                    <p
                      className="absolute overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ width: "226px", top: "68px", left: "44px", fontFamily: "Pretendard", fontWeight: 700, fontSize: "16px", color: "#1A1A1A" }}
                    >
                      {spot ? `${item.location} ${item.floor}층 ${item.seatNumber}번` : item.postTitle}
                    </p>

                    {/* 설명 */}
                    <p
                      className="absolute overflow-hidden"
                      style={{ width: "184px", height: "34px", top: "97px", left: "44px", fontFamily: "Pretendard", fontWeight: 400, fontSize: "12px", color: "#4A4A4A" }}
                    >
                      {spot
                        ? isExpired
                          ? "퇴실 시간이 만료되었습니다."
                          : `퇴실까지 ${item.leftMinutes}분 남음`
                        : item.postDescription}
                    </p>

                    {/* 등록일 */}
                    <p
                      className="absolute"
                      style={{ width: "166px", top: "145px", left: "44px", fontFamily: "Pretendard", fontWeight: 400, fontSize: "12px", color: "#7F7F7F" }}
                    >
                      {spot ? "양도 등록일" : "대여 신청일"} : {item.requestCreatedAt}
                    </p>

{/* 1. 수정 버튼 (일반 게시물일 때만 왼쪽에 표시) */}
{item.postCategory !== "EMPTY_SPOTS" && (
  <button
    onClick={(e) => {
      e.stopPropagation()
      navigate(`/post/edit/${item.postId}`, { state: { item } })
    }}
    className="absolute flex items-center justify-center text-white"
    style={{
      width: "68px",
      height: "34px",
      top: "135px",
      left: "196px", // 왼쪽 배치
      borderRadius: "40px",
      backgroundColor: "#9996FF",
      fontFamily: "Pretendard",
      fontWeight: 600,
      fontSize: "13px",
    }}
  >
    수정
  </button>
)}

{/* 2. 삭제 버튼 (항상 오른쪽에 표시) */}
<button
  onClick={(e) => {
    e.stopPropagation()
    handleDeleteClick(item)
  }}
  className="absolute flex items-center justify-center"
  style={{
    width: "68px",
    height: "34px",
    top: "135px",
    left: "271px", // 오른쪽 배치
    borderRadius: "40px",
    border: "1px solid #E6E6E6",
    fontFamily: "Pretendard",
    fontWeight: 600,
    fontSize: "13px",
    color: "#7F7F7F",
  }}
>
  삭제
</button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 (메인 컨테이너 div 내부로 이동) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 max-w-100.5 mx-auto">
          <div
            className="bg-white flex flex-col items-center"
            style={{ width: "334px", borderRadius: "40px", paddingTop: "32px", paddingBottom: "24px", paddingLeft: "24px", paddingRight: "24px" }}
          >
            <p className="text-center" style={{ fontFamily: "Pretendard", fontWeight: 700, fontSize: "18px", color: "#1A1A1A", marginBottom: "12px" }}>
              게시글을 삭제하시겠어요?
            </p>
            <p className="text-center" style={{ fontFamily: "Pretendard", fontWeight: 400, fontSize: "13px", color: "#7F7F7F", marginBottom: "28px" }}>
              삭제하면 다시 복구할 수 없습니다.
            </p>
            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
                style={{ height: "44px", borderRadius: "40px", border: "1px solid #E6E6E6", fontFamily: "Pretendard", fontWeight: 600, fontSize: "14px", color: "#1A1A1A" }}
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 text-white"
                style={{ height: "44px", borderRadius: "40px", backgroundColor: "#FF5E5E", fontFamily: "Pretendard", fontWeight: 600, fontSize: "14px" }}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}