// 로그인
import { useState } from "react";                       // useEffect
import { useNavigate, Link } from "react-router-dom";
// import { googleLoginCallback } from "../api/auth";   // 실제 API 연결 시 주석 해제
import { mockGoogleLoginCallback } from "../../api/mockAuth";
// import type { SocialLoginResponse } from "../../types/auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleGoogleLogin = async () => {
        try {
            const response = await mockGoogleLoginCallback("existing-user"); 
            
            if (response.isSuccess) {
                const { authStatus, accessToken, signUpToken } = response.result;
                
                if (authStatus === "NEED_SIGNUP") {
                    navigate("/signup", { state: { signUpToken } });
                } else {
                    if (accessToken) localStorage.setItem("accessToken", accessToken);
                    navigate("/"); 
                }
            }
        } catch (error) {
            console.error("로그인 중 에러 발생:", error);
        }
    };

    return (
        <div className="relative min-w-[402px] max-w-[402px] min-h-[874px] max-height-[874px] w-[402px] h-[874px] overflow-y-auto overflow-x-hidden flex flex-col items-center bg-white">
            
            {/* 1. 상단 로고 및 슬로건 섹션 */}
            <div className="flex flex-col items-center text-center mt-[123px] gap-0.5">
                <img src="/logo1.png" alt="BORO 로고" className="h-[58px] w-auto" />
                <h1 className="text-[14px] text-[#1A1A1A] mt-1.5">바로, 송이끼리!</h1>
                <p className="text-[12px] text-[#7F7F7F]">대학생만의 신뢰 기반 대여 플랫폼</p>
            </div>

            {/* 2. 로그인 폼 카드 섹션 */}
            <div className="flex w-[370px] h-[356px] flex-col rounded-[40px] bg-[#E4E4FF] mt-10 p-8">
                <h2 className="text-[16px] font-bold text-[#1A1A1A] ml-1">로그인</h2>

                {/* 이메일 입력 섹션 */}
                <div className="flex flex-col gap-[4px] mt-3">
                    <label htmlFor="email" className="text-[14px] text-[#1A1A1A] pl-1">
                        학교 이메일
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@sookmyung.ac.kr"
                        className="w-[304px] h-[40px] rounded-[35.9px] bg-white px-6 py-4 text-[12px] text-[#1A1A1A] placeholder-[#7F7F7F] focus:outline-none"
                    />
                    <p className="pl-1 text-[12px] text-[#7F7F7F]">
                        학교 이메일(@ac.kr)만 사용 가능합니다
                    </p>
                </div>

                {/* 소셜 및 일반 로그인 버튼 섹션 */}
                <div className="flex flex-col gap-3">
                    <label className="text-[14px] text-[#1A1A1A] pl-1 mt-3">
                        학교 이메일로 로그인하기
                    </label>

                    {/* Google 로그인 버튼 */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex w-[304px] h-[40px] mt-[-5px] items-center justify-center gap-3 rounded-[35.9px] bg-white transition hover:bg-gray-50"
                    >
                        <img
                        src="https://www.google.com/images/branding/product/2x/googleg_32dp.png"
                        alt="Google"
                        className="h-[17px] w-[17px]"
                        />
                        <span className="text-[12px] text-[#1A1A1A]">구글 계정으로 로그인하기</span>
                    </button>

                    {/* 일반 로그인 버튼 */}
                    <button
                        type="button"
                        className="w-[304px] h-[40px] rounded-[35.9px] bg-[#9996FF] text-[14px] !font-bold text-white transition hover:bg-[#7a7eff]"
                    >
                        로그인
                    </button>
                </div>

                {/* 3. 회원가입 유도 링크 섹션 (비율 조정) */}
                <div className="flex items-center justify-center gap-2 text-center text-[12px] text-[#7F7F7F] mt-6">
                    <span>계정이 없으신가요?</span>
                    <Link to="/signup" className="font-semibold text-[#0077FF]">
                        회원가입
                    </Link>
                </div>
            </div>

            {/* 4. 하단 서비스 소개 카드 섹션 (디자인 비율 조정) */}
            <div className="flex flex-col w-[370px] h-[162px] gap-3 rounded-[40px] bg-[#F0F0FF] p-6 mt-6">
                <h3 className="text-[16px] font-bold text-[#1A1A1A] pl-2">‘바로’ 는?</h3>
                
                {/* 서비스 소개 목록 */}
                <ul className="flex flex-col text-[14px] text-[#7F7F7F] gap-1">
                    <li className="flex items-start gap-2">
                        <svg className="w-3 h-2 mt-1.5" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.59 0L6 4.94467L1.41 0L0 1.52227L6 8L12 1.52227L10.59 0Z" fill="#7F7F7F"/>
                        </svg>
                        <span>과잠, 전공서적 등 대학생 특화 대여</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <svg className="w-3 h-2 mt-1.5" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.59 0L6 4.94467L1.41 0L0 1.52227L6 8L12 1.52227L10.59 0Z" fill="#7F7F7F"/>
                        </svg>
                        <span>도서관/카페 빈자리 실시간 양도</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <svg className="w-3 h-2 mt-1.5" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.59 0L6 4.94467L1.41 0L0 1.52227L6 8L12 1.52227L10.59 0Z" fill="#7F7F7F"/>
                        </svg>
                        <span>학교 인증으로 안전한 거래</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}