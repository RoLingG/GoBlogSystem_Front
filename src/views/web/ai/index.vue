<template>
  <div class="ai_index">
    <web_nav no-scroll></web_nav>
    <main>
      <div class="menu">
        <div class="head">
          <router-link :to="{name: 'role_square'}">角色广场</router-link>
        </div>
        <div class="role_list">
          <div :class="{item: true, active: Number(route.query.role_id) === item.id}" @click="checkRole(item)" v-for="item in store.roleHistoryList">
            <img class="avatar" :src="getImgSrc(item.icon)" alt="">
            <div class="content">
              <a-typography-text class="name" :ellipsis="{rows: 1, css: true}">{{ item.name }}</a-typography-text>
              <a-typography-text class="abs" :ellipsis="{rows: 2, css: true}">{{ item.abstract }}</a-typography-text>
            </div>
          </div>
        </div>
      </div>
      <div class="view">
        <router-view/>
      </div>
    </main>
    <web_footer></web_footer>
  </div>
</template>

<script setup lang="ts">
import Web_footer from "@/components/web/web_footer.vue";
import Web_nav from "@/components/web/web_nav.vue";
import {useRoute} from "vue-router";
import {watch} from "vue";
import {useStore} from "@/stores/counter.ts";
import {checkRole} from "@/service/check_role.ts";

const route = useRoute()

const store = useStore()

function getImgSrc(path: string) {
  if (!path) {
    return "";
  }
  if (path.startsWith("http")) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}

watch(()=>store.isLogin, ()=>{
  store.getRoleHistoryList()
}, {immediate: true})

</script>

<style lang="scss">
.ai_index{
  main{
    height: calc(100vh - 60px);
    width: 100%;
    padding: 20px 40px;
    display: flex;
    .menu{
      margin-top: 60px;
      width: 290px;
      height: 93%;
      background-color: var(--color-bg-1);
      border-radius: 5px;
      .head{
        padding: 20px;
        border-bottom: 1px solid var(--bgColor);
        display: flex;
        justify-content: center;
      }
      .role_list{
        overflow-y: auto;
        height: calc(100% - 50px);
        display: flex;
        flex-direction: column;
        min-width: 240px;
        .item{
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 20px;
          &.active{
            background-color: var(--color-fill-2);
          }
          &:hover{
            background-color: var(--color-fill-1);
          }
          &:last-child{
            margin-bottom: 0;
          }
          .avatar{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          .content{
            margin-left: 10px;
            .name{
              margin-bottom: 0;
            }
            .abs{
              color: var(--color-text-2);
              font-size: 12px;
              margin-top: 5px;
              margin-bottom: 0;
            }
          }
        }
      }
    }

    .view{
      flex-grow: 1;
      margin-left: 20px;
    }
  }
}
</style>