<template>
  <div class="role_preview_view">
    <div class="head">
      <div>预览角色</div>
      <div>{{ props.data.name }}</div>
    </div>
    <div class="body">
      <div class="item">
        <div class="avatar">
          <img :src="getImgSrc(props.data.icon)" alt="">
        </div>
        <div class="main">
          <div class="date">{{ dateTimeFormat(new Date().toLocaleString())}}</div>
          <div class="content">
            <md-preview :model-value="props.data.prologue" :theme="store.themeStringTheme"></md-preview>
          </div>
        </div>
      </div>
    </div>
    <div class="menu">
      <div class="btn">
        新话题
      </div>
      <div class="ipt">
        <IconSend></IconSend>
        <a-input placeholder="来说点什么吧...(Shift + Enter = 换行)"></a-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {dateTimeFormat} from "../../utils/dayjs.ts";
import type {roleType} from "@/api/large_model_api.ts";
import {useStore} from "@/stores/counter.ts";
import {MdPreview} from "md-editor-v3";

interface Props{
  data: roleType
}

const props = defineProps<Props>()

const store = useStore()

function getImgSrc(path: string) {
  console.log(path)
  if (!path) {
    return "";
  }
  if (path.startsWith("http")) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}

</script>

<style lang="scss">
.role_preview_view {
  border: 1px solid var(--webBgColor);
  border-radius: 5px;
  .head {
    border-bottom: 1px solid var(--webBgColor);
    padding: 5px 0;
    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      &:last-child {
        font-size: 12px;
      }
    }
  }
  .body {
    padding: 20px;
    min-height: 600px;
    .item {
      display: flex;
      .avatar {
        img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .main {
        margin-left: 10px;
        .date {
          font-size: 12px;
        }
        .content {
          background-color: var(--webBgColor);
          padding: 1px 15px 1px 15px;
          border-radius: 5px;
          margin-top: 5px;
          .md-editor{
            padding: 0;
          }
          article > p:first-child {
            margin-top: 5px;
          }
        }
      }
    }
  }
  .menu {
    padding: 20px;
    display: flex;
    align-items: center;
    width: 100%;
    .btn {
      width: 80px;
      height: 30px;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--active);
      color: white;
    }
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
      }
      .arco-input-wrapper {
        border-radius: 10px;
        pointer-events: none;
      }
    }
  }
}
</style>