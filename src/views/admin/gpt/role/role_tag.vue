<template>
  <div class="tag_list_view">
    <a-modal title="添加标签" v-model:visible="visible" :on-before-ok="ok">
      <a-form ref="formRef" :model="form">
        <a-form-item field="title" label="标签名称" :rules="[{required:true,message:'请输入标签名称'}]"
                     :validate-trigger="['blur']">
          <a-input v-model="form.title" placeholder="标签名称"></a-input>
        </a-form-item>
        <a-form-item field="color" label="标签颜色" :rules="[{required:true,message:'请输入标签颜色'}]"
                     :validate-trigger="['blur']">
          <a-input v-model="form.color" placeholder="标签颜色"></a-input>
          <input style="margin-left: 10px" type="color" v-model="form.color"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <admin_table
        :url="largeScaleModelRoleTagListApi" :columns="columns"
        add-text="创建标签" ref="adminTable"
        no-checkbox no-action-group
        search-placeholder="搜索标签名称"
        default-remove @add="add" @edit="edit">
    </admin_table>
  </div>
</template>

<script setup lang="ts">
import Admin_table from "@/components/admin/admin_table.vue";
import {
  largeScaleModelRoleTagListApi, largeScaleModelRoleTagUpdateApi, type roleTagType
} from "@/api/large_model_api.ts";
import {h, reactive, ref} from "vue";
import {Message, Tag} from "@arco-design/web-vue";

const modeDict : Record<number, string> = {
  1: "精确匹配",
  2: "模糊匹配",
  3: "前缀匹配",
  4: "正则匹配",
}

const modeOptions = [
  {label: "精确匹配", value: 1},
  {label: "模糊匹配", value: 2},
  {label: "前缀匹配", value: 3},
  {label: "正则匹配", value: 4},
]

const columns = [
  {title: '标签名称', dataIndex: 'title'},
  {title: '标签颜色', dataIndex: 'color',
    render: (data: any) => {
      const record = data.record as roleTagType;
      return h(Tag, {color: record.color}, {default: () => record.title});
    },
  },
  {title: '角色数量', dataIndex: 'roleCount'},
  {title: '添加时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'},
]

const form = reactive<roleTagType>({
  id: 0,
  title: "",
  color: "",
  roleCount: 0,
})

const defaultForm = reactive<roleTagType>({
  id: 0,
  title: "",
  color: "",
  roleCount: 0,
})


const formRef = ref()

const adminTable = ref()

const visible = ref(false)

function add() {
  visible.value = true
}

function edit(record: roleTagType) {
  form.id = record.id
  form.title = record.title
  form.color = record.color
  form.roleCount = record.roleCount
  visible.value = true
}

async function ok() {
  let value = await formRef.value.validate();
  if (value) {
    return false
  }
  let res = await largeScaleModelRoleTagUpdateApi(form)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  visible.value = false
  await adminTable.value.getList()
  Object.assign(form, defaultForm)
}

</script>

<style lang="scss">
.tag_list_view{
  padding: 0px;
}
</style>