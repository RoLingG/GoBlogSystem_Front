<template>
  <div class="theme" @click="store.setTheme()">
    <icon-sun v-if="store.theme"></icon-sun>
    <icon-moon v-else></icon-moon>
  </div>
</template>

<script setup lang="ts">
import { IconSun, IconMoon } from '@arco-design/web-vue/es/icon';
import {useStore} from "@/stores/counter.ts";

const store = useStore();
store.loadTheme()

</script>

<style scoped>
  .theme {
    margin-right: 20px;
    font-size: 18px;
    &:hover{
      color: var(--active);
    }
  }
</style>