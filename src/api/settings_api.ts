import {useAxios} from "@/api/index.ts";
import type {baseResponse} from "@/api/index.ts";
import type {chatGroupConfigType} from "@/api/chat_api.ts";
import type {largeScaleModelInfoType} from "@/api/large_model_api.ts";

export interface siteInfoType {
    created_at: string;
    beian: string;
    title: string;
    qq_image: string;
    version: string;
    email: string;
    wechat_image: string;
    name: string;
    job: string;
    addr: string;
    slogan: string;
    slogan_en: string;
    web: string;
    github_url: string;
    gitee_url: string;
}

export interface emailInfoType {
    host: string;
    port: number;
    user: string;
    password: string;
    default_from_email: string;
    use_ssl: boolean;
    use_tls: boolean;
}

export interface jwtInfoType {
    secret: string;
    expires: number;
    issuer: string;
}

export interface qiNiuInfoType {
    is_enable: boolean;
    access_key: string;
    secret_key: string;
    bucket: string;
    cdn: string;
    zone: string;
    size: number;
    prefix: string;
}

export function settingsInfoApi<T extends siteInfoType | emailInfoType | jwtInfoType | qiNiuInfoType | chatGroupConfigType | largeScaleModelInfoType>(name: string):Promise<baseResponse<T>> {
    return useAxios.get(`/api/settings/${name}`);
}

export function settingsInfoUpdateApi(name:string, data: siteInfoType | emailInfoType | jwtInfoType | qiNiuInfoType | chatGroupConfigType):Promise<baseResponse<any>> {
    return useAxios.put(`/api/settings/${name}`, data);
}