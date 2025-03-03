import type {baseResponse, paramsType} from "@/api/index.ts";
import type {listData} from "@/components/admin/admin_table.vue";
import {useAxios} from "@/api/index.ts";
import type {optionType} from "@/components/common/types";
import {cacheRequest} from "@/api/index.ts";


export interface articleType {
    abstract: string;
    category: string;
    collect_count: number;
    comment_count: number;
    create_at: string;
    digg_count: number;
    id: string;
    image_id: number;
    image_url: string;
    look_count: number;
    tags: string[];
    title: string;
    update_at: string;
    user_avatar: string;
    user_id: number;
    user_nick_name: string;
    link: string;
    source: string;
    content?: string;

    is_collect?: boolean;
    is_digg?: boolean;
}

export interface articleItemType {
    abstract: string;
    category: string;
    collect_count?: number;
    comment_count?: number;
    look_count?: number;
    digg_count?: number;
    create_at: string;
    id: string;
    image_id?: number;
    image_url: string;
    tags?: string[];
    title: string;
    update_at?: string;
    user_avatar?: string;
    user_id?: number;
    user_nick_name?: string;
    link?: string;
    source?: string;
}

export interface articleUpdateType {
    title?: string;
    abstract?: string;
    content?: string;
    category?: string;
    source?: string;
    link?: string;
    image_id?: number;
    tags?: string[];
    id?: string;
    image_url?: string;
    create_at?: string;
    collect_count?: number;
    comment_count?: number;
    look_count?: number;
    digg_count?: number;
}

export interface articleDataType {
    collect_count: number;
    comment_count: number;
    look_count: number;
    digg_count: number;
    create_at: string;
}

export interface articleCalendarType {
    date: string;
    count: number;
}

export interface articleParams extends paramsType{
    tag?: string;
    date?: string;
    article_category?: string;
}

export function articleListApi(params: articleParams):Promise<baseResponse<listData<articleType>>> {
    return useAxios.get("/api/articleList", {params: params});
}

export const articleCategoryListApi:()=>Promise<baseResponse<optionType[]>> = cacheRequest(()=>useAxios.get("/api/articleCategoryList"))

// 因为多个组件复用了该API进行资源加载，所以进行调用限制
// export function articleCategoryListApi():Promise<baseResponse<optionType[]>> {
//     return useAxios.get("/api/articleCategoryList");
// }

export const articleTagNameList:()=>Promise<baseResponse<optionType[]>> = cacheRequest(()=>useAxios.get("/api/tagNameList"))

// export function articleTagNameList():Promise<baseResponse<optionType[]>> {
//     return useAxios.get("/api/tagNameList");
// }

export function articleUpdateApi(data: articleUpdateType):Promise<baseResponse<string>> {
    return useAxios.put("/api/articleUpdate", data);
}

export function articleCreateApi(data: articleUpdateType):Promise<baseResponse<string>> {
    return useAxios.post("/api/articleCreate", data);
}

export function articleContentApi(id: string):Promise<baseResponse<string>> {
    return useAxios.get(`/api/articleContent/${id}`);
}


export function articleCollectListApi(params: paramsType):Promise<baseResponse<listData<articleType>>> {
    return useAxios.get("/api/articleCollectList", {params: params});
}

export function articleCalendarApi(): Promise<baseResponse<articleCalendarType[]>> {
    return useAxios.get("/api/articleCalendar", {
        timeout: 10000  // 10 seconds
    });
}

export function articleDetailApi(id: string):Promise<baseResponse<articleType>> {
    return useAxios.get(`/api/articleDetail/${id}`);
}

export function articleDiggApi(id: string):Promise<baseResponse<string>> {
    return useAxios.post(`/api/diggArticle/${id}`);
}

export function articleCollectApi(id: string):Promise<baseResponse<string>> {
    return useAxios.post(`/api/articleCollect/${id}`);
}

export interface articleFullTextSearchType {
    id: string;
    key: string
    title: string
    slug: string
    body: string
}

export function articleFullTextSearchApi(params: paramsType):Promise<baseResponse<listData<articleFullTextSearchType>>> {
    return useAxios.get("/api/articleFullTextSearch", {params});
}