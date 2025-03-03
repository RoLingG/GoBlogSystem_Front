<template>
  <div class="upload_image">
    <div class="image">
      <a-input :placeholder="props.placeholder" v-model="text"></a-input>
      <a-upload action="/api/imageUploadSingle"
                name="image"
                :headers="headers"
                :show-file-list="false"
                @success="uploadSuccessEvent"
                style="margin-left: 10px"
      />
    </div>
    <a-image :src="text" height="80px"
             style="border-radius: 5px; height: 80px;
             object-fit: cover; max-width: 100%;"
             v-if="text"></a-image>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useStore} from "@/stores/counter.ts";
import {type FileItem, Message} from "@arco-design/web-vue";
import type {baseResponse} from "@/api";

const store = useStore()

const headers = {
  token: store.userInfo.token,
}

interface Props {
  modelValue: string
  placeholder: string;
}

const props = defineProps<Props>()

const {placeholder = "图片链接"} = props

const text = ref("")

watch(() => props.modelValue, () => {
  text.value = props.modelValue as string
})
const emits = defineEmits(["update:modelValue"]);

function uploadSuccessEvent(file: FileItem) {
  const res = file.response as baseResponse<string>
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  console.log(res.data)
  text.value = res.data
}

watch(text, ()=>{
  console.log(text.value.toString())
  emits("update:modelValue", text.value.toString() as string)
})

</script>

<style scoped lang="scss">
.upload_image{
  width: 100%;
  .image{
    display: flex;
  }
  .arco-image{
    margin-top: 10px;
  }
}
</style>