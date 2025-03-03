<template>
  <div class="comment_component">
    <a-comment
        v-for="item in props.data"
        :author="item.user.nick_name"
        :content="item.content"
        :datetime="relativeCurrentTime(item.create_at)">
      <template #avatar>
        <a-avatar>
          <img alt="avatar" :src="item.user.avatar" @click="handleCheckMessage(item)"/>
        </a-avatar>
      </template>
      <template #actions>
        <span class="action" @click="applyShow(item)">
          <IconMessage/>回复
        </span>
        <span class="action" @click="diggComment(item)">
          <icon-thumb-up>点赞</icon-thumb-up>
          ({{ item.digg_count }})
        </span>
        <a-popconfirm v-if="store.isAdmin || store.userInfo.user_id === item.user_id" content="是否删除这条评论?" @ok="deleteComment(item)">
          <span class="action"><IconDelete/>删除</span>
        </a-popconfirm>
      </template>
      <div class="apply_comment_recursion">
        <a-comment v-if="item.isApply">
          <template #avatar>
            <a-avatar>
              <img alt="avatar" :src="userAvatar"/>
            </a-avatar>
          </template>
          <template #content>
            <div>
              <a-textarea @keydown.enter.ctrl="applyComment(item)"
                          :placeholder="'回复用户: '+item.user.nick_name"
                          v-model="item.applyContent"/>
              <a-button type="primary" @click="applyComment(item)" style="margin-bottom: 10px">回复</a-button>
            </div>
          </template>
        </a-comment>
      </div>
      <comment_recursion :data="item.sub_comments" @list="refreshSubComment"></comment_recursion>
      <message_record_modal v-model:visible="messageVisible"
                            :send-user_id="sendUser_id"
                            :rev-user_id="revUser_id"
                            :rev-user_name="revUser_name">
      </message_record_modal>
    </a-comment>
  </div>
</template>

<script setup lang="ts">
import {relativeCurrentTime} from "@/utils/dayjs.ts";
import {
  type commentAddType,
  commentCreateApi,
  commentDeleteApi,
  type commentType,
  diggCommentApi
} from "@/api/comment_api.ts";
import {Message} from "@arco-design/web-vue";
import {onMounted, reactive, ref} from "vue";
import {useStore} from "@/stores/counter.ts";
import Message_record_modal from "@/components/common/message_record_modal.vue";

interface Props {
  data: commentType[]
}

const props = defineProps<Props>()

const emits = defineEmits(["list","create_ok","messageModalShow"])

const store = useStore()

const userAvatar = ref('')

async function fetchUserAvatar() {
  if (userAvatar.value) return;
  try {
    userAvatar.value = getAvatar(store.userInfo.avatar);
  } catch (error) {
    console.error('Fa led to fetch user avatar:', error);
  }
}

function getAvatar(path: string) {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080${path}`;
  }
}

onMounted(async () => {
  await fetchUserAvatar();
});

// 删除评论
async function deleteComment(record: commentType) {
  let res = await commentDeleteApi(record.id)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  emits("list","create_ok")
}

let showCount = 0
// 回复评论
function applyShow(record: commentType) {
  if (showCount === 0) {
    record.isApply = true
    showCount += 1
  } else if (showCount === 1) {
    record.isApply = false
    showCount -= 1
  }
}

async function applyComment(record: commentType) {
  if (!store.isLogin) {
    Message.warning("请登录")
    return
  }
  if (record.applyContent.trim() === "") {
    Message.warning("回复内容不能为空")
    return
  }
  const data: commentAddType = {
    article_id: record.article_id,
    content: record.applyContent,
    parent_comment_id: record.id
  }
  let res = await commentCreateApi(data)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  record.applyContent = ""
  emits("list","create_ok")
}

function refreshSubComment() {
  emits("list","create_ok")
}

// 一个用户可以对一条评论进行多次点赞，这算是个问题，待修复
async function diggComment(record: commentType){
  let res = await diggCommentApi(record.id)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  record.digg_count++
}

const messageVisible = ref(false);
const sendUser_id = ref<number>(0);
const revUser_id = ref<number>(0);
const revUser_name = ref<string>("");

function handleCheckMessage(item: any){
  messageVisible.value = true;
  revUser_id.value = item.user_id;
  revUser_name.value = item.user.nick_name;
  sendUser_id.value = store.userInfo.user_id;
}



</script>

<style lang="scss">
.comment_component{
  margin-top: 10px;
  .action{
    cursor: pointer;
    margin-right: 15px;
    &:last-child{
      margin-right: 0;
    }
    &:hover{
      color: var(--active);
    }
  }
  .apply_comment_recursion{
    margin-top: 10px;
  }
  .arco-comment{
    margin-top: 0;
    .arco-inner-comment{
      margin-top: 0;
    }
    .arco-comment-inner-comment{
      margin-top: 0;
    }
  }
}
</style>
