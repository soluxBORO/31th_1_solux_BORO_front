import api from "../lib/axios"
import type {
  ApiResponse,
  PostSummary,
  MemberPostItem,
  CreatePostRequest,
  UpdatePostRequest,
} from "../types/post"

// 게시글 목록 가져오기
export const getPosts = (onlyAvailable: boolean) =>
  api.get<ApiResponse<PostSummary[]>>(`/api/v1/post?onlyAvailable=${onlyAvailable}`)

// 게시글 상세 정보 가져오기
export const getPostDetail = (postId: number) =>
  api.get<ApiResponse<PostSummary>>(`/api/v1/post/${postId}`)

// 게시글 좋아요
export const likePost = (postId: number) =>
  api.post(`/api/v1/post/${postId}/like`)

// 게시글 생성
export const createPost = (data: CreatePostRequest) =>
  api.post("/api/v1/post", data)

// 게시글 삭제
export const deletePost = (postId: number) =>
  api.delete(`/api/v1/post/${postId}`)

// 게시글 수정
export const updatePost = (postId: number, data: UpdatePostRequest) =>
  api.patch(`/api/v1/post?postId=${postId}`, data)

// 내가 작성한 게시물 목록 조회
export const getMyPosts = () =>
  api.get<ApiResponse<MemberPostItem[]>>("/api/v1/members/posts")