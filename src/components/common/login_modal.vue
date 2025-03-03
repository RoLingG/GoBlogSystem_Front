<template>
  <a-modal :visible="props.visible" title="用户登录" :footer="false" @cancel="close" @close="close">
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
<!--      <div class="label-pop">第三方登录</div>-->
<!--      <a href="" class="qq-icon-pop"><IconQq/></a>-->
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {Message} from "@arco-design/web-vue";
import {emailLoginApi} from "@/api/user_api.ts";
import {useStore} from "@/stores/counter.ts";
import {useRouter} from "vue-router";

const store = useStore()

const router = useRouter()

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

const form = reactive({
  user_name: "",
  password: "",
})

const emits = defineEmits(["update:visible"])

const formRef = ref();

function close() {
  emits("update:visible", false);
}

function formReset() {
  formRef.value.resetFields(Object.keys(form))
  formRef.value.clearValidate(Object.keys(form))
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

</script>

<style lang="scss">
.form-item-modal {
  margin-bottom: 30px;
}
</style>