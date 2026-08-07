import { ArrowLeft, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getLikedPosts } from "../../api/member"
import { categoryLabel, priceUnitLabel } from "../../utils/postMapper"
import type { LikedPostItem } from "../../types/likedPosts"
import type { PostCategory, RentalPriceUnit } from "../../types/post"
import { likePost } from "../../api/post"

export default function LikedPostsPage() {
  const navigate = useNavigate()

  const [likedPosts, setLikedPosts] = useState<LikedPostItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLikedPosts = async () => {
      setIsLoading(true)
      try {
        const res = await getLikedPosts()
        console.log("좋아요한 게시물 첫번째 항목 전체:", res.data.result[0])
        setLikedPosts(res.data.result)
      } catch (err) {
        console.error("좋아요한 게시물 조회 실패:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLikedPosts()
  }, [])

  return (
    <div className="w-full h-full relative bg-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden vertical-scroll">
        <div className="w-[402px] flex flex-col bg-white pb-10">
          {/* 헤더 */}
          <div className="flex items-center gap-3 px-4 pt-5 pb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft size={22} className="text-[#1A1A1A]" />
            </button>
            <span className="text-[17px] font-bold text-[#1A1A1A]">좋아요한 게시물</span>
          </div>

          {/* 게시글 카드 목록 */}
          <div className="flex flex-col px-4 py-2 gap-4">
            {isLoading ? (
              <p className="text-center text-sm text-[#7F7F7F] py-10">불러오는 중...</p>
            ) : likedPosts.length === 0 ? (
              <p className="text-center text-sm text-[#7F7F7F] py-10">
                좋아요한 게시물이 없어요
              </p>
            ) : (
          likedPosts.map((post, idx) => (
            <div
              key={post.postId ?? idx}
              onClick={() => post.postId && navigate(`/post/${post.postId}`)}
              className="relative mx-auto cursor-pointer"
              style={{
                width: "370px",
                height: "203px",
                borderRadius: "40px",
                border: "1px solid #CCCCCC",
                background: "linear-gradient(90deg, #FFFFFF 51.91%, #E4E4FF 114.12%)",
              }}
            >
              {/* 물건 사진 (90x90, radius 20, top 23 left 18) */}
              <div
                className="absolute bg-[#E6E6E6] overflow-hidden flex items-center justify-center"
                style={{ width: "90px", height: "90px", top: "23px", left: "18px", borderRadius: "20px" }}
              >
                <img
                  src={post.postImageUrl || "/logo3.png"}
                  alt={post.postTitle}
                  className={post.postImageUrl ? "w-full h-full object-cover" : "w-10 h-10 object-contain"}
                />
              </div>

              {/* 대여가능 뱃지 */}
              <div
                className="absolute flex items-center justify-center text-[12px] text-black px-2.5 whitespace-nowrap"
                style={{
                  height: "30px",
                  top: "23px",
                  left: "116px",
                  borderRadius: "40px",
                  backgroundColor:
                    post.postStatus === "ACTIVE" ? "#E9F5EE" : post.postStatus === "RENTED" ? "#FFF3CD" : "#FFE1E1",
                }}
              >
                {post.postStatus === "ACTIVE" ? "대여가능" : post.postStatus === "RENTED" ? "대여중" : "대여완료"}
              </div>

              {/* 카테고리 뱃지 */}
              <div
                className="absolute flex items-center justify-center text-[12px] bg-[#E4E4FF] text-[#000000] px-3 whitespace-nowrap"
                style={{ height: "30px", top: "23px", left: "186px", borderRadius: "40px" }}
              >
                {categoryLabel[post.postCategory as PostCategory]}
              </div>

              {/* 좋아요 */}
              <button
                onClick={async (e) => {
                  e.stopPropagation()
                  if (!post.postId) return
                  try {
                    await likePost(post.postId)
                    setLikedPosts((prev) => prev.filter((p) => p.postId !== post.postId))
                  } catch (err) {
                    console.error("좋아요 취소 실패:", err)
                  }
                }}
                className="absolute flex items-center gap-0.5"
                style={{ top: "23px", right: "20px" }}
              >
                <Heart size={20} className="fill-[#9996FF] text-[#9996FF]" />
                <span className="text-xs text-[#000000]">{post.likeCount}</span>
              </button>

              {/* 제목 */}
                      <p
                        className="absolute overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{
                          width: "226px",
                          height: "18px",
                          top: "61px",
                          left: "121px",
                          fontFamily: "Pretendard",
                          fontWeight: 700,
                          fontSize: "14px",
                          lineHeight: "1.2",
                          color: "#1A1A1A",
                        }}
                      >
                        {post.postTitle}
                      </p>

              {/* 설명 */}
                      <p
                        className="absolute whitespace-pre-line overflow-hidden"
                        style={{
                          width: "193px",
                          height: "34px",
                          top: "84px",
                          left: "122px",
                          fontFamily: "Pretendard",
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "1.4",
                          color: "#000000",
                        }}
                      >
                        {post.postDescription}
                      </p>
              {/* 대여 신청일 */}
                      <p
                        className="absolute"
                        style={{
                          width: "200px",
                          left: "122px",
                          bottom: "55px",
                          fontFamily: "Pretendard",
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "1.2",
                          color: "#43A860",
                        }}
                      >
                대여 신청일 : {post.requestCreatedAt}
              </p>

              {/* 사용자 사진 (25x25, radius 15, top 154 left 26) */}
                      <div
                        className="absolute bg-gray-300"
                        style={{ width: "25px", height: "25px", top: "154px", left: "26px", borderRadius: "15px" }}
                      />

              {/* 사용자 이름 (32x14, top 160 left 62, font12 regular) */}
                      <p
                        className="absolute overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{
                          width: "100px",
                          height: "16px",
                          top: "160px",
                          left: "62px",
                          fontFamily: "Pretendard",
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "1.2",
                          color: "#000000",
                        }}
                      >
                        {post.postMemberNickname || "익명"}
                      </p>

{/* 가격 (97x17, top 158 left 244, font14 bold, text-right) */}
                      <p
                        className="absolute text-right"
                        style={{
                          width: "97px",
                          height: "17px",
                          top: "158px",
                          left: "244px",
                          fontFamily: "Pretendard",
                          fontWeight: 700,
                          fontSize: "14px",
                          lineHeight: "1.2",
                          color: "#1A1A1A",
                        }}
                      >
                        {(post.price ?? 0).toLocaleString()}원 / {post.priceUnit ? priceUnitLabel[post.priceUnit as RentalPriceUnit] : ""}
                      </p>
                    </div>
            ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}