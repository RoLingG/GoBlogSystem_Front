<template>
  <div class="admin_side">
    <aside :class="{collapsed: store.collapsed}">
      <admin_logo></admin_logo>
      <admin_menu></admin_menu>
    </aside>
    <main>
      <div class="admin_head">
        <admin_breadcrumb></admin_breadcrumb>
        <div class="admin_function_area">
          <icon-import class="import_icon" @click="goBackIndex"></icon-import>
          <component_theme></component_theme>
          <user_info_menu :avatar="avatar"></user_info_menu>
        </div>
      </div>
      <admin_tabs></admin_tabs>
      <div class="admin_container">
        <router-view v-slot="{Component}">
          <transition name="fade" mode="out-in">
              <component :is="Component"></component>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  IconImport,
} from '@arco-design/web-vue/es/icon';
import admin_menu from '@/components/admin/admin_menu.vue';
import admin_breadcrumb from '@/components/admin/admin_breadcrumb.vue';
import admin_tabs from '@/components/admin/admin_tabs.vue';
import admin_logo from '@/components/admin/admin_logo.vue';
import component_theme from '@/components/common/theme.vue'
import {useStore} from "@/stores/counter.ts";
import {useRouter} from "vue-router";
import {userInfoApi} from "@/api/user_api.ts";
import {ref} from "vue";
import User_info_menu from "@/components/common/user_info_menu.vue";

const router = useRouter();

const store = useStore();

const avatar = ref("")

async function getAvatar(){
  let res = await userInfoApi()
  avatar.value = getImgSrc(res.data.avatar);
}
getAvatar()

function getImgSrc(path: string) {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080${path}`;
  }
}

function goBackIndex() {
  router.push({ name: 'index' });
}
</script>

<style lang="scss">
.admin_side{
  display: flex;
  aside{
    width: 240px;
    border-right: 1px solid var(--bgColor);
    background-color: var(--head-tab-color);
    transition: all .3s;
  }
  aside.collapsed{
    width: 48px;
    &~main{
      width: calc(100% - 48px);
    }
  }
  main{
    width: calc(100% - 240px);
    overflow-x: hidden;
    background-color: var(--containColor);
    transition: all .3s;
    .admin_head{
      width: 100%;
      height: 60px;
      border-bottom: 1px solid var(--bgColor);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      background-color: var(--head-tab-color);
      color: var(--color-text-2);
      .admin_function_area{
        .import_icon{
          margin-right: 20px;
          font-size: 18px;
          &:hover{
            color: var(--active);
          }
        }
        display: flex;
        align-items: center;
        .action_icon{
          margin: 0 15px;
        }
      }
    }
    .admin_container {
      background: var(--containColor);
      color: var(--color-text-2);
      min-height: calc(100vh - 100px);
      padding: 10px;
    }
  }
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fade-enter-active {
  transform: translateX(-30px);
  opacity: 0;
}

.fade-enter-to  {
  transform: translateX(0px);
  opacity: 1;
}

.fade-leave-active, .fade-enter-active  {
  transition: all 0.3s ease-in-out;
}

</style>
