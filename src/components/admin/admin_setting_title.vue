<template>
  <div class="admin_setting">
    {{ props.title }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

const props = defineProps<Props>()
</script>

<style scoped lang="scss">
.admin_setting {
  font-size: 16px;
  font-weight: 700;
  display: flex;
  &::before{
    width: 3px;
    height: 1.2rem;
    margin-right: 5px;
    content: "";
    display: inline-block;
    background-color: var(--active);
  }
}
</style>