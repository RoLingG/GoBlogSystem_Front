<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import {useStore} from "@/stores/counter.ts";

const store = useStore();
store.loadTheme()
store.loadToken()
store.getLargeScaleModelInfo()
</script>
