// 大模型配置
import {type baseResponse, cacheRequest, type optionsResponse, type paramsType, useAxios} from "@/api/index.ts";
import type {listData} from "@/components/admin/admin_table.vue";
import type {tagType} from "@/api/tag_api.ts";

export interface largeScaleModelSettingsType {
    name: string // 当前正在使用的大模型名字
    enable: boolean // 是否启用
    api_key: string // api的key
    api_secret: string  // api秘钥，有些大模型要用
    title: string // 大模型名称
    prompt: string // 提示词
    slogan: string // 介绍
    help: string    // 界面帮助词句
    order: number // 菜单序号
}

// 获取大模型配置
export function largeScaleModelSettingsApi(): Promise<baseResponse<largeScaleModelSettingsType>> {
    return useAxios.get("/api/large_scale_model/setting")
}

// 更新大模型配置
export function largeScaleModelSettingsUpdateApi(data: largeScaleModelSettingsType): Promise<baseResponse<largeScaleModelSettingsType>> {
    return useAxios.put("/api/large_scale_model/update", data)
}

// 大模型列表
export interface largeScaleModelUsableType {
    label: string
    value: string
    disabled: boolean // 是否不可以选择这个大模型
}

// 获取大模型列表
export function largeScaleModelUsableApi(): Promise<baseResponse<largeScaleModelUsableType[]>> {
    return useAxios.get("/api/large_scale_model/usable")
}

export interface largeScaleModelSessionType {
    chat_scope: number
    session_scope: number
    daily_scope: number
}

// 获取大模型会话配置
export function largeScaleModelSessionApi(): Promise<baseResponse<largeScaleModelSessionType>> {
    return useAxios.get("/api/large_scale_model/session_setting")
}

// 更新大模型配置
export function largeScaleModelSessionUpdateApi(data: largeScaleModelSessionType): Promise<baseResponse<string>> {
    return useAxios.put("/api/large_scale_model/session_setting", data)
}

// 自动回复的参数
export interface autoReplyType {
    id: number // 通过id判断是更新还是创建
    create_at?: string
    rule_name: string
    rule_mode: number // 匹配模式  1 精确匹配  2 模糊匹配  3 前缀匹配  4 正则匹配
    rule: string // 匹配规则
    reply_content: string
}

// 自动回复列表
export function autoReplyListApi(params?: paramsType): Promise<baseResponse<listData<autoReplyType>>> {
    return useAxios.get("/api/large_scale_model/auto_reply", {params})
}

// 更新或创建自动回复
export function autoReplyUpdateApi(data: autoReplyType): Promise<baseResponse<string>> {
    return useAxios.put("/api/large_scale_model/auto_reply", data)
}

// 角色标签类型
export interface roleTagType {
    id: number
    create_at?: string
    title: string
    color: string
    roleCount: number
    role_title?: string
}

// 获取角色标签列表
export function largeScaleModelRoleTagListApi(params?: paramsType): Promise<baseResponse<listData<roleTagType>>> {
    return useAxios.get("/api/large_scale_model/tag", {params})
}

// 更新或创建角色标签
export function largeScaleModelRoleTagUpdateApi(data: roleTagType): Promise<baseResponse<string>> {
    return useAxios.put("/api/large_scale_model/tag", data)
}

// 角色类型
export interface roleType {
    id?: number
    create_at: string
    name: string
    enable: boolean
    icon: string
    abstract: string
    tags: roleTagType[]
    scope: number
    prologue: string
    prompt: string
    auto_reply: boolean
    tagList: number[]
}

// 获取角色列表
export function largeScaleModelRoleListApi(params?: paramsType): Promise<baseResponse<listData<roleType>>> {
    return useAxios.get("/api/large_scale_model/roleList", {params})
}

// 添加/更新角色
export function largeScaleModelRoleUpdateApi(data: roleType): Promise<baseResponse<string>> {
    return  useAxios.put("/api/large_scale_model/role", data)
}

// 角色标签options列表
export function largeScaleModelRoleTagOptionsApi(): Promise<baseResponse<optionsResponse<number>[]>> {
    return useAxios.get("/api/large_scale_model/tag/options")
}

