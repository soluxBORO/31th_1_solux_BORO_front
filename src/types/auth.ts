// 공통 API 응답 구조
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}

// 1. 회원가입
// request body
export interface SignUpRequest {
    signUpToken: string;
    nickname: string;
    studentNumber: string;
}

// responses
export interface TokenResult {
    memberId: number;
    accessToken: string;
    refreshToken: string;
}

export type SignUpResponse = ApiResponse<TokenResult>;

// 2. 토큰 재발급 Response
// responses
export interface AccessTokenResult {
    memberId: number;
    accessToken: string;
}

export type ReissueResponse = ApiResponse<AccessTokenResult>;

// 3. 구글 소셜 로그인

export interface GoogleCallbackRequest {
    code: string;
}

// responses
export type AuthStatus = 'LOGIN' | 'NEED_SIGNUP';

export interface LoginResult {
    authStatus: AuthStatus;
    accessToken?: string;
    refreshToken?: string;
    signUpToken?: string;
    email?: string;
    name?: string;
}

export type GoogleCallbackResponse = ApiResponse<LoginResult>;


// 4. 닉네임 중복 확인
// Request Parameter
export interface NicknameCheckParams {
    nickname: string;
}

// Result DTO
export interface NicknameCheck {
    nickname: string;
    available: boolean;
}

// Response
export type NicknameCheckResponse = ApiResponse<NicknameCheck>;