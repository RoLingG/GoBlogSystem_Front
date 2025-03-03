<template>
  <div class="admin_table">
    <div class="table_head">
      <div class="create" :style="{ marginRight: props.noAdd ? '0px' : '20px' }">
        <a-button v-if="!props.noAdd" class="create_button" type="primary" @click="add">{{ addText }}</a-button>
      </div>
      <div class="group">
        <a-select placeholder="操作"
                  v-if="!noActionGroup"
                  v-model="actionActive"
                  allowClear style="width: 150px"
                  :options="groupOption"></a-select>
        <a-popconfirm v-if="!props.noTwiceConfirm"
                      content="是否确定执行此操作?"
                      type="error"
                      @ok="groupMethod">
          <a-button class="group_btn"
                    type="primary"
                    status="danger"
                    v-if="actionActive !== undefined && actionActive !== ''">执行
          </a-button>
        </a-popconfirm>
        <a-button v-else
                  class="group_btn"
                  type="primary"
                  status="danger"
                  @click="groupMethod"
                  v-if="actionActive !== undefined && actionActive !== ''">执行</a-button>
      </div>
      <div class="search" :style="{ marginRight: props.noAdd ? '0px' : '20px', marginLeft:'20px'}">
        <a-input-search v-if="!noSearch"
            :placeholder="searchPlaceholder"
                        v-model="params.key"
                        allowClear
                        @search="inputSearch"
                        @keydown.enter="inputSearch">
        </a-input-search>
      </div>
      <slot name="other_search"></slot>
      <div class="filter" v-if="filterGroupRole.length > 0">
        <a-select
            v-for="item in filterGroupRole"
            v-model="params.role"
            :placeholder="item.label"
            :options="item.options"
            allow-clear style="width: 150px"
            @change="filterGroupChangeRole($event)"
            @clear="handleClearRole()">
        </a-select>
      </div>
      <div class="filter" v-if="filterGroupLevel.length > 0">
        <a-select
            v-for="item in filterGroupLevel"
            v-model="params.level"
            :placeholder="item.label"
            :options="item.options"
            allow-clear style="width: 150px"
            @change="filterGroupChangeLevel($event)"
            @clear="handleClearLevel()">
        </a-select>
      </div>
      <slot name="action_slot"></slot>
      <div class="fresh">
        <a-button class="fresh_btn" @click="reFresh">
          <IconRefresh class="fresh_icon"/>
        </a-button>
      </div>
    </div>
    <div>
      <a-spin class="table_data" :loading="isLoading" tip="加载中...">
        <div class="table_source">
        <a-table :row-key="rowKey" :columns="props.columns"
                 :data="data.list"
                 :row-selection="props.noCheckbox ? undefined : rowSelection"
                 v-model:selectedKeys="selectedKeys"
                 :pagination="false">
          <template #columns>
            <template v-for="item in props.columns">
              <a-table-column v-if="item.render" :title="item.title as string">
                <template #cell="data">
                <!--有render优先走-->
                  <component :is="item.render(data)"></component>
                </template>
              </a-table-column>
              <!--没有slotName，走dataIndex-->
              <a-table-column v-else-if="!item.slotName" :title="item.title as string"
                              :data-index="item.dataIndex">
              </a-table-column>
              <!--有slotName，走有slotName-->
              <a-table-column v-else :title="item.title as string">
                <template #cell="{record}" v-if="item.slotName === 'action'">
                  <div class="cell_action">
                    <slot name="action_left" :record="record"></slot>
                    <a-button v-if="!props.noCheckboxEdit" type="primary" @click="edit(record)">{{ editText }}</a-button>
                    <slot name="action_middle" :record="record"></slot>
                    <a-popconfirm v-if="!props.noCheckboxDelete" content="确定要删除吗?" type="error" @ok="remove(record)">
                      <a-button status="danger" type="primary">删除</a-button>
                    </a-popconfirm>
                    <slot name="action_right" :record="record"></slot>
                  </div>
                </template>
                <template #cell="{record}" v-else-if="item.slotName === 'create_at'">
                  <span>{{ dateTimeFormat(record.create_at) }}</span>
                </template>
                <template #cell="{record}" v-else-if="item.slotName === 'avatar'">
                  <a-avatar @click="checkMessage(record)" :imageUrl="getAvatarUrl(record.avatar)"></a-avatar>
                </template>
                <template #cell="{record}" v-else>
                  <slot :name="item.slotName" :record="record"></slot>
                </template>
              </a-table-column>
            </template>
          </template>
        </a-table>
      </div>
        <div class="table_footer">
        <a-pagination v-model:current="params.page" @change="pageChange" :default-page-size="params.limit" show-total :total="data.count" show-jumper/>
      </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {type baseResponse, defaultOptionApi, type listResponse, type paramsType} from "@/api";
