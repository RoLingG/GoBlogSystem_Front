<template>
  <a-modal title="创建广告" v-model:visible="props.visible" :on-before-ok="createADOK" @cancel="cancel" @close="cancel">
    <a-form ref="formRef" :model="form" :label-col-props="{span: 6}" :wrapper-col-props="{span: 16}">
      <a-form-item field="title"
                   :rules="[{required:true,message:'必须输入广告名称'}]"
                   :validate-trigger="['change','input']"
                   label="广告名称">
        <a-input v-model="form.title" placeholder="请输入广告名称"/>
      </a-form-item >
      <a-form-item field="href"
                   :rules="[{required:true,message:'必须输入跳转链接'}]"
                   :validate-trigger="['change','input']"
                   label="跳转链接">
        <a-input v-model="form.href" placeholder="请输入跳转链接"/>
      </a-form-item>
      <a-form-item field="images" label="图片路径">
        <upload_image v-model="form.images" placeholder="请输入图片链接或上传图片"></upload_image>
      </a-form-item>
<!--      <a-form-item field="abstractString" label="图片预览">-->
<!--        <a-textarea v-model="form.abstractString"-->
<!--                    :autosize="{minRows:1, maxRows: 4}"/>-->
<!--      </a-form-item>-->
      <a-form-item field="is_show" label="是否显示">
        <a-switch v-model="form.is_show"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {Message} from "@arco-design/web-vue";
import {adCreateApi, type adCreateRequest} from "@/api/ad_api.ts";
import upload_image from "@/components/common/upload_image.vue";

const props = defineProps({
  visible: {
    type: Boolean,
  }
})
const emit = defineEmits(["update:visible", "ok"]);

const formRef = ref()

const form = reactive<adCreateRequest>({
  title: "",
  href: "",
  images: "",
  is_show: true,
})

const defaultForm = reactive<adCreateRequest>({
  title: "",
  href: "",
  images: "",
  is_show: true,
})

async function createADOK() {
  let val = await formRef.value.validate()
  if (val) {
    return false
  }
  let res = await adCreateApi(form)
  if (res.code){
    Message.error(res.msg)
    return false
  }
  Message.success(res.msg)
  Object.assign(form, defaultForm)
  emit("update:visible", false)
  emit("ok")
  return true
}

function cancel() {
  Object.assign(form, defaultForm)
  emit("update:visible", false)
}
</script>

<style  lang="scss">

</style>