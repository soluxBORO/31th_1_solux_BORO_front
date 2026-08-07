// src/lib/axios.ts
import axios from 'axios';
import { reissueToken } from '../api/auth';


/* 
1. 모든 요청에 자동으로 토큰 붙여서 보냄
2. 401 에러(토큰 만료/없음) 나면
3. 자동으로 "토큰 다시 발급해줘" 시도
4. 성공하면 → 원래 요청 다시 보냄
5. 실패하면 → 로그인 페이지로 이동 
*/

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// 1. 요청 Interceptor: API 요청을 보낼 때마다 저장된 Access Token을 헤더에 첨부
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. 응답 Interceptor: 401 (인증실패/토큰만료) 발생 시 자동으로 reissueToken 호출
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        //무한루프 방지 코드
        if (originalRequest?.url?.includes('/auth/reissue')) {
            localStorage.removeItem('accessToken');
            return Promise.reject(error);
        }
        // 401 에러이고, 아직 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 토큰 재발급 API 호출 (withCredentials: true 덕분에 쿠키의 refreshToken도 함께 전달됨)
                const res = await reissueToken();

                if (res.isSuccess) {
                    const newAccessToken = res.result.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    // 새로 받아온 Access Token으로 헤더를 바꾸고 실패했던 요청 다시 보냄
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (reissueError) {
                // Refresh Token도 만료된 경우 로그인 페이지로 이동
                localStorage.removeItem('accessToken');
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;