import {type baseResponse, type paramsType, useAxios} from "@/api/index.ts";
import type {listData} from "@/components/admin/admin_table.vue";


export interface loginDataRequest extends paramsType {
    date: number;
}

export interface loginDataType {
    date_list: string[];
    login_data: number[];
    sign_data: number[];
}

export function dataLoginApi(params: loginDataRequest):Promise<baseResponse<loginDataType>> {
        return useAxios.get("/api/dateLogin", {params})
}

export interface dataCollectType {
    user_count: number;
    article_count: number;
    message_count: number;
    chat_group_count: number;
    today_login_count: number;
    today_sign_count: number;
    flow_count: number;
}

export function dataCollectApi():Promise<baseResponse<dataCollectType>> {
    return useAxios.get("/api/dataCollect")
}