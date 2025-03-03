/// <reference types="vite/client" />
export interface ImportMetaEnv {
    VITE_SERVER_URL: string;
}

import 'vue-router'

declare module 'vue-router' {
    export interface RouteMeta {
        title?: string;
        isLogin?: boolean;
        isAdmin?: boolean;
        isUser?: boolean;
        isTourist?: boolean;
    }
}