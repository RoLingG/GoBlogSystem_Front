<template>
  <div class="comment_list_view">
    <div class="article_menu">
      <div class="head">
        <a-input-search placeholder="搜索文章标题"></a-input-search>
      </div>
      <div class="article_list">
        <div :class="{item: true, active: articleID === item.id}"
             @click="checkItem(item)" v-for="item in articleList.list">
          <div class="title">
            <a-typography-paragraph :ellipsis="{rows: 1, showTooltip: true, css: true}">
              {{ item.title }}
            </a-typography-paragraph>
          </div>
          <div class="count">{{ item.count }}</div>
<!--          <div class="action">-->
<!--            <IconDelete/>-->
<!--          </div>-->
        </div>
        <div class="page">
          <a-pagination simple :total="articleList.count"
                        v-model:current="articleParams.page"
                        :page-size="articleParams.limit"
                        @change="getArticleList">
          </a-pagination>
        </div>
      </div>
    </div>
    <div class="comment_record" v-if="articleID">
      <comment_record :article_id="articleID" @create_ok="getArticleList"></comment_record>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import type {listData} from "@/components/admin/admin_table.vue";
import {commentArticleListApi, type commentArticleType} from "@/api/comment_api.ts";
import type {paramsType} from "@/api";
import Comment_record from "@/components/common/comment_record.vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()

const route = useRoute()

const articleID = ref<string>(route.query.id as string)

const articleParams = reactive<paramsType>({
  page: 1,
  limit: 10,
})

const articleList = reactive<listData<commentArticleType>>({
  list: [],
  count: 0,
})

async function checkItem(item: commentArticleType) {
  articleID.value = item.id;
  await router.push({
    query: {
      id: item.id
    }
  })
}

async function getArticleList() {
  let res = await commentArticleListApi(articleParams)
  articleList.list = res.data.list
  articleList.count = res.data.count
}
getArticleList()

</script>

<style lang="scss">
.comment_list_view {
  display: flex;
  > div {
    background: var(--color-bg-1);
    height: calc(100vh - 150px);
    border-radius: 5px;
    color: var(--color-text-2);
  }
  .article_menu{
    width: 300px;
    margin-left: 20px;
    padding: 20px;
    position: relative;
    .head{
      margin-bottom: 10px;
    }
    .article_list {
      width: 100%;
      flex-direction: column;
      .item{
        width: 100%;
        height: 60px;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .title{
          width: 5rem;
          .arco-typography{
            margin-bottom: 0;
          }
        }
        &.active{
          border-radius: 5px;
          background: var(--color-fill-3);
        }
      }
      .page{
        position: fixed;
        margin-left: 50px;
        bottom: 50px;
      }
    }
  }
  .comment_record{
    width: calc(100% - 300px);
    height: 833px;
    margin-left: 15px;
  }
}
</style>