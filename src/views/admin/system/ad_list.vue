<template>
  <div class="ad_list">
    <ad_create v-model:visible="visible" @ok="createOK"></ad_create>
    <a-modal title="编辑用户" v-model:visible="updateVisible" :on-before-ok="updateADOK">
      <a-form ref="formRef" :model="updateADForm" :label-col-props="{span: 6}" :wrapper-col-props="{span: 16}">
        <a-form-item field="title"
                     :rules="[{required:true,message:'必须输入广告名称'}]"
                     :validate-trigger="['change','input']"
                     label="广告名称">
          <a-input v-model="updateADForm.title" placeholder="请输入广告名称"/>
        </a-form-item >
        <a-form-item field="href"
                     :rules="[{required:true,message:'必须输入跳转链接'}]"
                     :validate-trigger="['change','input']"
                     label="跳转链接">
          <a-input v-model="updateADForm.href" placeholder="请输入跳转链接"/>
        </a-form-item>
        <a-form-item field="images" label="图片路径">
          <upload_image v-model="updateADForm.images" placeholder="请输入图片链接或上传图片"></upload_image>
        </a-form-item>
<!--              <a-form-item field="abstractString" label="图片预览">-->
<!--                <a-textarea v-model="form.abstractString"-->
<!--                            :autosize="{minRows:1, maxRows: 4}"/>-->
<!--              </a-form-item>-->
        <a-form-item field="is_show" label="是否显示">
          <a-switch v-model="updateADForm.is_show"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <admin_table :url="adListApi" :columns="columns"
                 default-remove no-action-group
                 ref="adminTable" @edit="edit"
                 @add="visible=true"  search-placeholder="搜索推广标题"
                 @remove="remove" add-text="添加推广">
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