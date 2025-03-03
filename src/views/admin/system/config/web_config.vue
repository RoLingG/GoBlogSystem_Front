<template>
  <div class="web_config">
    <div class="setting_left">
      <div class="site_info">
        <admin_setting_title title="站点配置"></admin_setting_title>
        <a-form ref="formRef" :model="siteForm" :label-col-props="{span: 4}" :wrapper-col-props="{span: 14}">
          <a-form-item field="title"
                       :rules="[{required:true,message:'必须输入站点标题'}]"
                       :validate-trigger="['change','input']"
                       label="站点标题">
            <a-input v-model="siteForm.title" placeholder="请输入站点标题"/>
          </a-form-item >
          <a-form-item field="slogan"
                       :rules="[{required:true,message:'必须输入Slogan'}]"
                       :validate-trigger="['change','input']"
                       label="Slogan">
            <a-input v-model="siteForm.slogan" placeholder="请输入Slogan"/>
          </a-form-item >
          <a-form-item field="slogan_en"
                       :rules="[{required:true,message:'必须输入英文Slogan'}]"
                       :validate-trigger="['change','input']"
                       label="EN-Slogan">
            <a-input v-model="siteForm.slogan_en" placeholder="请输入英文Slogan"/>
          </a-form-item >
          <a-form-item field="beian"
                       label="站点备案号">
            <a-input v-model="siteForm.beian" placeholder="请输入备案号"/>
          </a-form-item >
          <a-form-item field="version"
                       label="站点版本号">
            <a-input v-model="siteForm.version" placeholder="请输入版本号"/>
          </a-form-item >
          <a-form-item field="created_at"
                       label="建站日期">
            <a-input v-model="siteForm.created_at" placeholder="请输入建站日期"/>
          </a-form-item >
          <a-form-item field="qq"
                       label="QQ二维码">
            <upload_image v-model="siteForm.qq_image" placeholder="QQ二维码"></upload_image>
          </a-form-item >
        </a-form>
      </div>
      <div class="site_update">
        <a-button type="primary" @click="siteInfoUpdate">更新</a-button>
      </div>
    </div>
    <div class="setting_right">
      <admin_setting_title title="个人信息"></admin_setting_title>
      <div class="user_info">
        <a-form :model="siteForm" :label-col-props="{span: 3}" :wrapper-col-props="{span: 14}">
          <a-form-item label="名称">
            <a-input v-model="siteForm.name" placeholder="请输入名称"/>
          </a-form-item>
          <a-form-item label="工作">
            <a-input v-model="siteForm.job" placeholder="请输入工作"/>
          </a-form-item>
          <a-form-item label="地址">
            <a-input v-model="siteForm.addr" placeholder="请输入地址"/>
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input v-model="siteForm.email" placeholder="请输入邮箱"/>
          </a-form-item>
          <a-form-item label="Github">
            <a-input v-model="siteForm.github_url" placeholder="请输入Github链接"/>
          </a-form-item>
          <a-form-item label="Gitee">
            <a-input v-model="siteForm.gitee_url" placeholder="请输入Github链接"/>
          </a-form-item>
          <a-form-item field="wechat"
                       label="微信二维码">
            <upload_image v-model="siteForm.wechat_image" placeholder="微信二维码"></upload_image>
          </a-form-item >
        </a-form>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import Admin_setting_title from "@/components/admin/admin_setting_title.vue";
import {reactive, ref} from "vue";
import {settingsInfoApi, settingsInfoUpdateApi, type siteInfoType} from "@/api/settings_api.ts";
import Upload_image from "@/components/common/upload_image.vue";
import {Message} from "@arco-design/web-vue";

const siteForm = reactive<siteInfoType>({
  created_at: "",
  beian: "",
  title: "",
  qq_image: "",
  version: "",
  email: "",
  wechat_image: "",
  name: "",
  job: "",
  addr: "",
  slogan: "",
  slogan_en: "",
  web: "",
  github_url: "",
  gitee_url: "",
})

const formRef = ref()

async function getData() {
  let res = await settingsInfoApi("site")
  Object.assign(siteForm, res.data)
}

getData()

async function siteInfoUpdate() {
  let val = await formRef.value.validate();
  if (val) {
    return
  }
  let res = await settingsInfoUpdateApi("site",siteForm)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
}

</script>

<style scoped lang="scss">
.web_config{
  display: flex;
  .setting_left{
    width: 50%;
    .site_info{
      .arco-form{
        margin-top: 20px;
      }
    }
    .site_update{
      margin-top: 10px;
      margin-left: 40px;
    }
  }
  .setting_right{
    width: 50%;
    .user_info{
    }
  }
}
</style>