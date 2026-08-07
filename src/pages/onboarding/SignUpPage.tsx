// 회원가입
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
// import { signUp } from "../api/auth"; // 실제 API 연결 시 주석 해제
import { mockSignUp } from "../../api/mockAuth";

export default function SignUpPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 소셜 로그인(LoginPage)에서 넘어온 signUpToken이 있다면 가져오기 (없으면 테스트용 임시값)
    const signUpToken = location.state?.signUpToken || "mock-signup-token-12345";

    // 1. 입력 필드 상태 관리
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [nickname, setNickname] = useState("");

    // 2. 검증 및 인증 관련 상태 관리
    const [isNicknameChecked, setIsNicknameChecked] = useState(false); // 닉네임 중복확인 여부
    const [isEmailVerified, setIsEmailVerified] = useState(false);     // 이메일 인증 완료 여부

    // 닉네임 중복확인 핸들러
    const handleNicknameCheck = () => {
        if (!nickname.trim()) {
            alert("닉네임을 입력해주세요.");
            return;
        }
        // [수정] 여러 번 테스트가 가능하도록 true 설정 및 alert만 실행 (버튼 텍스트는 바꾸지 않음)
        setIsNicknameChecked(true);
        alert("사용 가능한 닉네임입니다.");
    };

    // [추가] 사용자가 닉네임을 새로 타이핑하면 다시 중복확인을 받도록 상태를 리셋
    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
        setIsNicknameChecked(false); // 새로운 값을 입력하면 중복확인 취소 상태로 변경
    };

    // 이메일 인증하기 핸들러
    const handleEmailVerify = () => {
        if (!email.trim() || !email.includes("@") || !email.includes("ac.kr")) {
            alert("올바른 학교 이메일을 입력해주세요.");
            return;
        }
        setIsEmailVerified(true);
        alert("이메일 인증이 완료되었습니다.");
    };

    // 회원가입 완료하기 버튼 활성화 조건 충족 여부
    const isFormValid = 
        email.trim() !== "" && 
        name.trim() !== "" && 
        studentNumber.trim() !== "" && 
        nickname.trim() !== "" && 
        isNicknameChecked && 
        isEmailVerified;

    // 회원가입 완료 요청 핸들러
    const handleSignUpSubmit = async () => {
        if (!isFormValid) return;

        try {
            const response = await mockSignUp({
                signUpToken,
                nickname,
                studentNumber
            });

            if (response.isSuccess) {
                alert("회원가입에 성공하였습니다.")
                navigate("/login");
            }
        } catch (error) {
            console.error("회원가입 중 에러 발생:", error);
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-h-[874px] max-height-[874px] w-[402px] h-[874px] overflow-y-hidden overflow-x-hidden flex flex-col items-center bg-white px-5">
            
            {/* 상단 뒤로가기 헤더 바 */}
            <div className="w-full flex items-center pt-[35px] pb-[25px] mt-[-5px] pl-2 gap-4">
                <button type="button" onClick={() => navigate("/login")} className="cursor-pointer">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 8.36401C14.5523 8.36401 15 7.9163 15 7.36401C15 6.81173 14.5523 6.36401 14 6.36401V7.36401V8.36401ZM0.292893 6.65691C-0.0976315 7.04743 -0.0976315 7.6806 0.292893 8.07112L6.65685 14.4351C7.04738 14.8256 7.68054 14.8256 8.07107 14.4351C8.46159 14.0446 8.46159 13.4114 8.07107 13.0209L2.41421 7.36401L8.07107 1.70716C8.46159 1.31664 8.46159 0.68347 8.07107 0.292946C7.68054 -0.0975785 7.04738 -0.0975785 6.65685 0.292946L0.292893 6.65691ZM14 7.36401V6.36401L1 6.36401V7.36401V8.36401L14 8.36401V7.36401Z" fill="black"/>
                    </svg>
                </button>
                <span className="text-[16px] text-[#1A1A1A]">로그인으로 돌아가기</span>
            </div>

            {/* 회원가입 카드 섹션 */}
            <div className="flex w-[370px] h-[628px] flex-col rounded-[40px] bg-[#E4E4FF] px-[35px] py-[30px] gap-4">
                <div>
                    <h2 className="text-[16px] font-bold text-[#1A1A1A]">회원가입</h2>
                    <p className="text-[14px] text-[#7F7F7F] mt-1.5">학교 이메일로 안전하게 가입하세요</p>
                </div>

                {/* 학교 이메일 */}
                <div className="flex flex-col gap-1 mt-1">
                    <label htmlFor="email" className="text-[14px] text-[#1A1A1A]">
                        학교 이메일 *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        disabled={isEmailVerified} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@sookmyung.ac.kr"
                        // [수정] w-[304] -> w-[304px], !disabled:bg-[#FFFFFF] -> disabled:!bg-white로 문법 교정
                        className="w-[304px] h-[40px] rounded-[35.9px] bg-white px-5 text-[12px] text-[#1A1A1A] placeholder-[#7F7F7F] focus:outline-none disabled:!bg-white"
                    />
                    <p className="text-[12px] text-[#7F7F7F]">
                        학교 이메일(@ac.kr)만 사용 가능합니다
                    </p>
                </div>

                {/* 이름 */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-[14px] text-[#1A1A1A]">
                        이름 *
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="홍길동"
                        className="w-[133px] h-[40px] rounded-[35.9px] bg-white px-5 text-[12px] text-[#1A1A1A] placeholder-[#7F7F7F] focus:outline-none"
                    />
                </div>

                {/* 학번 */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="studentNumber" className="text-[14px] text-[#1A1A1A]">
                        학번 *
                    </label>
                    <input
                        type="text"
                        id="studentNumber"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                        placeholder="2611111"
                        className="w-[133px] h-[40px] rounded-[35.9px] bg-white px-5 text-[12px] text-[#1A1A1A] placeholder-[#7F7F7F] focus:outline-none"
                    />
                </div>

                {/* 닉네임 */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="nickname" className="text-[14px] text-[#1A1A1A]">
                        닉네임 *
                    </label>
                    <div className="flex w-full gap-2.5">
                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
                            onChange={handleNicknameChange} 
                            placeholder="한글 / 영문 / 숫자 조합 가능"
                            className="flex-1 w-[226px] h-[40px] rounded-[35.9px] bg-white px-5 text-[12px] text-[#1A1A1A] placeholder-[#7F7F7F] focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleNicknameCheck}
                            className="w-[69px] h-[40px] rounded-[35.9px] text-[12px] !font-semibold text-white transition bg-[#D3D3FF] hover:bg-[#b0aeff]"
                        >
                            중복확인
                        </button>
                    </div>
                </div>

                {/* 버튼 영역 (이메일 인증 및 가입 완료) */}
                <div className="flex flex-col gap-3 pt-2">
                    {/* 조건 1: 이메일 인증 버튼 기능 제어 */}
                    <button
                        type="button"
                        onClick={handleEmailVerify}
                        disabled={isEmailVerified}
                        className={`w-[304px] h-[40px] rounded-[35.9px] mt-1 text-[14px] !font-bold text-white transition ${
                            isEmailVerified ? "bg-[#B3B3B3]" : "bg-[#9996FF] hover:bg-[#8582eb]"
                        }`}
                    >
                        {isEmailVerified ? "이메일 인증이 완료되었습니다" : "이메일 인증하기"}
                    </button>

                    {/* 조건 2: 회원가입 완료하기 버튼 동적 색상 및 활성화 제어 */}
                    <button
                        type="button"
                        onClick={handleSignUpSubmit}
                        disabled={!isFormValid}
                        className={`w-[304px] h-[40px] rounded-[35.9px] mt-1.5 text-[14px] text-white transition ${
                            isFormValid ? "bg-[#9996FF] !font-bold hover:bg-[#8582eb] cursor-pointer" : "bg-[#B3B3B3]"
                        }`}
                    >
                        회원가입 완료하기
                    </button>
                </div>

                {/* 로그인 이동 링크 */}
                <div className="flex items-center justify-center gap-1.5 text-center text-[12px] text-[#7F7F7F] pt-2.5">
                    <span>이미 계정이 있으신가요?</span>
                    <Link to="/login" className="font-semibold text-[#0077FF]">
                        로그인
                    </Link>
                </div>
            </div>

            {/* 하단 회원가입 안내 섹션 */}
            <div className="w-[370px] h-[127px] shrink-0 border-[3px] border-[#9996FF] rounded-[40px] p-[15px] pl-6 mt-5 mb-10 bg-white">
                <h3 className="text-[14px] font-bold text-[#9996FF] mb-2">회원가입 안내</h3>
                <ul className="flex flex-col gap-1 text-[12px] text-[#1A1A1A]">
                    <li className="flex items-center gap-2">
                        <span className="text-[4px]">●</span>
                        <span>학교 이메일 인증이 필요합니다</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-[4px]">●</span>
                        <span>학생 신분이 확인된 회원만 이용 가능합니다</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-[4px]">●</span>
                        <span>허위 정보 입력 시 이용이 제한될 수 있습니다</span>
                    </li>
                </ul>
            </div>

        </div>
    );
}