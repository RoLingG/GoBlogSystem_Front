<template>
  <div class="role_list_view">
    <a-modal title="创建角色" width="45%" v-model:visible="visible" :on-before-ok="ok">
      <div class="role_add_modal">
        <div class="left">
          <a-form ref="formRef" :model="form">
            <a-form-item field="name" label="角色名称" :rules="[{required:true,message:'请输入角色名称'}]"
                         :validate-trigger="['blur']">
              <a-input v-model="form.name" placeholder="角色名称"></a-input>
            </a-form-item>
            <a-form-item field="icon" label="角色图标" :rules="[{required:true,message:'请输入角色图标'}]"
                         :validate-trigger="['blur']">
              <a-select style="
                     display: flex;
                     align-items: center;
                     box-sizing: border-box;
                     width: 90%;
                     overflow: hidden;
                     white-space: nowrap;
                     text-overflow: ellipsis;" v-model="form.icon"  placeholder="角色图标">
                <a-option v-for="item in iconOptions" :value="item.value" :key="item.value">
                  <div class="banner_image_div" style="display: flex; align-items: center">
                    <img height="30" width="30" style="border-radius: 5px; margin-right: 10px" :src="getImgSrc(item.value)" alt=""> {{ item.label }}
                  </div>
                </a-option>
              </a-select>
              <a-image width="30px" height="30px" v-if="form.icon !== ''" style="border-radius: 5px; margin-left: 5px"
                       :src="getImgSrc(form.icon)"></a-image>
            </a-form-item>
            <a-form-item  label="消耗积分">
              <a-input-number v-model="form.scope" placeholder="消耗积分"></a-input-number>
            </a-form-item>
            <a-form-item field="tagList" label="角色标签" :rules="[{required:true,message:'请选择角色标签'}]"
                         :validate-trigger="['blur']">
              <a-select v-model="form.tagList" multiple placeholder="角色标签" :options="tagOptions"></a-select>
            </a-form-item>
            <a-form-item field="abstract" label="角色简介" :rules="[{required:true,message:'请输入角色简介'}]"
                         :validate-trigger="['blur']">
              <a-textarea v-model="form.abstract" placeholder="角色简介"
                          :auto-size="{minRows: 3, maxRows: 4}"></a-textarea>
            </a-form-item>
            <a-form-item field="prologue" label="开场白" :rules="[{required:true,message:'请输入开场白'}]"
                         :validate-trigger="['blur']">
              <a-textarea v-model="form.prologue" placeholder="开场白"
                          :auto-size="{minRows: 3, maxRows: 4}"></a-textarea>
            </a-form-item>
            <a-form-item field="prompt" label="角色设定" :rules="[{required:true,message:'请输入角色设定'}]"
                         :validate-trigger="['blur']">
              <a-textarea v-model="form.prompt" placeholder="角色设定"
                          :auto-size="{minRows: 5, maxRows: 8}"></a-textarea>
            </a-form-item>
            <a-form-item label="是否启用">
              <a-switch v-model="form.enable"></a-switch>
            </a-form-item>
            <a-form-item label="自动回复">
              <a-switch v-model="form.auto_reply"></a-switch>
            </a-form-item>
          </a-form>
        </div>
        <div class="right">
          <role_preview v-if="form.name !== '' && form.icon !== '' && form.prologue !== ''"
                                  :data="form">
          </role_preview>
        </div>
      </div>
    </a-modal>
    <admin_table
        :url="largeScaleModelRoleListApi" :columns="columns"
        add-text="创建角色" ref="adminTable"
        no-checkbox no-action-group
        search-placeholder="搜索角色名称"
        default-remove @add="add" @edit="edit">
      <template #enable="{record}:{record: roleType}">
        <a-switch :model-value="record.enable"></a-switch>
      </template>
      <template #auto_reply="{record}:{record: roleType}">
        <a-switch :model-value="record.auto_reply"></a-switch>
      </template>
      <template #icon="{record}:{record: roleType}">
        <a-image width="40px" height="40px" style="border-radius: 50%" :src="getImgSrc(record.icon)"></a-image>
      </template>
      <template #tags="{record}:{record: roleType}">
        <a-tag v-for="item in record.tags" :color="item.color" style="margin-right: 10px" > {{ item.role_title }} </a-tag>
      </template>
      <template #abstract="{record}:{record: roleType}">
        <a-typography-text :ellipsis="{rows: 1}">{{ record.abstract }}</a-typography-text>
      </template>
      <template #prologue="{record}:{record: roleType}">
        <a-typography-text :ellipsis="{rows: 1}">{{ record.prologue }}</a-typography-text>
      </template>
      <template #prompt="{record}:{record: roleType}">
        <a-typography-text :ellipsis="{rows: 1}">{{ record.prompt }}</a-typography-text>
      </template>
    </admin_table>
  </div>
