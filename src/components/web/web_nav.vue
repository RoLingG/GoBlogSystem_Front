<template>
  <div :class="{web_nav: true, isShow: isShow}">
    <div class="web_nav_container">
      <div class="left">
        <div class="logo">
          <div class="slogan">{{ store.siteInfo.slogan }}</div>
          <div class="en_slogan">{{ store.siteInfo.slogan_en }}</div>
        </div>
        <div class="nav">
          <template v-for="item in navList">
            <a target="_blank" :href="item.menu_path" v-if="item.menu_path.startsWith('http')"
               :title="item.menu_title">{{ item.menu_title }}</a>
            <router-link :to="item.menu_path" v-else>{{ item.menu_title }}</router-link>
          </template>
        </div>
        <web_search></web_search>
      </div>
      <div class="right">
        <div class="login" v-if="!store.isLogin">
          <router-link :to="{name: 'login'}">登录</router-link>
        </div>
        <div class="user_info" v-else>
          <user_info_menu :avatar="avatar"></user_info_menu>
        </div>
        <div class="theme">
          <theme></theme>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "@/stores/counter.ts";
import {onUnmounted, reactive, ref} from "vue";
import Theme from "@/components/common/theme.vue";
import User_info_menu from "@/components/common/user_info_menu.vue";
import {menuNameListApi, type menuNameType} from "@/api/menu_api.ts";
import Web_search from "@/components/web/web_search.vue";
import {userInfoApi} from "@/api/user_api.ts";
import {largeScaleModelSessionApi, type largeScaleModelSettingsType} from "@/api/large_model_api.ts";

const store = useStore()

interface Props {
  noScroll?: boolean // 不需要滚动监听
}

const isShow = ref(false);

const props = defineProps<Props>()

const {noScroll = false} = props

if (!noScroll) {
  isShow.value = false
  window.addEventListener("scroll", scroll)
}

function scroll() {
  let top = document.documentElement.scrollTop
  if (top >= 200) {
    isShow.value = true
  } else {
    isShow.value = false
  }
}

onUnmounted(() => {
  if (!noScroll) {
    window.removeEventListener("scroll", scroll)
  }
})

const navList = ref<menuNameType[]>([])

async function getData() {
  const val = sessionStorage.getItem("navList")
  if (val !== null) {
    try {
      navList.value = JSON.parse(val)
      return
    } catch (e) {
      console.error(e)
    }
  }
  let res = await menuNameListApi()
  navList.value = res.data
  sessionStorage.setItem("navList", JSON.stringify(navList.value))
}
getData()

const avatar = ref("")

async function getAvatar(){
  let res = await userInfoApi();
  if (res.data && res.data.avatar) {
    avatar.value = getImgSrc(res.data.avatar);
  } else {
    avatar.value = ""; // 或者设置为默认图片的 URL
  }
}
getAvatar()

function getImgSrc(path: string | undefined | null): string {
  if (!path) {
    return "";
  }
  if (typeof path === 'string' && path.startsWith('http')) {
    return path;
  } else {
    return `http://127.0.0.1:8080${path}`;
  }
}

</script>

<style lang="scss">
.web_nav{
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  color: var(--icon);
  background: var(--icon_border_bg);
  z-index: 10;
  &.isShow{
    background-color: var(--head-tab-color);
    color: var(--color-text-1);
    a{
      color: var(--color-text-1);
    }
  }
  a{
    text-decoration: none;
    color: var(--icon);
    &.router-link-exact-active {
      color: var(--active);
    }
  }
  .web_nav_container{
    width: var(--container_width);
    height: 60px;
    display: flex;
    align-items: center;
    .left{
      width: 70%;
      display: flex;
      align-items: center;
      .logo{
        margin-left: 20px;
        margin-right: 40px;
        .slogan{
          font-size: 18px;
        }
        .en_slogan{
          font-size: 14px;
          margin-top: 2px;
        }
      }
      .nav{
        >a{
          margin-right: 30px;
        }
      }
      .web_search{
        svg{
          cursor: pointer;
        }
      }
    }
    .right{
      width: 30%;
      display: flex;
      justify-content: end;
      .login{

      }
      .user_info{

      }
      .theme{
        margin-left: 20px;
        display: flex;
        align-items: center;
        svg{
          cursor: pointer;
        }
      }
    }
  }
}
</style>