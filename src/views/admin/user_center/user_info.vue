<template>
  <div class="user_info">
    <div class="info_left">
      <img_cropper ref="clipperRef"
                   :type="clipperData.type"
                   :allow-type-list="clipperData.allowTypeList"
                   :limit-size="clipperData.limitSize"
                   :fixed-number="clipperData.fixedNumber"
                   :fixed-number-aider="clipperData.fixedNumberAider"
                   :preview-width="clipperData.previewWidth"
                   @confirm="onConfirm"/>
      <admin_setting_title title="用户信息"></admin_setting_title>
      <a-form ref="formRef" :model="form" :label-col-props="{span: 6}" :wrapper-col-props="{span: 16}">
        <a-form-item label="用户名">
          <span> {{ form.user_name }} </span>
        </a-form-item>
        <a-form-item label="用户头像">
          <a-image class="avatar" :src="getAvatarUrl(form.avatar)"/>
        </a-form-item>
        <a-form-item field="nick_name" label="用户昵称"
                     :rules="[{required:true,message:'必须输入用户昵称'},{minLength:5,message:'昵称必须大于5位'}]"
                     :validate-trigger="['blur']">
          <a-input @change="userInfoUpdate" v-model="form.nick_name" placeholder="请输入用户昵称"/>
        </a-form-item>
        <a-form-item field="signature" label="我的签名">
          <a-textarea @change="userInfoUpdate" v-model="form.signature" placeholder="请输入签名" :autosize="{ minRows: 3, maxRows: 3 }"/>
        </a-form-item>
        <a-form-item field="telephone" label="联系方式">
          <a-input @change="userInfoUpdate" v-model="form.telephone" placeholder="请输入联系方式"/>
        </a-form-item>
        <a-form-item field="blog" label="博客">
          <a-input @change="userInfoUpdate" v-model="form.blog" placeholder="请输入博客地址"/>
        </a-form-item>
        <a-form-item field="email" label="我的邮箱">
          <span>{{ form.email }}</span>
        </a-form-item>
        <a-form-item field="role" label="当前角色">
          <span>{{ form.role }}</span>
        </a-form-item>
        <a-form-item field="sign_status" label="登录来源">
          <span>{{ form.sign_status }}</span>
        </a-form-item>
        <a-form-item field="scope" label="用户积分">
          <span>{{ form.scope }}</span>
        </a-form-item>
      </a-form>
    </div>
    <div class="info_right">
      <admin_setting_title title="预览信息"></admin_setting_title>
      <div class="info_pre">
        <info_preview :key="form.avatar" :data="{
          avatar: getAvatarUrl(form.avatar),
          nick_name: form.nick_name,
          signature: form.signature,
          blog: form.blog,
          collect_count:Random.integer(1,200),
          comment_count: Random.integer(1,200),
          look_count: Random.integer(1,200),
          digg_count: Random.integer(1,200),
        }"></info_preview>
      </div>
      <admin_setting_title class="action_title" title="操作信息"></admin_setting_title>
      <update_password v-model:visible="updatePwdVisible"></update_password>
      <bind_email v-model:visible="bindEmailVisible"></bind_email>
      <div class="action_group">
        <a-button type="primary" @click="bindEmail">绑定邮箱</a-button>
        <a-button type="outline" @click="updatePassword">修改密码</a-button>
        <a-button type="primary" status="success" @click="showCropper">上传头像</a-button>
        <a-button type="primary" status="danger">注销用户</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import {type userDetailedInfoType, userInfoApi, userInfoUpdateApi, type userInfoUpdateType} from "@/api/user_api.ts";
import Admin_setting_title from "@/components/admin/admin_setting_title.vue";
import {Message} from "@arco-design/web-vue";
import Update_password from "@/components/common/update_password.vue";
import Bind_email from "@/components/common/bind_email.vue";
import img_cropper from "@/components/common/img_cropper.vue";
import Info_preview from "@/components/common/info_preview.vue";
import {Random} from "mockjs";

const updatePwdVisible = ref(false);

const bindEmailVisible = ref(false);

const formRef = ref()

const form = reactive<userDetailedInfoType>({
  id: 0,
  create_at: "",
  nick_name: "",
  user_name: "",
  avatar: "",
  email: "",
  telephone: "",
  address: "",
  ip: "",
  role: "",
  sign_status: "",
  signature: "",
  blog: "",
  scope: 0,
})

async function getFormData() {
  let res = await userInfoApi()
  Object.assign(form, res.data)
}
getFormData()

function getAvatarUrl(path: any): string {
  if (typeof path !== 'string') {
    const filePath = path[0].file_name;
    if (filePath.startsWith('http') ) {
      return filePath;
    } else {
      return `http://127.0.0.1:8080/${filePath}`;
    }
  }
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080${path}`;
  }
}

async function userInfoUpdate() {
  let val = await formRef.value.validate()
  if (val) return false
  let data : userInfoUpdateType = {
    nick_name: form.nick_name,
    signature: form.signature,
    telephone: form.telephone,
    avatar: form.avatar,
    blog: form.blog,
  }
  let res = await userInfoUpdateApi(data)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
}

function updatePassword() {
  updatePwdVisible.value = true
}

function bindEmail() {
  bindEmailVisible.value = true
}

interface IClipper {
  type: string
  allowTypeList: string[]
  limitSize: number
  fixedNumber: number[]
  fixedNumberAider?: number[]
  previewWidth: number
  previewWidthAider?: number
}

// 图片裁剪
const clipperData = ref<IClipper>({
  type: '',
  allowTypeList: [],
  limitSize: 1,
  fixedNumber: [],
  previewWidth: 0
})

const clipperRef = ref()

function showCropper(){
  clipperData.value = {
    type: 'browserLogo', // 该参数可根据实际要求修改类型
    allowTypeList: ['png', 'jpg', 'jpeg',], // 允许上传的图片格式
    limitSize: 1, // 限制的大小
    fixedNumber: [1, 1],  // 截图比例，可根据实际情况进行修改
    previewWidth: 100 // 预览宽度
  }
  // 打开裁剪组件
  clipperRef.value.uploadFile()
}

function onConfirm(val:any){
  const filePath = "/" + val[0].file_name;
  form.avatar = filePath
  userInfoUpdate()
}

</script>

<style lang="scss">
.user_info {
  background: var(--color-bg-1);
  padding: 20px 30px;
  display: flex;
  width: 100%;
  height: calc(100vh - 135px);
  border-radius: 5px;
  .info_left {
    width: 40%;
    .arco-form{
      margin-top: 20px;
    }
    .avatar{
      img{
        height: 120px;
        width: auto;
        border-radius: 50%;
      }
    }
  }
  .info_right {
    margin-left: 20px;
    width: calc(60% - 20px);
    .info_pre{
      margin-top: 20px;
    }
    .action_title{
      margin-top: 20px;
    }
    .action_group{
      >button{
        margin-top: 20px;
        margin-right: 20px;
      }
      &:last-child{
        margin-right: 0;
      }
    }
  }
}
</style>