<template>
  <div>
    <user_create v-model:visible="visible" @ok="createOK"></user_create>
    <a-modal title="编辑用户" v-model:visible="updateVisible" :on-before-ok="updateUserOK">
      <a-form ref="formRef" :model="updateUserForm" :label-col-props="{span: 6}" :wrapper-col-props="{span: 16}">
        <a-form-item field="nick_name" label="用户昵称"
                   :rules="[{required:true,message:'必须输入用户昵称'},{minLength:5,message:'昵称必须大于5位'}]"
                   :validate-trigger="['blur']">
          <a-input v-model="updateUserForm.nick_name" placeholder="请输入用户昵称"/>
        </a-form-item>
        <a-form-item field="role" label="权限" :rules="[{required:true,message:'必须选择角色权限'}]">
          <a-select v-model="updateUserForm.role" :options="roleOptions" placeholder="请选择权限"></a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <message_record_modal v-model:visible="messageVisible"
                          :send-user_id="sendUser_id"
                          :rev-user_id="revUser_id"
                          :rev-user_name="revUser_name">
    </message_record_modal>

    <admin_table :url="userListApi" :columns="columns"
                 default-remove :group-option="groupAction"
                 :default-params="{role: [1,2,3]}" ref="adminTable"
                 @add="visible=true"  search-placeholder="搜索昵称"
                 :filter-group-role="filterGroupRole" @edit="edit"
                 @remove="remove" add-text="添加用户" @checkMessage="handleCheckMessage">
    </admin_table>
  </div>
</template>

<script setup lang="ts">
import admin_table from "@/components/admin/admin_table.vue";
import {userUpdateApi, userListApi, type userDetailedInfoType} from "@/api/user_api.ts"
import {roleIDListApi} from "@/api/role_api.ts";
import {roleOptions, type userInfoType, useStore} from "@/stores/counter.ts";
import type {groupOptionType} from "@/components/admin/admin_table.vue";
import type {filterOptionType} from "@/components/admin/admin_table.vue";
import type {RecordType} from "@/components/admin/admin_table.vue";
import type {userUpdateRequest} from "@/api/user_api.ts";
import {reactive, ref} from "vue";
import User_create from "@/components/admin/user_create.vue";
import {Message} from "@arco-design/web-vue";
import Message_record_modal from "@/components/common/message_record_modal.vue";

const columns = [
  {title: '昵称', dataIndex: 'nick_name'},
  {title: '头像', slotName: 'avatar'},
  {title: '邮箱', dataIndex: 'email'},
  {title: '角色', dataIndex: 'role'},
  {title: 'IP', dataIndex: 'ip'},
  {title: '地址', dataIndex: 'address'},
  {title: '注册时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'}
]

// 选择组
const groupAction:groupOptionType[] = [
  {label: "批量拉黑", callback: async(idList: (number|string)[]):Promise<boolean> =>  {
      console.log("批量拉黑", idList)
      return true
    }},
  {label: "批量滚蛋", callback: async(idList: (number|string)[]):Promise<boolean> =>  {
      console.log("批量滚蛋", idList)
      return true
    }},
]

// 过滤
const filterGroupRole:filterOptionType[] = [
  {label: "角色过滤", value: 0, column:"role", source: roleIDListApi},
]

const visible = ref(false);

const adminTable = ref()

const updateVisible = ref(false)

const formRef = ref()

const updateUserForm = reactive<userUpdateRequest>({
  role: 0,
  user_id: 0,
  nick_name: "",
})

function edit(record: RecordType<userInfoType>): void {
  console.log(record);
  updateUserForm.user_id = record.user_id
  updateUserForm.nick_name = record.user_name
  updateUserForm.role = record.role
  updateVisible.value = true
}

function remove(idList: (number | string)[]) {
  console.log(idList)
}

function createOK(){
  adminTable.value.getList()
}

async function updateUserOK(){
  let value = await formRef.value.validate();
  if (value) {
    return false
  }
  let res = await userUpdateApi(updateUserForm)
  if (res.code) {
    Message.error(res.msg)
    return false
  }
  Message.success(res.msg)
  await adminTable.value.getList()
  return true
}

const messageVisible = ref(false);
const sendUser_id = ref<number>(0);
const revUser_id = ref<number>(0);
const revUser_name = ref<string>("");

const store = useStore()

const handleCheckMessage = (record: RecordType<any>) => {
  messageVisible.value = true;
  revUser_id.value = record.id;
  revUser_name.value = record.user_name;
  sendUser_id.value = store.userInfo.user_id;
};

</script>