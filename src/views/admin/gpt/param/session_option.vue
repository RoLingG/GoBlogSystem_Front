<template>
  <div class="session_option">
    <div class="left">
      <a-alert style="margin-bottom: 20px">用户使用大模型，每一个会话就是全新的聊天</a-alert>
      <a-form ref="formRef" :model="form">
        <a-form-item label="对话积分消耗">
          <a-input-number v-model="form.session_scope" placeholder="对话积分消耗"></a-input-number>
        </a-form-item>
        <a-form-item label="会话积分消耗">
          <a-input-number v-model="form.chat_scope" placeholder="会话积分消耗"></a-input-number>
        </a-form-item>
        <a-form-item label="每日积分领取">
          <a-input-number v-model="form.daily_scope" placeholder="每日积分领取"></a-input-number>
        </a-form-item>
        <a-form-item>
          <a-button @click="update" type="primary"> 更新</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="right">
      <admin_setting_title title="帮助"></admin_setting_title>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  largeScaleModelSessionApi,
  type largeScaleModelSessionType, largeScaleModelSessionUpdateApi,
} from "@/api/large_model_api.ts";
import {Message} from "@arco-design/web-vue";
import {reactive} from "vue";
import Admin_setting_title from "@/components/admin/admin_setting_title.vue";

const form = reactive<largeScaleModelSessionType>({
  chat_scope: 0,
  session_scope: 0,
  daily_scope: 0,
})

async function getData() {
  let res = await largeScaleModelSessionApi()
  Object.assign(form, res.data)
}
getData()

async function update() {
  let res = await largeScaleModelSessionUpdateApi(form)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  await getData()
}
</script>

<style lang="scss">
.session_option{
  display: flex;
  padding: 20px;
  .left{
    width: 60%;
    margin-right: 20px;
  }
  .right {
    width: 40%;
  }
}
</style>