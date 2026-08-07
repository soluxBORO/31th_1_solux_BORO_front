// 회원가입 페이지

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { signUp, checkNickname } from "../../api/auth";
import type { SignUpRequest } from "../../types/auth";

export default function SignUpPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 소셜 로그인 리다이렉트 시 넘어온 state 값
    const signUpToken: string | undefined = location.state?.signUpToken;
    const initialEmail: string = location.state?.email || "";
    const initialName: string = location.state?.name || "";
    const isAlertShown = useRef(false);

    // 2. direct 접근 및 signUpToken 유무 검증
    useEffect(() => {
        if (isAlertShown.current) return;

        if (!signUpToken) {
            isAlertShown.current = true;
            alert("회원가입이 필요합니다");
            navigate("/login");
            return;
        }

        if (!initialEmail.endsWith(".ac.kr")) {
            isAlertShown.current = true;
            alert("학교 이메일 계정(.ac.kr)만 회원가입이 가능합니다.");
            navigate("/login");
        }
    }, [signUpToken, initialEmail, navigate]);

    // 3. email, name 상태 고정 (readOnly)
    const [email] = useState(initialEmail);
    const [name] = useState(initialName);
    const [studentNumber, setStudentNumber] = useState("");
    const [nickname, setNickname] = useState("");

    // 검증 관련 상태 관리
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    // 닉네임 중복확인 핸들러 (API 연동)
    const handleNicknameCheck = async () => {
        if (!nickname.trim()) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        try {
            const response = await checkNickname({ nickname: nickname.trim() });

            if (response.isSuccess) {
                if (response.result.available) {
                    setIsNicknameChecked(true);
                    alert("사용 가능한 닉네임입니다.");
                } else {
                    setIsNicknameChecked(false);
                    alert("이미 사용 중인 닉네임입니다.");
                }
            } else {
                setIsNicknameChecked(false);
                alert(response.message || "닉네임 중복 확인에 실패했습니다.");
            }
        } catch (error) {
            console.error("닉네임 중복 확인 실패:", error);
            setIsNicknameChecked(false);
            alert("닉네임 중복 확인 중 오류가 발생했습니다.");
        }
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
        setIsNicknameChecked(false);
    };

    // 회원가입 완료하기 버튼 활성화 조건
    const isFormValid = 
        studentNumber.trim() !== "" && 
        nickname.trim() !== "" && 
        isNicknameChecked;

    // 회원가입 완료 요청 핸들러
    const handleSignUpSubmit = async () => {
        if (!isFormValid || !signUpToken) return;

        try {
            const signUpData: SignUpRequest = {
                signUpToken,
                nickname,
                studentNumber,
            };

            const response = await signUp(signUpData);

            if (response.isSuccess) {
                alert("회원가입에 성공하였습니다.");
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

                {/* 학교 이메일 (readOnly 마킹) */}
                <div className="flex flex-col gap-1 mt-1">
                    <label htmlFor="email" className="text-[14px] text-[#1A1A1A]">
                        학교 이메일 *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        readOnly
                        placeholder="example@sookmyung.ac.kr"
                        className="w-[304px] h-[40px] rounded-[35.9px] bg-white px-5 text-[12px] text-[#1A1A1A] placeholder-[#7F7F7F] focus:outline-none"
                    />
                    <p className="text-[12px] text-[#7F7F7F]">
                        학교 이메일(@ac.kr)만 사용 가능합니다
                    </p>
                </div>

                {/* 이름 (readOnly 마킹) */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-[14px] text-[#1A1A1A]">
                        이름 *
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        readOnly
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

                {/* 회원가입 완료 버튼 영역 */}
                <div className="flex flex-col gap-3 pt-2">
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