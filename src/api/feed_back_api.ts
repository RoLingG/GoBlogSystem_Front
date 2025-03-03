import type {baseResponse, paramsType} from "@/api/index.ts";
import {useAxios} from "@/api/index.ts";
import type {listData} from "@/components/admin/admin_table.vue";

export interface feedBackCreateType {
    email: string;
    content: string
}

export interface feedBackType {
    id?: number;
    content: string;
    create_at: string;
    email?: string;
}

export function feedBackCreateApi(request: feedBackCreateType):Promise<baseResponse<string>> {
    return useAxios.post("/api/feedbackCreate", request)
}

export function feedBackListApi(params?: paramsType):Promise<baseResponse<listData<feedBackType>>> {
    return useAxios.get("/api/feedbackList", {params})
}