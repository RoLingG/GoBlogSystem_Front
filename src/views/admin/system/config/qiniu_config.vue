<template>
  <div class="qiNiu_config">
    <div class="setting_left">
      <div class="qiNiu_info">
        <admin_setting_title title="七牛云配置"></admin_setting_title>
        <a-alert class="alert" style="border-radius: 5px">配置七牛云，启用之后，所有上传图片的操作都将图片上传至配置的存储桶中</a-alert>
        <a-form ref="formRef" :model="qiNiuForm" :label-col-props="{span: 4}" :wrapper-col-props="{span: 20}">
          <a-form-item field="access_key"
                       :rules="[{required:true,message:'必须输入公钥'}]"
                       :validate-trigger="['change','input']"
                       label="公钥">
            <a-input v-model="qiNiuForm.access_key" placeholder="请输入公钥"/>
          </a-form-item >
          <a-form-item field="secret_key"
                       :rules="[{required:true,message:'必须输入私钥'}]"
                       :validate-trigger="['change','input']"
                       label="私钥">
            <a-input v-model="qiNiuForm.secret_key" placeholder="请输入私钥"/>
          </a-form-item >
          <a-form-item field="bucket"
                       :rules="[{required:true,message:'必须输入对象存储桶名称'}]"
                       :validate-trigger="['change','input']"
                       label="存储桶">
            <a-input v-model="qiNiuForm.bucket" placeholder="请输入对象存储桶名称"/>
          </a-form-item >
          <a-form-item field="cdn"
                       :rules="[{required:true,message:'必须输入CDN'}]"
                       :validate-trigger="['change','input']"
                       label="CDN">
            <a-input v-model="qiNiuForm.cdn" placeholder="请输入CDN"/>
          </a-form-item >
          <a-form-item field="zone"
                       :rules="[{required:true,message:'必须输入存储地区'}]"
                       :validate-trigger="['change','input']"
                       label="存储地区">
            <a-input v-model="qiNiuForm.zone" placeholder="请输入存储地区"/>
          </a-form-item >
          <a-form-item field="size"
                       :rules="[{required:true,message:'必须输入图片大小限制'}]"
                       :validate-trigger="['change','input']"
                       label="大小限制">
            <a-input-number v-model="qiNiuForm.size" placeholder="请输入图片大小限制"/>
            <template #extra></template>
          </a-form-item >
          <a-form-item field="prefix"
                       :rules="[{required:true,message:'必须输入图片前缀'}]"
                       :validate-trigger="['change','input']"
                       label="图片前缀">
            <a-input v-model="qiNiuForm.prefix" placeholder="请输入图片前缀"/>
          </a-form-item >
          <a-form-item label="是否启用">
            <a-switch v-model="qiNiuForm.is_enable" />
          </a-form-item >
        </a-form>
      </div>
      <div class="qiNiu_update">
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
  type qiNiuInfoType
} from "@/api/settings_api.ts";
import {Message} from "@arco-design/web-vue";
import type {baseResponse} from "@/api";
import Admin_help from "@/components/admin/admin_help.vue";

const qiNiuForm = reactive<qiNiuInfoType>({
  is_enable: false,
  access_key: "",
  secret_key: "",
  bucket: "",
  cdn: "",
  zone: "",
  size: 0,
  prefix: "",
})

const formRef = ref()

async function getData() {
  let res = await settingsInfoApi("qiniu") as baseResponse<qiNiuInfoType>
  Object.assign(qiNiuForm, res.data)
  qiNiuForm.secret_key = "******"
}

getData()

async function qiNiuInfoUpdate() {
  let val = await formRef.value.validate();
  if (val) {
    return
  }
  let res = await settingsInfoUpdateApi("qiniu",qiNiuForm)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
}

const helpList = [
  {
    title: "公钥和私钥",
    abs: "公钥可以在七牛云的个人中心里面查看。",
    content: '<img src="http://127.0.0.1:8080/upload/file/rolingg/accesskey.png" width="100%"/>'
  },
  {
    title: "对象存储桶",
    abs: "对象存储桶可以在七牛云左上角的对象存储里面看，如果第一次的话可以去创建。",
    content: '<img src="http://127.0.0.1:8080/upload/file/rolingg/bucket.png" width="100%"/>'
  },
  {
    title: "域名和地域",
    abs: "域名可以在对象存储里面的域名管理里面查看。下面是各地域对应的编号，如有变动得去七牛云官网看。",
    content: '华东-浙江 z0 <br/> 华东-浙江2 cn-east-2 <br/> 华东-河北 z1 <br/> 华东-广东 z2 <br/> 北美-洛杉矶 na0 <br/> 亚太-新加坡 as0 <br/>'
  },
]

</script>

<style scoped lang="scss">
.qiNiu_config{
  display: flex;
  .setting_left{
    width: 40%;
    .qiNiu_info{
      .alert{
        margin-top: 20px;
      }
      .arco-form{
        margin-top: 20px;
      }
    }
    .qiNiu_update{
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