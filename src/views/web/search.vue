<template>
  <div class="search_index">
    <web_nav no-scroll></web_nav>
    <main>
      <div class="container">
        <div class="head">
          <div class="slogan">{{ store.siteInfo.slogan }} | 搜索</div>
          <a-input class="search_ipt" allow-clear v-model="params.key" @keydown.enter="getData"
                   placeholder="搜索文章标题"></a-input>
          <a-button type="primary" @click="getData">搜索</a-button>
        </div>
        <div class="action">
          <div class="item">
            <span @click="checkKey('sort', item)" :class="{active: params.sort === item.value}"
                  v-for="item in sortOption">{{ item.label }}</span>
          </div>
          <div class="item">
            <span @click="checkKey('article_category', item)" :class="{active: params.article_category === item.value}"
                  v-for="item in categoryOptions">{{ item.label }}</span>
          </div>
          <div class="item">
           <span @click="checkKey('tag', item)" :class="{active: params.tag === item.value}"
                 v-for="item in tagOptions">{{ item.label }}</span>
          </div>
        </div>
        <div class="source">
          <template v-if="data.list.length">
            <div class="article_list">
              <div class="search_item" v-for="item in data.list">
                <div class="top">
                  <img :src="getImgSrc(item.image_url)" alt="">
                </div>
                <div class="bottom">
                  <div class="bottom_title">
                    <router-link :to="{name: 'article', params: {id: item.id}}" v-html="item.title"></router-link>
                  </div>
                  <div class="abstract">
                    <a-typography-paragraph :ellipsis="{
                      rows: 1,
                      css: true,
                    }">{{ item.abstract }}
                    </a-typography-paragraph>
                  </div>
                  <div class="data">
                    <span v-if="params.sort === 'look_count desc' || params.sort === 'create_at desc' || params.sort === ''">
                      <IconEye></IconEye>
                      {{ item.look_count }}
                    </span>
                    <span v-else-if="params.sort === 'digg_count desc'">
                      <icon-thumb-up></icon-thumb-up>
                      {{ item.digg_count }}
                    </span>
                    <span v-else-if="params.sort === 'comment_count desc'">
                      <icon-message></icon-message>
                      {{ item.comment_count }}
                    </span>
                    <span v-else-if="params.sort === 'collect_count desc'">
                      <icon-star></icon-star>
                      {{ item.collect_count }}
                    </span>
                    <span>
                    <IconClockCircle></IconClockCircle>
                    {{ dateFormat(item.create_at) }}
                  </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="page">
              <a-pagination :total="data.count" v-model:current="params.page" show-total
                            @change="getData"></a-pagination>
            </div>
          </template>
          <a-empty v-else class="empty"></a-empty>
        </div>
      </div>
    </main>
    <web_footer></web_footer>
  </div>
</template>

<script setup lang="ts">
import Web_nav from "@/components/web/web_nav.vue";
import {useStore} from "@/stores/counter.ts";
import {reactive, ref} from "vue";
import type {optionType} from "@/components/common/types";
import {
  articleCategoryListApi,
  articleListApi,
  type articleParams,
  articleTagNameList,
  type articleType
} from "@/api/article_api.ts";
import type {listData} from "@/components/admin/admin_table.vue";
import {dateFormat} from "../../utils/dayjs.ts";
import Web_footer from "@/components/web/web_footer.vue";

const store = useStore()

type sortType = "" | "look_count desc" | "create_at desc" | "digg_count desc" | "comment_count desc" | "collect_count desc"

const params = reactive<articleParams & {sort: sortType}>({
  limit: 10,
  page: 1,
  sort: "",
  tag: "",
  article_category: "",
})

const sortOption = [
  {label: "综合排序", value: ""},
  {label: "最多浏览", value: "look_count desc"},
  {label: "最新发布", value: "create_at desc"},
  {label: "最多点赞", value: "digg_count desc"},
  {label: "最多评论", value: "comment_count desc"},
  {label: "最多收藏", value: "collect_count desc"},
]

const categoryOptions = ref<optionType[]>([])

const tagOptions = ref<optionType[]>([])

async function getCategoryOptions() {
  let res = await articleCategoryListApi()
  categoryOptions.value = [{label: "全部分类", value: ""}, ...res.data]
}
getCategoryOptions()

async function getTagOptions() {
  let res = await articleTagNameList()
  tagOptions.value = [{label: "全部标签", value: ""}, ...res.data]
}
getTagOptions()

function checkKey(key: "sort" | "article_category" | "tag", item: optionType) {
  if (key === "sort") {
    const validSortValues = ["", "look_count desc", "create_at desc", "digg_count desc", "comment_count desc", "collect_count desc"];
    if (validSortValues.includes(item.value as sortType)) {
      params.sort = item.value as sortType;
    } else {
      console.error("Invalid sort value:", item.value);
    }
  } else if (key === "article_category") {
    params.article_category = item.value as string;
  } else if (key === "tag") {
    params.tag = item.value as string;
  }
  getData();
}

const data = reactive<listData<articleType>>({
  list: [],
  count: 0,
})

async function getData() {
  let res = await articleListApi(params)
  data.list = res.data.list
  data.count = res.data.count
}
getData()

function getImgSrc(path: string) {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}
</script>

<style lang="scss">
.search_index{
  height: 100%;
  main{
    padding-top: 70px;
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    color: var(--color-text-2);
    .container{
      width: var(--container_width);
    }
  }
  .container{
    .head{
      padding: 20px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--color-bg-1);
      border-radius: 5px;
      .slogan{
        font-size: 16px;
        color: var(--collapse-button);
        font-weight: bold;
      }
      .search_ipt{
        width: 400px;
        margin: 0 20px
      }
    }
    .action{
      margin-top: 10px;
      padding: 20px 20px 5px 20px;
      background-color: var(--color-bg-1);
      border-radius: 5px;
      .item{
        margin-bottom: 25px;
        span{
          margin-right: 20px;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 5px;
          &.active{
            background-color: var(--active);
            color: white;
          }
        }
      }
    }
    .source{
      margin-top: 20px;
      min-height: calc(100vh - 405px);
      .article_list{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-column-gap: 30px;
        grid-row-gap: 20px;
        .search_item{
          width: 100%;
          border-radius: 5px;
          overflow: hidden;
          background-color: var(--color-bg-1);
          border-radius: 5px;
          .top{
            height: 120px;
            width: 100%;
            img{
              width: 100%;
              height: 100%;
              border-radius: 5px;
              object-fit: cover;
            }
          }
          .bottom{
            padding: 15px;
            border-radius: 5px;
            background-color: var(--color-fill-1);
            .bottom_title{
              margin-bottom: 10px;
              a {
                font-size: 18px;
                font-weight: 600;
                text-decoration: none; // 移除下划线
                color: var(--color-text-1); // 继承父元素的颜色
              }
              em {
                color: red;
                font-style: normal;
                font-weight: 600;
              }
            }
            .abstract{
              margin: 10px 0;
              .arco-typography{
                margin-bottom: 0px;
              }
              span {
                color: var(--color-text-2); // 继承父元素的颜色
              }
            }
            .data{
              display: flex;
              justify-content: space-between;
              span{
                margin-right: 15px;
                &:last-child{
                  margin-right: 0;
                }
              }
            }
          }
        }
      }
      .page{
        margin-top: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--color-bg-1);
        padding: 10px 20px;
        border-radius: 5px;
      }
      .empty{
        width: 100%;
        height: 58vh;
        background-color: var(--color-bg-1);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 5px;
      }
    }
  }
}
</style>