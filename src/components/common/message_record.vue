<template>
    <div class="user_record">
      <div class="user_record_head" v-if="isHead">
        <div class="user_record_title">
          {{ props.revUser_name }}
        </div>
        <div class="user_record_manage">
          <a-checkbox v-model="isManage">管理模式</a-checkbox>
          <a-button v-if="isManage && selectIDList.length" size="mini" style="margin-left: 10px" type="primary"
                    status="danger"
                    @click="removeMessageGroup">删除
          </a-button>
        </div>
      </div>
      <div :class="{record_list: true, isHead: isHead}">
        <a-checkbox-group v-model="selectIDList">
        <div :class="{message: true, isMe: item.isMe, isManage: isManage}" v-for="item in messageRecordData.list">
          <a-checkbox :value="item.id" v-if="isManage"></a-checkbox>
          <img class="avatar" :src="isMeAvatar(item)" alt="">
          <div class="message_main">
            <div class="message_user">{{ item.send_user_nick_name }}</div>
            <div class="message_content">
              <div class="content">
                <div class="text">{{ item.content }}</div>
              </div>
            </div>
          </div>
        </div>
        </a-checkbox-group>
      </div>
      <div class="message_record">
        <a-textarea v-model="messageCreateData.content" @keydown.enter.ctrl="sendMessage" placeholder="请输入聊天内容，Enter+Ctrl快捷发送消息" auto-size style="height: 100%;border-radius: 5px;"></a-textarea>
        <a-button type="primary" style="border-radius: 5px;" @click="sendMessage">回复</a-button>
      </div>
    </div>
</template>

<script setup lang="ts">
import {nextTick, reactive, ref, watch} from "vue";
import {
  type messageRecordType,
  type messageType,
  messageUserRecordByMyselfApi,
  messageUserListByMyselfApi,
  type messageCreateType,
  messageCreateApi, type userRecordRequestType, messageRecordRemoveApi,
} from "@/api/message_api.ts";
import type {listData} from "@/components/admin/admin_table.vue";
import {useStore} from "@/stores/counter.ts";
import {Message} from "@arco-design/web-vue";

const emits = defineEmits(["refresh"])

interface Props {
  sendUser_id: number;
  revUser_id: number;
  revUser_name?: string;
  isHead?: boolean;
}

const props = defineProps<Props>()

const {isHead = false} = props

const store = useStore()

const messageData = reactive<listData<messageType>>({
  list: [],
  count: 0,
})

const messageCreateData = reactive<messageCreateType>({
  send_user_id: store.userInfo.user_id,
  rev_user_id: props.revUser_id,
  content: "",
})

async function getMessageData() {
  let res = await messageUserListByMyselfApi();
  messageData.list = res.data.list;
  messageData.count = res.data.count;
}
getMessageData()

const messageRecordData = reactive<listData<messageRecordType>>({
  list: [],
  count: 0,
})

const recordData = reactive<userRecordRequestType>({
  user_id: props.revUser_id,
  limit: 50,
})

watch(() => props.revUser_id, () => {
  if (props.revUser_id !== 0) {
    recordData.user_id = props.revUser_id
    messageCreateData.rev_user_id = props.revUser_id
    messageCreateData.send_user_id = store.userInfo.user_id
    getMessageRecordData()
  }
})

async function getMessageRecordData() {
  let res = await messageUserRecordByMyselfApi(recordData);
  // 判断谁算右边
  const list: any = []
  res.data.list.forEach(item => {
    if (item.send_user_id === store.userInfo.user_id) {
      item.isMe = true
    } else if (item.send_user_id !== store.userInfo.user_id) {
      item.isMe = false
      let temp = item.send_user_avatar
      item.send_user_avatar = item.rev_user_avatar;
      item.rev_user_avatar = temp
      console.log(item)
    }
    list.push(item)
  })
  messageRecordData.list =list
  messageRecordData.count = res.data.count;
}

async function sendMessage() {
  if (messageCreateData.rev_user_id === 0) {
    Message.warning("请选择聊天用户")
    return;
  }
  if (messageCreateData.content === ""){
    Message.warning("消息内容不能为空")
    return;
  }
  let res = await messageCreateApi(messageCreateData)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  messageCreateData.content = ""
  await getMessageRecordData()
  await nextTick(() => {
    setTimeout(async () => {
      let doc = document.querySelector(".record_list")
      if (doc) doc.scrollTo({
        top: doc.scrollHeight,
        behavior: "smooth",
      });
    }, 200)
  })
}


const isManage = ref<boolean>(false)

const selectIDList = ref<number[]>([])

async function removeMessageGroup() {
  let res = await messageRecordRemoveApi(selectIDList.value)
  if (res.code){
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  selectIDList.value = []
  await getMessageRecordData()
  emits("refresh")
}

function isMeAvatar(item: any) {
  if (item.isMe) {
    return item.send_user_avatar;
  } else {
    return item.rev_user_avatar;
  }
}

</script>

<style lang="scss">
  .user_record{
    width: 100%;
    height: calc(100vh - 150px);
    .user_record_head{
      height: 60px;
      width: 100%;
      border-bottom: 1px solid var(--bgColor);
      display: flex;
      justify-content: center;
      align-items: center;
      .user_record_title{
        font-size: 16px;
        font-weight: 600;
      }
      .user_record_manage{
        position: absolute;
        right: 50px;
        display: flex;
        align-items: center;
      }
    }
    .record_list{
      padding: 20px;
      height: calc(100% - 180px);
      overflow-y: auto;
      &.isHead{
        height: calc(100% - 240px);
      }
      .arco-checkbox-group{
        width: 100%;
      }
      .message{
        display: flex;
        margin-bottom: 20px;
        .avatar{
          width: 40px;
          height: 40px;
          margin-top: 15px;
          border-radius: 50%;
        }
        .message_main{
          margin-left: 10px;
          .message_user{
            margin-left: 5px;
          }
          .message_content{
            margin-top: 5px;
            .content{
              display: flex;
              margin-left: 5px;
            }
          }
          .text{
            background-color: var(--color-fill-3);
            border-radius: 5px;
            padding: 10px;
            position: relative;
            width: fit-content;
            min-width: 41px;
            white-space: break-spaces;
            word-break: break-all;
            &:before{
              content: "";
              display: block;
              position: absolute;
              left: -19px;
              top: 6px;
              border-width: 10px 10px;
              border-style: solid;
              border-color: transparent var(--color-fill-3)  transparent transparent;
            }
          }
        }
        &.isMe{
          justify-content: right;
          flex-direction: row-reverse;
          .message_main{
            margin-left: 0;
            margin-right: 10px;
            .message_user{
              text-align: right;
            }
            .text{
              &:before{
                content: "";
                display: block;
                position: absolute;
                left: inherit;
                right: -19px;
                top: 6px;
                border-width: 10px 10px;
                border-style: solid;
                border-color: transparent transparent transparent var(--color-fill-3);
              }
            }
          }
        }
        &.isManage{
          border-radius: 5px;
          background-color: var(--color-fill-2);
        }
      }
    }
    .message_record{
      border-top: 1px solid var(--bgColor);
      padding: 10px 10px;
      position: relative;
      height: 180px;
      button{
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
    }
  }
</style>