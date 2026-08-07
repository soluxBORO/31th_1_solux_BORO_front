export type MyPostCategory =
  | "DEPARTMENT_JACKET"
  | "MAJOR_BOOKS"
  | "ELECTRONICS"
  | "LIVING_SUPPLIES"
  | "ETC"
  | "EMPTY_SPOTS"

export interface MyPostItem {
  postId: number
  emptySpotId?: number
  spotId?: number
  postStatus: string
  postCategory: MyPostCategory
  price: number
  priceUnit: string
  postTitle: string
  postDescription: string
  requestCreatedAt: string
  leftMinutes: number
  location: string
  floor: number
  seatNumber: number
}