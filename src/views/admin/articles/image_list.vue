<template>
  <div class="image_list">
    <a-modal title="图片上传" @before-open="clearFileList" v-model:visible="visible" @ok="imageUploadOK" @close="clearFileList" @cancel="clearFileList">
      <a-upload list-type="picture-card"
                action="/api/imagesUpload"
                tip="上传"
                name="images"
                :limit="5"
                @exceed-limit="exceedLimit"
                :headers="{token: store.userInfo.token}"
                :default-file-list="defaultFileList"
                v-model:file-list="fileList"
                image-previewa multiple
                class="image_upload"
                @success="imageUploadSuccess"
      ></a-upload>
    </a-modal>
    <admin_table :url="imageListApi" :columns="columns"
                 default-remove no-checkbox-edit ref="adminTable"
                 @add="visible=true"  search-placeholder="搜索图片名称"
                 @remove="remove" add-text="上传图片">
      <template #path="{record}: {record: imageType}">
        <a-image :src="imagePath(record.path)" style="border-radius: 5px" height="50px"></a-image>
      </template>
      <template #action_left="{record}: {record: imageType}">
        <a :href="imagePath(record.path)" :download="record.name">
          <a-button class="download_btn" type="primary">
            <template #icon>
              <IconDownload/>
            </template>
            图片下载
          </a-button>
        </a>
      </template>
    </admin_table>
  </div>
</template>

<script setup lang="ts">
import admin_table from "@/components/admin/admin_table.vue";
import {h, reactive, ref, watch} from "vue";
import {imageListApi, type imageType} from "@/api/image_api.ts";
import {Message, type TableColumnData, type TableData, Tag} from "@arco-design/web-vue"
import type {FileItem} from "@arco-design/web-vue";
import type {imageUploadResponse} from "@/api/image_api.ts";
import {useStore} from "@/stores/counter.ts";
import type {baseResponse} from "@/api";

const store = useStore();

const fileList = ref<FileItem[]>([])

const defaultFileList = ref<FileItem[]>([])

const columns: TableColumnData[] = [
  {title: '文件名', dataIndex: 'name'},
  {
    title: '上传类型',
    dataIndex: 'image_type',
    render: (data: { record: TableData; column: TableColumnData; rowIndex: number }) => {
      const { record } = data; // 提取 record 数据
      let color = "red";
      if (record.image_type === "本地存储") {
        color = "blue";
      }
      return h(Tag, { color: color }, { default: () => record.image_type });
    },
  },
  {title: '预览', slotName: 'path'},
  {title: '上传时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'}
]

const visible = ref(false);

const adminTable = ref()

function remove(idList: (number | string)[]) {
  console.log(idList)
}

function imageUploadOK(){
  adminTable.value.getList()
}

function imagePath(path: string) {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}

function imageUploadSuccess(file: FileItem) {
  const res = file.response as baseResponse<imageUploadResponse[]>
  if (res.data.length > 0) {
    // 看是否上传成功
    res.data.forEach(item => {
      if (!item.code) {
        Message.error(item.msg);
        return;
      }
      Message.success(item.msg);
      return;
    })
  }
}

function exceedLimit() {
  Message.error("单次最多上传5张图片");
  return;
}

function clearFileList() {
  fileList.value = []
}

</script>

<style lang="scss">
.image_upload{
  .arco-upload-list-picture{
    width: inherit;
  }
}
.download_btn {
  margin-right: 20px;
  border-radius: 5px;
}

</style>