import { Search, Zap, ChevronDown, Heart } from "lucide-react"
import BottomNav from "../../components/BottomNav"
import { useState } from "react"

export default function HomePage() {
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }

  //mockdata
  const posts = [
    {
      id: 1,
      imageUrl: null,
      status: "대여가능",
      category: "과잠",
      title: "컴퓨터 공학과 과잠 대여하고 싶어요",
      description: "23학번 과잠 대여 가능하신 분 있나요?\n상세 옵션들을 하루만 빨리고 싶습니다!",
      likes: 2,
      author: "코딩왕",
      date: "2026. 4. 8",
      price: "5,000원 / 일",
    },
    {
      id: 2,
      imageUrl: null,
      status: "대여가능",
      category: "전공서적",
      title: "경영학원론 교재 빌리고 싶어요",
      description: "경영학원론 최신판 필요합니다.\n한 학기만 빌릴 수 있을까요?",
      likes: 6,
      author: "경영광",
      date: "2026. 4. 3",
      price: "20,000원 / 학기",
    },
    {
      id: 3,
      imageUrl: null,
      status: "대여가능",
      category: "전자기기",
      title: "노트북 충전기 빌려주실 분",
      description: "C타입 충전기 급하게 필요합니다.\n하루만 빌려주세요!",
      likes: 4,
      author: "전자킹",
      date: "2026. 4. 5",
      price: "3,000원 / 일",
    },
    {
      id: 4,
      imageUrl: null,
      status: "대여가능",
      category: "생활용품",
      title: "미니 선풍기 대여합니다",
      description: "여름 한정 미니 선풍기 대여해요.\n상태 좋습니다!",
      likes: 8,
      author: "생활왕",
      date: "2026. 4. 1",
      price: "2,000원 / 일",
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto pb-20 vertical-scroll">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 mt-3 pt-4 pb-3">
        <img src="/logo1.png" alt="BORO" className="h-8" />
        <button className="bg-[#9996FF] text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
          <span>+</span> 글 쓰기
        </button>
      </div>

      {/* 검색창 */}
<div className="px-2 mt-1 mb-3 flex justify-center">
  <div className="bg-[#E6E6E6] rounded-[35.9px] w-full h-[36px] px-4 flex items-center gap-2">
          <Search className="text-[#7F7F7F]" size={18} />
          <input
            className="bg-transparent flex-1 text-sm outline-none"
            placeholder="검색어를 입력해주세요."
          />
        </div>
      </div>

{/* 전체 컨테이너에 양옆 여백(px-4)을 주고, 박스는 w-full로 채웁니다 */}
<div className="w-full mt-2.5 px-4 mb-5 flex justify-center">
  <div className="bg-[#E6E6E6] w-[359px] h-[44px] rounded-[40px] flex items-center justify-between p-[4px]">
    {/* 안쪽 버튼들도 고정 픽셀 대신 50%씩(w-40/2) 차지하도록 변경! */}
    <button className="ml-[6px] w-[180px] h-[34px] bg-[#9996FF] text-white text-sm font-semibold rounded-[40px] shadow-sm">
      전체 대여
    </button>
    <button className="w-[180px] h-[34px] text-[#7F7F7F] text-sm font-semibold flex items-center justify-center gap-1">
      <Zap size={16} /> 빈자리 핫클립
    </button>
  </div>
</div>

      {/* 카테고리 타이틀 */}
{/* h-[24px] 공간 안에서 4줄 아이콘과 글자가 완벽히 이쁘게 정렬됩니다 */}
<div className="px-4 mt-1 mb-0 flex items-center gap-2 h-[24px] w-full">
  {/* viewBox를 18x18로 유지하되, 전체 높이 h-[18px]를 주어 아래 컴포넌트를 절대 침범하지 않게 고정했습니다 */}
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 h-[18px] w-[18px]">
    <rect y="2" width="20" height="2" fill="#1A1A1A" />
    <rect y="6" width="20" height="2" fill="#1A1A1A" />
    <rect y="10" width="20" height="2" fill="#1A1A1A" />
    <rect y="14" width="20" height="2" fill="#1A1A1A" />
  </svg>
  <span className="text-[15px] text-[#1A1A1A] leading-none">카테고리</span>
</div>

  {/* 카테고리 */}
 <div className="flex px-4 gap-2 overflow-x-auto overflow-y-hidden mb-6 pt-3 pb-15 w-full category-scroll">
  {/* 전체 버튼 */}
  <button className="bg-[#9996FF] text-white text-sm font-semibold w-[75px] h-[36px] rounded-[40px] flex-shrink-0 shadow-sm">
    전체
  </button>
  
  {/* 기타 카테고리 맵핑 */}
  {["과잠", "전공서적", "전자기기", "생활용품", "빈자리", "기타"].map((category) => (
    <button
      key={category}
      className="text-[#000000] text-sm bg-[#E6E6E6] border border-[#E6E6E6] w-[75px] h-[36px] rounded-[40px] flex-shrink-0 font-medium active:bg-[#9996FF] active:text-white transition-colors duration-150"
    >
      {category}
    </button>
  ))}
</div>

      {/* 필터 & 정렬 */}
      <div className="flex items-center justify-between px-5 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-11 h-6 bg-[#9996FF] rounded-full relative">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
          </div>
          <span className="text-xs text-[#000000]">대여 가능한 항목만 보기</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#000000]">정렬</span>
          <button className="bg-[#E6E6E6] rounded-[40px] w-[102px] h-[29px] flex items-center justify-center gap-1 text-xs font-semibold">
            최신순 <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* 게시글 카드 목록 */}
      <div className="flex flex-col px-4 py-4 gap-4">
        {posts.map((post) => (
          <div
  key={post.id}
  className="border border-gray-200 rounded-3xl p-4 flex items-center gap-3 w-full h-[203px] bg-gradient-to-tl from-[#efeffe] via-white to-white"
>
            {/* 왼쪽: 이미지 + 작성자 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-23 h-23 bg-[#E6E6E6] rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={post.imageUrl || "/logo3.png"}
                  alt={post.title}
                  className={post.imageUrl ? "w-full h-full object-cover" : "w-10 h-10 object-contain"}
                />
              </div>
              <div className="flex items-center gap-2 mt-10">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
                <span className="text-[12px] text-[#000000]">{post.author}</span>
              </div>
            </div>

            {/* 오른쪽: 내용 */}
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex justify-between items-start">
                <div className="flex gap-1.5">
                  <span className="text-[12px] bg-[#E9F5EE] text-black px-2.5 py-1 rounded-full">{post.status}</span>
                  <span className="text-[12px] bg-[#E4E4FF] text-[#000000] px-2.5 py-1 rounded-full">{post.category}</span>
                </div>
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-0.5"
                >
                  <Heart
                    size={20}
                    className={likedPosts.includes(post.id) ? "fill-[#9996FF] text-[#9996FF]" : "text-[#9996FF]"}
                  />
                  <span className="text-xs text-[#000000]">{post.likes}</span>
                </button>
              </div>
              {/* 설명 */}
              <p className="text-sm font-bold mt-0.5">{post.title}</p>
              <p className="text-[12px] text-[#000000] leading-tight whitespace-pre-line">
                {post.description}
              </p>
              {/* 대여 신청일 */}
              <p className="text-[12px] text-[#43A860] mt-3">대여 신청일: {post.date}</p>
              {/* 가격 */}
              <p className="text-sm font-bold mt-2 text-right">{post.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  )
}