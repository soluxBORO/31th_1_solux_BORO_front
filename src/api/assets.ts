import api from "../lib/axios";
import type { GetStoreAssetsResponse, PurchaseAssetResponse } from '../types/assets';

/* 1. 상점 상품 조회 API  [GET] /api/v1/assets */
export const getStoreAssets = async (): Promise<GetStoreAssetsResponse> => {
    const response = await api.get<GetStoreAssetsResponse>('/api/v1/assets');
    return response.data;
};

/* 2. 상점 구매 API [POST] /api/v1/assets/{assetId} */
export const purchaseAsset = async (assetId: number): Promise<PurchaseAssetResponse> => {
    const response = await api.post<PurchaseAssetResponse>(`/api/v1/assets/${assetId}`);
    return response.data;
};