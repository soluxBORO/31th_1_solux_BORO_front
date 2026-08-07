export interface EmptySpotListResponse {
    location: string;
    floor: number;
    seatNumber: number;
    hasPowerOutlet: boolean;
    hasWindowSeat: boolean;
    expectedCheckoutTime: string;
    createdAt: string;
}

export interface EmptySpotDetailResponse {
    location: string;
    floor: number;
    seatNumber: number;
    hasPowerOutlet: boolean;
    hasWindowSeat: boolean;
    expectedCheckoutTime: string;
    createdAt: string;
}

export interface CreateEmptySpotRequest {
    location: string;
    floor: number;
    seatNumber: number;
    hasPowerOutlet: boolean;
    hasWindowSeat: boolean;
    expectedCheckoutTime: string;
}

export interface UpdateEmptySpotRequest {
    location: string;
    floor: number;
    seatNumber: number;
    hasPowerOutlet: boolean;
    hasWindowSeat: boolean;
    expectedCheckoutTime: string;
}