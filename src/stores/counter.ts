import { defineStore } from 'pinia'
import {parseToken} from "@/utils/jwt.ts";
import {logoutApi} from "@/api/user_api.ts";
import {Message} from "@arco-design/web-vue";
import {settingsInfoApi, type siteInfoType} from "@/api/settings_api.ts";
import type {Themes} from "md-editor-v3";
import type {largeScaleModelInfoType, largeScaleModelSettingsType, roleSingleType} from "@/api/large_model_api.ts";
import {sessionHistoryListApi} from "@/api/large_model_api.ts";

export const roleOptions = [
  {label:"管理员", value: 1},
  {label:"普通用户", value: 2},
  {label:"游客", value: 3},
]

export interface userInfoType {
  user_name: string
  nick_name: string
  role: number
  user_id: number
  token: string
  exp: number //过期时间
  avatar: string
}

const theme = true // true=light false=dark

const userInfo: userInfoType = {
  user_name: '',
  nick_name: '',
  role: 0,
  user_id: 0,
  token: '',
  exp: 0,
  avatar: ''
}

const defaultUserInfo: userInfoType = {
  user_name: '',
  nick_name: '',
  role: 0,
  user_id: 0,
  token: '',
  exp: 0,
  avatar: ''
}

const siteInfo: siteInfoType = {
  created_at: "2024-09-18",
  beian: "",
  title: "",
  qq_image: "",
  version: "",
  email: "",
  wechat_image: "",
  name: "",
  job: "后端开发",
  addr: "广东惠州",
  slogan: "RoLingG",
  slogan_en: "RoLingG'Blog",
  web: "",
  github_url: "",
  gitee_url: "",
}

const largeScaleModelInfo: largeScaleModelSettingsType = {
  name: "",
  enable: true,
  api_key: "",
  api_secret: "",
  title: "",
  prompt: "",
  slogan: "",
  help: "",
  order: 0,
}

const roleHistoryList: roleSingleType[] = []

export const useStore = defineStore('counter', {
  state(){
    return {
      theme: theme,
      collapsed: false, // 后台侧边栏默认收缩状态
      userInfo: userInfo,
      siteInfo: siteInfo,
      largeScaleModelInfo: largeScaleModelInfo,
      roleHistoryList: roleHistoryList,
      url: "http://127.0.0.1:8080",
    }
  },
  actions: {
    setTheme(localTheme?: boolean){
      if (localTheme !== undefined){
        this.theme = localTheme
      } else {
        this.theme = !this.theme;
      }
      document.body.setAttribute('arco-theme', this.themeString);
      localStorage.setItem("theme", JSON.stringify(this.theme));
    },
    loadTheme() {
      let val = localStorage.getItem("theme")
      if (val === null) {
        return;
      }
      let theme :boolean
      try {
        theme = JSON.parse(val)
        this.setTheme(theme);
      }catch(err) {
        return;
      }
    },
    setCollapsed(collapsed: boolean){
      this.collapsed = collapsed;
    },
    setToken(token: string){
      this.userInfo.token = token;
      let info = parseToken(token)
      Object.assign(this.userInfo, info);
      localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
    },
    loadToken(){
      let val = localStorage.getItem("userInfo")
      if (val === null){
        return;
      }
      try {
        this.userInfo = JSON.parse(val)
      } catch(err) {
        this.clearUserInfo()
        return;
      }
      //判断token是否过期
      let exp = Number(this.userInfo.exp) * 1000
      let now = new Date().getTime()
      if (exp - now <= 0){
        // 过期
        Message.warning("登录已过期，请重新登录")
        this.clearUserInfo()
        return;
      }
    },
    async logout(){
      await logoutApi()
      this.clearUserInfo()
    },

    clearUserInfo(){
      this.userInfo = defaultUserInfo
      localStorage.removeItem("userInfo")
    },
    async loadSiteInfo(){
      const val = sessionStorage.getItem("siteInfo");
      if (val !== null) {
        try {
          this.siteInfo = JSON.parse(val)
          return
        } catch (e) {

        }
      }
      let res = await settingsInfoApi("site")
      this.siteInfo = res.data as siteInfoType
      sessionStorage.setItem("siteInfo", JSON.stringify(this.siteInfo))
    },
    async getLargeScaleModelInfo(){
      let res = await settingsInfoApi("large_scale_model")
      Object.assign(this.largeScaleModelInfo, res.data)
    },
    async getRoleHistoryList(){
      if (!this.isLogin){
        return
      }
      let res = await sessionHistoryListApi()
      this.roleHistoryList = res.data
    }
  },
  getters: {
    themeString(): string {
      return this.theme ? "light" : "dark"
    },
    themeStringTheme(): Themes {
      return this.theme ? "light" : "dark"
    },
    isLogin(): boolean {
      return this.userInfo.role !== 0
    },
    isAdmin(): boolean {
      return this.userInfo.role === 1
    },
    isUser(): boolean {
      return this.userInfo.role === 2
    },
    isTourist(): boolean {
      return this.userInfo.role === 3
    }
  }
})
