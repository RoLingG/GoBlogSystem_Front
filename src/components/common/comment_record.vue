<template>
  <div class="comment_list_component">
    <div class="add_comment">
      <a-textarea placeholder="输入评论内容，Enter+Ctrl快捷发送评论" @keydown.enter.ctrl="createComment"
                  v-model="addCommentForm.content" :auto-size="{minRows: 4, maxRows: 4}"></a-textarea>
      <a-button @click="createComment" type="primary">发布评论</a-button>
    </div>
    <comment_recursion class="comment_recursion"
                       :data="data.list"
                       @list="refreshComments"
                       @create_ok="refreshList">
    </comment_recursion>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {
  type commentAddType,
  commentCreateApi,
  commentListApi,
  type commentType
} from "@/api/comment_api.ts";
import type {listData, RecordType} from "@/components/admin/admin_table.vue";
import {userInfoApi} from "@/api/user_api.ts";
import {Message} from "@arco-design/web-vue";
import {useStore} from "@/stores/counter.ts";
import type {paramsType} from "@/api";
import Comment_recursion from "@/components/common/comment_recursion.vue";

interface Props {
  article_id: string
}

const props = defineProps<Props>()

const store = useStore()

const emits = defineEmits(["create_ok"])

const data = reactive<listData<commentType>>({
  list: [],
  count: 0
})

const params = reactive<paramsType>({
  limit: 10
})

async function getData() {
  let res = await commentListApi(props.article_id, params);
  data.list = res.data.list
  data.count = res.data.count
}

function refreshComments() {
  getData();
}

function refreshList() {
  emits("create_ok")
}

// const userAvatar = ref('')
//
// async function getUserAvatar(): Promise<string> {
//   let res = await userInfoApi()
//   userAvatar.value = getAvatar(res.data.avatar)
//   return userAvatar.value
// }
//
// function getAvatar(path: string) {
//   if (path.startsWith('http') ) {
//     return path;
//   } else {
//     return `http://127.0.0.1:8080${path}`;
//   }
// }
//
// // 在组件加载时调用异步函数
// onMounted(() => {
//   getUserAvatar();
// });

watch(()=>props.article_id, ()=> {
  if (props.article_id) {
    getData()
  }
},{immediate:true})

// 新增评论
const addCommentForm = reactive<commentAddType>({
  article_id: "",
  content: "",
  parent_comment_id: undefined,
})

async function createComment() {
  if (!store.isLogin) {
    Message.warning("请登录")
    return
  }
  addCommentForm.article_id = props.article_id
  if (addCommentForm.article_id === "") {
    Message.warning("请选择文章")
    return
  }
  if (addCommentForm.content.trim() === "") {
    Message.warning("评论内容不能为空")
    return
  }
  let res = await commentCreateApi(addCommentForm)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  addCommentForm.content = ""
  await getData()
  emits("create_ok");
}

</script>

<style scoped lang="scss">
.comment_list_component{
  background-color: var(--color-bg-1);
  border-radius: 5px;
  width: 100%;
  padding: 20px;
  .add_comment{
    position: relative;
    button{
      position: absolute;
      right: 20px;
      bottom: 10px;
    }
  }
}
</style>