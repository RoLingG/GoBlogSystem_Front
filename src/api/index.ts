import axios, {type AxiosInstance} from "axios";
import {useStore} from "@/stores/counter.ts";
import {Message} from "@arco-design/web-vue";
import type {optionType} from "@/components/common/types";

export const useAxios : AxiosInstance = axios.create({
    // baseURL: "http://127.0.0.1:8080",
})

export interface baseResponse<T> {
    code: number;
    data: T;
    msg: string;
}

export interface optionsResponse<T> {
    label: string;
    value: T;
}

export interface paramsType {
    page?: number;
    limit?: number;
    key?: string;
    sort?: string;
    role?: number[];
    level?: number[];
    category?: number[];
}

export interface listResponse<T> {
    code: number;
    data: {
        count: number;
        list: T[]
    };
    msg: string;
}

useAxios.interceptors.request.use((config) => {
    const store = useStore();
    config.headers["token"] = store.userInfo.token
    return config;
})

useAxios.interceptors.response.use((response) => {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    } else {
        Message.error(response.statusText || "请求失败");
        return Promise.reject(response.statusText);
    }
}, (err) => {
    console.error("服务错误", err);
    Message.error(err.message || "网络错误");
    return Promise.reject(err.message);
});

export function defaultRemoveApi<T>(url: string, idList: T[]) :Promise<baseResponse<string>> {
    return useAxios.delete(url, {
        data:{
            id_list: idList,
        }
    })
}

export function defaultOptionApi<T>(url: string, params?:paramsType[]) :Promise<baseResponse<optionType[]>> {
    return useAxios.get(url, {params})
}

export function cacheRequest<T>(func: (...args: any) => Promise<T>, cacheTime: number = 20000): () => Promise<T> {
    let lastRequestTime: number = 0;
    let cacheData: T | null = null;
    let currentRequest: Promise<T> | null = null;
    return function() {
        const currentTime: number = Date.now();
        const timeDiff = currentTime - lastRequestTime;

        if (timeDiff < cacheTime && cacheData !== null) {
            return Promise.resolve(cacheData);
        }

        if (!currentRequest) {
            currentRequest = func(...arguments).then((res: T) => {
                lastRequestTime = currentTime;
                cacheData = res;
                currentRequest = null;
                return res;
            }).catch((err) => {
                currentRequest = null;
                throw err;
            });
        }
        return currentRequest;
    };
}