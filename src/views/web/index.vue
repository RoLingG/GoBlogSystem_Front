<template>
  <div class="web_index">
    <web_nav></web_nav>
    <web_banner></web_banner>
    <main>
      <div class="container">
        <div class="left">
<!--          <card title="今日热搜">-->
<!--            <web_news></web_news>-->
<!--          </card>-->
          <card title="文章日历">
            <web_article_calendar></web_article_calendar>
          </card>
          <card title="文章列表">
            <template #head_right>
              <a-input-search v-model="key" @search="search" @keydown.enter="search" placeholder="搜索文章标题"></a-input-search>
            </template>
            <web_article_list ref="webArticleList"></web_article_list>
          </card>
        </div>
        <div class="right">
          <card title="独家推广">
            <web_promotion></web_promotion>
          </card>
          <card title="文章标签">
            <web_tags></web_tags>
          </card>
          <card title="个人名片">
            <web_user_card></web_user_card>
          </card>
          <card title="意见反馈">
            <web_feed_back></web_feed_back>
          </card>
        </div>
      </div>
    </main>
    <web_footer></web_footer>
  </div>
</template>

<script setup lang="ts">
import web_nav from "@/components/web/web_nav.vue";
import web_banner from "@/components/web/web_banner.vue";
import Card from "@/components/common/card.vue";
import Web_footer from "@/components/web/web_footer.vue";
import Web_news from "@/components/web/web_news.vue";
import Web_promotion from "@/components/web/web_promotion.vue";
import Web_user_card from "@/components/web/web_user_card.vue";
import Web_feed_back from "@/components/web/web_feed_back.vue";
import Web_article_calendar from "@/components/web/web_article_calendar.vue";
import Web_article_list from "@/components/web/web_article_list.vue";
import {ref} from "vue";
import Web_tags from "@/components/web/web_tags.vue";

const webArticleList = ref()

const key = ref()

function search() {
  webArticleList.value.getData({
    key: key.value,
  })
}
</script>

<style lang="scss">
.web_index{
  main{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .container{
      width: var(--container_width);
      display: flex;
      justify-content: space-between;
      >.left{
        width: calc(100% - 400px);
      }
      >.right{
        width: 380px;
      }
      .card{
        margin-bottom: 20px;
      }
    }
  }
}
</style>