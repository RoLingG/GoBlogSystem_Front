<template>
  <div class="ad_list">
    <admin_table :url="adListApi" :columns="columns"
                 default-remove no-action-group no-add
                 ref="adminTable" @edit="edit" @remove="remove"
                 @add="visible=true"  search-placeholder="搜索推广标题">
      <template #images="{record}:{record: adType}">
        <a-image height="80" style="border-radius: 5px" :src="getADImageSrc(record.images)">
        </a-image>
      </template>
      <template #href="{record}:{record: adType}">
        <a-link :href="record.href" target="_blank">{{ record.href }}</a-link>
      </template>
      <template #is_show="{record}:{record: adType}">
        <a-tag v-if="record.is_show" color="blue">显示</a-tag>
        <a-tag v-else color="red">不显示</a-tag>
      </template>
    </admin_table>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {type adType, adUpdateApi} from "@/api/ad_api.ts";
import {adListApi} from "@/api/ad_api.ts";
import Admin_table, {type RecordType} from "@/components/admin/admin_table.vue";
import {Message} from "@arco-design/web-vue";
import Ad_create from "@/components/admin/ad_create.vue";
import Upload_image from "@/components/common/upload_image.vue";

const columns = [
  {title: '标题', dataIndex: 'title'},
  {title: '链接', slotName: 'href'},
  {title: '图片', slotName: 'images'},
  {title: '是否显示', slotName: 'is_show'},
  {title: '更新时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'},
]

const updateADForm = reactive<adType>({
  id: 0,
  create_at: "",
  title: "",
  href: "",
  images: "",
  is_show: false,
})

const formRef = ref()

const adminTable = ref()

const visible = ref(false)

const updateVisible = ref(false)

function remove(idList: (number|string)[]) {
  console.log(idList)
}

const getADImageSrc = (path: string): string => {
  if (path.startsWith('http') ) {
    return path;
  } else {
    console.log(path)
    return `http://127.0.0.1:8080${path}`;
  }
}

function edit(record: RecordType<adType>): void {
  console.log(record);
  updateADForm.id = record.id
  updateADForm.href = record.href
  updateADForm.title = record.title
  updateADForm.images = record.images
  updateADForm.is_show = record.is_show
  updateVisible.value = true
}

async function updateADOK(){
  let value = await formRef.value.validate();
  if (value) {
    return false
  }
  let res = await adUpdateApi(updateADForm.id,updateADForm)
  if (res.code) {
    Message.error(res.msg)
    return false
  }
  Message.success(res.msg)
  await adminTable.value.getList()
  return true
}

function createOK(){
  adminTable.value.getList()
}

</script>

<style lang="scss">
.ad_list{

}
</style>