<template>
  <div class="base_option">
    <div class="left">
      <a-alert style="margin-bottom: 20px">使用大模型必须的配置项</a-alert>
      <a-form ref="formRef" :model="form">
        <a-form-item label="大模型选择">
          <a-select v-model="form.name" placeholder="大模型选择" :options="largeScaleModelList"></a-select>
        </a-form-item>
        <a-form-item label="api_key">
          <a-input v-model="form.api_key" placeholder="api_key"></a-input>
        </a-form-item>
        <a-form-item label="api_secret">
          <a-input v-model="form.api_secret" placeholder="api_secret"></a-input>
        </a-form-item>
        <a-form-item label="大模型名称">
          <a-input v-model="form.title" placeholder="大模型名称"></a-input>
        </a-form-item>
        <a-form-item label="大模型提示词">
          <a-textarea v-model="form.prompt" :auto-size="{minRows:4, maxRows: 5}"
                      placeholder="大模型提示词"></a-textarea>
        </a-form-item>
        <a-form-item label="slogan">
          <a-textarea v-model="form.slogan" :auto-size="{minRows:3, maxRows: 5}" placeholder="slogan"></a-textarea>
        </a-form-item>
        <a-form-item label="菜单序号">
          <a-input-number v-model="form.order"></a-input-number>
        </a-form-item>
        <a-form-item label="是否启用">
          <a-switch v-model="form.enable"></a-switch>
        </a-form-item>
        <a-form-item>
          <a-button @click="update" type="primary"> 更新</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="right">
      <admin_setting_title title="帮助"></admin_setting_title>
      <div class="help">
        <span> {{ form.help }} </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import {
  largeScaleModelSettingsApi,
  type largeScaleModelSettingsType,
  largeScaleModelSettingsUpdateApi, largeScaleModelUsableApi, type largeScaleModelUsableType
} from "@/api/large_model_api.ts";
import Admin_setting_title from "@/components/admin/admin_setting_title.vue";
import {Message} from "@arco-design/web-vue";

const form = reactive<largeScaleModelSettingsType>({
  name: "",
  enable: true,
  order: 0,
  api_key: "",
  api_secret: "",
  title: "",
  prompt: "",
  slogan: "",
  help: "通义千问配置文档，最好去官方文档那边了解相关配置，再进行配置。",
})

const defaultForm = reactive<largeScaleModelSettingsType>({
  name: "",
  enable: true,
  order: 0,
  api_key: "",
  api_secret: "",
  title: "",
  prompt: "",
  slogan: "",
  help: "通义千问配置文档，最好去官方文档那边了解相关配置，再进行配置。",
})

const largeScaleModelList = ref<largeScaleModelUsableType[]>([])

async function getList() {
  let res = await largeScaleModelUsableApi()
  largeScaleModelList.value = res.data
}
getList()

async function getData() {
  let res = await largeScaleModelSettingsApi()
  Object.assign(form, res.data)
  form.help = defaultForm.help
}
getData()

async function update() {
  let res = await largeScaleModelSettingsUpdateApi(form)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  await getData()
}

</script>

<style lang="scss">
.base_option{
  display: flex;
  padding: 20px;
  .left{
    width: 60%;
    margin-right: 40px;
  }
  .right {
    width: 40%;
    .help{
      margin-top: 10px;
      font-size: 16px;
      font-weight: bold;
      color: var(--color-text-1);
    }
  }
}
</style>