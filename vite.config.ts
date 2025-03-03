import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import {ImportMetaEnv} from "./env";

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  let env: Record<keyof ImportMetaEnv, string> = loadEnv(mode, process.cwd())
  console.log(env, process.cwd(), env.VITE_SERVER_URL)

  const serverUrl = env.VITE_SERVER_URL
  const wsUrl = serverUrl.replace("http", "ws")

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    envDir: "./",
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host: "0.0.0.0",
      port: 80,
      proxy: {
        "/api":{
          target: serverUrl,
          changeOrigin: true,
        },
        "/upload":{
          target: serverUrl,
          changeOrigin: true,
        },
        "/ws": {
          target: wsUrl,
          changeOrigin: true,
          ws: true, //websocket代理设置
          rewrite: (path) => path.replace(/^\/ws/, "")
        }
      }
    }
  }
})
