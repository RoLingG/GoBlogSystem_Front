<template>
  <div class="message_list">
    <div class="user_list_menu">
      <div class="head">
        <a-input-search placeholder="搜索用户名" v-model="params.nick_name" @search="getMessageData" @keydown.enter="getMessageData" allowClear></a-input-search>
      </div>
      <message_list @check="messageCheck" :data="messageData.list"></message_list>
      <div class="page">
        <a-pagination simple :total="messageData.count" v-model:current="params.page" :page-size="params.limit" @change="getMessageData"></a-pagination>
      </div>
    </div>
    <div class="user_menu" v-if="messageUserData.list.length">
      <message_list @check="messageUserCheck" :data="messageUserData.list"></message_list>
    </div>
    <div class="user_record" v-if="messageRecordData.list.length">
      <div :class="{message: true, isMe: item.isMe}" v-for="item in messageRecordData.list">
        <img class="avatar" :src="item.isMe ? item.send_user_avatar : item.rev_user_avatar" alt="">
        <div class="message_main">
          <div class="message_user">{{ item.send_user_nick_name }}</div>
          <div class="message_content">
            <div class="content">
              <div class="text">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import type {messageRecordType, messageType, messageParams} from "@/api/message_api.ts";
import Message_list from "@/components/admin/message_list.vue";
import {messageUserListApi, messageUserListByUserApi, messageUserRecordApi} from "@/api/message_api.ts";
import type {listData} from "@/components/admin/admin_table.vue";

const params = reactive<messageParams>({
  page: 1,
  limit: 10,
  nick_name: "",
})

const messageData = reactive<listData<messageType>>({
  list: [],
  count: 0,
})

const revUser = ref<number>(0)
const sendUser = ref<number>(0)

async function getMessageData() {
  let res = await messageUserListApi(params);
  messageData.list = res.data.list;
  messageData.count = res.data.count;
}
getMessageData()

const messageUserData = reactive<listData<messageType>>({
  list: [],
  count: 0,
})

async function messageCheck(item: messageType) {
  let res = await messageUserListByUserApi(item.user_id);
  messageUserData.list = res.data.list;
  messageUserData.count = res.data.count;
  sendUser.value = item.user_id
}

const messageRecordData = reactive<listData<messageRecordType>>({
  list: [],
  count: 0,
})

async function messageUserCheck(item: messageType) {
  revUser.value = item.user_id
  let res = await messageUserRecordApi(sendUser.value, revUser.value);
  // 判断谁算右边
  const list: any = []
  res.data.list.forEach(item => {
    if (item.send_user_id === sendUser.value) {
      item.isMe = true
    } else {
      item.isMe = false
    }
    list.push(item)
  })
  messageRecordData.list =list
  messageRecordData.count = res.data.count;
}

</script>

<style lang="scss">
.message_list{
  display: flex;
  >div{
    background: var(--color-bg-1);
    height: calc(100vh - 150px);
    border-radius: 5px;
    color: var(--color-text-2);
  }
  .user_list_menu{
    width: 280px;
    padding: 20px;
    .head{
      margin-bottom: 15px;
    }
    .page{
      position: fixed;
      margin-left: 30px;
      bottom: 50px;
    }
  }
  .user_menu{
    width: 280px;
    margin-left: 20px;
    padding: 20px;
  }
  .user_record{
    width: calc(100% - 560px);
    margin-left: 20px;
    padding: 20px;
    overflow-y: auto;
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
    }
  }
}
</style>