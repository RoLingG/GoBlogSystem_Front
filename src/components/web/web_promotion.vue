<template>
  <div class="web_promotion">
    <a-carousel auto-play
                indicator-type="dot"
                show-arrow="hover">
      <a-carousel-item v-for="item in promotionList">
        <a :href="item.href" target="_blank" class="link">
          <img :src="getImgSrc(item.images)" :alt="item.title"/>
        </a>
      </a-carousel-item>
    </a-carousel>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {adListApi, type adType} from "@/api/ad_api.ts";

const promotionList = ref<adType[]>([])

async function getData() {
  let res = await adListApi()
  promotionList.value= res.data.list
}
getData()

function getImgSrc(path: string) {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080${path}`;
  }
}

</script>

<style lang="scss">
.web_promotion{
  height: 200px;
  .arco-carousel{
    height: 100%;
    width: 100%;
    .link{
      width: 100%;
      height: 100%;
      display: block;
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>