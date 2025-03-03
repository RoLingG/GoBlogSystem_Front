<template>
  <div class="reply_list_view">
    <a-modal title="添加自动回复" v-model:visible="visible" :on-before-ok="ok">
      <a-form ref="formRef" :model="form">
        <a-form-item field="rule_name" label="规则名称" :rules="[{required:true,message:'请输入规则名称'}]"
                     :validate-trigger="['blur']">
          <a-input v-model="form.rule_name" placeholder="规则名称"></a-input>
        </a-form-item>
        <a-form-item field="rule_mode" label="匹配模式" :rules="[{required:true,message:'请选择匹配模式'}]"
                     :validate-trigger="['blur']">
          <a-select v-model="form.rule_mode" placeholder="匹配模式" :options="modeOptions"></a-select>
        </a-form-item>
        <a-form-item field="rule" label="规则" :rules="[{required:true,message:'请输入规则'}]"
                     :validate-trigger="['blur']">
          <a-textarea v-model="form.rule" placeholder="规则" :auto-size="{minRows: 3, maxRows: 5}"></a-textarea>
        </a-form-item>
        <a-form-item field="reply_content" label="回复内容" :rules="[{required:true,message:'请输入回复内容'}]"
                     :validate-trigger="['blur']">
          <a-textarea v-model="form.reply_content" placeholder="回复内容"
                      :auto-size="{minRows: 4, maxRows: 5}"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
    <admin_table
        :url="autoReplyListApi" :columns="columns"
        add-text="创建自动回复" ref="adminTable"
        no-checkbox no-action-group
        search-placeholder="搜索规则名称"
        default-remove @add="add" @edit="edit">
    </admin_table>
  </div>
</template>

<script setup lang="ts">
import Admin_table from "@/components/admin/admin_table.vue";
import {autoReplyListApi, type autoReplyType, autoReplyUpdateApi} from "@/api/large_model_api.ts";
import {h, reactive, ref} from "vue";
import {Message} from "@arco-design/web-vue";

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
  {title: '规则名称', dataIndex: 'rule_name'},
  {title: '匹配模式', dataIndex: 'rule_mode',
    render: (data: any) => {
      const record = data.record as autoReplyType;
      return h("span", null, modeDict[record.rule_mode]);
    },
  },
  {title: '规则', dataIndex: 'rule'},
  {title: '回复内容', dataIndex: 'reply_content'},
  {title: '添加时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'},
]

const form = reactive<autoReplyType>({
  id: 0,
  rule_name: "",
  rule_mode: 1,
  rule: "",
  reply_content: "",
})

const formRef = ref()

const adminTable = ref()

const visible = ref(false)

function add() {
  visible.value = true
}

function edit(record: autoReplyType) {
  form.id = record.id
  form.rule_name = record.rule_name
  form.rule_mode = record.rule_mode
  form.rule = record.rule
  form.reply_content = record.reply_content
  visible.value = true
}

async function ok() {
  let value = await formRef.value.validate();
  if (value) {
    return false
  }
  let res = await autoReplyUpdateApi(form)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  visible.value = false
  await adminTable.value.getList()
}

</script>

<style lang="scss">
.reply_list_view{
  padding: 0px;
}
</style>