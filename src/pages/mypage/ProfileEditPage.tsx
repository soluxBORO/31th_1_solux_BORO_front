import { ArrowLeft, Camera, User, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { getMemberInfo, updateMemberInfo } from "../../api/member"
import { getPresignedUrl } from "../../api/file"


interface UserProfile {
  nickname: string
  phoneNumber: string
  profileImageUrl?: string
}

const sanitizePhoneNumber = (formattedNumber: string): string => {
  return formattedNumber.replace(/\D/g, "")
}

const formatPhoneNumber = (rawNumber: string): string => {
  const cleaned = rawNumber.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)} - ${cleaned.slice(3, 7)} - ${cleaned.slice(7)}`
  }
  return rawNumber
}

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [nickname, setNickname] = useState("")
  const [phone, setPhone] = useState("")
  const [intro, setIntro] = useState("안녕하세요! 성실하게 거래합니다.")
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined)

  const [school, setSchool] = useState("")
  const [studentId, setStudentId] = useState("")

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  // GET 데이터 조회
useEffect(() => {
  const fetchProfile = async () => {

    
    setIsLoading(true)
    try {
      const res = await getMemberInfo()
      const member = res.data.result
      setNickname(member.nickname)
      setProfileImageUrl(member.profileUrl)
      setSchool("숙명여자대학교")
      setStudentId(member.studentNumber)
      setEmail(member.email)  // ← 추가!
    } catch (err) {
      console.error("내 정보 조회 실패:", err)
    } finally {
      setIsLoading(false)
    }
  }
  fetchProfile()
}, [])

  // 카메라 버튼 클릭 시 숨겨진 파일 선택창 열기
  const handleCameraButtonClick = () => {
    fileInputRef.current?.click()
  }

  // 사진 선택 완료 시 실제 서버에 업로드
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const presignedRes = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
      })
      const { presignedUrl, fileUrl } = presignedRes.data.result

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      })

      setProfileImageUrl(fileUrl)
    } catch (err) {
      console.error("프로필 사진 업로드 실패:", err)
      alert("사진 업로드에 실패했어요!")
    } finally {
      setIsLoading(false)
    }
  }

  // 프로필 수정 저장
  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateMemberInfo({
        profileUrl: profileImageUrl || "",
        nickname,
        phoneNumber: phone,
      })
      navigate(-1)
    } catch (err) {
      console.error("프로필 수정 실패:", err)
      alert("저장에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const labelStyle = {
    fontFamily: "Pretendard",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "100%",
  }

  return (
    <div className="w-full h-full relative bg-white flex flex-col overflow-hidden">
      
      {/* 숨겨진 파일 Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden vertical-scroll">
        <div className="w-[402px] flex flex-col bg-white pb-10">
          
          {/* 헤더 */}
          <div className="relative w-full h-[80px] bg-white flex-shrink-0">
            <button 
              onClick={() => setShowCancelModal(true)}
              className="absolute left-[30px] top-[43px] -translate-y-1/2 w-6 h-6 flex items-center justify-center"
            >
              <ArrowLeft size={24} strokeWidth={2.5} className="text-[#1A1A1A]" />
            </button>

            <span
              className="absolute text-[#1A1A1A] whitespace-nowrap"
              style={{ left: "60px", top: "34px", fontFamily: "Pretendard", fontWeight: 700, fontSize: "16px" }}
            >
              프로필 수정
            </span>

            <button
              onClick={handleSave}
              className="absolute right-[30px] top-[26px] w-[73px] h-[34px] rounded-[40px] bg-[#9996FF] flex items-center justify-center active:opacity-80"
            >
              <span className="text-white text-[14px] text-center font-medium">저장</span>
            </button>
          </div>

          {/* 프로필 사진 카드 */}
          <div 
            className="relative bg-[#E6E6E6] flex-shrink-0"
            style={{ width: "334px", height: "195px", marginLeft: "30px", marginTop: "12px", borderRadius: "40px" }}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden"
              style={{ width: "71px", height: "71px", top: "37px", backgroundColor: "#CCCCCC", borderRadius: "50%" }}
            >
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="프로필 미리보기" className="w-full h-full object-cover" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="#7F7F7F" strokeWidth="1.58" style={{ width: "36px", height: "36px" }}>
                  <circle cx="12" cy="7" r="3.2" />
                  <rect x="3.5" y="13.5" width="17" height="6.2" rx="3.1" />
                </svg>
              )}
            </div>

            <button
              onClick={handleCameraButtonClick}
              type="button"
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center active:opacity-90 cursor-pointer"
              style={{ width: "76px", height: "34px", top: "95px", borderRadius: "40px", backgroundColor: "#9996FF" }}
            >
              <svg viewBox="0 0 24 24" style={{ width: "26px", height: "22px" }}>
                <path d="M4 6h3l1.5-2.5h7L17 6h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="white" />
                <circle cx="12" cy="12.5" r="4.2" fill="#9996FF" />
                <circle cx="12" cy="12.5" r="2.0" fill="white" />
              </svg>
            </button>

            <span
              className="absolute text-[#7F7F7F] text-center block left-1/2 -translate-x-1/2 whitespace-nowrap"
              style={{ top: "141px", width: "80px", height: "14px", fontFamily: "Pretendard", fontWeight: 400, fontSize: "12px" }}
            >
              프로필 사진 변경
            </span>
          </div>

          {/* 입력 폼 카드 */}
          <div 
            className="bg-white flex flex-col justify-between flex-shrink-0"
            style={{
              width: "334px",
              height: "505px",
              marginLeft: "34px",
              marginTop: "20px",
              borderRadius: "40px",
              border: "1px solid #CCCCCC",
              padding: "24px 26px 28px 26px"
            }}
          >
            {/* 닉네임 */}
            <div>
              <label className="text-[#1A1A1A] mb-2.5 block" style={labelStyle}>닉네임</label>
              <div className="relative flex items-center w-[138px] h-[46px] bg-[#E6E6E6] rounded-[40px]">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full h-full bg-transparent outline-none px-[26px] text-[#1A1A1A] text-[12px]"
                />
              </div>
            </div>

            {/* 자기소개 */}
            <div>
              <label className="text-[#1A1A1A] mb-2.5 block" style={labelStyle}>자기소개</label>
              <div className="relative flex items-center w-full h-[46px] bg-[#E6E6E6] rounded-[40px]">
                <input
                  type="text"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  maxLength={200}
                  className="w-full h-full bg-transparent outline-none px-[26px] text-[#1A1A1A] text-[12px]"
                />
              </div>
              <p className="text-[11px] text-[#B3B3B3] text-left mt-1.5 pl-2">{intro.length}/200</p>
            </div>

            <div className="border-t border-[#CCCCCC] my-0.5" />

            {/* 대학교 */}
            <div>
              <p className="text-[#7F7F7F] mb-1.5" style={labelStyle}>대학교</p>
              <p className="text-[#1A1A1A] font-bold text-[14px]">{school}</p>
              <p className="text-[11px] text-[#B3B3B3] mt-1.5">학교 정보는 변경할 수 없습니다</p>
            </div>

            {/* 학번 */}
            <div>
              <p className="text-[#7F7F7F] mb-1.5" style={labelStyle}>학번</p>
              <p className="text-[#1A1A1A] font-bold text-[14px]">{studentId}</p>
              <p className="text-[11px] text-[#B3B3B3] mt-1.5">학번 정보는 변경할 수 없습니다</p>
            </div>
            
             {/* 이메일 */}
            <div>
              <p className="text-[#7F7F7F] mb-1.5" style={labelStyle}>학교 이메일</p>
              <p className="text-[#1A1A1A] font-bold text-[14px]">{email}</p>
              <p className="text-[11px] text-[#B3B3B3] mt-1.5">학교 이메일 정보는 변경할 수 없습니다</p>
            </div>

          </div>

        </div>
      </div>

      {/* 모달 하단 요소 간격이 넓어진 취소 모달 */}
      {showCancelModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity">          
          <div 
            className="bg-white flex flex-col items-center shadow-xl box-border opacity-100"
            style={{
              width: "350px",
              height: "305px",
              borderRadius: "40px",
              paddingTop: "40px",
              paddingBottom: "24px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            {/* 1. 느낌표 아이콘 원 */}
            <div 
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#FFDBC8",
                borderRadius: "50%",
                marginBottom: "30px"
              }}
            >
              <AlertCircle 
                style={{ width: "25px", height: "25px" }} 
                className="text-[#FF5E00]" 
                strokeWidth={2.2}
              />
            </div>

            {/* 2. 타이틀 */}
            <p 
              className="text-[#1A1A1A] text-center whitespace-nowrap w-full flex items-center justify-center flex-shrink-0"
              style={{
                fontFamily: "Pretendard",
                fontWeight: 700,
                fontSize: "19px",
                lineHeight: "100%",
                letterSpacing: "0.2px",
                marginBottom: "30px" // ⬇️ 타이틀-설명문 간격 확장 (12px -> 18px)
              }}
            >
              프로필 수정을 취소하시겠어요?
            </p>

            {/* 3. 설명 텍스트 (더 아래로 내려감) */}
            <p 
              className="text-[#8E8E93] text-center w-full flex items-center justify-center flex-shrink-0"
              style={{
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "100%",
                letterSpacing: "0.1px",
                marginBottom: "25px" // ⬇️ 설명문-버튼 간격 확장 (28px -> 36px)
              }}
            >
              변경사항이 저장되지 않습니다.
            </p>

            {/* 4. 하단 버튼 영역 (더 아래로 내려감) */}
            <div className="flex justify-center gap-3 w-full flex-shrink-0">
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-[130px] h-[44px] rounded-[40px] border border-[#A0A0A0] bg-white font-semibold text-[14px] text-[#1A1A1A] active:bg-gray-50 transition-colors"
              >
                계속 수정
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-[130px] h-[44px] rounded-[40px] bg-[#9996FF] font-semibold text-[14px] text-white active:bg-[#8582f2] transition-colors"
              >
                취소하기
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
