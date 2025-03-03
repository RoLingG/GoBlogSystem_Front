<template>
  <div class="web_tags">
    <div :class="{item: true, active: active === item.tag}" v-for="item in list">
      <a href="javascript:void (0)" @click="checkTag(item)">
        <span>{{ item.tag }}</span>
        <span>x{{ item.count }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import router from "@/router";
import type {tagType} from "@/api/tag_api";
import {useRoute} from "vue-router";
import {tagArticleListApi} from "@/api/tag_api";

const route = useRoute()

const active = ref<string>(route.query.tag as string)

const list = ref<tagType[]>([])

async function getData() {
  let res = await tagArticleListApi()
  list.value = res.data.list
}
getData()

function checkTag(item: tagType) {
  if (active.value === item.tag) {
    // 第二次点一样的，取消点击
    active.value = ""
  } else {
    active.value = item.tag
  }

  router.push({
    query: {
      tag: active.value
    }
  })
}

</script>

<style lang="scss">
.web_tags{
  a {
    text-decoration: none; // 移除下划线
    color: inherit; // 继承父元素的颜色
  }
  .item{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-2);
    background-color: var(--color-fill-1);
    width: 50%;
    height: 40px;
    &:hover{
      color: var(--active);
    }
    &.active{
      color: var(--active);
    }
    &:nth-child(4n+1), &:nth-child(4n+2){
      background-color: var(--color-fill-2);
  }
    &:nth-child(4n+1), &:nth-child(4n+3){
      border-right: 1px solid var(--color-fill-3);
    }
    span:nth-child(1) {
      margin-right: 10px;
    }
    span:nth-child(2) {
     font-size: 12px;
    }
  }
}
</style>