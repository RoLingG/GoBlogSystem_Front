<template>
  <div class="web_user_card">
    <div class="title">
      <icon-quote/>
      这是我的个人名片，请笑纳
    </div>
    <div class="info">
      <div class="item">
        <span>名称:</span>
        <span>{{ store.siteInfo.name }}</span>
      </div>
      <div class="item">
        <span>现任:</span>
        <span>{{ store.siteInfo.job }}</span>
      </div>
      <div class="item">
        <span>位于:</span>
        <span>{{ store.siteInfo.addr }}</span>
      </div>
    </div>
    <div class="image">
      <div class="qq">
        <img :src="getImgSrc(store.siteInfo.qq_image)" alt="">
        <span>QQ</span>
      </div>
      <div class="wechat">
        <img :src="getImgSrc(store.siteInfo.wechat_image)" alt="">
        <span>微信</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "@/stores/counter.ts";

const store = useStore()

function getImgSrc(path: string | undefined | null): string {
  if (path === undefined || path === null) {
    return "";
  }
  if (path.startsWith('http')) {
    return path;
  } else {
    return `http://127.0.0.1:8080${path}`;
  }
}
</script>

<style lang="scss">
.web_user_card{
  color: var(--color-text-2);
  .title{
    background-color: var(--color-fill-2);
    border-radius: 5px;
    margin-bottom: 20px;
    color: var(--color-text-1);
    text-align: center;
    padding: 40px 0px;
  }
  .info{
    .item{
      margin-bottom: 10px;
      >span:nth-child(1){
        margin-right: 10px;
        color: var(--color-text-1);
        font-weight: 600;
      }
    }
  }
  .image{
    display: flex;
    justify-content: center;
    img{
      width: 100px;
      height: 100px;
      margin: 0px 50px;
      border-radius: 5px;
    }
    span{
      margin-top: 10px;
      font-weight: 600;
    }
    >div{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>