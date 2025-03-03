<template>
  <div class="info_preview">
    <a :href="getUrl(props.data.blog)" class="link_button" target="_blank">
      <icon-pushpin />
    </a>
    <div class="head">
      <a-avatar :size="60" :image-url="userAvatar"></a-avatar>
      <div class="nick_name">{{ props.data.nick_name }}</div>
    </div>
    <div class="sign">{{ props.data.signature }}</div>
    <div class="article_data">
      <span>
        <icon-eye style="font-size: 24px; margin-top: 10px" />
        <span>{{ props.data.look_count }}</span>
      </span>
      <span>
        <icon-thumb-up style="font-size: 24px; margin-top: 10px" />
        <span>{{ props.data.digg_count }}</span>
      </span>
      <span>
        <icon-message style="font-size: 24px; margin-top: 10px" />
        <span>{{ props.data.comment_count }}</span>
      </span>
      <span>
        <icon-star style="font-size: 24px; margin-top: 10px" />
        <span>{{ props.data.collect_count }}</span>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">

import {onMounted, ref} from "vue";

interface userInfoPreviewType {
  avatar: string
  nick_name: string
  signature: string
  blog: string
  collect_count: number
  comment_count: number
  look_count: number
  digg_count: number
}

interface Props {
  data: userInfoPreviewType
}

const props = defineProps<Props>()

function getUrl(url: string): string | undefined {
  if (url.trim() !== '') {
    if (!url.startsWith('http') || !url.startsWith('https')) {
      // 如果不是完整的 URL，添加协议
      return `https://${url}`;
    }
    return url;
  }
  return undefined;
}

const userAvatar = ref<string | undefined>(undefined);

onMounted(() => {
  // 延迟更新头像
  setTimeout(() => {
    userAvatar.value = props.data.avatar;
  }, 500);
});

</script>

<style lang="scss">
.info_preview {
  padding: 20px;
  background-color: var(--color-bg-1);
  border-radius: 5px;
  width: 50%;
  border: 1px solid var(--bgColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  color: var(--color-text-1);

  &::before {
    position: absolute;
    width: 100px;
    height: 100px;
    content: "";
    display: block;
    right: -50px;
    top: -50px;
    background-color: var(--color-fill-2);
    transform: rotate(45deg);
  }

  .link_button {
    position: absolute;
    right: 10px;
    top: 10px;
    color: var(--color-text-2);
    font-size: 18px;
  }

  .head {
    display: flex;
    flex-direction: column;
    align-items: center;

    .nick_name {
      margin-top: 10px;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .sign {
    margin: 20px 0;
    color: var(--color-text-2);
    text-align: center;
    line-height: 1.5rem;
  }

  .article_data {
    display: flex;
    width: 100%;
    color: var(--color-text-2);
    > span {
      width: 25%;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
    }
  }
}
</style>