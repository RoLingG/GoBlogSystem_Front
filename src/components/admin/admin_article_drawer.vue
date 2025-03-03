<template>
  <div class="drawer">
    <article_update title="完善文章信息" type="add" @ok="okHandler"
                    v-model:visible="updateVisible"
                    :data="updateData"></article_update>
    <a-drawer class="inner" width="80%" :visible="props.visible" title="发布文章"
              unmountOnClose
              @cancel="handleClose"
              @close="handleClose">
      <div>
        <MdEditor v-model="updateData.content" :on-upload-img="onUploadImg" :theme="store.themeStringTheme"/>
      </div>
      <template #footer>
        <a-button @click="handleClose">取消</a-button>
        <a-button type="primary" status="success" @click="updateVisible = true">完善信息</a-button>
        <a-button type="primary" @click="createArticle">发布</a-button>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import {MdEditor} from "md-editor-v3";
import 'md-editor-v3/lib/style.css'
import {reactive, ref} from "vue";
import {uploadImageApi} from "@/api/image_api.ts";
import {Message} from "@arco-design/web-vue";
import type {baseResponse} from "@/api";
import Article_update from "@/components/common/article_update.vue";
import {articleCreateApi, type articleUpdateType} from "@/api/article_api.ts";
import {useStore} from "@/stores/counter.ts";

const store = useStore()

const updateVisible = ref(false);

const updateData = reactive<articleUpdateType>({
    content: "",
})

interface Props {
  visible: boolean;
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

function okHandler(form: articleUpdateType) {
  Object.assign(updateData, form);
}

async function createArticle() {
  if (updateData.title  === "") {
    Message.warning("文章标题不能为空")
    return false;
  }
  if (updateData.content === "") {
    Message.warning("文章内容不能为空")
    return false;
  }
  let res = await articleCreateApi(updateData)
  if (res.code) {
    Message.error(res.msg)
    return false;
  }
  Message.success(res.msg)
  emits('update:visible', false);
  clearUpdateData()
  const saveStore: articleStoreType = {
    category: updateData.category,
    tags: updateData.tags,
    date: new Date(),
  }
  sessionStorage.setItem("saveStore", JSON.stringify(saveStore))
  emits('ok');
}

interface articleStoreType {
  category?: string;
  tags?: string[];
  date: Date
}

function getData() {
  let item = sessionStorage.getItem("saveStore");
  if (item === null) return;
  try {
    const obj:articleStoreType = JSON.parse(item)
    updateData.category = obj.category
    updateData.tags = obj.tags
  } catch (e) {
    return
  }
}
getData()

function clearUpdateData() {
  updateData.title = ""
  updateData.content = ""
  updateData.abstract = ""
  updateData.image_id = undefined
  updateData.image_url = ""
  updateData.source = ""
  updateData.link = ""
}

</script>

<style lang="scss">
.inner {
  .md-editor {
    height: calc(100vh - 137px);
  }
}
</style>