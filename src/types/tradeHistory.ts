export interface TradeHistoryItem {
  rentalRequestId: number
  postId: number
  postStatus: string
  postCategory: string
  price: number
  priceUnit: string
  postTitle: string
  postMemberNickname: string
  postDescription: string
  rentalStartTime: string
  rentalEndTime: string
  location: string
  floor: number
  seatNumber: number
}