<template>
  <div class="log_list">
    <admin_table :url="logListApi" :columns="columns" :filter-group-level="filterGroupLevel"
                 default-remove no-add no-checkbox-edit :limit="15"
                 ref="adminTable" @remove="remove" search-placeholder="搜索日志名称">
      <template #level="{record}:{record: logListType}">
        <a-tag v-if="record.level === 'info'" color="blue">Info</a-tag>
        <a-tag v-else-if="record.level === 'warning'" color="orange">Warning</a-tag>
        <a-tag v-else-if="record.level === 'error'" color="red">Error</a-tag>
        <a-tag v-else color="gray">Error</a-tag>
      </template>
    </admin_table>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Admin_table from "@/components/admin/admin_table.vue";
import {logLevelListApi, logListApi, type logListType} from "@/api/log_api.ts";
import type {filterOptionType} from "@/components/admin/admin_table.vue";

const columns = [
  {title: 'ID', dataIndex: 'id'},
  {title: '时间', dataIndex: 'create_at'},
  {title: 'IP', dataIndex: 'ip'},
  {title: '地区', dataIndex: 'addr'},
  {title: '等级', slotName: 'level'},
  {title: '内容', dataIndex: 'content'},
  {title: '用户ID', dataIndex: 'user_id'},
  {title: '用户昵称', dataIndex: 'nick_name'},
  {title: '操作', slotName: 'action'},
]

const adminTable = ref()

function remove(idList: (number|string)[]) {
  console.log(idList)
}

// 过滤
const filterGroupLevel:filterOptionType[] = [
  {label: "等级过滤", value: 0, column:"level", source: logLevelListApi},
]

</script>

<style lang="scss">
.log_list{

}
</style>