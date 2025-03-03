<template>
 <router-view class="web_view" />
</template>

<script setup lang="ts">

import {useStore} from "@/stores/counter.ts";

const store = useStore()

store.loadSiteInfo()

</script>

<style lang="scss">
.web_view {
  background-color: var(--webBgColor);
}

@media screen and (min-width: 1400px) and (max-width: 1800px)  {
  body{
    --container_width: 1200px;
  }
}

@media screen and (min-width: 1200px) and (max-width: 1400px)  {
  body{
    --container_width: 1000px;
  }
}

@media screen and (min-width: 1000px) and (max-width: 1200px)  {
  body{
    --container_width: 800px;
  }
}
</style>