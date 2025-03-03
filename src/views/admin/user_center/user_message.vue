<template>
  <div class="message_list">
    <div class="user_menu">
      <message_list @check="messageUserCheck" :data="messageData.list"></message_list>
      <div class="page">
        <a-pagination simple :total="messageData.count"
                      v-model:current="messageParams.page"
                      :page-size="messageParams.limit"
                      @change="getMessageData">
        </a-pagination>
      </div>
    </div>
    <message_record class="user_record"
                    :send-user_id="sendUser_id"
                    :rev-user_id="revUser_id"
                    :rev-user_name="revUser_name"
                    :is-head="true"
                    @refresh="refreshMsgList">
    </message_record>
  </div>
</template>

<script setup lang="ts">
import message_record from "@/components/common/message_record.vue";
import Message_list from "@/components/admin/message_list.vue";
import {reactive, ref} from "vue";
import {
  type messageRecordType,
  type messageType,
  messageUserListByMyselfApi, messageUserRecordByMyselfApi, type userRecordRequestType
} from "@/api/message_api.ts";
import type {listData} from "@/components/admin/admin_table.vue";
import {useStore} from "@/stores/counter.ts";
import type {paramsType} from "@/api";

const store = useStore()

const sendUser_id = ref<number>(0)
const revUser_id = ref<number>(0)

const revUser_name = ref<string>("")

const messageParams = reactive<paramsType>({
  page: 1,
  limit: 10,
})

const messageData = reactive<listData<messageType>>({
  list: [],
  count: 0,
})

async function getMessageData() {
  let res = await messageUserListByMyselfApi(messageParams);
  messageData.list = res.data.list;
  messageData.count = res.data.count;
}
getMessageData()

async function messageUserCheck(item: messageType) {
  revUser_id.value = item.user_id
  revUser_name.value = item.nick_name
  sendUser_id.value = store.userInfo.user_id
}

const key = ref(0);

function refreshMsgList() {
  getMessageData()
}

</script>

<style lang="scss">
.message_list {
  display: flex;
  > div {
    background: var(--color-bg-1);
    height: calc(100vh - 150px);
    border-radius: 5px;
    color: var(--color-text-2);
  }
  .user_menu{
    width: 300px;
    margin-left: 20px;
    padding: 20px;
  }
  .page{
    position: fixed;
    margin-left: 50px;
    bottom: 50px;
  }
  .user_record{
    width: calc(100% - 340px);
    margin-left: 20px;
  }
}
</style>