<template>
  <div class="email_config">
    <div class="setting_left">
      <div class="email_info">
        <admin_setting_title title="邮箱配置"></admin_setting_title>
        <a-alert class="alert" style="border-radius: 5px">配置邮箱之后，系统会将通知信息发送到填写的邮箱，不配置则不发送通知</a-alert>
        <a-form ref="formRef" :model="emailForm" :label-col-props="{span: 4}" :wrapper-col-props="{span: 20}">
          <a-form-item field="host"
                       :rules="[{required:true,message:'必须输入邮箱域名'}]"
                       :validate-trigger="['change','input']"
                       label="邮箱域名">
            <a-input v-model="emailForm.host" placeholder="请输入邮箱域名"/>
          </a-form-item >
          <a-form-item field="port"
                       :rules="[{required:true,message:'必须输入邮箱端口'}]"
                       :validate-trigger="['change','input']"
                       label="邮箱端口">
            <a-input-number v-model="emailForm.port" placeholder="请输入邮箱端口"/>
          </a-form-item >
          <a-form-item field="user"
                       :rules="[{required:true,message:'必须输入默认名称'}]"
                       :validate-trigger="['change','input']"
                       label="发信名称">
            <a-input v-model="emailForm.user" placeholder="请输入发信名称"/>
          </a-form-item >
          <a-form-item field="default_from_email"
                       :rules="[{required:true,message:'必须输入发信邮箱'}]"
                       :validate-trigger="['change','input']"
                       label="发信邮箱">
            <a-input v-model="emailForm.default_from_email" placeholder="请输入发信邮箱"/>
          </a-form-item >
          <a-form-item field="password"
                       :rules="[{required:true,message:'必须输入授权码'}]"
                       :validate-trigger="['change','input']"
                       label="授权码">
            <a-input v-model="emailForm.password" type="password" placeholder="请输入授权码"/>
          </a-form-item >
          <a-form-item label="ssl">
            <a-switch v-model="emailForm.use_ssl"/>
          </a-form-item >
          <a-form-item label="tls">
            <a-switch v-model="emailForm.use_tls"/>
          </a-form-item >
        </a-form>
      </div>
      <div class="email_update">
<!--        <a-button status="danger" type="primary" @click="emailInfoUpdate">连接测试</a-button>-->
        <a-button type="primary" @click="emailInfoUpdate">更新</a-button>
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
import {settingsInfoApi, settingsInfoUpdateApi, type emailInfoType} from "@/api/settings_api.ts";
import {Message} from "@arco-design/web-vue";
import type {baseResponse} from "@/api";
import Admin_help from "@/components/admin/admin_help.vue";

const emailForm = reactive<emailInfoType>({
  host: "",
  port: 0,
  user: "",
  password: "",
  default_from_email: "",
  use_ssl: true,
  use_tls: false,
})

const formRef = ref()

async function getData() {
  let res = await settingsInfoApi("email") as baseResponse<emailInfoType>
  Object.assign(emailForm, res.data)
}

getData()

async function emailInfoUpdate() {
  let val = await formRef.value.validate();
  if (val) {
    return
  }
  let res = await settingsInfoUpdateApi("email",emailForm)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
}

const helpList = [
  {
    title: "邮箱域名和邮箱端口",
    abs: "每个邮件服务的smtp域名和端口都不一样，请仔细检查",
    content: '参考链接：<a href="https://blog.csdn.net/weixin_65357601/article/details/144990576" target="_blank">https://blog.csdn.net/weixin_65357601/article/details/144990576</a>'
  },
  {
    title: "发信名称",
    abs: "发送给用户的邮件上，对应显示的名称。",
  },
  {
    title: "发信邮箱",
    abs: "以QQ邮箱为例，在设置里面点击账号，里面有对应的邮件服务，打开即可获得对应配置。",
    content: '<img src="http://127.0.0.1:8080/upload/file/rolingg/smtp.png" width="100%"/>'
  },
  {
    title: "邮箱密码",
    abs: "邮箱密码可能不是登录邮箱的密码，可能是邮件服务开启时生成的服务密码。",
    content: '参考链接：<a href="https://blog.csdn.net/m0_62140641/article/details/142205387" target="_blank">https://blog.csdn.net/m0_62140641/article/details/142205387</a>'
  },
  {
    title: "ssl",
    abs: "是否启用ssl传输。",
    content: "启用ssl之后，对应的端口号可能需要做出相应的改动，避免端口占用情况出现",
  },
]

</script>

<style scoped lang="scss">
.email_config{
  display: flex;
  .setting_left{
    width: 40%;
    .email_info{
      .alert{
        margin-top: 20px;
      }
      .arco-form{
        margin-top: 20px;
      }
    }
    .email_update{
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