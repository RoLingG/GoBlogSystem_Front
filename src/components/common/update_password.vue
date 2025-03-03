<template>
  <div>
    <a-modal title="修改密码" :visible="props.visible" :on-before-ok="updatePassword" @cancel="close" @close="close">
      <a-form ref="formRef" :model="form" :label-col-props="{span: 6}" :wrapper-col-props="{span: 16}">
        <a-form-item field="old_pwd"
                     :rules="[{required:true,message:'必须输入旧密码'},{minLength:6,message:'密码必须长度大于6位'}]"
                     :validate-trigger="['change','input']"
                     label="旧密码">
          <a-input type="password" v-model="form.old_pwd" placeholder="请输入旧密码"/>
        </a-form-item>
        <a-form-item field="new_pwd"
                     :rules="[{required:true,message:'必须输入新密码'},{minLength:6,message:'密码必须长度大于6位'}]"
                     :validate-trigger="['change','input']"
                     label="新密码">
          <a-input type="password" v-model="form.new_pwd" placeholder="请输入新密码"/>
        </a-form-item>
        <a-form-item field="re_pwd"
                     :rules="[{required:true,message:'必须重新输入新密码'},{validator:rePasswordValidator},{minLength:6,message:'密码必须长度大于6位'}]"
                     :validate-trigger="['blur']"
                     label="确认密码">
          <a-input type="password" v-model="form.re_pwd" placeholder="请确认新密码"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import {userUpdatePasswordApi, type userUpdatePasswordType} from "@/api/user_api.ts";
import {Message} from "@arco-design/web-vue";
import {useStore} from "@/stores/counter.ts";
import router from "@/router";

interface Props {
  visible: boolean;
}

const store = useStore()

const props = defineProps<Props>()

const emits = defineEmits(["update:visible"]);

const form = reactive<userUpdatePasswordType>({
  old_pwd: "",
  new_pwd: "",
  re_pwd: "",
})

const formRef = ref()

async function updatePassword() {
  let val = await formRef.value.validate();
  if (val) return false
  let res = await userUpdatePasswordApi(form)
  if (res.code) {
    Message.error(res.msg)
    return false
  }
  Message.success(res.msg)
  emits("update:visible", false)
  await store.logout()
  await router.push({
    name: "login"
  })
}

//密码一致性校验
function rePasswordValidator(re_pwd: string | undefined, callback: (error?: string) => void ):void {
  if (re_pwd !== form.new_pwd) {
    callback("确定密码不一致")
    return
  }
}

function close() {
  emits("update:visible", false);
}

</script>

<style scoped lang="scss">

</style>