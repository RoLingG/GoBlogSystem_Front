<template>
  <div class="admin_user_info_menu">
    <a-dropdown @select="select" class="admin_dropdown">
      <div class="admin_user_info_menu_dropdown">
        <a-image :src="props.avatar" alt="logo"/>
        <span>{{ store.userInfo.nick_name }}</span>
        <icon-down/>
      </div>
      <template #content>
        <template v-for="(item, index) in doptionList" :key="index">
          <a-dgroup v-if="item.Type === 'line'" title=""></a-dgroup>
          <a-doption v-else :value="item.Name">{{ item.Title }}</a-doption>
        </template>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import {IconDown} from "@arco-design/web-vue/es/icon";
import {useStore} from "@/stores/counter.ts";
import {useRouter} from "vue-router";
import type {tabType} from "@/components/common/types";

interface Props {
  avatar: string;
}

const props = defineProps<Props>()

interface dopType extends tabType {
  Type: string;
}

const store = useStore();

const router = useRouter();

const doptionList: dopType[] = [
  {Name: "user_info", Title: "我的信息", Type:""},
  {Name: "article_list", Title: "文章列表", Type:""},
  {Name: "users_list", Title: "用户管理", Type:""},
  {Name: "log_list", Title: "系统日志", Type:""},
  {Name: "", Title: "", Type:"line"},
  {Name: "logout", Title: "用户注销", Type:""},
]

function select(value: string | number | Record<string, any> | undefined, ev: Event) {
  if (value === 'logout') {
    store.logout()
    router.push({
      name: "index"
    })
    console.log(store.userInfo)
    return
  }
  router.push({
    name: value as string,
  });
}

</script>

<style lang="scss">
.admin_user_info_menu{
  display: flex;
  img{
    margin: 0 10px;
    height: 25px;
    width: 25px;
    border-radius: 5px;
  }
  .admin_user_info_menu_dropdown{
    display: flex;
    align-items: center;
    coursor:pointer;
  }
}

.admin_dropdown{
  .arco-dropdown-group-title{
    margin-top: 1px;
    margin-bottom: 1px;
    &::after{
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      background: var(--dropline-color);
    }
  }
}


</style>