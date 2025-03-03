import {type baseResponse, type listResponse, type paramsType, useAxios} from "@/api/index.ts";
import type {userInfoType} from "@/stores/counter.ts";

export interface emailLoginType {
    user_name: string;
    password: string;
}

export interface userDetailedInfoType {
    id: number
    create_at: string
    nick_name: string
    user_name: string
    avatar: string
    email: string
    telephone: string
    address: string
    ip: string
    role: string
    sign_status: string
    signature: string
    blog: string
    scope: number
}

export function emailLoginApi(request: emailLoginType):Promise<baseResponse<string>> {
    return useAxios.post("/api/emailLogin", request);
}

export function logoutApi():Promise<baseResponse<string>> {
    return useAxios.post("/api/userLogout");
}

export function userListApi(params: paramsType):Promise<listResponse<userDetailedInfoType>> {
    return useAxios.get("/api/userList", {params});
}

export function userInfoApi():Promise<baseResponse<userDetailedInfoType>> {
    return useAxios.get("/api/userInfo");
}

export interface userCreateRequest {
    nick_name: string;
    user_name: string;
    password: string;
    role: number;
}

export function userCreateApi(request: userCreateRequest):Promise<baseResponse<string>> {
    return useAxios.post("/api/userCreate", request);
}

export interface userUpdateRequest {
    role: number;
    user_id: number;
    nick_name: string;
}

export function userUpdateApi(request: userUpdateRequest):Promise<baseResponse<string>> {
    return useAxios.put("/api/userUpdateAdmin", request);
}

export interface userInfoUpdateType {
    nick_name: string;
    signature: string;
    telephone: string;
    avatar: string;
    blog: string;
}

export function userInfoUpdateApi(data: userInfoUpdateType):Promise<baseResponse<string>> {
    return useAxios.put("/api/userInfoUpdate", data);
}

export interface userUpdatePasswordType {
    old_pwd: string;
    new_pwd: string;
    re_pwd: string;
}

export function userUpdatePasswordApi(data: userUpdatePasswordType):Promise<baseResponse<string>> {
    return useAxios.put("/api/userUpdatePassword", data);
}

export interface userBindEmailType {
    email: string;
    password: string;
    code: string | undefined;
}

export function userBindEmailApi(data: userBindEmailType):Promise<baseResponse<string>> {
    return useAxios.post("/api/userBindEmail", data);
}