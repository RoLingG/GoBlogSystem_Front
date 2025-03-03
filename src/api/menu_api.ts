import {type baseResponse, type listResponse, type paramsType, useAxios} from "@/api/index.ts";

export interface menuImage {
    id?: number;
    path: string;
}

export interface menuType {
    id: number;
    create_at: string;
    menu_title: string;
    menu_path: string;
    slogan: string;
    abstract: string[]
    abstract_time: number,
    menu_time: number,
    sort: number;
    menu_image: menuImage[];
}

export function menuListApi(params?: paramsType):Promise<listResponse<menuType>> {
    return useAxios.get("/api/menusList", {params});
}

export interface imageSortList {
    image_id: number;
    sort: number;
}

export interface menuCreateRequest {
    menu_title: string;
    menu_path: string
    slogan: string
    abstract: string[]
    abstract_time: number,
    menu_time: number,
    sort: number,
    image_sort_list: imageSortList[]
}

export function menuCreateApi(request: menuCreateRequest):Promise<baseResponse<string>> {
    return useAxios.post("/api/menusUpload", request);
}

export function menuUpdateApi(id:number, request: menuCreateRequest):Promise<baseResponse<string>> {
    return useAxios.put(`/api/menusUpdate/${id}`, request);
}

export interface menuNameType {
    id: number;
    menu_title: string;
    menu_path: string;
}

export function menuNameListApi():Promise<baseResponse<menuNameType[]>> {
    return useAxios.get("/api/menusNameList");
}

export interface menuDetailRequest {
    path: string;
}

export function menuDetailApi(request: menuDetailRequest):Promise<baseResponse<menuType>> {
    return useAxios.get("/api/menuDetailList", {params: request});
}