import type {baseResponse, listResponse, paramsType} from "@/api/index.ts";
import {useAxios} from "@/api/index.ts";
import type {optionType} from "@/components/common/types";

export interface logListType {
    id: number;
    create_at: string;
    ip: string;
    addr: string;
    level: string;
    content: string;
    user_id: number;
    nick_name: string;
}

export function logListApi(params: paramsType):Promise<listResponse<logListType>> {
    return useAxios.get("/api/logList", {params});
}


export function logLevelListApi(params?: paramsType):Promise<baseResponse<optionType[]>> {
    return useAxios.get("/api/logLevelList", {params});
}