<template>
  <div class="session_view">
    <a-modal title="编辑会话名称" v-model:visible="visible" :on-before-ok="ok" @open="onBeforeOpen">
      <a-form :model="form" ref="formRef">
        <a-form-item label="会话名称" field="session_name" :rules="[{required:true,message:'请输入会话名称'}]"
                     :validate-trigger="['blur']">
          <a-input ref="sessionNameIptRef" v-model="form.session_name" placeholder="会话名称"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="left">
      <div class="head"> {{ detail.name }}
        <div class="manage">
          <a-button v-if="isManage && chatIDList.length > 0" @click="chatRemove" style="margin-right: 10px" type="primary" status="danger" size="mini">删除</a-button>
          <a-checkbox v-if="isManage" style="margin-right: 10px" @change="allIn">全选</a-checkbox>
          <a-checkbox v-if="store.isAdmin" v-model="isManage">管理模式</a-checkbox>
        </div>
      </div>
      <div class="chat_list">
        <a-checkbox-group v-model="chatIDList">
          <div :class="{item: true, isCheck: isInList(item.id)}" v-for="item in chatData.list">
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
                  <MdPreview v-if="item.ai_content !== ''" :model-value="item.ai_content" :theme="store.themeStringTheme"></MdPreview>
                  <icon-loading style="font-size: 32px; padding: 1px 10px;" v-else/>
                </div>
              </div>
            </div>
          </div>
        </a-checkbox-group>
      </div>
      <div class="chat_menu">
        <div class="ipt">
          <IconSend></IconSend>
          <a-textarea @keydown.enter.prevent="userChat"
                      v-model="chatParams.content"
                      placeholder="来说点什么吧...(Shift + Enter = 换行)"
                      :auto-size="{minRows: 1, maxRows: 5}">
          </a-textarea>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="role_info">
        <div>
          <img :src="getImgSrc(detail.icon)" alt="">
          <div class="info">
            <div class="name">{{ detail.name }}</div>
            <div class="count">共{{ detail.chat_count }}条对话</div>
          </div>
        </div>
        <a-typography-text
            style="color: var(--color-text-2); padding-top: 10px"
                           :ellipsis="{rows: 2}">{{ detail.abstract }}
        </a-typography-text>
      </div>
      <div class="session_list">
        <a-button class="add_session" type="outline" @click="createSession" long>创建新会话</a-button>
        <div :class="{item: true, active: item.id === Number(route.query.session_id)}" @click="checkSession(item)"
             v-for="item in data.list">
          <IconMessage class="msg"/>
          <div class="name">{{ item.session_name }}</div>
          <IconEdit title="编辑" @click="edit(item)" class="edit"/>
          <a-popconfirm content="是否删除会话?" @ok="remove(item)">
            <IconDelete title="删除" class="delete"></IconDelete>
          </a-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useRoute} from "vue-router";
import {nextTick, reactive, ref, watch} from "vue";
import {
  type chatSSEParams,
  type chatType, largeScaleModelChatDeleteApi, largeScaleModelChatListApi,
  roleDetailApi, type roleDetailType,
  roleSessionListApi,
  type roleSessionRequest,
  type roleSessionType, sessionCreateApi, sessionNameUpdateApi,
  type sessionNameUpdateRequest, sessionRemoveApi
} from "@/api/large_model_api.ts";
import type {listData} from "@/components/admin/admin_table.vue";
import {Message} from "@arco-design/web-vue";
import router from "@/router";
import {dateTimeFormat} from "@/utils/dayjs.ts";
import {MdPreview} from "md-editor-v3";
import "md-editor-v3/lib/preview.css"
import {useStore} from "@/stores/counter.ts";
import type {baseResponse} from "@/api";

const store = useStore()

const route = useRoute()

const visible = ref<boolean>(false)

const formRef = ref()

const sessionNameIptRef = ref()

const form = reactive<sessionNameUpdateRequest>({
  session_id: 0,
  session_name: "",
})

const data = reactive<listData<roleSessionType>>({
  list: [],
  count: 0,
})

const detail = reactive<roleDetailType>({
  id: 0,
  create_at: "",
  icon: "",
  name: "",
  abstract: "",
  tags: [],
  chat_count: 0,
})

async function getRoleDetail() {
  let res = await roleDetailApi(Number(route.query.role_id));
  Object.assign(detail, res.data);
}
getRoleDetail()

