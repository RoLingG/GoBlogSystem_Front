<template>
  <div class="jwt_config">
    <div class="setting_left">
      <div class="jwt_info">
        <admin_setting_title title="jwt配置"></admin_setting_title>
        <a-alert class="alert" style="border-radius: 5px">JWT系统配置，根据各项配置进行JWT设置。</a-alert>
        <a-form ref="formRef" :model="jwtForm" :label-col-props="{span: 4}" :wrapper-col-props="{span: 20}">
          <a-form-item field="secret"
                       :rules="[{required:true,message:'必须输入密钥'}]"
                       :validate-trigger="['change','input']"
                       label="密钥">
            <a-input v-model="jwtForm.secret" placeholder="请输入密钥"/>
          </a-form-item >
          <a-form-item field="secret"
                       :rules="[{required:true,message:'必须输入过期时间'}]"
                       :validate-trigger="['change','input']"
                       label="过期时间">
            <a-input-number v-model="jwtForm.expires" placeholder="请输入过期时间"/>
          </a-form-item >
          <a-form-item field="issuer"
                       :rules="[{required:true,message:'必须输入发行人'}]"
                       :validate-trigger="['change','input']"
                       label="发行人">
            <a-input v-model="jwtForm.issuer" placeholder="请输入发行人"/>
            <template #extra>单位：小时</template>
          </a-form-item >
        </a-form>
      </div>
      <div class="jwt_update">
        <a-button type="primary" @click="qiNiuInfoUpdate">更新</a-button>
      </div>
    </div>
    <div class="setting_right">
      <admin_help :data="helpList"></admin_help>
    </div>
  </div>
</template>

<script setup lang="ts">
import Admin_setting_title from "@/components/admin/admin_setting_title.vue";
import {reactive, ref} from "vue";
import {
  settingsInfoApi,
  settingsInfoUpdateApi,
  type jwtInfoType
} from "@/api/settings_api.ts";
import {Message} from "@arco-design/web-vue";
import type {baseResponse} from "@/api";
import Admin_help from "@/components/admin/admin_help.vue";

const jwtForm = reactive<jwtInfoType>({
  secret: "",
  expires: 0,
  issuer: "",
})

const formRef = ref()

async function getData() {
  let res = await settingsInfoApi("jwt") as baseResponse<jwtInfoType>
  Object.assign(jwtForm, res.data)
  jwtForm.secret = "******"
}

getData()

async function qiNiuInfoUpdate() {
  let val = await formRef.value.validate();
  if (val) {
    return
  }
  let res = await settingsInfoUpdateApi("jwt",jwtForm)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
}

const helpList = [
  {
    title: "密钥",
    abs: "JWT的密钥配置，密钥默认为“******”，每次配置都记得设置好密钥。",
  },
  {
    title: "过期时间",
    abs: "JWT的过期时间，标志着用户需要重新登陆的时间，单位是小时。",
  },
  {
    title: "发行人",
    abs: "JWT的发行人，用于JWT的认证鉴定。",
  },
]

</script>

<style scoped lang="scss">
.jwt_config{
  display: flex;
  .setting_left{
    width: 40%;
    .jwt_info{
      .alert{
        margin-top: 20px;
      }
      .arco-form{
        margin-top: 20px;
      }
    }
    .jwt_update{
      margin-top: 10px;
      margin-left: 40px;
      button{
        margin-right: 20px;
      }
    }
  }
  .setting_right{
    width: 60%;
  }
}
</style>