import axios from 'axios';
import type { ApiResponse, SignUpRequest, SignUpResponse, SocialLoginResponse, ReissueResponse } from '../types/auth';

// 프로젝트 환경에 맞는 Axios 인스턴스를 설정해 주세요.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/* 1. 회원가입 API */
export const signUp = async (data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> => {
    const response = await authApi.post<ApiResponse<SignUpResponse>>('/auth/sign-up', data);
    return response.data;
};

/* 2. 소셜 로그인 (구글 콜백) API */
export const googleLoginCallback = async (code: string): Promise<ApiResponse<SocialLoginResponse>> => {
    const response = await authApi.post<ApiResponse<SocialLoginResponse>>('/auth/google/callback', { code });
    return response.data;
};

/* 3. 액세스 토큰 재발급 API */
export const reissueToken = async (refreshToken: string): Promise<ApiResponse<ReissueResponse>> => {
    const response = await authApi.post<ApiResponse<ReissueResponse>>(
        '/auth/reissue',
        {},
        {
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        },
        }
    );
    return response.data;
};