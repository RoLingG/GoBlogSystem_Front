<template>
  <div class="web_news">
    <span class="index">{{ data.index }}</span>
    <a class="title" :href="data.link" target="_blank">{{ data.title }}</a>
    <span class="hot">{{ data.hotValue }}</span>
  </div>
</template>

<script setup lang="ts">

import {reactive} from "vue";
import type {newsType} from "@/api/news_api.ts";

const data = reactive<newsType>({
  hotValue: "192.3万",
  index: "1",
  link: "/index",
  title: "今日热搜",
})

</script>

<style lang="scss">
.web_news{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title{
    color: var(--active);
    text-decoration: none;
    width: 80%;
  }
}
</style>