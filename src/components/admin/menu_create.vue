<template>
  <a-modal title="创建菜单" v-model:visible="props.visible" :on-before-ok="createMenuOK" @cancel="cancel" @close="cancel">
    <a-form ref="formRef" :model="form" :label-col-props="{span: 6}" :wrapper-col-props="{span: 16}">
      <a-form-item field="menu_title"
                   :rules="[{required:true,message:'必须输入菜单标题'}]"
                   :validate-trigger="['change','input']"
                   label="菜单标题">
        <a-input v-model="form.menu_title" placeholder="请输入菜单标题"/>
      </a-form-item >
      <a-form-item field="menu_path"
                   :rules="[{required:true,message:'必须输入菜单路径'}]"
                   :validate-trigger="['change','input']"
                   label="菜单路径">
        <a-input v-model="form.menu_path" placeholder="请输入菜单路径"/>
      </a-form-item>
      <a-form-item field="slogan" label="Slogan">
        <a-input v-model="form.slogan" placeholder="请输入Slogan"/>
      </a-form-item>
      <a-form-item field="abstractString" label="菜单简介">
        <a-textarea v-model="form.abstractString" placeholder="请输入菜单简介"
                    :autosize="{minRows:1, maxRows: 4}"/>
      </a-form-item>
      <a-form-item label="简介切换时间">
        <a-input-number v-model="form.abstract_time" placeholder="请输入简介切换时间"/>
        <template #extra>
          <div>简介的切换时间，越小数字优先级越高</div>
        </template>
      </a-form-item>
      <a-form-item label="菜单切换时间">
        <a-input-number v-model="form.menu_time" placeholder="请输入菜单切换时间"/>
        <template #extra>
          <div>菜单的切换时间，越小数字优先级越高</div>
        </template>
      </a-form-item>
      <a-form-item label="菜单排序">
        <a-input-number v-model="form.sort" placeholder="请输入菜单排序"/>
        <template #extra>
          <div>菜单的排序，越大数字优先级越高</div>
        </template>
      </a-form-item>
      <a-form-item label="菜单头图列表">
        <a-select v-model="form.imageIDList" multiple placeholder="请输入菜单头图列表">
          <a-option v-for="item in imageList" :key="item.id" :value="item.id">
            <div class="menu_image_list">
              <img class="menu_img" height="40" :src="getMenuImageSrc(item.path)" alt="">{{item.name}}
            </div>
          </a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {type imageSortList, menuCreateApi} from "@/api/menu_api.ts";
import {imageIDListApi} from "@/api/image_api.ts";
import type {imageIDType} from "@/api/image_api.ts";
import type {menuCreateRequest} from "@/api/menu_api.ts";
import {Message} from "@arco-design/web-vue";

const props = defineProps({
  visible: {
    type: Boolean,
  }
})
const emit = defineEmits(["update:visible", "ok"]);

const formRef = ref()

const form = reactive<menuCreateRequest&{abstractString:string, imageIDList: number[]}>({
  menu_title: "",
  menu_path: "",
  slogan: "",
  abstract: [""],
  abstract_time: 7,
  menu_time: 7,
  sort: 1,
  image_sort_list: [],
  abstractString: "",
  imageIDList: []
})

const defaultForm = reactive<menuCreateRequest>({
  menu_title: "",
  menu_path: "",
  slogan: "",
  abstract: [""],
  abstract_time: 7,
  menu_time: 7,
  sort: 1,
  image_sort_list: []
})

const imageList = ref<imageIDType[]>([])

async function imageGetList() {
  let res = await imageIDListApi()
  imageList.value = res.data
}
imageGetList()

const getMenuImageSrc = (path: string): string => {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}

async function createMenuOK() {
  let val = await formRef.value.validate()
  if (val) {
    return false
  }
  let imageSortIDList: imageSortList[] = []
  for(let i = 0; i < form.imageIDList.length; i++) {
    const imageID = form.imageIDList[i]
    imageSortIDList.push({
      image_id: imageID,
      sort: form.imageIDList.length - i,
    })
    form.image_sort_list = imageSortIDList
  }
  form.abstract = form.abstractString.split("\n")
  let res = await menuCreateApi(form)
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
  emit("update:visible", false)
}
</script>

<style  lang="scss">
.menu_image_list{
  display: flex;
  align-items: center;
  padding: 5px 0px;
  .menu_img{
    margin-right: 5px;
    border-radius: 5px;
  }
}
</style>