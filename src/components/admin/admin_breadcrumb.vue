<template>
  <div class="admin_breadcrumb">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="item in route.matched" style="font-size: 15px; font-weight: bold">
        {{ item.meta.title }}
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute();
</script>

<style scoped>

</style>