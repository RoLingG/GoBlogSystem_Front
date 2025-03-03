<template>
  <div class="article_index">
    <web_nav></web_nav>
    <web_banner v-if="data.image_url" :data="{
      abstract: data.abstract,
      menu_image: getImgSrc(data.image_url),
      slogan: data.title,
      menu_time: 7
    }"></web_banner>
    <main>
      <div class="container">
        <div class="article_container">
          <div class="head">
            <div class="title" :id="data.title">{{ data.title }}</div>
            <div class="date">
              发布时间：{{ dateFormat(data.create_at) }} （{{ relativeCurrentTime(data.create_at) }}）
            </div>
            <div class="tag">
              <a-tag v-for="(item, index) in data.tags" :color="colorList[index]">{{ item }}</a-tag>
            </div>
          </div>
          <article>
            <MdPreview :editor-id="mdID" v-model="data.content" :theme="store.themeStringTheme"></MdPreview>
          </article>
          <div class="next_prev">
<!--            <div class="prev">-->
<!--              上一篇：<a href="">xxx</a>-->
<!--            </div>-->
<!--            <div class="next">-->
<!--              下一篇：<a href="">xxx</a>-->
<!--            </div>-->
          </div>
          <comment_record v-if="store.isLogin" :article_id="article_id"></comment_record>
        </div>
        <aside>
          <info_preview style="width: 300px; margin-bottom: 20px" :data="{
            avatar: data.user_avatar,
            nick_name: data.user_nick_name,
            signature: '欢迎来到我的主页',
            blog: '',
            collect_count: data.collect_count,
            comment_count: data.comment_count,
            digg_count:data.digg_count,
            look_count: data.look_count}">
          </info_preview>
          <login_modal  v-model:visible="visible"></login_modal>
          <div :class="{article_actions: true, isFixed: isFixed}">
            <card title="文章目录" class="web_article_dict">
              <MdCatalog style="align-items: center" :editor-id="mdID"
                         :offset-top="80"
                         :theme="store.themeStringTheme"
                         :scroll-element-offset-top="80"
                         :scroll-element="scrollElement">
              </MdCatalog>
            </card>
            <div class="web_article_actions">
              <icon-thumb-up v-if="!data.is_digg" @click="articleDigg"></icon-thumb-up>
              <icon-thumb-up-fill v-if="data.is_digg" @click="articleDigg"></icon-thumb-up-fill>
              <icon-star v-if="!data.is_collect" @click="articleCollect"></icon-star>
              <icon-star-fill v-if="data.is_collect" @click="articleCollect"></icon-star-fill>
              <icon-double-up @click="goTop"></icon-double-up>
              <icon-message @click="goComment"></icon-message>
            </div>
          </div>
        </aside>
      </div>
    </main>
    <web_footer></web_footer>
  </div>
</template>

<script setup lang="ts">
import Web_nav from "@/components/web/web_nav.vue";
import {useRoute} from "vue-router";
import Info_preview from "@/components/common/info_preview.vue";
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {articleCollectApi, articleDetailApi, articleDiggApi, type articleType} from "@/api/article_api.ts";
import {dateFormat, relativeCurrentTime} from "../../utils/dayjs.ts";
import Comment_record from "@/components/common/comment_record.vue";
import Web_banner from "@/components/web/web_banner.vue";
import Web_footer from "@/components/web/web_footer.vue";
import {MdPreview, MdCatalog} from "md-editor-v3";
import "md-editor-v3/lib/preview.css"
import {useStore} from "@/stores/counter.ts";
import Card from "@/components/common/card.vue";
import {Message} from "@arco-design/web-vue";
import Login_modal from "@/components/common/login_modal.vue";

const route = useRoute()

const store = useStore()

const article_id = route.params.id as string

const articleID = ref(route.params.id as string);

const scrollElement = document.documentElement;

const top = ref(910)

const isFixed = ref(false)

const mdID = "articleID_114514"

const colorList = [
  'red',
  'orangered',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'arcoblue',
  'purple',
  'pinkpurple',
  'magenta',
  'gray',
]

const data = reactive<articleType>({
  abstract: "",
  category: "",
  collect_count: 0,
  comment_count: 0,
  create_at: "",
  digg_count: 0,
  id: "",
  image_id: 0,
  image_url: "",
  look_count: 0,
  tags: [],
  title: "",
  update_at: "",
  user_avatar: "",
  user_id: 0,
  user_nick_name: "",
  link: "",
  source: "",
})

