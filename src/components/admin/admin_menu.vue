<template>
  <div class="admin_menu">
    <a-menu
        showCollapseButton
        @menu-item-click="clickMenu"
        v-model:selected-keys="selectedKeys"
        v-model:open-keys="openKeys"
        @collapse="collapse">
      <template v-for="item in menuList" :key="item.RouterName">
        <a-menu-item :key="item.RouterName" v-if="item.Child?.length === 0">
          {{ item.Title }}
          <template #icon>
            <component :is="item.Icon" style="font-size: 18px"></component>
          </template>
        </a-menu-item>
        <a-sub-menu v-if="item.Child?.length !== 0" :key="item.RouterName">
          <template #icon>
            <component :is="item.Icon" style="font-size: 18px"></component>
          </template>
          <template #title>{{item.Title}}</template>
          <a-menu-item :key="sub.RouterName" v-for="sub in item.Child">
            {{sub.Title}}
            <template #icon>
              <component :is="sub.Icon"></component>
            </template>
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import {type Component, ref, watch} from "vue";
import {useRouter} from "vue-router"
import {useRoute} from "vue-router";
import {
  IconBook,
  IconHome,
  IconMessage,
  IconRobot,
  IconUser,
  IconUserGroup,
  IconTool,
  IconFile
} from "@arco-design/web-vue/es/icon";
import {useStore} from "@/stores/counter.ts";

const router = useRouter();
const route = useRoute();
const store = useStore();

interface MenuType {
  Key: string
  Title: string
  Icon?: Component
  RouterName?: string
  Child?: MenuType[]
}

const menuList : MenuType[] = [
  { Key: "1", Title: "首页", Icon: IconHome, RouterName: "home", Child: []},
  { Key: "2", Title: "个人中心", Icon: IconUser, RouterName: "user_center", Child: [
      { Key: "2-1", Title: "我的信息", Icon: IconUser, RouterName: "user_info"},
      { Key: "2-2", Title: "我的发布", Icon: IconUser, RouterName: "user_public"},
      { Key: "2-3", Title: "我的收藏", Icon: IconUser, RouterName: "user_collect"},
      { Key: "2-4", Title: "我的消息", Icon: IconUser, RouterName: "user_message"},
    ]},
  { Key: "3", Title: "文章管理", Icon: IconBook, RouterName: "articles", Child: [
      { Key: "3-1", Title: "文章列表", Icon: IconBook, RouterName: "article_list"},
      { Key: "3-2", Title: "图片列表", Icon: IconBook, RouterName: "image_list"},
      { Key: "3-3", Title: "评论列表", Icon: IconBook, RouterName: "comment_list"},
    ]},
  { Key: "4", Title: "群聊管理", Icon: IconMessage, RouterName: "chat_group", Child: [
      { Key: "4-1", Title: "群聊记录", Icon: IconMessage, RouterName: "chat_list"},
    ]},
  { Key: "5", Title: "用户管理", Icon: IconUserGroup, RouterName: "users", Child: [
      { Key: "5-1", Title: "用户列表", Icon: IconUserGroup, RouterName: "users_list"},
      { Key: "5-2", Title: "消息列表", Icon: IconUserGroup, RouterName: "users_message"},
    ]},
  { Key: "6", Title: "系统管理", Icon: IconTool, RouterName: "system", Child: [
      { Key: "6-1", Title: "菜单列表", Icon: IconTool, RouterName: "menu_list"},
      { Key: "6-2", Title: "广告列表", Icon: IconTool, RouterName: "ad_list"},
      { Key: "6-3", Title: "系统配置", Icon: IconTool, RouterName: "system_setting"},
    ]},
  { Key: "7", Title: "大模型管理", Icon: IconRobot, RouterName: "gpt", Child: [
      { Key: "7-1", Title: "参数配置", Icon: IconRobot, RouterName: "param_setting"},
      { Key: "7-2", Title: "角色配置", Icon: IconRobot, RouterName: "role_setting"},
      { Key: "7-3", Title: "会话管理", Icon: IconRobot, RouterName: "session_setting"},
    ]},
  { Key: "8", Title: "日志管理", Icon: IconFile, RouterName: "log", Child: [
      { Key: "8-1", Title: "日志列表", Icon: IconFile, RouterName: "log_list"},
    ]},
]

const selectedKeys = ref([route.name])
const openKeys = ref(route.matched.length > 1 ? [route.matched[1].name] : [])

function clickMenu(name: string) {
  router.push({
    name: name,
  })
}

// 监听路由变化，变动侧边栏选中提示
watch(() => route.name, () => {
  selectedKeys.value = [route.name];
  openKeys.value = route.matched.length > 1 ? [route.matched[1].name] : [];
}, { immediate: true });


function collapse(collapse: boolean) {
  store.setCollapsed(collapse);
}
</script>

<style lang="scss">
.admin_menu {
  .arco-menu{
    position: inherit;
  }
  .arco-menu-collapse-button{
    margin: 5px 5px;
    color: var(--collapse-color);
    background: var(--collapse-button);
    border-radius: 5px;
    position: fixed;
    &:hover{
      color: var(--active);
    }
  }
}
</style>