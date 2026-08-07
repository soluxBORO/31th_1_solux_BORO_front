import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { googleCallback } from "../../api/auth";
import { jwtDecode } from "jwt-decode";


interface JwtPayload {
    sub?: string;
    memberId?: number | string;
    userId?: number | string;
    exp?: number;
    iat?: number;
}

export default function GoogleCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code"); // URL 주소창에서 ?code=xxxx 추출

    // React Strict Mode로 인한 API 중복 호출 방지용 플래그
    const isCalled = useRef(false);

    useEffect(() => {
        // code가 없거나 이미 API를 호출한 경우 실행하지 않음
        if (!code || isCalled.current) return;
        isCalled.current = true; // 호출 완료 상태로 변경

        const handleAuth = async () => {
            try {
                // 1. 백엔드로 code를 보내고 JSON 응답 받기
                const response = await googleCallback({ code });

                // 2. 백엔드가 보낸 JSON 결과 처리
                if (response.isSuccess) {
                    const { authStatus, accessToken, signUpToken, email, name } = response.result;

                    // 신규 회원 -> 회원가입 페이지로 이동 (state로 토큰 전달)
                    if (authStatus === "NEED_SIGNUP") {
                        navigate("/signup", {
                            state: {
                                signUpToken,
                                email,
                                name,
                            },
                        });
                    } 
                    // 기존 회원 -> 토큰 저장 후 메인 페이지로 이동
                    else if (authStatus === "LOGIN" || accessToken) {
                        if (accessToken) {
                            localStorage.setItem("accessToken", accessToken);

                            try {
                                // JWT 토큰 페이로드 디코딩
                                const decoded = jwtDecode<JwtPayload>(accessToken);
                                const memberId = decoded.memberId || decoded.sub || decoded.userId;
                                
                                if (memberId) {
                                    localStorage.setItem("memberId", String(memberId));
                                }
                            } catch (error) {
                                console.error("토큰 디코딩 실패:", error);
                            }
                        }
                        
                        //alert("로그인에 성공하였습니다.");
                        navigate("/");
                    }
                } else {
                    alert(response.message || "로그인 처리 중 오류가 발생했습니다.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("로그인 API 에러:", error);
                alert("로그인 처리 중 오류가 발생했습니다.");
                navigate("/login");
            }
        };

        handleAuth();
    }, [code, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-200 bg-white">
            <p className="text-[14px] text-gray-400">구글 로그인 처리 중입니다...</p>
            <p className="text-[12px] text-gray-400 mt-2">잠시만 기다려 주세요.</p>
        </div>
    );
}