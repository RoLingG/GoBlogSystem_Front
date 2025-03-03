<template>
  <div class="login">
    <div class="login_area">
      <a-form ref="formRef" :model="form" :label-col-props="{span: 5}" :wrapper-col-props="{span: 15}">
        <div class="login_title">用户登录</div>
        <a-form-item class="form-item" field="user_name"
                     :rules="[{required:true,message:'必须输入用户名'},{minLength:5,message:'名称长度必须大于5位'}]"
                     :validate-trigger="['change','input']"
                     label="用户名">
          <a-input v-model="form.user_name" placeholder="请输入用户名"/>
        </a-form-item >
        <a-form-item field="password"
                     :rules="[{required:true,message:'必须输入密码'},{minLength:6,message:'密码必须长度大于6位'}]"
                     :validate-trigger="['change','input']"
                     label="密码">
          <a-input type="password" v-model="form.password" placeholder="请输入密码"/>
        </a-form-item>
        <a-form-item>
          <a-button html-type="login" @click="emailLogin">登录</a-button>
        </a-form-item>
<!--        <div class="label">第三方登录</div>-->
<!--        <a href="" class="qq-icon">-->
<!--          <IconQq></IconQq>-->
<!--        </a>-->
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {emailLoginApi} from "@/api/user_api.ts";
import type {emailLoginType} from "@/api/user_api.ts";
import {Message} from "@arco-design/web-vue";
import {useStore} from "@/stores/counter.ts";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const formRef = ref();
const form = reactive<emailLoginType>({
  user_name: "",
  password: "",
})

async function emailLogin() {
  let val = await formRef.value.validate();
  if (val) {
    return
  }

  if (store.userInfo.token) {
    Message.warning("用户已登录")
    return
  }

  let res = await emailLoginApi(form)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  store.setToken(res.data)
  let backRouter = window.history.state.back
  if (backRouter === null) {
    await router.push({
      name: "index"
    })
    return
  }
  await router.push(backRouter)
}

</script>

<style lang="scss">
.login {
  background: var(--login-background)  no-repeat center;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  .login_area{
    width: 500px;
    height: 100%;
    background-color: var(--login-side-background);
    position: absolute;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    .login_title{
      margin-bottom: 30px;
      font-size: 30px;
      font-weight: 700;
      text-align: center;
      color: var(--collapse-button);
    }
    .form-item {
      margin-bottom: 30px;
    }
    .arco-input {
      background: #fff;
    }
    .arco-input-wrapper{
      background: #fff;
    }
    .arco-btn{
      margin-top: 20px;
      color: #ffffff;
      background: var(--active);
      padding: 20px 135px 20px 125px;
    }
    .arco-form-item-label{
      color: var(--color-text-1);
    }
    .arco-form-item-label-col{
      padding-right: 10px;
    }
    .arco-form-item-status-error .arco-input-wrapper:not(.arco-input-disabled):hover, .arco-form-item-status-error .arco-textarea-wrapper:not(.arco-textarea-disabled):hover{
      background-color: #fff;
    }
    .label{
      display: flex;
      align-items: center;
      color: var(--text-color);
      &::before{
        margin-left: 110px;
        display: inline-flex;
        width: 20%;
        height: 1px;
        content: "";
        background: var(--color-text-4);
      }
      &::after{
        display: inline-flex;
        width: 20%;
        height: 1px;
        content: "";
        background: var(--color-text-4);
      }
    }
    .qq-icon {
      position: absolute;
      bottom: 160px;
      left: 46%;
      font-size: 50px;
      color: var(--collapse-button);
    }
  }
}
</style>