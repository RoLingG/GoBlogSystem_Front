<template>
  <div class="session_list_view">
    <a-drawer v-model:visible="visible" class="chat_drawer" placement="right" width="50%" :footer="false">
      <template #title>
        <div class="left">{{ drawerTitle }}</div>
        <div class="right">
          <a-button style="margin-right: 10px" type="primary" status="danger" size="mini" v-if="useIDList.length && isManage" @click="chatRemove">删除
          </a-button>
          <a-checkbox v-if="isManage" @change="allIn" style="margin-right: 10px">全选</a-checkbox>
          <a-checkbox v-model="isManage">管理模式</a-checkbox>
        </div>
      </template>
      <div class="chat_list_view">
        <a-checkbox-group style="width: 100%" v-model="useIDList">
          <div :class="{item: true, isCheck: isInList(item.id)}" v-for="item in data.list">
            <div class="user_item">
              <a-checkbox v-if="isManage" :value="item.id"></a-checkbox>
              <div class="avatar">
                <img :src="getImgSrc(item.user_avatar)" alt="">
              </div>
              <div class="container">
                <div class="date">{{ dateTimeFormat(item.create_at) }}</div>
                <div class="content">{{ item.user_content }}</div>
              </div>
            </div>
            <div class="bot_item">
              <div class="avatar">
                <img :src="getImgSrc(item.ai_avatar)" alt="">
              </div>
              <div class="container">
                <div class="date">{{ dateTimeFormat(item.create_at) }}</div>
                <div class="content">
                  <MdPreview :model-value="item.ai_content" :theme="store.themeStringTheme"></MdPreview>
                </div>
              </div>
            </div>
          </div>
        </a-checkbox-group>
      </div>
    </a-drawer>
    <admin_table
        :url="largeScaleModelSessionListApi" :columns="columns"
        ref="adminTable" no-add edit-text="查看"
        no-checkbox no-action-group
        search-placeholder="搜索角色名称"
        default-remove @edit="showSession">
    </admin_table>
  </div>
</template>


<script setup lang="ts">
import {
  type chatType,
  largeScaleModelChatDeleteApi,
  largeScaleModelChatListApi,
  largeScaleModelSessionListApi,
  type sessionType
} from "@/api/large_model_api.ts";
import {reactive, ref} from "vue";
import Admin_table, {type listData} from "@/components/admin/admin_table.vue";
import {dateTimeFormat} from "../../../../utils/dayjs.ts";
import {useStore} from "@/stores/counter.ts";
import {MdPreview} from "md-editor-v3";
import "md-editor-v3/lib/preview.css"
import {Message} from "@arco-design/web-vue";

const store = useStore()

const columns = [
  {title: '用户名称', dataIndex: 'nick_name'},
  {title: '会话', dataIndex: 'session_name'},
  {title: '角色', dataIndex: 'role_name'},
  {title: '对话次数', dataIndex: 'chat_count'},
  {title: '聊天内容', dataIndex: 'last_content'},
  {title: '创建时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'},
]

const data = reactive<listData<chatType>>({
  count: 0,
  list: []
})

const isManage = ref<boolean>(false)

const useIDList = ref<number[]>([])

const activeSessionID = ref<number>(0)

const allIDList = ref()

const drawerTitle = ref("")

const adminTable = ref()

const visible = ref(false)

function isInList(id: number) {
  for (const uid of useIDList.value) {
    if (uid === id) {
      return true
    }
  }
  return false
}

async function showSession(record: sessionType) {
  visible.value = true
  drawerTitle.value = `${record.nick_name}-${record.role_name} 会话详情`
  activeSessionID.value = record.id
  await getData()
}

function allIn(value: (boolean | (string | number | boolean)[]), ev: Event) {
  let v = value as boolean
  if (v) {
    // 全选
    useIDList.value = allIDList.value
  } else {
    // 取消全选
    useIDList.value = []
  }
}

async function getData() {
  let res = await largeScaleModelChatListApi({session_id: activeSessionID.value})
  data.count = res.data.count
  data.list = res.data.list
  allIDList.value = []
  for (const re of res.data.list) {
    allIDList.value.push(re.id)
  }
}

async function chatRemove() {
  console.log(useIDList.value)
  let res = await largeScaleModelChatDeleteApi(useIDList.value)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  useIDList.value = []
  await getData()
}

function getImgSrc(path: string) {
  if (!path) {
    return "";
  }
  if (path.startsWith("http")) {
    return path;
  } else if (path.startsWith("/")) {
    return `http://127.0.0.1:8080${path}`;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}
</script>

<style lang="scss">
  .chat_drawer {
    .arco-drawer-title {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      .right {
        display: flex;
        align-items: center;
        .arco-btn {
          margin-right: 10px;
        }
      }
    }
  }
  .chat_list_view {
    .item {
      .bot_item {
        display: flex;
        margin-bottom: 20px;
        .container {
          margin-left: 10px;
          .md-editor {
            background-color: transparent;
          }
        }
      }
      .user_item {
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 10px;
        .container {
          margin-right: 10px;
          width: auto;
          display: flex;
          flex-direction: column;
          align-items: end;
          .content {
            padding: 15px;
          }
          .date {
            text-align: right;
          }
        }
      }
      .container {
        width: calc(100% - 120px);
        .date {
          font-size: 12px;
        }
        .content {
          background-color: var(--webBgColor);
          border-radius: 5px;
          margin-top: 5px;
          width: fit-content;
        }
      }
      .avatar {
        width: 50px;
        height: 50px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      &.isCheck {
        background-color: var(--color-fill-3);
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 20px;
      }
    }
  }
</style>