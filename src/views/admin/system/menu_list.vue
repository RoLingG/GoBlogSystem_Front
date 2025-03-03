<template>
  <div class="menu_list">
    <menu_create v-model:visible="visible" @ok="createOK"></menu_create>
<!--    编辑没写-->
    <admin_table
        :url="menuListApi" :columns="columns"
        add-text="添加菜单" ref="adminTable"
        no-checkbox no-action-group no-checkbox-edit
        search-placeholder="搜索角色名称"
        default-remove @add="visible=true" @edit="edit">
      <template #menu_image="{record}:{record: menuType}">
        <div class="menu_image">
          <a-image v-for="item in record.menu_image"
                   :key="item.id" :src="getMenuImageSrc(item.path)">
          </a-image>
        </div>
      </template>
    </admin_table>
  </div>
</template>

<script setup lang="ts">
import {type menuCreateRequest, menuListApi, menuUpdateApi} from "@/api/menu_api.ts";
import type {menuType} from "@/api/menu_api.ts";
import {reactive, ref} from "vue";
import Admin_table from "@/components/admin/admin_table.vue";
import type {RecordType} from "@/components/admin/admin_table.vue";
import menu_create from "@/components/admin/menu_create.vue";
import {Message} from "@arco-design/web-vue";

const columns = [
  {title: '序号', dataIndex: 'sort'},
  {title: '菜单标题', dataIndex: 'menu_title'},
  {title: '路径', dataIndex: 'menu_path'},
  {title: 'Slogan', dataIndex: 'slogan'},
  {title: '简介', dataIndex: 'abstract'},
  {title: '头图切换时间', dataIndex: 'menu_time'},
  {title: '简介切换时间', dataIndex: 'abstract_time'},
  {title: '菜单头图', slotName: 'menu_image'},
  {title: '更新时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'},
]

const updateMenuForm = reactive<menuCreateRequest & {id: number; abstractString: string; imageIDList: any[] }>({
  id: 0,
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

const formRef = ref()

const adminTable = ref()

const visible = ref(false)

const updateVisible = ref(false)

function edit(record: RecordType<menuType>): void {
  updateVisible.value = true
}

function remove(idList: (string | number)[]): void {
  console.log(idList)
}

const getMenuImageSrc = (imagePath: string): string => {
  // 假设你的应用运行在 http://127.0.0.1:8080
  return `http://127.0.0.1:8080/${imagePath}`;
};

// async function updateMenuOK(){
//   let value = await formRef.value.validate();
//   if (value) {
//     return false
//   }
//   let res = await menuUpdateApi(id,updateMenuForm)
//   if (res.code) {
//     Message.error(res.msg)
//     return false
//   }
//   Message.success(res.msg)
//   await adminTable.value.getList()
//   return true
// }

function createOK(){
  adminTable.value.getList()
}

</script>

<style lang="scss">
.menu_list{
  .menu_image{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    .arco-image-img{
      border-radius: 5px;
      height: 40px;
    }
  }
}
</style>