</template>


<script setup lang="ts">
import {
  largeScaleModelRoleIconOptionsApi,
  largeScaleModelRoleListApi, largeScaleModelRoleTagOptionsApi,
  largeScaleModelRoleUpdateApi,
  type roleType
} from "@/api/large_model_api.ts";
import {h, reactive, ref} from "vue";
import {Message, Tag} from "@arco-design/web-vue";
import Admin_table from "@/components/admin/admin_table.vue";
import type {optionsResponse} from "@/api";
import Role_preview from "@/components/admin/role_preview.vue";

const columns = [
  {title: '角色名称', dataIndex: 'name'},
  {title: '是否启用', slotName: 'enable'},
  {title: '角色图标', slotName: 'icon'},
  {title: '角色简介', slotName: 'abstract'},
  {title: '角色标签', slotName: 'tags'},
  {title: '消耗积分', dataIndex: 'scope'},
  {title: '对话开场白', slotName: 'prologue'},
  {title: '角色设定', slotName: 'prompt'},
  {title: '是否启用自动回复', slotName: 'auto_reply'},
  {title: '创建时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'},
]

const form = reactive<roleType>({
  id: 0,
  create_at: "",
  name: "",
  enable: false,
  icon: "",
  abstract: "",
  tags: [],
  scope: 0,
  prologue: "",
  prompt: "",
  auto_reply: false,
  tagList: [],
})

const defaultForm = reactive<roleType>({
  id: 0,
  create_at: "",
  name: "",
  enable: false,
  icon: "",
  abstract: "",
  tags: [],
  scope: 0,
  prologue: "",
  prompt: "",
  auto_reply: false,
  tagList: [],
})

const formRef = ref()

const adminTable = ref()

const visible = ref(false)

function add() {
  Object.assign(form, defaultForm)
  visible.value = true
}

const tagOptions = ref<optionsResponse<number>[]>([])

async function getTagOptions() {
  let res = await largeScaleModelRoleTagOptionsApi()
  tagOptions.value = res.data
}
getTagOptions()

const iconOptions = ref<optionsResponse<string>[]>([])

async function getIconOptions() {
  let res = await largeScaleModelRoleIconOptionsApi()
  iconOptions.value = res.data
}
getIconOptions()

function edit(record: roleType) {
  form.id = record.id
  form.name = record.name
  form.enable = record.enable
  form.icon = record.icon
  form.abstract = record.abstract
  form.tags = record.tags
  form.scope = record.scope
  form.prologue = record.prologue
  form.prompt = record.prompt
  form.auto_reply = record.auto_reply
  let tagList = []
  for (const tag of record.tags){
    tagList.push(tag.id)
  }
  form.tagList = tagList
  visible.value = true
}

async function ok() {
  let value = await formRef.value.validate();
  if (value) {
    return false
  }
  let res = await largeScaleModelRoleUpdateApi(form)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  visible.value = false
  await adminTable.value.getList()
  Object.assign(form, defaultForm)
}

function getImgSrc(path: string) {
  console.log(path)
  if (!path) {
    return "";
  }
  if (path.startsWith("http")) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}

</script>

<style scoped lang="scss">
.role_list_view{
  .arco-typography{
    margin-bottom: 0;
  }
  .col_tag{
    display: flex;
    .arco-tag{
      margin-left: 10px;
      &:first-child{
        margin-left: 0;
      }
    }
  }
}
.role_add_modal{
  display: flex;
  .left{
    width: 50%;
  }
  .right{
    padding-left: 20px;
    width: 50%;
  }
}
</style>