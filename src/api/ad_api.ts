import {type baseResponse, type listResponse, type paramsType, useAxios} from "@/api/index.ts";
import type {userCreateRequest, userUpdateRequest} from "@/api/user_api.ts";

export interface adType {
    id: number
    create_at: string
    title: string
    href: string
    images: string
    is_show: boolean
}

export function adListApi(params?: paramsType):Promise<listResponse<adType>> {
    return useAxios.get("/api/advertList", {params});
}

export interface adCreateRequest {
    title: string
    href: string
    images: string
    is_show: boolean
}

export function adCreateApi(request: adCreateRequest):Promise<baseResponse<string>> {
    return useAxios.post("/api/advertUpload", request);
}

export function adUpdateApi(id: number, request: adCreateRequest):Promise<baseResponse<string>> {
    return useAxios.put(`/api/advertUpdate/${id}`, request);
}