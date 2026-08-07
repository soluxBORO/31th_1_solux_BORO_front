// 공통 API 응답 구조 인터페이스
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}

// 1. 회원가입
export interface SignUpRequest {
    signUpToken: string;
    nickname: string;           // !!!! nickName인지 nickname인지 확인하기 !!!!
    studentNumber: string;
}

export interface SignUpResponse {
    memberId: number;
    accessToken: string;
    refreshToken: string;
}

// 2. 소셜 로그인
export type AuthStatus = 'NEED_SIGNUP' | 'LOGIN';

export interface SocialLoginRequest {
  code: string; // 구글 인가 코드 등 callback 시 전달받을 파라미터
}

export interface SocialLoginResponse {
    authStatus: AuthStatus;
    accessToken: string | null;
    refreshToken: string | null;
    signUpToken: string | null;
    email: string | null;
    name: string | null;
}

// 3. 토큰 재발급
export interface ReissueResponse {
    memberId: number;
    accessToken: string;
}