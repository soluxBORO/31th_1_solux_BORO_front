import type { ApiResponse, SignUpRequest, SignUpResponse, SocialLoginResponse, ReissueResponse } from '../types/auth';

// 가상 딜레이 함수 (0.5초 대기 후 응답)
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/* 1. 회원가입 Mock API */
export const mockSignUp = async (data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> => {
    await delay();
    // 미사용 변수 에러를 방지하기 위해 콘솔로그를 남겨줌
    console.log('Mock SignUp Data:', data);

    return {
        isSuccess: true,
        code: 'COMMON200_1',
        message: '성공한 요청입니다.',
        result: {
            memberId: 1,
            accessToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWQiOjEsImlhdCI6MTc4MzY2NzIxOSwiZXhwIjoxNzgzNjcwODE5fQ.eTuO5wMRo3ChpTbFuA9cFgS9aI2ldpzxed-7V4Z4ZSIHf8R_IpI752Bxm9fxPUErOA8oL-MzS1tGWjK5DGSstg',
            refreshToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWQiOjEsImlhdCI6MTc4MzY2NzIxOSwiZXhwIjoxNzgzNjc3MjE5fQ.iiggQ_Qa2lcLP0qvcF1knGIVKX4F85-1KZCl0ztUVnXqlYxS0AwDx69xcwKdQDQt-chhVGKtVtaRype_VpKGsA'
        }
    };
};

/* 2. 소셜 로그인 Mock API */
export const mockGoogleLoginCallback = async (code: string): Promise<ApiResponse<SocialLoginResponse>> => {
    await delay();

    if (code === 'new-user') {
        // 회원가입 안 한 경우
        return {
        isSuccess: true,
        code: 'COMMON200_1',
        message: '성공한 요청입니다.',
        result: {
            authStatus: 'NEED_SIGNUP',
            accessToken: null,
            refreshToken: null,
            signUpToken: 'eyJhbGciOiJIUzUxMiJ9.eyJ0eXBlIjoiU0lHTlVQIiwic29jaWFsVHlwZSI6IkdPT0dMRSIsInByb3ZpZGVySWQiOiMxMTA0MDQ2MTY1NDYzNTc2NDk2NzIiLCJlbWFpbCI6ImNoZXN1bm55QHNvb2tteXVuZy5hYy5rciIsIm5hbWUiOiLsoJzsnKDsp4QiLCJpYXQiOjE3ODM2Njc1OTcsImV4cCI6MTc4MzY2ODE5N30.8nzIDjiuBRxa55zFZcS4Wz7rxW1mAglSiqj2pFdJqPklPiHIrP9sVxlae_BrYRMtyfvlRKnxT0epWB-icyBZ1Q',
            email: 'chesunny@sookmyung.ac.kr',
            name: '제유진'
        }
        };
    }

    // 이미 회원가입이 된 경우
    return {
        isSuccess: true,
        code: 'COMMON200_1',
        message: '성공한 요청입니다.',
        result: {
            authStatus: 'LOGIN',
            accessToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWQiOjEsImlhdCI6MTc4MzY2ODA5OCwiZXhwIjoxNzgzNjcxNjk4fQ.Rk5oRyhONb4ecdjznrbiLQPtNnJeAg_1XT_kXU0pQ4J_T0QegfWp2iMFIyRhm2Hx08PsvkZnAExhiv6Y05ox0A',
            refreshToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWQiOjEsImlhdCI6MTc4MzY2ODA5OCwiZXhwIjoxNzgzNjc4MDk4fQ.4WqRXfUTpslfIwSqrmlRwn6LzcQ24a6hfyGmBBw6NiWOJ53GE68x-eOVkx6aHBWm6OCqMHggVXpQZoRq6yF8Kg',
            signUpToken: null,
            email: null,
            name: null
        }
    };
};

/* 3. 액세스 토큰 재발급 Mock API */
export const mockReissueToken = async (refreshToken: string): Promise<ApiResponse<ReissueResponse>> => {
    await delay();
    // 미사용 변수 에러를 방지하기 위해 콘솔로그를 남겨줌
    console.log('Mocking token reissue for:', refreshToken);

    return {
        isSuccess: true,
        code: 'COMMON200_1',
        message: '성공한 요청입니다.',
        result: {
            memberId: 1,
            accessToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWQiOjEsImlhdCI6MTc4MzY2ODA5OCwiZXhwIjoxNzgzNjcxNjk4fQ.Rk5oRyhONb4ecdjznrbiLQPtNnJeAg_1XT_kXU0pQ4J_T0QegfWp2iMFIyRhm2Hx08PsvkZnAExhiv6Y05ox0A'
        }
    };
};