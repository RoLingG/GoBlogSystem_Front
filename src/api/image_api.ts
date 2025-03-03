import type {listData} from "@/components/admin/admin_table.vue";
import {type baseResponse, type paramsType, useAxios} from "@/api/index.ts";

export interface imageIDType {
    id: string | number;
    path: string;
    name: string;
}

// export const imageIDListApi:()=>Promise<baseResponse<imageIDType[]>> = cacheRequest((params?: paramsType)=>useAxios.get("/api/imagesNameList", {params}))

export function imageIDListApi(params?: paramsType):Promise<baseResponse<imageIDType[]>> {
    return useAxios.get("/api/imagesNameList", {params});
}

export interface imageType {
    id: number;
    create_at: string;
    path: string;
    hash: string;
    name: string;
    image_type: "本地存储"|"七牛云存储";
}

export function imageListApi(params?: paramsType):Promise<baseResponse<listData<imageType[]>>> {
    return useAxios.get("/api/imagesList", {params});
}

export interface imageUploadResponse {
    file_name: string;
    code: boolean;
    msg: string;
}

export function uploadImageApi(file: File):Promise<baseResponse<string>> {
 return new Promise((resolve, reject) => {
     const formData = new FormData();
     formData.set("images", file)
     useAxios.post("/api/imagesUpload", formData, {
         headers:{
             "Content-Type": "multipart/form-data",
         }
     }).then((res:any) => resolve(res)).catch(err => reject(err));
 })
}

// export function uploadImageApi(file: File): Promise<baseResponse<string>> {
//     return new Promise((resolve, reject) => {
//         const formData = new FormData();
//         formData.append("images", file);
//
//         useAxios.post("/api/imagesUpload", formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         }).then((res: AxiosResponse) => {
//             // 确保响应符合 baseResponse<string> 类型
//             const data = res.data;
//             if (typeof data === 'object' && data !== null && 'code' in data && 'msg' in data && 'data' in data) {
//                 resolve(data as baseResponse<string>);
//             } else {
//                 reject(new Error('Invalid response structure'));
//             }
//         }).catch(err => {
//             reject(err);
//         });
//     });
// }