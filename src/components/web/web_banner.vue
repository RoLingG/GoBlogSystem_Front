<template>
  <div class="web_banner">
    <div class="head">
      <div class="slogan">{{ data.slogan }}</div>
      <div class="abstract">
        <template v-if="typeof data.abstract === 'object'">
          <VueTyped  :strings="data.abstract"
                    :type-speed="100" :back-speed="100" :start-delay="100" loop>
            <span class="typing"></span>
          </VueTyped>
        </template>
        <template v-else>
          {{ data.abstract }}
        </template>
      </div>
    </div>
    <a-carousel
        :auto-play="{interval: data.menu_time * 1000}"
        indicator-type="dot"
        show-arrow="hover">
      <a-carousel-item v-for="item in (data.menu_image) as menuImage[]">
        <img class="banner_image" alt="" :src="getImgSrc(item.path)"/>
      </a-carousel-item>
    </a-carousel>
  </div>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";
import {menuDetailApi, type menuDetailRequest, type menuImage} from "@/api/menu_api.ts";
import VueTyped from "vue3typed/libs/typed/index.vue"

interface Props {
  data?: bannerType
}
const props = defineProps<Props>()

interface bannerType {
  abstract: string | string[]
  menu_time: number
  menu_image: menuImage[] | string
  slogan: string
}

const data = reactive<bannerType>({
  slogan: "",
  abstract: [],
  menu_time: 7,
  menu_image: [],
})

const detailRequest = reactive<menuDetailRequest>({
  path: ""
})

async function getData() {
  if (props.data){
    if (typeof props.data.menu_image === 'string') {
      data.menu_image = [{path: props.data.menu_image}]
    }
    data.slogan = props.data.slogan
    data.abstract = props.data.abstract
    data.menu_time = props.data.menu_time
    return
  }
  const key = `menus__${location.pathname}`
  const val = sessionStorage.getItem(key)
  if (val !== null) {
    try {
      const jsonData = JSON.parse(val) as bannerType
      data.menu_image = jsonData.menu_image
      data.slogan = jsonData.slogan
      data.abstract = jsonData.abstract
      data.menu_time = jsonData.menu_time
      return
    } catch (e) {
    }
  }
  detailRequest.path = location.pathname;
  let res = await menuDetailApi(detailRequest)
  data.menu_image = res.data.menu_image
  data.slogan = res.data.slogan
  data.abstract = res.data.abstract
  data.menu_time = res.data.menu_time
  sessionStorage.setItem(key, JSON.stringify(data))
}
getData()

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

watch(()=>props.data, ()=>{
  getData()
},{immediate:true})
</script>

<style lang="scss">
.web_banner{
  width: 100%;
  height: 700px;
  position: relative;
  .head{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    color: #ffffff;
    .slogan{
      font-size: 30px;
      font-weight: 400;
      text-align: center;
      margin-bottom: 10px;
    }
    .abstract{
      font-size: 18px;
      text-align: center;
    }
  }
  .arco-carousel{
    width: 100%;
    height: 700px;
    .banner_image{
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }
}
</style>