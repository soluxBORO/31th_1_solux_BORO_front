// 공통 API 응답 구조
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    result: T;
}

// Item Category Enum
export type ItemCategory = 'CLOTHING' | 'ACCESSORY' | 'ETC';

// 1. 상점 상품 조회
// responses
export interface StoreAsset {
    itemId: number;
    itemName: string;
    itemCategory: ItemCategory;
    itemPrice: number;
    owned: boolean;
}

export type GetStoreAssetsResponse = ApiResponse<StoreAsset[]>;

// 2. 상점 구매
// request path parameter
export interface PurchaseAssetParams {
    assetId: number;
}

// responses
export interface CreatedAsset {
    assetId: number;
}

export type PurchaseAssetResponse = ApiResponse<CreatedAsset>;