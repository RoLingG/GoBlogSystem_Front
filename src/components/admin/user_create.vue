<template>
  <a-modal title="创建用户" v-model:visible="props.visible" :on-before-ok="createUser" @cancel="cancel" @close="cancel">
    <a-form ref="formRef" :model="form" :label-col-props="{span: 6}" :wrapper-col-props="{span: 16}">
      <a-form-item field="user_name"
                   :rules="[{required:true,message:'必须输入用户名'},{minLength:5,message:'名称长度必须大于5位'}]"
                   :validate-trigger="['change','input']"
                   label="用户名">
        <a-input v-model="form.user_name" placeholder="请输入用户名"/>
      </a-form-item >
      <a-form-item field="nick_name"
                   :rules="[{required:true,message:'必须输入用户昵称'},{minLength:5,message:'昵称必须大于5位'}]"
                   :validate-trigger="['change','input']"
                   label="用户昵称">
        <a-input v-model="form.nick_name" placeholder="请输入用户昵称"/>
      </a-form-item>
      <a-form-item field="password" label="密码"
                   :rules="[{required:true,message:'必须输入用户密码'},{minLength:5,message:'密码长度必须大于6位'}]"
                   :validate-trigger="['blur']">
        <a-input type="password" v-model="form.password" placeholder="请输入用户密码"/>
      </a-form-item>
      <a-form-item field="re_password" label="确认密码"
                   :rules="[{required:true,message:'必须输入确认密码'},{validator:rePasswordValidator}]"
                   :validate-trigger="['blur']">
        <a-input type="password" v-model="form.re_password" placeholder="请再次输入密码"/>
      </a-form-item>
      <a-form-item field="role" label="权限">
        <a-select v-model="form.role" :options="roleOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {userCreateApi} from "@/api/user_api.ts";
import type {userCreateRequest} from "@/api/user_api.ts"
import {Message} from "@arco-design/web-vue";
import {roleOptions} from "@/stores/counter.ts";

interface Props {
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(["update:visible", "ok"]);

const formRef = ref()

const form = reactive<userCreateRequest & {re_password:string}>({
  nick_name: "",
  user_name: "",
  password: "",
  re_password: "",
  role: 2,
})

const defaultForm = reactive<userCreateRequest & {re_password:string}>({
  nick_name: "",
  user_name: "",
  password: "",
  re_password: "",
  role: 2,
})

async function createUser() {
  let value = await formRef.value.validate();
  if (value) {
    return false
  }
  let res = await userCreateApi(form)
  if (res.code) {
    Message.error(res.msg)
    return false
  }
  Message.success(res.msg)
  emit("update:visible", false)
  emit("ok")
  Object.assign(form, defaultForm)
  return true
}

//密码一致性校验
function rePasswordValidator(value: string | undefined, callback: (error?: string) => void ):void {
  if (value !== form.password) {
    callback("确定密码不一致")
    return
  }
}

function cancel() {
  emit("update:visible", false)
}

</script>

<style scoped lang="scss">

</style>