import {type baseResponse, type paramsType, useAxios} from "@/api/index.ts";
import type {optionType} from "@/components/common/types";

export function roleIDListApi(params?: paramsType):Promise<baseResponse<optionType[]>> {
    return useAxios.get("/api/roleIDList", {params});
}