async function getSessionList() {
  const roleID = Number(route.query.role_id)
  let res = await roleSessionListApi({role_id: roleID})
  data.list = res.data.list
  data.count = res.data.count
}
getSessionList()

async function edit(record: roleSessionType) {
  form.session_id = record.id
  form.session_name = record.session_name
  visible.value = true
}

async function remove(record: roleSessionType) {
  let res = await sessionRemoveApi(record.id)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  await getSessionList()
  if (data.list.length > 0) {
    await router.push({
      name: route.name as string,
      query: {
        role_id: route.query.role_id,
        session_id: data.list[0].id,
      }
    })
    return
  }
  await store.getRoleHistoryList()
  await router.push({
    name: "role_square"
  })
}

async function ok() {
  let val = await formRef.value.validate()
  if (val) {
    return false
  }
  let res = await sessionNameUpdateApi(form)
  if (res.code) {
    Message.error(res.msg)
    return false
  }
  Message.success(res.msg)
  visible.value = false
  await getSessionList()
  return true
}

function onBeforeOpen() {
  sessionNameIptRef.value.focus()
}

function checkSession(record: roleSessionType) {
  router.push({
    name: route.name as string,
    query: {
      role_id: route.query.role_id,
      session_id: record.id,
    }
  })
}

async function createSession() {
  let res = await sessionCreateApi(Number(route.query.role_id));
  if (res.code) {
    Message.error(res.msg)
    return
  }
  if (res.msg !== "已存在新的未对话会话"){
    Message.success(res.msg)
    await getSessionList()
    await router.push({
      name: route.name as string,
      query: {
        role_id: route.query.role_id,
        session_id: res.data,
      }
    })
    return
  }
  Message.warning(res.msg)
  await router.push({
    name: route.name as string,
    query: {
      role_id: route.query.role_id,
      session_id: res.data,
    }
  })
  await getChatData()
  await getSessionList()
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

const isManage = ref<boolean>(false);

const chatData = reactive<listData<chatType>>({
  count: 0,
  list: []
})

const allIDList = ref<number[]>([])

const chatIDList = ref<number[]>([])

async function getChatData() {
  let res = await largeScaleModelChatListApi({session_id: Number(route.query.session_id)});
  chatData.count = res.data.count
  chatData.list = res.data.list
  allIDList.value = []
  for (const re of res.data.list) {
    allIDList.value.push(re.id)
  }
}
getChatData()

const chatParams = reactive<chatSSEParams>({
  token: store.userInfo.token,
  session_id: 0,
  content: "",
})

function userChat(e: KeyboardEvent) {
  if (e.shiftKey || e.ctrlKey) {
    chatParams.content += "\n"
    return;
  }
  chatSend()
}

async function chatSend() {
  if (chatParams.content.trim() === "") {
    Message.warning("内容不能为空")
    return
  }
  const chatItem = reactive<chatType>({
    id: 0,
    create_at: new Date().toLocaleString(),
    status: false,
    user_content: chatParams.content,
    user_avatar: store.userInfo.avatar,
    ai_avatar: detail.icon,
    ai_content: "",
  })
  chatData.list.push(chatItem)
  chatParams.session_id = Number(route.query.session_id)
  const eventSource = new EventSource(`/api/large_scale_model/chat_sse?token=${chatParams.token}&session_id=${chatParams.session_id}&content=${chatParams.content}`)
  eventSource.onopen = function () {
    chatParams.content = ""
    chatItem.status = true
  }
  eventSource.onmessage = function (ev: MessageEvent) {
    const data: baseResponse<string> = JSON.parse(ev.data)
    if (data.code) {
      Message.error(data.msg)
      // chatItem.ai_content = data.msg
      return
    }
    chatItem.ai_content += data.data
  }

  eventSource.onerror = function (ev: Event) {
    eventSource.close()
    // 控制页面滚动到最底部
    nextTick(() => {
      let dom = document.querySelector(".chat_list") as HTMLDivElement
      dom.scrollTo({
        top: dom.scrollHeight,
        behavior: "smooth" // 平滑
      })
    })
    chatParams.content = ""
    getChatData()
  }
}

function isInList(id: number) {
  for (const uid of chatIDList.value) {
    if (uid === id) {
      return true
    }
  }
  return false
}

function allIn(value: (boolean | (string | number | boolean)[]), ev: Event) {
  let v = value as boolean
  if (v) {
    // 全选
    chatIDList.value = allIDList.value
  } else {
    // 取消全选
    chatIDList.value = []
  }
}

async function chatRemove() {
  console.log(chatIDList.value, 123)
  let res = await largeScaleModelChatDeleteApi(chatIDList.value)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  chatIDList.value = []
  await getChatData()
}

// 监听角色变化
watch(() => route.query.role_id, () => {
  if (route.query.role_id === "") {
    return
  }
  getRoleDetail() // 获取角色详情
  getSessionList() // 获取角色会话列表
}, {immediate: true})

// 监听角色变化
watch(() => route.query.session_id, () => {
  if (route.query.session_id === "") {
    return
  }
  getChatData() // 获取对话内容列表
}, {immediate: true})

</script>

<style lang="scss">
.session_view {
  display: flex;
  margin-top: 60px;
  width: 100%;
  justify-content: space-between;
  position: relative;
  .left {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: calc(75vw - 120px);
    height: calc(100vh - 170px);
    border-radius: 10px;
    background-color: var(--color-bg-1);
    margin-right: 20px;
    .head {
      text-align: center;
      padding: 20px 10px;
      border-bottom: 1px solid var(--bgColor);
      color: var(--color-text-1);
      font-size: 16px;
      position: relative;
      .manage{
        position: absolute;
        right: 20px;
        top: 20px;
        display: flex;
        align-items: center;
      }
    }
    .chat_list {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      color: var(--color-text-1);
      .arco-checkbox-group{
        width: 100%;
      }
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
      &::-webkit-scrollbar {
        width: 8px; /* 可以调整滚动条的宽度 */
      }
      &::-webkit-scrollbar-track {
        background: var(--color-bg-1); /* 轨道颜色 */
        border-radius: 10px; /* 轨道圆角 */
      }
      &::-webkit-scrollbar-thumb {
        background: var(--text-color); /* 滑块颜色 */
        border-radius: 10px; /* 滑块圆角 */
      }
      &::-webkit-scrollbar-thumb:hover {
        background: var(--text-color); /* 滑块悬停颜色 */
      }
    }
    .chat_menu {
      padding: 20px;
      display: flex;
      align-items: center;
      width: 100%; // 确保 .chat_menu 宽度与 .left 容器相同
      .ipt {
        width: 100%;
        position: relative;
        margin-left: 10px;
        svg {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-2);
          z-index: 1;
          cursor: pointer;
        }
        .arco-textarea-wrapper {
          border-radius: 10px;
        }
      }
    }
  }
  .right {
    width: 280px;
    height: calc(100vh - 170px);
    border-radius: 10px;
    background-color: var(--color-bg-1);
    .role_info {
      width: 100%;
      padding: 20px 20px 0 20px;
      display: flex;
      flex-direction: column;
      border-bottom: 1px dashed var(--bgColor);
      > div {
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .info {
          margin-left: 10px;
          .name {
            font-size: 16px;
            font-weight: 600;
            color: var(--color-text-1);
          }
          .count {
            font-size: 12px;
            margin-top: 5px;
            color: var(--color-text-2);
          }
        }
        .abs {
          margin-top: 10px;
          color: var(--color-text-2);
          margin-bottom: 0;
        }
      }
    }
    .session_list {
      padding: 20px;
      .add_session {
        border-radius: 5px;
      }
      .item {
        margin-top: 20px;
        border-radius: 5px;
        padding: 10px;
        background-color: var(--color-fill-2);
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        position: relative;
        &.active {
          background-color: var(--color-fill-3);
        }
        &:hover {
          .edit, .delete {
            opacity: 1;
          }
        }
        .msg {
          font-size: 20px;
          margin-right: 5px;
        }
        .edit {
          position: absolute;
          right: 40px;
          font-size: 20px;
          cursor: pointer;
          opacity: 0;
          transition: all .3s;
        }
        .name {
          color: var(--color-text-1);
          width: 6rem;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .delete {
          position: absolute;
          color: red;
          right: 10px;
          font-size: 20px;
          cursor: pointer;
          opacity: 0;
          transition: all .3s;
        }
        &.isCheck {
          background-color: var(--color-fill-3);
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>