<template>
  <div class="web_footer">
    <span class="text1">@RoLingG</span>
    <div class="version">
      <span class="version_left">version:</span>
      <span class="version_right">{{ store.siteInfo.version }}</span>
    </div>
    <span class="created_at">
      <span class="created_at_left">建站日期:</span>
      <span class="created_at_right">{{ store.siteInfo.created_at }}</span>
    </span>
    <span class="text2">(O--V--O)</span>
  </div>
</template>

<script setup lang="ts">

import {useStore} from "@/stores/counter.ts";

const store = useStore()

</script>

<style lang="scss">
.web_footer{
  width: 100%;
  height: 60px;
  bottom: 20px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  border-top: solid 2px var(--containColor);
  color: var(--color-text-1);
  background-color: var(--color-bg-1);
  .text1{
    font-size: 18px;
    margin-right: 200px;
    text-align: center;
  }
  .version{
    margin-right: 200px;
    .version_left{
      font-size: 14px;
      text-align: center;
      color: var(--icon_border_bg);
      background-color: var(--active);
      border-radius: 5px 0px 0px 5px;
      padding: 4px 8px;
    }
    .version_right{
      font-size: 14px;
      text-align: center;
      padding: 4px 6px;
      color: var(--color-text-1);
      background-color: var(--bgColor);
      border-radius: 0px 5px 5px 0px;
    }
  }
  .created_at{
    text-align: center;
    margin-right: 200px;
    .created_at_left{
      font-size: 14px;
      text-align: center;
      color: var(--icon_border_bg);
      background-color: var(--icon);
      border-radius: 5px 0px 0px 5px;
      padding: 4px 8px;
    }
    .created_at_right{
      font-size: 14px;
      text-align: center;
      padding: 4px 6px;
      color: var(--color-text-1);
      background-color: var(--bgColor);
      border-radius: 0px 5px 5px 0px;
    }
  }
  .text2{
    font-size: 18px;
    text-align: center;
  }
}
</style>