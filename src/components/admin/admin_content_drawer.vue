<template>
  <div class="drawer">
    <a-drawer class="inner" width="80%" :visible="props.visible" title="编辑正文"
              unmountOnClose
              @cancel="handleClose"
              @close="handleClose">
      <div>
        <MdEditor v-model="updateData.content" :on-upload-img="onUploadImg"/>
      </div>
      <template #footer>
        <a-button @click="handleClose">取消</a-button>
        <a-button type="primary" @click="updateArticle">修改</a-button>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import {MdEditor} from "md-editor-v3";
import 'md-editor-v3/lib/style.css'
import {reactive, ref, watch} from "vue";
import {uploadImageApi} from "@/api/image_api.ts";
import {Message} from "@arco-design/web-vue";
import type {baseResponse} from "@/api";
import {articleContentApi, articleCreateApi, articleUpdateApi, type articleUpdateType} from "@/api/article_api.ts";

const updateData = reactive<articleUpdateType>({
  content: "",
})

interface Props {
  visible: boolean;
  id?: string;
}

const props = defineProps<Props>();
const emits = defineEmits(["update:visible", "ok"]);

function handleClose() {
  emits('update:visible', false);
}

async function onUploadImg(files: Array<File>, callback: (urls: Array<string>) => void): Promise<void> {
  let resList: baseResponse<string>[]=[]

  try {
    resList = await Promise.all(files.map(file => uploadImageApi(file)))
  }catch(err) {
    console.error(err)
    return
  }
  const urlList: string[] = []
  resList.forEach(res => {
    if (res.code) {
      Message.error(res.msg)
      return
    }
    if (Array.isArray(res.data) && res.data.length > 0 && 'file_name' in res.data[0]) {
      let newUrl = imagePath(res.data[0].file_name);
      urlList.push(newUrl);
    } else {
      Message.error("Invalid data structure in response");
    }
  });

  callback(urlList);
}

function imagePath(path: string) {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}

async function updateArticle() {
  if (updateData.content === "") {
    Message.warning("文章内容不能为空")
    return false;
  }
  let res = await articleUpdateApi(updateData)
  if (res.code) {
    Message.error(res.msg)
    return false;
  }
  Message.success(res.msg)
  emits('update:visible', false);
  emits('ok');
}

async function getData() {
  let res = await articleContentApi(props.id as string);
  if (res.code) {
    Message.error(res.msg)
    return false;
  }
  updateData.id = props.id;
  updateData.content = res.data
}

watch(()=> props.id, () => {
  if (props.id) {
    getData();
  }
},{immediate:true});

</script>

<style lang="scss">
.inner {
  .md-editor {
    height: calc(100vh - 137px);
  }
}
</style>