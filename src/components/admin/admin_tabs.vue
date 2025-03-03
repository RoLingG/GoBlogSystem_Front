<template>
  <div class="admin_tabs">
    <swiper
        :slides-per-view="5"
        class="mySwiper"
    >
      <swiper-slide v-for="(item) in tabList" :key="item.Name" style="padding: 5px">
        <span
            :class="{admin_tab: true, active: route.name === item.Name}"
            @click="clickTab(item)"
            @click.middle="closeTab(item)">
          {{ item.Title }}
          <IconClose @click.stop="closeTab(item)" v-if="item.Name !== 'home'"></IconClose>
        </span>
      </swiper-slide>
    </swiper>
    <span class="admin_tab close_all_tabs" @click="closeAllTabs">全部关闭</span>
  </div>
</template>

<script setup lang="ts">
import {ref, type Ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Swiper, SwiperSlide} from 'swiper/vue';
import "swiper/css";
import type {tabType} from "@/components/common/types";

const route = useRoute();
const router = useRouter();

const tabList:Ref<tabType[]> = ref([
    {Name: "home", Title:"首页"},
])

function clickTab(item: tabType) {
  router.push({
    name: item.Name,
  })

}

// 小心响应式变量赋值导致被赋值的对象也变成响应式
function closeAllTabs() {
  tabList.value = [
    {Name: "home", Title: "首页", },
  ];
  router.push({
    name: "home"
  });
}

function closeTab(item: tabType) {
  if (item.Name === "home") {
    return;
  }
  let index = tabList.value.findIndex((tab) => item.Name === tab.Name)
  tabList.value.splice(index, 1)
  if (route.name === item.Name) {
    let prevTabIndex = index - 1;
    let prevTab = tabList.value[prevTabIndex];
    clickTab(prevTab);
  }
}

watch(() => route.name, () => {
  if (!inTabList(route.name as string)) {
    if (route.name === "home") {
      return;
    }
    tabList.value.push({
      Name: route.name as string,
      Title: route.meta.title as string,
    });
  }
}, { immediate: true });

function inTabList(name: string): boolean {
  return tabList.value.some(tab => tab.Name === name);
}

function persistence() {
  localStorage.setItem("tabList", JSON.stringify(tabList.value));
}

function loadTabs() {
  let val = localStorage.getItem("tabList")
  if (val === null) {
    return;
  }
  let tabs = []
  try {
    tabs = JSON.parse(val)
  }catch(err) {
    return;
  }
  tabList.value = tabs;
}

loadTabs()
watch(() => tabList.value.length, () => {
    persistence();
})

</script>

<style lang="scss" scoped>
.admin_tabs{
  height: 40px;
  width: 100%;
  border-bottom: 1px solid var(--bgColor);
  display: flex;
  align-items: center;
  position: relative;
  color: var(--color-text-2);
  background-color: var(--head-tab-color);
  .mySwiper {
    width: calc(100% - 24px);
    margin-right: 120px;
    overflow: hidden;
    display: flex;
    align-items: center;
    border-right: 1px solid #e0dddd;
    .swiper-wrapper {
      display: flex;
      justify-content: start;
      width: 100%;
      padding: 15px;
      .swiper-slide {
        width: auto !important;
      }
    }
  }
  .admin_tab{
    border-radius: 5px;
    border: 1px solid var(--bgColor);
    margin: 10px 8px;
    padding: 3px 10px;
    cursor: pointer;
    &.active{
      background-color: var(--active);
      color: #fff;
      svg{
        &:hover {
          background-color: #94BFFF;
        }
      }
    }
    svg{
      font-size: 13px;
      border-radius: 3px;
      &:hover {
        background-color: var(--bgColor);
      }
    }
  }
  .close_all_tabs{
    position: absolute;
    right: 15px;
    background-color: rgb(var(--red-6));
    color: #ffffff;
  }
}
</style>