import {Message, type TableColumnData, type TableRowSelection} from "@arco-design/web-vue";
import {dateFormat, dateTimeFormat, relativeCurrentTime} from "../../utils/dayjs.ts";
import {defaultRemoveApi} from "@/api"
import type {optionType} from "@/components/common/types";

interface Props {
  url: (params: paramsType)=>Promise<listResponse<any>>,
  columns: TableColumnData[],
  limit?: number,
  rowKey?: string,
  addText?: string,
  editText?: string,
  defaultRemove?: boolean,
  groupOption?: groupOptionType[],
  filterGroupRole?: filterOptionType[], // 用户权限过滤
  filterGroupLevel?: filterOptionType[], // 日志等级过滤
  filterGroupCategory?: filterOptionType[], // 文章分类过滤
  searchPlaceholder?: string,  //搜索模糊匹配提示
  defaultParams?: paramsType & any, //默认第一次查询的参数
  noActionGroup?: boolean,  //是否不启用选择器
  noTwiceConfirm?: boolean, //是否不启用二次确定执行
  noAdd?: boolean,  //是否不启用添加按钮
  noCheckbox?: boolean,  //是否不启用选择框
  noCheckboxEdit?: boolean, //是否不启用选择框编辑
  noCheckboxDelete?: boolean, //是否不启用选择框删除
  noSearch?: boolean, //是否不启用搜索框
}

const props = defineProps<Props>()

// 没传过来的默认值在这里声明，上级组件要传可以直接写
const {
  limit = 10,
  rowKey = "id",
  addText = "添加",
  searchPlaceholder = "搜索",
  editText = "编辑",
} = props

export interface listData<T> {
  list: T[]; // 或者更具体的类型，比如 YourItemType[]
  count: number;
}

const data = reactive<listData<any>>({
  list: [],
  count: 0,
});

const params = reactive<paramsType>({
  page: 1,
  limit: limit,
  key: "",
  role: [],
  level: [],
  category: [],
})

export type RecordType <T> = T & {}

// const emits = defineEmits(["addUser", "editUser", "removeUser"])
const emits = defineEmits<{
  (e:"add"): void,  //添加事件
  (e:"edit", record:RecordType<any>):void,  //编辑事件
  (e:"checkMessage", record:RecordType<any>):void,  //头像点击触发消息弹窗事件
  (e:"remove", idList:(number | string)[]):void,  //删除事件
  (e:"removeUser", idList:(number | string)[]):void,  // 用户删除事件
  (e:"removeMenus", idList:(number | string)[]):void,  // 菜单删除事件
  (e:"removeAD", idList:(number | string)[]):void,  // 广告删除事件
  (e:"removeLog", idList:(number | string)[]):void,  // 日志删除事件
  (e:"removeImage", idList:(number | string)[]):void,  // 图片删除事件
  (e:"removeArticle", idList:(number | string)[]):void,  // 文章删除事件
  (e:"removeCollect", idList:(number | string)[]):void,  // 文章收藏删除事件
  (e:"removeAutoReply", idList:(number | string)[]):void,  // 自动回复删除事件
  (e:"removeRoleTag", idList:(number | string)[]):void,  // 角色标签删除事件
  (e:"removeRole", idList:(number | string)[]):void,  // 角色删除事件
  (e:"removeSession", idList:(number | string)[]):void,  // 会话删除事件
}>()


export interface groupOptionType {
  label: string
  value?: string|number
  callback?: (idList: (number | string)[]) => Promise<boolean>
}

const groupOption = ref<groupOptionType[]>([
  {label: "批量删除", value: 0},
])

// 追加选择器内容
function addActionGroup() {
  if (!props.groupOption) {
    return
  }
  for (let i = 0; i < props.groupOption.length; i++) {
    groupOption.value.push({
      label: props.groupOption[i].label,
      value: i + 1,
      callback: props.groupOption[i].callback,
    })
  }
}
addActionGroup()

