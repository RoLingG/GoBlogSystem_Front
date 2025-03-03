<template>
  <div class="chat_group_config">
    <admin_setting_title style="padding: 15px 15px" title="群聊设置"></admin_setting_title>
    <div class="chat_group" v-if="isShow">
      <a-form :model="form" :label-col-props="{span: 6}" :wrapper-col-props="{span:18}">
        <a-form-item label="匿名群聊">
          <a-switch v-model="form.isAnonymous"></a-switch>
          <template #extra>开启后，用户不用登录也能聊</template>
        </a-form-item>
        <a-form-item label="显示时间">
          <a-switch v-model="form.isShowTime"></a-switch>
          <template #extra>悬浮消息，显示时间</template>
        </a-form-item>
        <a-form-item label="初始条数">
          <a-input-number v-model="form.defaultLimit" placeholder="初始条数" style="width: 240px"/>
          <template #extra>聊天记录的条数</template>
        </a-form-item>
        <a-form-item label="欢迎语">
          <a-input v-model="form.welcomeTitle" placeholder="欢迎语" style="width: 240px"/>
          <template #extra>聊天头部显示的文字</template>
        </a-form-item>
        <a-form-item label="显示人数">
          <a-switch v-model="form.isOnlinePeople"></a-switch>
          <template #extra>聊天头部下方显示在线人数</template>
        </a-form-item>
<!--        <a-form-item label="可发图片">-->
<!--          <a-switch v-model="form.isSendImage"></a-switch>-->
<!--          <template #extra>配置之后，用户可在聊天界面上传图片</template>-->
<!--        </a-form-item>-->
<!--        <a-form-item label="粘贴上传">-->
<!--          <a-switch v-model="form.isSendFile"></a-switch>-->
<!--          <template #extra>配置之后，用户可在聊天输入框粘贴上传图片</template>-->
<!--        </a-form-item>-->
      </a-form>
      <a-button style="margin-left: 20px" type="primary" @click="updateConfig">更新配置</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import type {chatGroupConfigType} from "@/api/chat_api";
import {settingsInfoApi, settingsInfoUpdateApi} from "@/api/settings_api";
import  type {baseResponse} from "@/api";
import {Message} from "@arco-design/web-vue";
import Admin_setting_title from "@/components/admin/admin_setting_title.vue";

const form = reactive<chatGroupConfigType>({
  isAnonymous: true,
  isShowTime: false,
  defaultLimit: 50,
  welcomeTitle: "【Blog】在线聊天室",
  isOnlinePeople: true,
  isSendImage: false,
  isSendFile: false
})

const isShow = ref(false)

async function getConfig() {
  let res = await settingsInfoApi("chat_group") as baseResponse<chatGroupConfigType>
  isShow.value = true
  if (res.code) {
    Message.error(res.msg)
  }
  Object.assign(form, res.data)
}
getConfig()

async function updateConfig() {
  let res = await settingsInfoUpdateApi("chat_group", form)
  if (res.code) {
    Message.error(res.msg)
  }
  Message.success(res.msg)
  await getConfig()
}
</script>

<style lang="scss">
.chat_group_config{
  .chat_group{
    margin-top: 20px;
  }
}
</style>