<template>
  <div :class="{admin_article: true, preview: props.preview}">
    <div class="cover">
      <a-image :src="getImageSrc(props.data.image_url || '')"></a-image>
    </div>
    <div class="info">
      <div class="title">
        <template v-if="props.data.id === ''">
          {{ props.data.title }}
        </template>
        <router-link v-else :to="{name: 'article', params: {id: props.data.id}}" v-html="props.data.title"></router-link>
      </div>
      <div class="abstract">
        <a-typography-paragraph :ellipsis="{rows: 2, css: true}">
          {{ props.data.abstract }}
        </a-typography-paragraph>
      </div>
      <div class="data">
        <span class="category">
          <a-tag color="red">{{ props.data.category }}</a-tag>
        </span>
        <span class="date">
          <IconCalendarClock/>
          {{ dateFormat(props.data.create_at || '') }}
        </span>
      </div>
      <div class="data">
        <span class="count_data">
          <span>
            <icon-thumb-up />
            <span class="data_span">{{ props.data.digg_count }}</span>
          </span>
          <span>
            <icon-eye />
            <span class="data_span">{{ props.data.look_count }}</span>
          </span>
          <span>
            <icon-message />
            <span class="data_span">{{ props.data.comment_count }}</span>
          </span>
          <span>
            <icon-star />
            <span class="data_span">{{ props.data.collect_count }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type {articleUpdateType} from "@/api/article_api.ts";
import {dateFormat} from "@/utils/dayjs.ts";

interface Props {
  data: articleUpdateType,
  preview?: boolean;
}

const props = defineProps<Props>()

const getImageSrc = (path: string): string => {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}
</script>

<style lang="scss">
.admin_article{
  width: 100%;
  padding: 10px;
  display: flex;
  background: var(--color-fill-2);
  border-radius: 5px;
  color: var(--color-text-1);
  margin-bottom: 10px;
  &:hover{
    img{
      transform: scale(1.05);
    }
  }
  &.preview{
    transform: scale(1);
    transform-origin: left top;
  }
  .cover{
    width: 30%;
    border-radius: 5px;
    overflow: hidden;
    .arco-image {
      width: 100%;
      height: 100%;
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all .3s;
        border-radius: 5px;
      }
    }
  }
  .info{
    margin-left: 10px;
    width: 70%;
    padding: 10px 15px;
    background-color: var(--color-bg-1);
    border-radius: 5px;
    .title{
      font-weight: bold;
      font-size: 20px;
      a {
        text-decoration: none; // 移除下划线
        color: inherit; // 继承父元素的颜色
      }
      em{
        font-style: normal;
        color: red;
      }
    }
    .abstract{
      margin-top: 10px;
      .arco-typography{
        margin-bottom: 0;
      }
    }
  }
  .data{
    margin-top: 10px;
    .category{
      margin-right: 10px;
    }
    .date{
      margin-right: 10px;
    }
    .category{

    }
    .count_data{
      >span{
        margin-right: 8px;
        i{
          margin-right: 3px;
        }
      }
      .data_span{
        margin-left: 5px;
      }
    }
  }
}
</style>