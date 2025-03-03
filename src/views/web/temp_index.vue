<template>
  <div class="web_index">前台首页
    <a-modal v-model:visible="visible" title="用户登录" :footer="false" @cancel="close">
      <a-form ref="formRef" :model="form" :label-col-props="{span: 5}" :wrapper-col-props="{span: 15}">
        <a-form-item class="form-item-modal" field="user_name"
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
          <a-button html-type="login" @click="emailLoginModal">登录</a-button>
        </a-form-item>
        <div class="label-pop">第三方登录</div>
        <a href="" class="qq-icon-pop"><IconQq/></a>
      </a-form>
    </a-modal>
    <a-button class="modal_button" @click="visible = true">登录</a-button>
    <a-button class="modal_button" @click="router.push({name: 'admin'})">登录后台</a-button>
    <theme></theme>
    <router-link to="/login">登录</router-link>
  </div>
</template>

<script lang="ts">
import {reactive, ref} from "vue";
import Theme from "@/components/common/theme.vue";
import {emailLoginApi} from "@/api/user_api.ts";
import {Message} from "@arco-design/web-vue";
import {useStore} from "@/stores/counter.ts";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const formRef = ref();
const visible = ref(false)
const form = reactive({
  user_name: "",
  password: "",
})

function close() {
  visible.value = false
  formReset()
}

async function emailLoginModal() {
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
  close()
  let backRouter = window.history.state.back
  if (backRouter === null) {
    await router.push({
      name: "index"
    })
    return
  }
  await router.push(backRouter)
}

function formReset() {
  formRef.value.resetFields(Object.keys(form))
  formRef.value.clearValidate(Object.keys(form))
}

console.log(import.meta.env)
</script>

<style lang="scss">
.web_index {
  background: var(--login-background) no-repeat center;
  background-size: cover; // 使背景图片覆盖整个页面
  height: 100vh; // 设置页面高度为视口高度
  width: 100vw; // 设置页面宽度为视口宽度
  .form-item-modal {
    margin-bottom: 30px;
  }
  .modal_button{
    background-color: var(--bgColor);
    color: var();
  }
}
.label-pop{
  display: flex;
  justify-content: center; // 水平居中
  align-items: center; // 垂直居中
  &::before{
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
.qq-icon-pop{
  display: flex;
  justify-content: center; // 水平居中
  align-items: center; // 垂直居中
  margin-top: 10px;
  font-size: 30px;
  color: var(--text-color);
}

</style>