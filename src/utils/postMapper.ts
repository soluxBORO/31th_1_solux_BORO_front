// 게시글 관련 유틸리티 함수 및 상수 정의
// 한글로 변역

import type { PostCategory, PostStatus, RentalPriceUnit } from "../types/post"

export const categoryLabel: Record<PostCategory, string> = {
  DEPARTMENT_JACKET: "과잠",
  MAJOR_BOOKS: "전공서적",
  ELECTRONICS: "전자기기",
  LIVING_SUPPLIES: "생활용품",
  ETC: "기타",
  EMPTY_SPOTS: "빈자리",
}

export const statusLabel: Record<PostStatus, string> = {
  ACTIVE: "대여가능",
  RENTED: "대여중",
  COMPLETED: "대여완료",
  DELETED: "삭제됨",
}

export const priceUnitLabel: Record<RentalPriceUnit, string> = {
  HOUR: "시간",
  DAY: "일",
  WEEK: "주",
  MONTH: "월",
  SEMESTER: "학기",
}