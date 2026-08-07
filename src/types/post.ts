// 게시글 데이터 type 정의
export type PostCategory =
  | "DEPARTMENT_JACKET"
  | "MAJOR_BOOKS"
  | "ELECTRONICS"
  | "LIVING_SUPPLIES"
  | "ETC"
  | "EMPTY_SPOTS"

export type PostStatus = "ACTIVE" | "RENTED" | "COMPLETED" | "DELETED"

export type RentalPriceUnit = "HOUR" | "DAY" | "WEEK" | "MONTH" | "SEMESTER"

export interface PostSummary {
  postId: number
  status: PostStatus
  imageUrlList: string[]
  category: PostCategory
  title: string
  description: string
  rentalStartTime: string
  rentalEndTime: string
  rentalPrice: number
  rentalPriceUnit: RentalPriceUnit
  authorNickname: string
  likeCount: number
  liked: boolean
  createdAt: string
}

export interface ApiResponse<T> {
  isSuccess: boolean
  code: string
  message: string
  result: T
}

// 게시글 생성 요청 타입
export interface CreatePostRequest {
  imageUrlList: string[]
  category: PostCategory
  title: string
  description: string
  rentalStartTime: string
  rentalEndTime: string
  rentalPrice: number
  rentalPriceUnit: RentalPriceUnit
}

// 게시글 수정 요청 타입
export interface UpdatePostRequest extends CreatePostRequest {}

// 내 작성 게시물 조회 응답 타입 (GET /api/v1/members/posts)
export interface MemberPostItem {
  postId: number
  postStatus: PostStatus | string
  postCategory: PostCategory | string
  price: number
  priceUnit: RentalPriceUnit | string
  postTitle: string
  postDescription: string
  requestCreatedAt: string
  leftMinutes: number
  location?: string
  floor?: number
  seatNumber?: number
}