const actionActive = ref<string | number | undefined | "">(undefined)

type filterFunc = (params?: paramsType) => Promise<baseResponse<optionType[]>>

export interface filterOptionType {
  label: string,
  value?: number | string,
  column?: string,
  source: optionType[] | string | filterFunc
  options?: optionType[]
}

const filterGroupRole = ref<filterOptionType[]>([]);

const filterGroupLevel = ref<filterOptionType[]>([]);

const filterGroupCategory = ref<filterOptionType[]>([]);

async function initFilterGroupRole() {
  if (!props.filterGroupRole) return
  for (let i = 0; i < props.filterGroupRole.length; i++) {
    const item = props.filterGroupRole[i]
    let source: optionType[] = []
    // 处理source的数据，不同的数据类型做不同处理
    switch (typeof item.source) {
      case "function":
        let funcRes = await item.source()
        source = funcRes.data
        break;
      case "string":
        let strRes = await defaultOptionApi(item.source as string)
        source = strRes.data
        break;
      case "object":
        source = item.source
        break;
    }
    filterGroupRole.value.push({
      label: item.label,
      value: item.value,
      column: item.column,
      source: item.source,
      options: source,
    })
  }
}
initFilterGroupRole()

async function initFilterGroupLevel() {
  if (!props.filterGroupLevel) return
  for (let i = 0; i < props.filterGroupLevel.length; i++) {
    const item = props.filterGroupLevel[i]
    let source: optionType[] = []
    // 处理source的数据，不同的数据类型做不同处理
    switch (typeof item.source) {
      case "function":
        let funcRes = await item.source()
        source = funcRes.data
        break;
      case "string":
        let strRes = await defaultOptionApi(item.source as string)
        source = strRes.data
        break;
      case "object":
        source = item.source
        break;
    }
    filterGroupLevel.value.push({
      label: item.label,
      value: item.value,
      column: item.column,
      source: item.source,
      options: source,
    })
  }
}
initFilterGroupLevel()

// 待做
async function initFilterGroupCategory() {
  if (!props.filterGroupCategory) return
  for (let i = 0; i < props.filterGroupCategory.length; i++) {
    const item = props.filterGroupCategory[i]
    let source: optionType[] = []
    // 处理source的数据，不同的数据类型做不同处理
    switch (typeof item.source) {
      case "function":
        let funcRes = await item.source()
        source = funcRes.data
        break;
      case "string":
        let strRes = await defaultOptionApi(item.source as string)
        source = strRes.data
        break;
      case "object":
        source = item.source
        break;
    }
    filterGroupCategory.value.push({
      label: item.label,
      value: item.value,
      column: item.column,
      source: item.source,
      options: source,
    })
  }
}
initFilterGroupCategory()

const getAvatarUrl = (path: string): string => {
    if (path.startsWith('http') ) {
      return path;
    } else {
      return `http://127.0.0.1:8080${path}`;
    }
};

const selectedKeys = ref<number[]|string[]>([]);
const rowSelection = reactive<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});

const isLoading = ref<boolean>(false);

// 将分页限制参数传给后端，获取用户列表数据
async function getList(p?: paramsType & any) {
  if (p) {
    Object.assign(params, p)
  }
  isLoading.value = true
  let res = await props.url(params)
  isLoading.value = false
  data.list = res.data.list
  data.count = res.data.count
}

getList(props.defaultParams)

function pageChange() {
  getList()
}

function inputSearch() {
  params.page = 1;
  getList()
}

function reFresh() {
  Message.success("刷新成功")
  getList()
}

defineExpose({
  getList,
})

function add() {
  emits("add")
}

function edit(record: RecordType<any>) {
  emits("edit", record);
}

function groupMethod() {
  if (actionActive.value === "") {
    return;
  }
  // 判断选择操作组的方法
  if (actionActive.value === 0) {
    // 当前方法是批量删除
    if (selectedKeys.value.length === 0) {
      Message.warning("请选择要删除的记录")
      return
    }
    removeIDList(selectedKeys.value)
    return
  }
  const action = groupOption.value[actionActive.value as number];
  if (!action.callback) {
    return;
  }
  action.callback(selectedKeys.value).then(res => {
    if (res) {
      getList()
      selectedKeys.value = []
      return
    }
  })
}

function filterGroupChangeRole(role: any) {
  console.log(role)
  if (role.length === 0){
    role = [1,2,3]
  }
  params.role = role
  getList()
}

