import type {baseResponse} from "@/api/index.ts";
import type {listData} from "@/components/admin/admin_table.vue";
import {useAxios} from "@/api/index.ts";

export interface tagType {
    tag: string
    count: number
    article_id_list?: string[]
    create_at?: string
}

export function tagArticleListApi():Promise<baseResponse<listData<tagType>>> {
    return useAxios.get("/api/articleTagsList")
}