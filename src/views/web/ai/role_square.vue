<template>
  <div class="role_square_view">
    <div class="banner">
      <div class="head">{{ store.largeScaleModelInfo.title }}</div>
      <div class="slogan">{{ store.largeScaleModelInfo.slogan }}</div>
    </div>
    <div class="role_tags">
      <span :class="{item: true, active: item.id === activeTag}" @click="checkTag(item)" v-for="item in tagList">{{ item.title }}</span>
    </div>
    <div class="role_list">
      <div class="item" @click="checkRole(item)" v-for="item in useRoleList">
        <img :src="getImgSrc(item.icon)" alt="">
        <a-typography-text class="title" :ellipsis="{rows: 1, css: true}">{{ item.name }}</a-typography-text>
        <a-typography-text class="abs" :ellipsis="{rows: 2, css: true}">{{ item.abstract }}</a-typography-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useStore} from "@/stores/counter.ts";
import {h, ref, type VNode} from "vue";
import {checkRole} from "@/service/check_role.ts";
import {
  type roleSingleType,
  squareListApi,
  type squareType, userScopeApi, userScopeEnableApi
} from "@/api/large_model_api.ts";
import {Button, Message, Notification} from "@arco-design/web-vue";

const tagList = ref<squareType[]>([])

const store = useStore()

const useRoleList = ref<roleSingleType[]>([])

const activeTag = ref<number>(0)

async function getData() {
  let res = await squareListApi()
  tagList.value = res.data
  if (tagList.value.length > 0) {
    checkTag(tagList.value[0])
  }
}
getData()

async function getUserScopeEnable() {
  if (!store.isLogin){
    return
  }
  let res = await userScopeEnableApi()
  if (res.code) {
    // 未登录
    return
  }
  if (res.data.enable) {
    const id = `${Date.now()}`;
    const closeNotification = Notification.info({
      id,
      title: '积分领取通知',
      content: `今日可免费领取 ${res.data.scope} 积分`,
      duration: 0,
      footer: (): VNode[] => {
        return [
          h(Button, {
            style: { marginRight: "10px" },
            onClick: () => bigModelScope(false),
          }, "取消"),
          h(Button, { type: "primary", onClick: () => bigModelScope(true) }, "领取")
        ];
      },
      closable: true,
    })
  }
}

async function bigModelScope(status: boolean) {
  let res = await userScopeApi(status)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  Notification.clear()
}
getUserScopeEnable()

function checkTag(record: squareType) {
  useRoleList.value = record.role_list
  activeTag.value = record.id
}

function getImgSrc(path: string) {
  if (!path) {
    return "";
  }
  if (path.startsWith("http")) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}

</script>

<style lang="scss">
.role_square_view {
  margin-top: 60px;
  width: 100%;
  background-color: var(--color-bg-1);
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 20px;
  border-radius: 5px;

  .banner {
    .head {
      text-align: center;
      font-size: 40px;
      font-weight: bold;
      margin-top: 20px;
      color: var(--active);
    }
    .slogan {
      margin-top: 30px;
      font-size: 20px;
      text-align: center;
      color: var(--color-text-2);
    }
  }

  .role_tags {
    margin-top: 60px;
    .item {
      cursor: pointer;
      margin-right: 20px;
      padding: 10px 30px;
      border-radius: 20px;
      background-color: var(--color-fill-2);
      color: var(--color-text-2);
      &:hover {
        background-color: var(--active);
        color: white;
      }
      &.active {
        background-color: var(--active);
        color: white;
      }
    }
  }
  .role_list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-row-gap: 40px;
    grid-column-gap: 20px;
    width: 100%;
    margin-top: 60px;
    justify-content: space-between;
    .item {
      height: 200px;
      width: 200px;
      background-color: var(--color-fill-1);
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      cursor: pointer;
      transition: all .3s;
      &:hover {
        transform: translateY(-10px);
        background-color: var(--color-fill-2);
        box-shadow: 0 5px 5px 5px rgba(0, 0, 0, 0.05);
      }
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .title {
        font-size: 18px;
        margin-top: 10px;
      }
      .abs {
        font-size: 14px;
        color: var(--color-text-2);
        margin-top: 5px;
      }
    }
  }
}
</style>
