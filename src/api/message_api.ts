import {type listResponse, type paramsType, useAxios} from "@/api/index.ts";

export interface messageType {
    user_name: string;
    nick_name: string;
    user_id: number;
    avatar: string;
    count: number;
}

export interface messageRecordType {
    content: string;
    create_at: string;
    id: number;
    is_read: boolean;
    rev_user_avatar: string;
    rev_user_id: number;
    rev_user_nick_name: string;
    send_user_avatar: string;
    send_user_id: number;
    send_user_nick_name: string;
    isMe: boolean;  // 判断
}

export interface messageParams extends paramsType {
    nick_name: string;
}

export function messageUserListApi(param?: messageParams):Promise<listResponse<messageType>> {
    return useAxios.get("/api/messageUserReceiveList",{params: param});
}

export function messageUserListByUserApi(userID: number):Promise<listResponse<messageType>> {
    return useAxios.get("/api/messageUserListByUser", {params: {
            user_id: userID,
        }
    });
}

export function messageUserRecordApi(sendUserID: number, revUserID: number):Promise<listResponse<messageRecordType>> {
    return useAxios.get("/api/messageUserRecord", {params: {
            send_user_id: sendUserID,
            rev_user_id: revUserID,
        }
    });
}

export function messageUserListByMyselfApi(params?: paramsType):Promise<listResponse<messageType>> {
    return useAxios.get("/api/messageUserListByMyself", {params});
}

export interface userRecordRequestType extends paramsType {
    user_id: number;
}

export function messageUserRecordByMyselfApi(params: userRecordRequestType):Promise<listResponse<messageRecordType>> {
    return useAxios.get("/api/messageUserRecordByMyself", {params: params});
}

export interface messageCreateType{
    send_user_id: number;
    rev_user_id: number;
    content: string;
}

export function messageCreateApi(data:messageCreateType):Promise<listResponse<string>> {
    return useAxios.post("/api/messageCreate", data);
}

export function messageRecordRemoveApi(idList:number[]):Promise<listResponse<string>> {
    return useAxios.delete("/api/messageRecordRemove", {data: {id_list: idList}});
}