function filterGroupChangeLevel(level: any) {
  console.log(level)
  if (level.length === 0){
    level = [1,2,3,4]
  }
  params.level = level
  getList()
}

// 待做
function filterGroupChangeCategory(category: any) {
  console.log(category)
  if (category.length === 0){
    category = [1,2,3,4]
  }
  params.category = category
  getList()
}

// 监听角色权限过滤清除事件，当清楚后把对应的角色权限限制清除
function handleClearRole() {
  params.role = [];
  getList();
}

// 监听日志等级过滤清除事件
function handleClearLevel() {
  params.level = [];
  getList();
}

const urlRegex = /return useAxios.get\("(.*?)", .*?\)/

async function remove(idList: RecordType<any>) {
  let id = idList[rowKey]
  await removeIDList([id])
}

async function removeIDList(idList: (number | string)[]) {
  if (props.defaultRemove) {
    let removeUrl = urlRegex.exec(props.url.toString())
    if (removeUrl === null || removeUrl.length !== 2) {
      return;
    }
    if (removeUrl[1] === "/api/userList") {
      removeUrl[1] = "/api/userRemove"
      emits("removeUser", idList);
    } else if (removeUrl[1] === "/api/menusList") {
      removeUrl[1] = "/api/menusRemove"
      emits("removeMenus", idList);
    } else if (removeUrl[1] === "/api/advertList") {
      removeUrl[1] = "/api/advertRemove"
      emits("removeAD", idList);
    } else if (removeUrl[1] === "/api/logList") {
      removeUrl[1] = "/api/logRemove"
      emits("removeLog", idList);
    } else if (removeUrl[1] === "/api/imagesList") {
      removeUrl[1] = "/api/imagesRemove"
      emits("removeImage", idList);
    } else if (removeUrl[1] === "/api/articleList") {
      removeUrl[1] = "/api/articleRemove"
      emits("removeArticle", idList);
    } else if (removeUrl[1] === "/api/articleCollectList") {
      removeUrl[1] = "/api/articleCollectRemove"
      emits("removeCollect", idList);
    } else if (removeUrl[1] === "/api/large_scale_model/auto_reply") {
      removeUrl[1] = "/api/large_scale_model/auto_reply"
      emits("removeAutoReply", idList);
    } else if (removeUrl[1] === "/api/large_scale_model/tag") {
      removeUrl[1] = "/api/large_scale_model/tag"
      emits("removeRoleTag", idList);
    } else if (removeUrl[1] === "/api/large_scale_model/roleList") {
      removeUrl[1] = "/api/large_scale_model/role"
      emits("removeRole", idList);
    } else if (removeUrl[1] === "/api/large_scale_model/session") {
      removeUrl[1] = `/api/large_scale_model/session/${idList}`
      emits("removeSession", idList);
    } else {
      emits("remove", idList);
    }
    let res = defaultRemoveApi(removeUrl[1], idList)
    if ((await res).code) {
      Message.error((await res).msg)
    }
    Message.success((await res).msg)
    selectedKeys.value = []
    await getList()
    return;
  }
}

const checkMessage = (record: RecordType<any>) => {
  emits("checkMessage", record);
};

</script>

<style lang="scss">
.admin_table{
  background-color: var(--color-bg-1);
  border-radius: 5px;
  .table_head{
    padding: 15px 20px 15px 20px;
    border-bottom: 1px solid var(--bgColor);
    display: flex;
    align-items: center;
    position: relative;
    .group{
      display: flex;
      .group_btn{
        margin-left: 20px;
      }
    }
    .fresh{
      position: absolute;
      right: 20px;
      margin-right: 0px;
      .fresh_btn{
        border-radius: 5px;
        padding: 0px 10px;
        background-color: var(--collapse-button);
        color: var(--collapse-color);
        &:hover{
          transition: transform 0.3s ease;
          transform: rotate(180deg);
        }
      }
    }
    .filter{
      display: flex;
      margin-left: 20px;
      >.arco-select{
        margin-right: 20px;
      }
    }
  }
  .table_data{
    width: 100%;
    padding: 10px 20px 10px 20px;
    .table_source{
      .cell_action{
        >button{
          border-radius: 5px;
          margin-right: 10px;
          &:last-child{
            margin-right: 0px;
          }
        }
      }
    }
    .table_footer{
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }
  }
}
</style>