// 角色icon列表
export function largeScaleModelRoleIconOptionsApi(): Promise<baseResponse<optionsResponse<string>[]>> {
    return useAxios.get("/api/large_scale_model/role_icon/options")
}

// 会话类型
export interface sessionType {
    id: number
    create_at: string
    user_id: number
    nick_name: string
    session_name: string // 会话名称
    role_name: string // 角色名称
    chat_count: number // 对话个数
    last_content: string // 最后一次对话内容
}

// 会话列表
export function largeScaleModelSessionListApi(params?: paramsType): Promise<baseResponse<listData<sessionType>>> {
    return useAxios.get("/api/large_scale_model/session", {params})
}

export interface chatListRequestType extends paramsType{
    session_id: number,
}

// 对话类型
export interface chatType {
    id: number,
    create_at: string,
    user_content: string,
    user_avatar: string,
    ai_content: string,
    ai_avatar: string,
    status: boolean,
}

// 对话列表
export function largeScaleModelChatListApi(params?: chatListRequestType): Promise<baseResponse<listData<chatType>>> {
    return useAxios.get("/api/large_scale_model/chat_list", {params})
}

// 对话删除列表
export function largeScaleModelChatDeleteApi(idList: number[]): Promise<baseResponse<string>> {
    return useAxios.delete("/api/large_scale_model/chat", {
        data: {
            id_list: idList,
        }
    })
}

// 简单角色信息
export interface roleSingleType {
    id: number
    name: string
    abstract: string
    icon: string
}

export interface squareType {
    id: number
    title: string
    role_list: roleSingleType[]
}

// 角色广场
export function squareListApi(): Promise<baseResponse<squareType[]>> {
    return useAxios.get("/api/large_scale_model/role_tag")
}

// 用户角色-历史列表
export function sessionHistoryListApi(): Promise<baseResponse<roleSingleType[]>> {
    return useAxios.get("/api/large_scale_model/historical_session")
}

// 角色会话类型
export interface roleSessionType {
    id: number
    created_at: string
    session_name: string // 会话名称
}

// 请求角色会话列表的入参
export interface roleSessionRequest extends paramsType {
    role_id: number
}

// // 角色会话列表
// export const roleSessionListApi: (params: roleSessionRequest) => Promise<baseResponse<listData<roleSessionType>>> = cacheRequest(
//     (params: roleSessionRequest) => useAxios.get("/api/large_scale_model/role_session", {params})
// )

export function roleSessionListApi(params: roleSessionRequest): Promise<baseResponse<listData<roleSessionType>>> {
    return useAxios.get("/api/large_scale_model/role_session", {params})
}

export function sessionCreateApi(roleID: number): Promise<baseResponse<number>> {
    return useAxios.post("/api/large_scale_model/session", {role_id: roleID})
}

// 修改会话名称的入参
export interface sessionNameUpdateRequest {
    session_id: number // 会话id
    session_name: string // 新的会话名称
}

// 修改会话名称
export function sessionNameUpdateApi(data: sessionNameUpdateRequest): Promise<baseResponse<string>> {
    return useAxios.put("/api/large_scale_model/session", data)
}

export interface largeScaleModelInfoType {
    title: string
    slogan: string
}

// 用户删除会话
export function sessionRemoveApi(id: number): Promise<baseResponse<string>> {
    return useAxios.delete(`/api/large_scale_model/session/${id}`)
}

// 角色详情信息
export interface roleDetailType {
    id: number
    create_at: string
    icon: string
    name: string
    abstract: string
    tags: tagType[]
    chat_count: number
}

// 角色详情
export function roleDetailApi(id: number): Promise<baseResponse<roleDetailType>> {
    return useAxios.get(`/api/large_scale_model/role_info/${id}`)
}

export interface chatSSEParams {
    token: string
    session_id: number
    content:string
}

export interface scopeType {
    enable: boolean
    scope: number
}

// 用户是否可以获取大模型积分
export function userScopeEnableApi(): Promise<baseResponse<scopeType>> {
    return useAxios.get("/api/large_scale_model/scope")
}

// 用户获取大模型积分
export function userScopeApi(status: boolean): Promise<baseResponse<string>> {
    return useAxios.post("/api/large_scale_model/scope", {status})
}
