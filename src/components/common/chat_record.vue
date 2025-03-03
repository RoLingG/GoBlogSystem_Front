<template>
  <div class="chat_group_components">
    <a-spin :loading="loading">
      <div class="head">
        <div class="title">
          {{ config.welcomeTitle }}
        </div>
        <div class="outline"></div>

        <div class="manage">
          <a-checkbox v-if="!props.noManage" v-model="isManage">管理模式</a-checkbox>
          <a-button v-if="isManage && selectIDList.length" size="mini" style="margin-left: 10px" type="primary"
                    status="danger"
                    @click="removeChatGroup">删除
          </a-button>
        </div>
      </div>
      <div class="record_list">
        <a-checkbox-group v-model="selectIDList">
          <template v-for="item in chatRecordData.list">
            <div :class="{msg: true, isManage: isManage}">
              <a-checkbox :value="item.id" v-if="isManage"></a-checkbox>
              <div class="date" v-if="config.isShowTime">
                {{ dateTimeFormat(item.create_at) }}
              </div>
              <div v-if="item.msg_type === 2" :class="{message: true}">
                <img class="avatar" :src="getImgSrc(item.avatar)" alt="">
                <div class="chat_main">
                  <div class="chat_user">{{ item.nick_name }}</div>
                  <div class="chat_content">
                    <div class="content">
                      <div class="txt-message">{{ item.content }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.msg_type === 1 || item.msg_type === 7 || item.msg_type === 0"
                   :class="'system '+'system_'+item.msg_type.toString() ">
                <div class="txt-message">{{ item.content }}</div>
              </div>
            </div>
          </template>
        </a-checkbox-group>
      </div>
      <div class="footer">
        <div class="menu">
          <div class="icon" v-if="config.isSendImage" @click="imageEvent">
            <IconImage></IconImage>
          </div>
          <div class="icon" v-if="config.isSendFile" @click="imageEvent">
            <IconFile></IconFile>
          </div>
        </div>
        <div class="into_room" v-if="!socket">
          <a-button type="primary" @click="websocketConnect">进入聊天室</a-button>
        </div>
          <a-textarea v-model="content" auto-size placeholder="聊天内容" style="height: 100%"></a-textarea>
          <a-button class="send_button" type="primary" @click="sendData">发送</a-button>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import type {baseResponse, paramsType} from "@/api";
import type {listData} from "@/components/admin/admin_table.vue";
import {
  type chatGroupConfigType,
  type chatMessageType,
  chatRecordApi,
  chatRemoveApi,
  type chatType
} from "@/api/chat_api.ts";
import {Message} from "@arco-design/web-vue";
import {settingsInfoApi} from "@/api/settings_api.ts";
import {useStore} from "@/stores/counter.ts";
import {userInfoApi} from "@/api/user_api.ts";
import {dateTimeFormat} from "../../utils/dayjs.ts";

interface Props {
  noManage?: boolean
}

const props = defineProps<Props>()

const {noManage = false} = props

const params = reactive<paramsType>({
  page: 1,
  limit: 50,
})

const chatRecordData = reactive<listData<chatType>>({
  list: [],
  count: 0
})

const loading = ref(true);

const config = reactive<chatGroupConfigType>({
  isAnonymous: true,
  isShowTime: false,
  defaultLimit: 50,
  welcomeTitle: "【Blog】在线聊天室",
  isOnlinePeople: true,
  isSendImage: false,
  isSendFile: false
})

async function getConfig() {
  let res = await settingsInfoApi("chat_group") as baseResponse<chatGroupConfigType>
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Object.assign(config, res.data)
  params.limit = config.defaultLimit;
  await getData()
  loading.value = false
}

getConfig()

async function getData() {
  let res = await chatRecordApi(params)
  chatRecordData.list = res.data.list
  chatRecordData.list.reverse()
  chatRecordData.count = res.data.count
  console.log(res.data.list)
}
getData()

function getImgSrc(url: string) {
  if (url.startsWith('http') ) {
    return url;
  } else if (url === "" ) {
    return "http://127.0.0.1:8080/upload/avatar/avatar.png";
  } else {
    return `http://127.0.0.1:8080/${url}`;
  }
}

const isManage = ref(false)

const selectIDList = ref<number[]>([])

async function removeChatGroup() {
  let res = await chatRemoveApi(selectIDList.value)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  selectIDList.value = []
  await getData()
}

function imageEvent(){
  Message.warning("开发中")
}

let socket = ref<WebSocket>()

let index = 0

const chatData = reactive<chatMessageType>({
  avatar: "",
  msg: "",
  date: "",
  msg_type: 2,
  nick_name: "",
  online_count: 0,
})

onUnmounted(()=> {
  if (socket.value) {
    socket.value.close()
  }
})

// isMe判断有问题
function websocketConnect() {
  // 建立websocket连接，没有跨域限制
  socket.value = new WebSocket(`ws://${location.host}/ws/api/chatGroup`)
  // 接收消息
  socket.value.onmessage = function (event) {
      let jsonData = JSON.parse(event.data);
      // if (index === 0) {
      //   // 第一条消息，区分我发的还是别人发的
      //   chatData.nick_name = jsonData.nick_name;
      //   chatData.online_count = jsonData.online_count;
      //   index++;
      //   return;
      // }
      chatData.online_count = jsonData.online_count;
      chatRecordData.list.push({
        avatar: jsonData.avatar,
        content: jsonData.content,
        create_at: jsonData.date,
        msg_type: jsonData.msg_type,
        nick_name: jsonData.nick_name,
        // isMe: chatData.nick_name.trim() === jsonData.nick_name.trim(),
      });
      index++;
      nextTick(() => {
        let dom = document.querySelector(".record_list") as HTMLDivElement;
        dom.scrollTo({
          top: dom.scrollHeight,
          behavior: "smooth" // 平滑滚动
        });
      });
  };

  // 连接成功之后的回调
  socket.value.onopen = function (ev) {
    Message.success("成功进入聊天室")
  }
  // 错误
  socket.value.onerror = function (ev) {
    Message.error("进入聊天室失败")
  }
  // 服务端关闭
  socket.value.onclose = function (ev) {
    Message.error("连接断开")
    socket.value = null as unknown as WebSocket | undefined
  }
}

const content = ref("")

const store = useStore()

async function sendData() {
  const message = {
    nick_name: store.userInfo.nick_name,
    avatar: userAvatar.value,
    msg: content.value,
    msg_type: 2,
  };
  console.log(message);
  console.log("sendData", message);
  socket.value?.send(JSON.stringify(message))
  content.value = ""
  setTimeout(async () => {
    await getData()
  }, 500);
}

const userAvatar = ref('')

async function getUserAvatar(): Promise<string> {
  let res = await userInfoApi()
  userAvatar.value = getAvatar(res.data.avatar)
  return userAvatar.value
}

function getAvatar(path: string) {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080${path}`;
  }
}

// 在组件加载时调用异步函数
onMounted(() => {
  getUserAvatar();
});

</script>

<style lang="scss">
.chat_group_components {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-1);
  border-radius: 5px;

  .arco-spin{
    width: 100%;
  }

  .head {
    border-bottom: 1px solid var(--bgColor);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70px;
    position: relative;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
    }

    .outline {
      margin-top: 5px;
      color: var(--color-text-2);
    }

    .manage {
      position: absolute;
      right: 10px;
      display: flex;
      align-items: center;
    }
  }

  .record_list {
    overflow-y: auto;
    padding: 20px;
    height: calc(100vh - 410px);
    .message {
      display: flex;
      margin-bottom: 20px;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .chat_main {
        margin-left: 10px;
        .chat_content {
          margin-top: 5px;
          .content {
            display: flex;
            margin-left: 5px;
          }
        }
        .txt-message {
          background-color: var(--color-fill-3);
          border-radius: 5px;
          padding: 10px;
          position: relative;
          width: fit-content;
          min-height: 41px;
          white-space: break-spaces;
          word-break: break-all;
          color: var(--color-text-1);
          &:before {
            content: "";
            display: block;
            position: absolute;
            left: -19px;
            top: 6px;
            border-width: 5px 10px;
            border-style: solid;
            border-color: transparent var(--color-fill-3) transparent transparent;
          }
        }
      }
      .chat_user {
        margin-left: 10px;
        color: var(--color-text-1);
      }
      //&.isMe {
      //  justify-content: right;
      //  flex-direction: row-reverse;
      //  .chat_main {
      //    margin-left: 0;
      //    margin-right: 10px;
      //    .chat_user {
      //      text-align: right;
      //      color: var(--color-text-1);
      //    }
      //    .txt-message {
      //      &:before {
      //        content: "";
      //        display: block;
      //        position: absolute;
      //        right: -20px;
      //        left: inherit;
      //        top: 6px;
      //        border-width: 5px 10px;
      //        border-style: solid;
      //        border-color: transparent transparent transparent var(--color-fill-2);
      //      }
      //    }
      //  }
      //}
    }
    .system {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      .txt-message {
        padding: 5px 10px;
        background-color: var(--color-fill-3);
        border-radius: 5px;
        color: var(--color-text-2);
      }
    }
    .msg {
      position: relative;
      &.isManage {
        background-color: var(--color-fill-2);
        border-radius: 5px;
      }
      .arco-checkbox {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .arco-checkbox-group {
      width: 100%;
    }
    .date {
      position: absolute;
      right: 50px;
      top: 5%;
      color: var(--color-text-3);
      font-size: 12px;
    }
  }
  .footer {
    height: 210px;
    border-top: 1px solid var(--bgColor);
    padding: 20px;
    position: relative;
    .menu {
      display: flex;
      align-items: center;
      position: absolute;
      top: -32px;
      border-top: 1px solid var(--bgColor);
      border-right: 1px solid var(--bgColor);
      left: 0;
      background-color: var(--color-bg-1);
      .icon {
        font-size: 18px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
    .into_room{
      position: absolute;
      width: calc(100% - 40px);
      height: calc(100% - 40px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      background-color: var(--login-side-background);
    }
    .send_button {
      position: absolute;
      right: 30px;
      bottom: 30px;
    }
  }
}
</style>