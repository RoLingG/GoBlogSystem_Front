<template>
  <div class="web_fade_back">
    <a-form ref="formRef" :model="form" :label-col-props="{span:0}" :wrapper-col-props="{span:24}">
      <a-form-item
          field="email"
          :rules="[{required: true, message:'请输入邮箱', type:'string'}, {message:'请输入正确邮箱', type:'email'}]"
          validate-trigger="blur">
        <a-input v-model="form.email" placeholder="请输入邮箱"></a-input>
      </a-form-item>
      <a-form-item validate-trigger="blur" field="content"
                   :rules="[{required: true, message:'请输入反馈内容', type:'string'}]">
        <a-textarea  show-word-limit :max-length="160" v-model="form.content" :auto-size="{minRows: 4, maxRows:4}"
                     placeholder="请输入反馈内容"></a-textarea>
      </a-form-item>
      <a-form-item>
        <a-button @click="feedbackCreate" type="primary" style="width: 100%">发布</a-button>
      </a-form-item>
    </a-form>
    <div class="fade_back_list">
      <div class="title">反馈列表</div>
      <div class="list">
        <div class="feedback_item" v-for="item in list">
          <div class="content">
            <a-typography-paragraph :ellipsis="{  rows: 1, css: true,}">
              {{ item.content }}
            </a-typography-paragraph>
          </div>
          <div class="date">{{ dateFormat(item.create_at) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {dateFormat} from "../../utils/dayjs.ts";
import {reactive, ref} from "vue";
import {feedBackCreateApi, type feedBackCreateType, feedBackListApi, type feedBackType} from "@/api/feed_back_api.ts";
import {Message} from "@arco-design/web-vue";

const formRef = ref()

const form = reactive<feedBackCreateType>({
  email: "",
  content: "",
})

const list = ref<feedBackType[]>([])

async function getData() {
  let res = feedBackListApi()
  list.value = (await res).data.list
}
getData()

async function feedbackCreate() {
  let val = await formRef.value.validate()
  if (val) {
    return
  }
  let res = await feedBackCreateApi(form)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  await getData()
  form.content = ""
}
</script>

<style lang="scss">
.web_fade_back{
  color: var(--color-text-2);
  .fade_back_list{
    .title{
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      &::before{
        display: inline-flex;
        width: 35%;
        height: 1px;
        content: "";
        background-color: var(--color-text-4);
      }
      &::after{
        display: inline-flex;
        width: 35%;
        height: 1px;
        content: "";
        background-color: var(--color-text-4);
      }
    }
    .list{
      margin-top: 10px;
      height: 200px;
      overflow-y: auto;
      .feedback_item{
        margin-bottom: 10px;
        margin-right: 10px;
        padding: 10px;
        border-radius: 5px;
        background-color: var(--color-fill-2);
        display: flex;
        justify-content: space-between;
        .arco-typography{
          margin-bottom: 0px;
        }
        &:last-child{
          margin-bottom: 0;
        }
        .content{
          width: 70%;
          display: flex;
          white-space: nowrap;
          align-items: center;
        }
        .date{
          display: flex;
          white-space: nowrap;
          align-items: center;
        }
      }
    }

  }
}
/* 只修改特定元素的滚动条样式 */
.fade_back_list .list::-webkit-scrollbar {
  width: 8px; /* 可以调整滚动条的宽度 */
}

.fade_back_list .list::-webkit-scrollbar-track {
  background: var(--bgColor); /* 轨道颜色 */
  border-radius: 10px; /* 轨道圆角 */
}

.fade_back_list .list::-webkit-scrollbar-thumb {
  background: var(--icon_border); /* 滑块颜色 */
  border-radius: 10px; /* 滑块圆角 */
}

.fade_back_list .list::-webkit-scrollbar-thumb:hover {
  background: #555; /* 滑块悬停颜色 */
}
</style>