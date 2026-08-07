import api from "../lib/axios"
import type { ApiResponse, PostSummary } from "../types/post"
import type { MyPostItem } from "../types/myPost"
import type { LikedPostItem } from "../types/likedPosts"
import type { TradeHistoryItem } from "../types/tradeHistory"
import type { MemberInfo, UpdateMemberRequest } from "../types/member"

// 내가 작성한 게시물 조회
export const getMyPosts = () =>
  api.get<ApiResponse<MyPostItem[]>>("/api/v1/members/posts")

// 내가 좋아요한 게시물 조회
export const getLikedPosts = () =>
  api.get<ApiResponse<LikedPostItem[]>>("/api/v1/members/liked-posts")

// 내가 대여한 게시물 조회
export const getMemberRentals = (rentalHistoryType: "ALL" | "PROVIDED") =>
  api.get<ApiResponse<TradeHistoryItem[]>>(`/api/v1/members/rentals?rentalHistoryType=${rentalHistoryType}`)

export const getMemberInfo = () =>
  api.get<ApiResponse<MemberInfo>>("/api/v1/members")

export const updateMemberInfo = (data: UpdateMemberRequest) =>
  api.put<ApiResponse<{}>>("/api/v1/members", data)