function getImgSrc(url: string) {
  if (url.startsWith('http')) {
    return url;
  } else {
    return `http://127.0.0.1:8080/${url}`;
  }
}

async function getData(){
  let res = await articleDetailApi(articleID.value)
  Object.assign(data, res.data)
}
getData()

window.addEventListener("scroll", scroll)
function scroll() {
  if (document.documentElement.scrollTop >= top.value) {
    isFixed.value = true
  } else {
    isFixed.value = false
  }
}
onUnmounted(() => {
  window.removeEventListener("scroll", scroll)
})

function goTop() {
  document.documentElement.scrollTo({
    top: 700 - 60,
    behavior: "smooth"
  })
}

function goComment() {
  let box = document.querySelector(".add_comment") as HTMLElement
  if (!box) {
    return
  }

  let top = box.offsetTop

  document.documentElement.scrollTo({
    top: top - 60,
    behavior: "smooth"
  })
}

async function articleDigg() {
  let res = await articleDiggApi(articleID.value)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  Message.success(res.msg)
  data.digg_count++
  data.is_digg = true
  setTimeout(() => {
    data.is_digg = false
  }, 2000)
}

async function articleCollect() {
  if (!store.isLogin) {
    visible.value = true
    Message.warning("请登录")
    return
  }
  let res = await articleCollectApi(articleID.value)
  if (res.code) {
    Message.error(res.msg)
    return
  }
  data.is_collect = !data.is_collect
  if (data.is_collect) {
    data.collect_count++
  } else {
    data.collect_count--
  }
  Message.success(res.msg)
}

watch(()=>route.params , () => {
  getData()
},{immediate: true, deep: true})

onMounted(() => {
  let hash = route.hash
  if (hash !== "") {
    setTimeout(() => {
      let dom = document.querySelector(hash)
      if (dom) {
        let top = dom.getBoundingClientRect().top
        document.documentElement.scrollTo({
          top: top - 60,
          behavior: "smooth"
        })
      }
    }, 150)
  }
  getData()
})

const visible = ref(false)

</script>

<style lang="scss">
.article_index{
  main{
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: var(--webBgColor);
    padding-top: 20px;
    padding-bottom: 20px;
    .container{
      width: var(--container_width);
      display: flex;
      aside{
        margin-left: 20px;
        .form-item-modal {
          margin-bottom: 30px;
        }
        .article_actions{
          width: 300px;
          position: relative;
          &.isFixed {
            position: fixed;
            top: 80px;
            width: 300px;
          }
          .web_article_dict{
            color: var(--color-text-1);
            .card_body{
              max-height: calc(100vh - 400px);
              overflow: auto;
              /* 滚动条样式 */
              &::-webkit-scrollbar {
                width: 8px; /* 可以调整滚动条的宽度 */
              }

              &::-webkit-scrollbar-track {
                background: var(--color-bg-1); /* 轨道颜色 */
                border-radius: 10px; /* 轨道圆角 */
              }

              &::-webkit-scrollbar-thumb {
                background: var(--color-bg-1); /* 滑块颜色 */
                border-radius: 10px; /* 滑块圆角 */
              }

              &::-webkit-scrollbar-thumb:hover {
                background: var(--color-bg-1); /* 滑块悬停颜色 */
              }
            }
          }
          .web_article_actions{
            margin-top: 10px;
            background-color: var(--color-bg-1);
            border-radius: 5px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            >svg{
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 18px;
              color: var(--color-text-1);
              cursor: pointer;
              &:hover{
                color: var(--active);
              }
            }
          }
        }
      }
      .article_container{
        width: 70%;
        .head{
          border-radius: 5px 5px 0 0;
          margin-bottom: 1px;
          background-color: var(--color-bg-1);
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .title{
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--color-text-1);
          }
          .date{
            margin-bottom: 10px;
            color: var(--color-text-2);
          }
          .tag{
            .arco-tag{
              margin-right: 5px;
              &:last-child{
                margin-right: 0;
              }
            }
          }
        }
        .next_prev{
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--color-bg-1);
          border-radius: 0 0 5px 5px;
          padding: 20px;
          margin-top: 1px;
          margin-bottom: 20px;
          color: var(--color-text-1);
          a{
            color: var(--color-text-2);
          }
        }
      }
    }
  }
}
</style>