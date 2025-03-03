import {type baseResponse, type paramsType, useAxios} from "@/api/index.ts";
import type {listData} from "@/components/admin/admin_table.vue";

export interface chatType {
    avatar: string;
    content: string;
    create_at: string;
    id?: number
    is_group?: boolean;
    msg_type: number;   //1：系统消息-进入聊天室，2：文本消息，7：系统消息-离开聊天室
    nick_name: string;

    isMe?: boolean;
}

export function chatRecordApi(params: paramsType):Promise<baseResponse<listData<chatType>>> {
    return useAxios.get("/api/chatRecord", {params})
}

export function chatRemoveApi(idList: number[]):Promise<baseResponse<listData<chatType>>> {
    return useAxios.delete("/api/chatRemove", {data: {id_list: idList}})
}

export interface chatGroupConfigType {
    isAnonymous: boolean;
    isShowTime: boolean;
    defaultLimit: number;
    contentLength?: number;
    welcomeTitle: string;
    isOnlinePeople: boolean;
    isSendImage: boolean;
    isSendFile: boolean;
}

export interface chatMessageType {
    avatar: string;
    msg: string;
    date: string;
    msg_type: number;
    nick_name: string;

    online_count?: number;
}

