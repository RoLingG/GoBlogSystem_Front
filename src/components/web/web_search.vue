<template>
  <a-modal title="全文搜索" width="40%" v-model:visible="visible" :footer="false" body-class="web_search_body">
    <div class="head">
      <a-input-search v-model="params.key" @keydown.enter="search" @search="search" ref="searchRef"
                      placeholder="全文搜索"
                      search-button allow-clear></a-input-search>
    </div>
    <template v-if="data.list.length">
      <div class="body">
        <div class="item" @click="goTo(item)" v-for="item in data.list">
          <div class="title">{{ item.title }}</div>
          <div class="content" v-html="item.body"></div>
        </div>
      </div>
      <div class="footer">
        共搜索到结果{{ data.count }}条
      </div>
    </template>

  </a-modal>
  <div class="web_search">
    <IconSearch @click="showSearch"></IconSearch>
  </div>
</template>

<script setup lang="ts">

import {nextTick, onMounted, reactive, ref} from "vue";
import type {paramsType} from "@/api";
import {articleFullTextSearchApi, type articleFullTextSearchType} from "@/api/article_api.ts";
import type {listData} from "@/components/admin/admin_table.vue";
import {useRoute} from "vue-router";

const visible = ref(false);

const params = reactive<paramsType>({
  
})

const data = reactive<listData<articleFullTextSearchType>>({
  list: [],
  count: 0,
})

const searchRef = ref()

function showSearch() {
  visible.value = true;
  nextTick(()=>{
    searchRef.value.focus()
  })
}

async function search() {
  let res = await articleFullTextSearchApi(params);
  data.count = res.data.count;
  data.list = res.data.list;
}

function goTo(item: articleFullTextSearchType) {
  window.open(`/article/${item.slug}`, "_blank");
}
</script>

<style lang="scss">
.web_search_body{
  padding: 0;
  .head{
    padding: 20px;
  }
  .body{
    max-height: 50vh;
    overflow-y: auto;
    color: var(--color-text-2);
    .item{
      border-bottom: 1px solid var(--color-border);
      padding: 10px 20px;
      cursor: pointer;
      &:hover{
        background-color: var(--color-fill-2);
      }
      .title{
        color: var(--color-text-1);
        font-size: 16px;
        margin-bottom: 5px;
      }
      em{
        font-style: normal;
        color: red;
        margin: 0px 5px
      }
      .content{

      }
    }
  }
  .footer{
    text-align: center;
    padding: 10px 0px;
    color: var(--color-text-2);
  }
}
.web_search{

}
</style>