<template>
  <div>
    <a-modal title="绑定邮箱" :visible="props.visible" body-class="bind_email" @close="close" @cancel="close">
      <a-steps v-model:current="step" type="navigation">
        <a-step>输入邮箱</a-step>
        <a-step>输入验证码</a-step>
      </a-steps>
      <a-form ref="formRef" :model="form" :label-col-props="{span: 6}" :wrapper-col-props="{span: 16}">
        <a-form-item v-if="step === 1" field="email"
                     :rules="[{required:true,message:'必须输入邮箱'},{type: 'email', message: '邮箱格式错误'}]"
                     :validate-trigger="['change','input']"
                     label="邮箱">
          <a-input v-model="form.email" placeholder="请输入邮箱"/>
        </a-form-item>
        <a-form-item v-if="step === 2" field="code"
                     :rules="[{required:true,message:'必须输入验证码'}]"
                     :validate-trigger="['change','input']"
                     label="验证码">
          <a-input v-model="form.code" placeholder="请输入邮箱验证码"/>
        </a-form-item>
        <a-form-item v-if="step === 2" field="password"
                     :rules="[{required:true,message:'必须输入登录密码'},{minLength:6,message:'密码必须长度大于6位'}]"
                     :validate-trigger="['change','input']"
                     label="登录密码">
          <a-input type="password" v-model="form.password" placeholder="请输入登录密码"/>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="close">取消</a-button>
        <a-button v-if="step === 2" @click="step -= 1">上一步</a-button>
        <a-button type="primary" v-if="step === 1" @click="nextStep">下一步</a-button>
        <a-button type="primary" v-if="step === 2" @click="bindEmail">绑定邮箱</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import {
  userBindEmailApi,
  type userBindEmailType,

} from "@/api/user_api.ts";
import {Message} from "@arco-design/web-vue";
import {useStore} from "@/stores/counter.ts";
import router from "@/router";

interface Props {
  visible: boolean;
}

const store = useStore()

const props = defineProps<Props>()

const emits = defineEmits(["update:visible"]);

const step = ref<number>(1)

const form = reactive<userBindEmailType>({
  email: "",
  password: "",
  code: undefined,
})

const defaultForm = reactive<userBindEmailType>({
  email: "",
  password: "",
  code: undefined,
})

const formRef = ref()

async function bindEmail() {
  let val = await formRef.value.validateField(["code", "password"]);
  if (val) return
  let res = await userBindEmailApi(form)
  if (res.code) {
    Message.error(res.msg)
    return false
  }
  if (res.code) {
    Message.error(res.msg)
    return false
  }
  Message.success(res.msg)
  emits("update:visible", false)
}

async function nextStep() {
  let val = await formRef.value.validateField(["email"]);
  if (val) return
  let res = await userBindEmailApi(form)
  if (res.code) {
    Message.error(res.msg)
    return false
  }
  if (res.code) {
    Message.error(res.msg)
    return false
  }
  Message.success(res.msg)
  step.value += 1
}

function close() {
  emits("update:visible", false);
  Object.assign(form, defaultForm)
  step.value = 1
}

</script>

<style scoped lang="scss">
.bind_email{
  .arco-form{
    margin-top: 20px;
  }
}
</style>