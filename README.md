# 31th_1_solux_BORO_front
solux 31th BORO team Front End
<p align="center">
  <img src="public/logo1.png" alt="바로 로고" width="70%" />
</p>

## 🌀 BORO (바로)
> 바로 송이끼리! 대학생만의 신뢰 기반 대여 플랫폼

<br>

## 💻 프로젝트 소개
- **개발 기간**: 202X.XX.XX ~ 202X.XX.XX (X주)
- **배포 주소**: [boro](https://your-deploy-url.com)
- **기획 의도**: 프로젝트를 왜 만들었는지, 어떤 문제를 해결하는지 작성합니다.

<br>

## 🛠 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Environment & Tools
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

<br>

## ✨ 기능 소개

### 온보딩

| 로그인 | 회원가입 | 
| :---: | :---: |
| <img src="" width="300"> | <img src="" width="300"> |
| Google Social Login 지원 | 인증된 이메일, 이름<br>자동입력 |

<br>

### 홈

| 전체 대여 | 빈자리 핫클립 | 글쓰기 |
| :---: | :---: | :---: |
| <img src="" width="300"> | <img src="" width="300"> | <img src="" width="300"> |
| 물품 게시글<br>상세보기<br>채팅 &rarr; 대여요청  | 빈자리 게시글<br>상세보기<br>채팅 &rarr; 대여요청 | 물품, 빈자리 게시글 작성

<br>

### 대여현황

| 내가 빌려준 것 | 내가 빌린 것 | 
| :---: | :---: |
| <img src="" width="300"> | <img src="" width="300"> |
| Google Social Login 지원 | 인증된 이메일, 이름<br>자동입력 |

### 채팅

### 마이페이지

<br>

## 🏃 시작하기
로컬 환경에서 프로젝트를 실행하는 방법입니다.

### 1. 저장소 클론 (Clone the repository)
```bash
git clone https://github.com
cd repository-name
```

### 2. 환경 변수 설정 (Environment Variables)
루트 디렉토리에 `.env.local` 파일을 생성하고 아래 내용을 입력하세요.
```env
VITE_API_BASE_URL=https://yourdomain.com
```

### 3. 패키지 설치 및 실행 (Installation & Run)
```bash
# 의존성 패키지 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

## 📂 프로젝트 구조
```text
src/
├── assets/          # 이미지, 폰트 등의 정적 파일
├── components/      # 공통 재사용 컴포넌트
├── constants/       # 상수 관리
├── hooks/           # 커스텀 훅
├── pages/           # 라우팅 페이지 컴포넌트
├── services/        # API 요청 모듈 (Axios 등)
├── store/           # 전역 상태 관리 (Zustand 등)
├── types/           # TypeScript 타입 정의
├── App.tsx          # 최상위 컴포넌트
└── main.tsx         # 엔트리 포인트
```

## 👥 팀원 소개

| **홍길동 (팀장)** | **임꺽정 (팀원)** |
| :---: | :---: |
| <img src="https://github.com" width="100"> | <img src="https://github.com" width="100"> |
| [@gildong](https://github.com) | [@kkeokjeong](https://github.com) |
| **Role**: UI/UX, 전역 상태 설계 | **Role**: API 연동, 성능 최적화 |
