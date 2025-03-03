import {type baseResponse, type paramsType, useAxios} from "@/api/index.ts";
import type {listData} from "@/components/admin/admin_table.vue";

export interface commentArticleType {
    title: string;
    id: string;
    count: number;
}

export function commentArticleListApi(params: paramsType):Promise<baseResponse<listData<commentArticleType>>> {
    return useAxios.get("/api/commentByArticle", {params})
}

export interface commentUserType {
    address: string;
    avatar: string;
    ip: string;
    nick_name: string;
}

export interface commentType {
    id: number;
    article_id: string;
    comment_count: number;
    create_at: string;
    content: string;
    digg_count: number;
    parent_comment_id: number | null;   //父评论
    sub_comments: commentType[];
    user: commentUserType;
    user_id: number;

    applyContent: string    // 人为加上的
    isApply: boolean    // 是否显示回复的那个组件
}

export function commentListApi(articleID: string, params: paramsType):Promise<baseResponse<listData<commentType>>> {
    return useAxios.get(`/api/commentList/${articleID}`, {params})
}

export function commentDeleteApi(commentID: number):Promise<baseResponse<string>> {
    return useAxios.delete(`/api/commentRemove/${commentID}`)
}

export interface commentAddType {
    article_id: string;
    content: string;
    parent_comment_id?: number;
}

export function commentCreateApi(data: commentAddType):Promise<baseResponse<string>> {
    return useAxios.post("/api/commentCreate", data)
}

export function diggCommentApi(commentID: number):Promise<baseResponse<string>> {
    return useAxios.post(`/api/diggComment/${commentID}`)
}