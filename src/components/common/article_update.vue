<template>
  <div class="article_update">
    <a-modal width="50%" :title="title" :visible="props.visible" @cancel="cancel" @close="cancel" :on-before-ok="okHandler">
      <a-form ref="formRef" :model="form" :label-col-props="{span: 4}" :wrapper-col-props="{span: 19}">
        <a-form-item field="title"
                     :rules="[{required:true,message:'必须输入文章标题'}]"
                     :validate-trigger="['change','input']"
                     label="文章标题">
          <a-input v-model="form.title" placeholder="请输入文章标题"/>
        </a-form-item >
        <a-form-item field="abstract" label="文章简介">
          <a-textarea v-model="form.abstract" placeholder="请输入文章简介" :autosize="{ minRows: 4, maxRows: 5 }"/>
        </a-form-item >
        <a-form-item field="category" label="文章分类">
          <a-select placeholder="文章分类" allow-create v-model="form.category" :options="categoryOptions"></a-select>
        </a-form-item >
        <a-form-item field="tags" label="文章标签">
          <a-select placeholder="文章标签" allow-create multiple v-model="form.tags" :options="tagOptions"></a-select>
        </a-form-item >
        <a-form-item label="文章封面">
          <a-select style="
                     display: flex;
                     align-items: center;
                     box-sizing: border-box;
                     width: 81%;
                     overflow: hidden;
                     white-space: nowrap;
                     text-overflow: ellipsis;"
                    v-model="form.image_id" @change="imageChange" placeholder="请选择文章封面" allow-clear >
            <a-option v-for="item in imageList" :key="item.id" :value="item.id">
              <div class="article_image_list">
                <img class="article_img" height="40" :src="getImageSrc(item.path)" alt="">{{item.name}}
              </div>
            </a-option>
          </a-select>
          <a-button type="outline" style="margin-left: 10px;" @click="randomImg">随机封面</a-button>
        </a-form-item>
        <a-form-item field="link" label="原文地址">
          <a-input v-model="form.link" placeholder="请输入原文地址"/>
        </a-form-item >
        <a-form-item field="source" label="文章来源">
          <a-input v-model="form.source" placeholder="请输入文章来源"/>
        </a-form-item >
        <a-form-item label="预览" v-if="form.title && form.image_url">
          <admin_article :data="form" preview></admin_article>
        </a-form-item >
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">

import {reactive, ref, watch} from "vue";
import {
  articleCategoryListApi, type articleDataType, type articleItemType,
  articleTagNameList,
  articleUpdateApi,
  type articleUpdateType
} from "@/api/article_api.ts";
import type {optionType} from "@/components/common/types";
import {imageIDListApi, type imageIDType} from "@/api/image_api.ts";
import {Message} from "@arco-design/web-vue";
import Admin_article from "@/components/admin/admin_article.vue";
import {Random} from "mockjs";

interface Props {
  visible: boolean
  data: articleUpdateType
  title?: string
  type?: "add" | "update"
}

const props = defineProps<Props>()

const {title="文章更新", type="update"} = props

const emit = defineEmits(["update:visible", "ok"]);

const form = reactive<articleUpdateType & articleDataType>({
  id: "",
  collect_count: 0,
  comment_count: 0,
  look_count: 0,
  digg_count: 0,
  create_at: new Date().toString(),
})

watch(()=> props.data, () => {
  Object.assign(form, props.data)
}, {deep: true, immediate: true})

const categoryOptions = ref<optionType[]>()

const tagOptions = ref<optionType[]>()

async function getArticleCategory() {
  let res = await articleCategoryListApi()
  categoryOptions.value = res.data
}
getArticleCategory()

async function getArticleTags() {
  let res = await articleTagNameList()
  tagOptions.value = res.data
}
getArticleTags()

const imageList = ref<imageIDType[]>([])

async function getImageList() {
  let res = await imageIDListApi()
  imageList.value = res.data
}
getImageList()

const getImageSrc = (path: string): string => {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}

function cancel() {
  emit("update:visible", false)
}

const formRef = ref()

async function okHandler() {
  let v = await formRef.value.validate()
  if (v) return
  if (type === "update") {
    let res = await articleUpdateApi(form)
    if (res.code) {
      Message.error(res.msg)
      return
    }
    Message.success(res.msg)
    emit("update:visible", false)
    emit("ok")
  }
  if (type === "add") {
    emit("update:visible", false)
    emit("ok", form)
  }
}

function imageChange(val: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[]) {
  const img = imageList.value.find((item) => item.id === val.toString())
  if (img) {
    form.image_url = getImageSrc(img.path);
  } else {
    console.error('Image not found:', val);
    form.image_url = '';
  }
}

function randomImg() {
  const img:imageIDType = Random.pick(imageList.value)
  form.image_id = img.id as number
  form.image_url = img.path
}

</script>

<style scoped lang="scss">
.article_image_list{
  display: flex;
  align-items: center;
  padding: 5px 0;
  .article_img{
    margin-right: 5px;
    border-radius: 5px;
  }
}
</style>