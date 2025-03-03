import type {userInfoType} from "@/stores/counter.ts";

export function parseToken(token: string) {
    let payLoad = token.split('.')[1];
    let userInfo: userInfoType = JSON.parse(decodeURIComponent(escape(window.atob(payLoad.replace(/-/g,"+").replace(/_/g,"/")))));
    return userInfo;
}