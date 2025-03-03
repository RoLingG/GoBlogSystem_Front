<template>
  <div class="home_view">
    <div class="home_welcome">
      <div class="home_title">
        早安，{{ store.userInfo.nick_name }}，祝您今天生活愉快。
      </div>
<!--      <home_weather class="home_weather"></home_weather>-->
      <div class="home_statistics">
        <span>
          <span class="home_icon">
            <IconSwap style="transform: rotate(90deg)"></IconSwap>
          </span>
          在线流量：{{ statisticsData.flow_count }}
        </span>
        <span>
           <span class="home_icon">
            <IconUserGroup></IconUserGroup>
          </span>
          用户总数：{{ statisticsData.user_count }}
        </span>
        <span>
           <span class="home_icon">
            <IconBook></IconBook>
          </span>
          文章总数：{{ statisticsData.article_count }}
        </span>
        <span>
           <span class="home_icon">
            <IconMessage></IconMessage>
          </span>
          群聊消息：{{ statisticsData.chat_group_count }}
        </span>
        <span>
           <span class="home_icon">
            <IconBulb></IconBulb>
          </span>
          今日登录：{{ statisticsData.today_login_count }}
        </span>
      </div>
    </div>
    <div class="home_main">
      <div class="left">
        <card title="快捷入口" class="quick_entry">
          <div class="quick_body">
            <div class="quick_item"
                 v-for="item in quickEntryList"
                 :style="{'--icon_bg': item.bgColor, '--icon_color': item.fontColor}">
              <div class="entry_icon" @click="goLink(item)">
                <component :is="item.font"></component>
              </div>
              <div class="entry_text">{{ item.text }}</div>
            </div>
          </div>
        </card>
        <card class="statistic" title="数据统计">
          <login_data_charts></login_data_charts>
        </card>
      </div>
      <div class="right">
        <card title="更新日志" class="update_log">
          <div class="item" v-for="(item, index) in updateLogList">
            <span>
              <span class="index">{{ index + 1 }}. </span>
              <span class="content">
                <a-typography-text :ellipsis="{
                  rows: 1,
                  showTooltip: true,
                  css: true,
                }">
                  {{ item.title }}
                </a-typography-text>
              </span>
            </span>
            <span class="date">{{ relativeCurrentTime(item.create_at) }}</span>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "@/stores/counter.ts";
import Card from "@/components/common/card.vue";
import {type Component, reactive} from "vue";
import {IconBook, IconFile, IconMessage, IconSettings, IconUser, IconUserGroup} from "@arco-design/web-vue/es/icon";
import {useRouter} from "vue-router";
import {relativeCurrentTime} from "../../../utils/dayjs.ts";
import Login_data_charts from "@/components/echart/login_data_charts.vue";
import {dataCollectApi, type dataCollectType} from "@/api/data_api.ts";

const router = useRouter()
const store = useStore()

interface quickEntryType {
  bgColor?: string
  fontColor?: string
  font: Component
  text: string
  routerName?: string
  link?: string
}

const quickEntryList: quickEntryType[] = [
  {
    font: IconFile,
    text: "日志列表",
    routerName: "log_list",
  },
  {
    font: IconUserGroup,
    text: "用户列表",
    routerName: "users_list",
  },
  {
    font: IconBook,
    text: "文章列表",
    routerName: "article_list",
  },
  {
    font: IconUser,
    text: "我的详情",
    routerName: "user_info",
  },
  {
    font: IconSettings,
    text: "系统配置",
    routerName: "system_setting",
  },
  {
    font: IconMessage,
    text: "群聊记录",
    routerName: "chat_list",
  },
]

function goLink(item: quickEntryType) {
  if (item.routerName) {
    router.push({
      name: item.routerName,
    })
    return
  }
  if (item.link) {
    window.open(item.link, "_blank");
  }
}

interface updateLogType {
  id?: number
  title: string
  create_at: string
}

const updateLogList: updateLogType[] = [
  {
    title: "后端接口部分日志新增",
    create_at: "2024-12-28 15:28:30",
  },
  {
    title: "控制台文章部分日志新增",
    create_at: "2024-12-28 15:28:30",
  },
]

const statisticsData = reactive<dataCollectType>({
  user_count: 0,
  article_count: 0,
  message_count: 0,
  chat_group_count: 0,
  today_login_count: 0,
  today_sign_count: 0,
  flow_count: 0,
})

async function getStatisticsData() {
 let res = await dataCollectApi();
  console.log(res.data);
 statisticsData.user_count = res.data.user_count;
 statisticsData.article_count = res.data.article_count;
 statisticsData.message_count = res.data.message_count;
 statisticsData.chat_group_count = res.data.chat_group_count;
 statisticsData.today_login_count = res.data.today_login_count;
 statisticsData.today_sign_count = res.data.today_sign_count;
 statisticsData.flow_count =res.data.flow_count;
 console.log(statisticsData)
}
getStatisticsData()

</script>

<style lang="scss">
.home_view{
  .home_welcome{
    padding: 10px 20px;
    width: 100%;
    background-color: var(--color-bg-1);
    background-repeat: no-repeat;
    background-position: right;
    border-radius: 5px;
    .home_title{
      margin-top: 10px;
      font-size: 20px;
      font-weight: 400;
      color: var(--color-text-1);
    }
    .home_weather{
      margin: 20px 0 10px 0;
    }
    .home_statistics{
      margin: 20px 0 10px 0;
      font-size: 16px;
      >span{
        margin-right: 20px;
      }
      .home_icon{

      }
    }
  }
  .home_main{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    .left{
      width: 70%;
      margin-right: 10px;
      .quick_entry{
        .quick_body{
          display: flex;
        }
        .quick_item{
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-right: 40px;
          padding-left: 20px;
          &:last-child{
            margin-right: 0;
          }
          .entry_icon{
            border: 2px solid var(--icon_border);
            background-color: var(--icon_border_bg);
            color: var(--icon);
            border-radius: 10px;
            width: 60px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28px;
            transition: all .3s;
            cursor: pointer;
            svg{
              transition: all .3s;
            }
            &:hover{
              transform: scale(1.05);
              svg{
                transform: scale(1.10);
              }
            }
          }
          .entry_text{
            margin-top: 5px;
            display: flex;
            align-content: center;
            font-size: 15px;
            color: var(--color-text-2);
          }
        }
      }
      .statistic{
        margin-top: 10px;
      }
    }
    .right{
      width: 30%;
      .update_log{
        height: 300px;
        overflow-y: scroll;
        .item{
          display: flex;
          justify-content: space-between;
          color: var(--color-text-2);
          margin-bottom: 15px;
          >span{
            display: flex;
            align-items: center;
            white-space: nowrap;
          }
          .index{
            margin-right: 10px;
          }
          .content{
            display: flex;
            .arco-typography{
              margin-bottom: 0;
              display: inline-block;
            }
          }
          .content{
          }
        }
      }
    }
  }
}

</style>