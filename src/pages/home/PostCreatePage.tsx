import { ArrowLeft, ImagePlus, ChevronDown, Calendar, Clock } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { categoryLabel, priceUnitLabel } from "../../utils/postMapper"
import type { PostCategory, RentalPriceUnit } from "../../types/post"
import { createPost, getPostDetail, updatePost } from "../../api/post"
import { createEmptySpot, updateEmptySpot, getEmptySpotDetail } from "../../api/emptySpot"
import axios from "axios"
import { getPresignedUrl } from "../../api/file"



export default function PostCreatePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"post" | "spot">("post")
  const [hasOutlet, setHasOutlet] = useState(false)
  const [hasWindow, setHasWindow] = useState(true)
  const [category, setCategory] = useState<PostCategory>("DEPARTMENT_JACKET")
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [rentalStartTime, setRentalStartTime] = useState("")
  const [rentalPrice, setRentalPrice] = useState("")
  const [location, setLocation] = useState("")
  const [floor, setFloor] = useState("")
  const [seatNumber, setSeatNumber] = useState("")
  const [checkoutTime, setCheckoutTime] = useState("")
  const [rentalPriceUnit, setRentalPriceUnit] = useState<RentalPriceUnit | null>(null)
  const [periodCount, setPeriodCount] = useState("1")
  const [showPeriodMenu, setShowPeriodMenu] = useState(false)
  const { postId, spotId } = useParams()
  const isEditMode = !!postId || !!spotId  // postId나 spotId가 있으면 true (수정 모드)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const postCategoryList: PostCategory[] = [
    "DEPARTMENT_JACKET",
    "MAJOR_BOOKS",
    "ELECTRONICS",
    "LIVING_SUPPLIES",
    "ETC",
  ]

  useEffect(() => {
    if (!isEditMode) return

    const fetchEditData = async () => {
      try {
        if (postId) {
          const res = await getPostDetail(Number(postId))
          const post = res.data.result
          setTitle(post.title)
          setDescription(post.description)
          setCategory(post.category)
          setRentalPrice(String(post.rentalPrice))
          setRentalStartTime(post.rentalStartTime)
          setRentalPriceUnit(post.rentalPriceUnit)
        } else if (spotId) {
          const res = await getEmptySpotDetail(spotId)
          const spot = (res.data as any).result
          setLocation(spot.location)
          setFloor(String(spot.floor))
          setSeatNumber(String(spot.seatNumber))
          setHasOutlet(spot.hasPowerOutlet)
          setHasWindow(spot.hasWindowSeat)
          setCheckoutTime(spot.expectedCheckoutTime?.slice(11, 16) || "")
        }
      } catch (err) {
        console.error("수정할 데이터 불러오기 실패:", err)
      }
    }

    fetchEditData()
  }, [postId, spotId])

  const uploadImage = async (file: File): Promise<string> => {
    const res = await getPresignedUrl({
      fileName: file.name,
      contentType: file.type,
    })
    const { presignedUrl, fileUrl } = res.data.result

    await axios.put(presignedUrl, file, {
      headers: { "Content-Type": file.type },
    })
    return fileUrl
  }

  const calculateEndTime = (startDate: string, unit: RentalPriceUnit): string => {
  const date = new Date(startDate)
  switch (unit) {
    case "HOUR":
      date.setHours(date.getHours() + 1)
      break
    case "DAY":
      date.setDate(date.getDate() + 1)
      break
    case "WEEK":
      date.setDate(date.getDate() + 7)
      break
    case "MONTH":
      date.setMonth(date.getMonth() + 1)
      break
    case "SEMESTER":
      date.setMonth(date.getMonth() + 4)
      break
  }
  return date.toISOString().split("T")[0]
}
  const handleSubmit = async () => {
  if (activeTab === "post") {
    if (!title || !description || !rentalStartTime || !rentalPrice || !rentalPriceUnit) {
      alert("필수 항목을 모두 입력해주세요!")
      return
    }

    if (Number(rentalPrice) > 5000) {
      alert("대여 비용은 최대 5,000원까지 입력할 수 있습니다.")
      return
    }

    try {
      if (imageFiles.length === 0) {
        alert("사진을 최소 1장 이상 첨부해야 합니다.")
        return
      }

      const uploadedUrls = await Promise.all(imageFiles.map((file) => uploadImage(file)))

      if (isEditMode && postId) {
        await updatePost(Number(postId), {
          imageUrlList: uploadedUrls,
          category,
          title,
          description,
          rentalStartTime,
          rentalEndTime: calculateEndTime(rentalStartTime, rentalPriceUnit),
          rentalPrice: Number(rentalPrice),
          rentalPriceUnit,
        })
      } else {
        await createPost({
          imageUrlList: uploadedUrls,
          category,
          title,
          description,
          rentalStartTime,
          rentalEndTime: calculateEndTime(rentalStartTime, rentalPriceUnit),
          rentalPrice: Number(rentalPrice),
          rentalPriceUnit,
        })
      }
      navigate("/")
    } catch (err) {
      console.error("게시글 처리 실패:", err)
      alert("처리에 실패했어요. 다시 시도해주세요.")
    }
  } else {
    // 빈자리 작성 로직
    if (!location || !floor || !seatNumber || !checkoutTime) {
      alert("필수 항목을 모두 입력해주세요!")
      return
    }

    // 1. 선택한 시간으로 Date 객체 생성
    const [hours, minutes] = checkoutTime.split(":").map(Number)
    const now = new Date()
    const checkoutDate = new Date()
    checkoutDate.setHours(hours, minutes, 0, 0)

    // 2. 자정 경계 보정
    if (now.getHours() >= 23 && hours < 2) {
      checkoutDate.setDate(checkoutDate.getDate() + 1)
    }

    // 3. 현재 시간과의 차이 계산 (분 단위)
    const diffMinutes = (checkoutDate.getTime() - now.getTime()) / (1000 * 60)

    if (diffMinutes < 5) {
      alert("퇴실 예정 시간은 현재 시각으로부터 최소 5분 이후여야 합니다!")
      return
    }

    if (diffMinutes > 20) {
      alert("퇴실 예정 시간은 현재 시각으로부터 20분 이내로 설정해야 합니다!")
      return
    }

    try {
      const parsedFloor = Number(floor.replace(/[^0-9]/g, "")) || 1
      const parsedSeatNumber = Number(seatNumber.replace(/[^0-9]/g, "")) || 1
      const isoCheckoutTime = checkoutDate.toISOString()

      console.log("실제 서버로 보내는 값:", isoCheckoutTime)

      if (isEditMode && spotId) {
        await updateEmptySpot(spotId, {
          location,
          floor: parsedFloor,
          seatNumber: parsedSeatNumber,
          hasPowerOutlet: hasOutlet,
          hasWindowSeat: hasWindow,
          expectedCheckoutTime: isoCheckoutTime,
        })
      } else {
        await createEmptySpot({
          location,
          floor: parsedFloor,
          seatNumber: parsedSeatNumber,
          hasPowerOutlet: hasOutlet,
          hasWindowSeat: hasWindow,
          expectedCheckoutTime: isoCheckoutTime,
        })
      }
      navigate("/")
    } catch (err) {
      console.error("빈자리 처리 실패:", err)
      alert("처리에 실패했어요. 다시 시도해주세요.")
    }
  }
}

  ////////////////////////////////////////////////////
  //ui 구성 부분
  return (
    <div className="w-full h-full relative bg-white flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden vertical-scroll">
        <div className="w-100.5 flex flex-col bg-white pb-24">
          {/* 상단 고정 헤더 (402x80, 스크롤해도 고정) */}
          <div
            className="sticky top-0 bg-white z-30 w-full"
            style={{ height: "80px" }}
          >
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
            {isEditMode ? "게시글 수정" : "게시글 작성"}
          </span>
        </div>

        {/* 고정 헤더만큼 아래 여백 확보 */}
        <div style={{ height: "5px" }} />

        {/* 게시글 작성 / 빈자리 작성 탭 (359x44, radius 40) */}
        <div className="w-full mb-5 flex justify-center">
          <div
            className="relative"
            style={{
              width: "359px",
              height: "44px",
              borderRadius: "40px",
              backgroundColor: "#E6E6E6",
            }}
          >
            {/* 움직이는 보라색 배경 */}
            <div
              className="absolute transition-all"
              style={{
                width: "175px",
                height: "34px",
                top: "5px",
                left: activeTab === "post" ? "5px" : "179px",
                borderRadius: "40px",
                backgroundColor: "#9996FF",
              }}
            />

            <button
              onClick={() => setActiveTab("post")}
              className="absolute flex items-center justify-center"
              style={{
                top: "5px",
                left: "5px",
                width: "175px",
                height: "34px",
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "1.2",
                color: activeTab === "post" ? "#FFFFFF" : "#7F7F7F",
              }}
            >
              게시글 작성
            </button>

            <button
              onClick={() => setActiveTab("spot")}
              className="absolute flex items-center justify-center"
              style={{
                top: "5px",
                left: "179px",
                width: "175px",
                height: "34px",
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "1.2",
                color: activeTab === "spot" ? "#FFFFFF" : "#7F7F7F",
              }}
            >
              빈자리 작성
            </button>
          </div>
        </div>

      {activeTab === "post" ? (
        <>

        {/* 카테고리 (334x107, radius 40, border 1px #CCCCCC) */}
      <div className="w-full flex justify-center mb-4">
        <div
          className="relative"
          style={{
            width: "334px",
            height: "107px",
            borderRadius: "40px",
            border: "1px solid #CCCCCC",
          }}
        >
          <p
            className="absolute"
            style={{
              top: "18px",
              left: "30px",
              fontFamily: "Pretendard",
              fontWeight: 600,
              fontSize: "12px",
              lineHeight: "1.2",
              color: "#1A1A1A",
            }}
          >
            카테고리
          </p>

          {/* 드롭다운 박스 (138x46, radius 40, border 1px) */}
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="absolute flex items-center"
            style={{
              width: "138px",
              height: "46px",
              top: "44px",
              left: "25px",
              borderRadius: "40px",
              border: "1px solid #CCCCCC",
              paddingLeft: "26px",
            }}
          >
            <span
              style={{
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "1.2",
                color: "#1A1A1A",
              }}
            >
              {categoryLabel[category]}
            </span>
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              style={{ position: "absolute", top: "20px", left: "107px" }}
            >{/* 제목 (334x107, radius 40, border 1px #CCCCCC) */}
      <div className="w-full flex justify-center mb-4">
        <div
          className="relative"
          style={{
            width: "334px",
            height: "107px",
            borderRadius: "40px",
            border: "1px solid #CCCCCC",
          }}
        >
          <p
            className="absolute"
            style={{
              top: "18px",
              left: "30px",
              fontFamily: "Pretendard",
              fontWeight: 600,
              fontSize: "12px",
              lineHeight: "1.2",
              color: "#1A1A1A",
            }}
          >
            제목 {!title && <span style={{ color: "#1A1A1A" }}>*</span>}
          </p>

          {/* 입력 바 (284x46, radius 40, 배경 #E6E6E6) */}
          <div
            className="absolute flex items-center"
            style={{
              width: "284px",
              height: "46px",
              top: "44px",
              left: "25px",
              borderRadius: "40px",
              backgroundColor: "#E6E6E6",
              paddingLeft: "26px",
            }}
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent outline-none w-full"
              style={{
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "1.2",
                color: "#1A1A1A",
              }}
              placeholder="예 : 컴퓨터 공학과 과잠 빌리고 싶습니다"
            />
            </div>
          </div>
        </div>
        <path d="M1 1L6 6L11 1" stroke="#7F7F7F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>

    {/* 드롭다운 메뉴 */}
    {showCategoryMenu && (
      <div
        className="absolute bg-white shadow-md z-10"
        style={{
          top: "92px",
          left: "25px",
          width: "138px",
          borderRadius: "30px",
          border: "1px solid #CCCCCC",
          overflow: "hidden",
        }}
      >
        {postCategoryList.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat)
              setShowCategoryMenu(false)
            }}
            className="w-full text-left px-6.5 py-2 hover:bg-gray-100"
            style={{
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "12px",
              color: "#1A1A1A",
            }}
          >
            {categoryLabel[cat]}
          </button>
        ))}
      </div>
      )}
      </div>
    </div>

    {/* 제목 (334x107, radius 40, border 1px #CCCCCC) */}
    <div className="w-full flex justify-center mb-4">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "107px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          제목 *
        </p>

    {/* 입력 바 (284x46, radius 40, 배경 #E6E6E6) */}
    <div
      className="absolute flex items-center"
      style={{
        width: "284px",
        height: "46px",
        top: "44px",
        left: "25px",
        borderRadius: "40px",
        backgroundColor: "#E6E6E6",
        paddingLeft: "26px",
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-transparent outline-none w-full"
        style={{
          fontFamily: "Pretendard",
          fontWeight: 400,
          fontSize: "12px",
          lineHeight: "1.2",
          color: "#1A1A1A",
        }}
        placeholder="예 : 컴퓨터 공학과 과잠 빌리고 싶습니다"
      />
    </div>
  </div>
</div>

    {/* 설명 (334x107, radius 40, border 1px #CCCCCC) */}
    <div className="w-full flex justify-center mb-4">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "107px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          설명 <span style={{ color: "#1A1A1A" }}>*</span>
        </p>

        <div
          className="absolute flex items-center"
          style={{
            width: "284px",
            height: "46px",
            top: "44px",
            left: "25px",
            borderRadius: "40px",
            backgroundColor: "#E6E6E6",
            paddingLeft: "26px",
          }}
        >
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-transparent outline-none w-full"
            style={{
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "1.2",
              color: "#1A1A1A",
            }}
            placeholder="대여 조건 등을 자세히 설명해주세요"
          />
        </div>
      </div>
    </div>

    {/* 대여 신청 날짜 및 기간 (334x107, radius 40, border 1px #CCCCCC) */}
    <div className="w-full flex justify-center mb-4">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "135px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          대여 신청 날짜 및 기간 <span style={{ color: "#1A1A1A" }}>*</span>
        </p>

        <div className="absolute flex items-center gap-2" style={{ top: "44px", left: "25px" }}>
          <div
      className="relative flex items-center justify-between"
      style={{
        width: "157px",
        height: "46px",
        borderRadius: "40px",
        backgroundColor: "#E6E6E6",
        paddingLeft: "20px",
        paddingRight: "16px",
      }}
    >
      <span
        style={{
          fontFamily: "Pretendard",
          fontWeight: 400,
          fontSize: "12px",
          color: rentalStartTime ? "#1A1A1A" : "#7E7E7E",
        }}
      >
        {rentalStartTime
          ? new Date(rentalStartTime).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "연도, 월, 일"}
      </span>
      <button
        onClick={() => document.getElementById("rental-date-input")?.showPicker()}
        className="flex items-center justify-center"
        style={{ marginRight: "5px" }}
      >
        <Calendar size={16} className="text-[#1A1A1A]" style={{ transform: "scaleX(1.1)" }}/>
      
      </button>
      <input
        id="rental-date-input"
        type="date"
        value={rentalStartTime}
        onChange={(e) => setRentalStartTime(e.target.value)}
        className="absolute opacity-0 pointer-events-none"
        style={{ width: "1px", height: "1px" }}
      />
    </div>
    <div className="relative">
      <button
        onClick={() => setShowPeriodMenu(!showPeriodMenu)}
        className="flex items-center justify-center gap-1"
        style={{
          width: "105px",
          height: "46px",
          borderRadius: "40px",
          backgroundColor: "#E6E6E6",
          fontFamily: "Pretendard",
          fontWeight: 400,
          fontSize: "12px",
          color: rentalPriceUnit ? "#1A1A1A" : "#7F7F7F",
        }}
      >
        {rentalPriceUnit ? priceUnitLabel[rentalPriceUnit] : "대여 기간"} <ChevronDown size={23} />
      </button>

      {showPeriodMenu && (
        <div
          className="absolute bg-white shadow-md z-10"
          style={{
            top: "50px",
            right: "0px",
            width: "105px",
            borderRadius: "16px",
            border: "1px solid #CCCCCC",
            overflow: "hidden",
          }}
        >
          {(["HOUR", "DAY", "WEEK", "MONTH", "SEMESTER"] as RentalPriceUnit[]).map((unit) => (
            <button
              key={unit}
              onClick={() => {
                setRentalPriceUnit(unit)
                setShowPeriodMenu(false)
              }}
              className="w-full text-center py-2 hover:bg-gray-100"
              style={{ fontFamily: "Pretendard", fontWeight: 400, fontSize: "12px", color: "#1A1A1A" }}
            >
              {priceUnitLabel[unit]}
            </button>
          ))}
        </div>
      )}
    </div>
        </div>
    <p
          className="absolute"
          style={{
            top: "102px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 400,
            fontSize: "11px",
            color: "#7F7F7F",
          }}
        >
          언제부터 언제까지 대여를 원하는지 알려주세요
        </p>
        
      </div>
    </div>

    {/* 대여 비용 (334x107, radius 40, border 1px #CCCCCC) */}
    <div className="w-full flex justify-center mb-6">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "135px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          대여 비용 <span style={{ color: "#1A1A1A" }}>*</span>
        </p>

        <div className="absolute flex items-center gap-2" style={{ top: "44px", left: "25px" }}>
          <div
            className="flex items-center"
            style={{
              width: "150px",
              height: "46px",
              borderRadius: "40px",
              backgroundColor: "#E6E6E6",
              paddingLeft: "20px",
            }}
          >
            <input
              value={rentalPrice}
              onChange={(e) => setRentalPrice(e.target.value)}
              className="bg-transparent outline-none w-full"
              style={{
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "12px",
                color: "#1A1A1A",
              }}
              placeholder="예 : 3000"
            />
          </div>
          <span
            style={{
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "12px",
              color: "#1A1A1A",
            }}
          >
            원
          </span>
        </div>
        <p
          className="absolute"
          style={{
            top: "102px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 400,
            fontSize: "11px",
            color: "#7F7F7F",
          }}
        >
          최대 5,000원 까지 설정 가능합니다 (숫자만 입력)
        </p>
      </div>
    </div>
              {/* 작성 가이드 */}
    <div className="w-full flex justify-center mb-6">
      <div
        style={{
          width: "334px",
          minHeight: "139px",
          borderRadius: "40px",
          backgroundColor: "#E4E4FF",
          padding: "20px 24px",
        }}
      >
        <p className="text-[13px] font-bold text-[#9996FF] mb-3">작성 가이드</p>
        <ul className="text-[11px] text-[#1A1A1A] space-y-1.5">
          <li>• 대여 물품을 정확히 설명해주세요</li>
          <li>• 대여 신청 기간을 명확히 해주세요</li>
          <li>• 보증금은 거래 시 채팅으로 협의해주세요</li>
        </ul>
      </div>
    </div>
            </>
          ) : (
            <>

            
            {/* 빈자리 카테고리 */}
    <div className="w-full flex justify-center mb-4">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "107px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          카테고리 <span style={{ color: "#1A1A1A" }}></span>
        </p>
        <div
          className="absolute flex items-center"
          style={{
            width: "138px",
            height: "46px",
            top: "44px",
            left: "25px",
            borderRadius: "40px",
            border: "1px solid #CCCCCC",
            paddingLeft: "16px",
          }}
        >
          <span
            style={{
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "12px",
              color: "#1A1A1A",
            }}
          >
            빈자리
          </span>
        </div>
      </div>
    </div>

    {/* 장소 */}
    <div className="w-full flex justify-center mb-4">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "107px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          장소 {!location && <span style={{ color: "#1A1A1A" }}>*</span>}
        </p>
        <div
          className="absolute flex items-center"
          style={{
            width: "284px",
            height: "46px",
            top: "44px",
            left: "25px",
            borderRadius: "40px",
            backgroundColor: "#E6E6E6",
            paddingLeft: "26px",
          }}
        >
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent outline-none w-full"
            style={{
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "12px",
              color: "#1A1A1A",
            }}
            placeholder="예 : 중앙도서관"
          />
        </div>
      </div>
    </div>

    {/* 층 */}
    <div className="w-full flex justify-center mb-4">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "107px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          층 {!floor && <span style={{ color: "#1A1A1A" }}>*</span>}
        </p>
        <div
          className="absolute flex items-center"
          style={{
            width: "284px",
            height: "46px",
            top: "44px",
            left: "25px",
            borderRadius: "40px",
            backgroundColor: "#E6E6E6",
            paddingLeft: "26px",
          }}
        >
          <input
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="bg-transparent outline-none w-full"
            style={{
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "12px",
              color: "#1A1A1A",
            }}
            placeholder="예 : 2"
          />
        </div>
      </div>
    </div>

    {/* 좌석 번호 */}
    <div className="w-full flex justify-center mb-4">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "107px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          좌석 번호 {!seatNumber && <span style={{ color: "#1A1A1A" }}>*</span>}
        </p>
        <div
          className="absolute flex items-center"
          style={{
            width: "157px",
            height: "46px",
            top: "44px",
            left: "25px",
            borderRadius: "40px",
            backgroundColor: "#E6E6E6",
            paddingLeft: "26px",
          }}
        >
          
          <input
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
            className="bg-transparent outline-none w-full"
            style={{
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "12px",
              color: "#1A1A1A",
            }}
            placeholder="예 : DICA 28번"
          />
        </div>
      </div>
    </div>

    {/* 콘센트 여부 */}
    <div className="w-full flex justify-center mb-4">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "80px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          콘센트 여부 <span style={{ color: "#1A1A1A" }}></span>
        </p>
        <button
          onClick={() => setHasOutlet(!hasOutlet)}
          className="absolute rounded-full transition-colors"
          style={{
            top: "42px",
            left: "30px",
            width: "44px",
            height: "24px",
            borderRadius: "40px",
            backgroundColor: hasOutlet ? "#9996FF" : "#E6E6E6",
          }}
        >
          <div
            className="absolute bg-white rounded-full transition-all"
            style={{
              width: "18px",
              height: "18px",
              top: "3px",
              left: hasOutlet ? "23px" : "3px",
            }}
          />
        </button>
      </div>
    </div>

    {/* 창가자리 여부 */}
    <div className="w-full flex justify-center mb-4">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "80px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          창가자리 여부 <span style={{ color: "#1A1A1A" }}></span>
        </p>
        <button
          onClick={() => setHasWindow(!hasWindow)}
          className="absolute rounded-full transition-colors"
          style={{
            top: "42px",
            left: "30px",
            width: "44px",
            height: "24px",
            borderRadius: "40px",
            backgroundColor: hasWindow ? "#9996FF" : "#E6E6E6",
          }}
        >
          <div
            className="absolute bg-white rounded-full transition-all"
            style={{
              width: "18px",
              height: "18px",
              top: "3px",
              left: hasWindow ? "23px" : "3px",
            }}
          />
        </button>
      </div>
    </div>

    {/* 퇴실 예정 시간 */}
    <div className="w-full flex justify-center mb-6">
      <div
        className="relative"
        style={{
          width: "334px",
          height: "107px",
          borderRadius: "40px",
          border: "1px solid #CCCCCC",
        }}
      >
        <p
          className="absolute"
          style={{
            top: "18px",
            left: "30px",
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#1A1A1A",
          }}
        >
          퇴실 예정 시간 {!checkoutTime && <span style={{ color: "#1A1A1A" }}>*</span>}
        </p>

        <div
          className="relative flex items-center justify-between"
          style={{
            width: "157px",
            height: "46px",
            top: "44px",
            left: "25px",
            borderRadius: "40px",
            backgroundColor: "#E6E6E6",
            paddingLeft: "20px",
            paddingRight: "16px",
            position: "absolute",
          }}
        >
          <span
            style={{
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "12px",
              color: checkoutTime ? "#1A1A1A" : "#7E7E7E",
            }}
          >
            {checkoutTime || "Time"}
          </span>
          <button
            onClick={() => document.getElementById("checkout-time-input")?.showPicker()}
            className="flex items-center justify-center"
            style={{ marginRight: "5px" }}
          >
            <Calendar
              size={16}
              className="text-[#1A1A1A]"
              style={{ transform: "scaleX(1.1)" }}
            />
          </button>
          <input
            id="checkout-time-input"
            type="time"
            value={checkoutTime}
            onChange={(e) => setCheckoutTime(e.target.value)}
            className="absolute opacity-0 pointer-events-none"
            style={{ width: "1px", height: "1px" }}
          />
        </div>
      </div>
    </div>

    {/* 빈자리 작성 가이드 */}
    <div className="w-full flex justify-center mb-6">
      <div
        style={{
          width: "350px",
          minHeight: "139px",
          borderRadius: "40px",
          backgroundColor: "#E4E4FF",
          padding: "20px 24px",
        }}
      >
        <p className="text-[13px] font-bold text-[#9996FF] mb-3">작성 가이드</p>
        <ul className="text-[11px] text-[#1A1A1A] space-y-1.5"
          style={{ letterSpacing: "-0.2px" }}
        >
          <li>• 자리 양도는 가격 설정 및 영리 거래가 절대 불가합니다.</li>
          <li>• 퇴실 시간은 실 퇴실시간으로 부터 5분 이내로 설정해주세요.</li>
          <li>• 양도자에게는 자리 양도 한정 아이템이 지급됩니다.</li>
        </ul>
      </div>
    </div></>
          )}

          {/* 등록하기 버튼 */}
    <div className="w-full flex justify-center mb-40">
      <button
      onClick={handleSubmit}
      style={{
        width: "304px",
        height: "40px",
        borderRadius: "35.9px",
        backgroundColor: "#9996FF",
      }}
      className="text-white text-sm font-bold"
    >
      {isEditMode ? "수정하기" : "등록하기"}
    </button>
    </div>
        </div>
        </div>
        </div>
      )
    }