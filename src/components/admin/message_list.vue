<template>
  <div class="message_list">
    <div :class="{item: true, active: active === item.user_id}" @click="checkItem(item)" v-for="item in props.data">
      <img class="avatar" :src="item.avatar" alt="">
      <div class="nick_name">
        <a-typography-paragraph :ellipsis="{rows: 1, showTooltip: true, css: true}">
          {{ item.nick_name }}
        </a-typography-paragraph>
      </div>
      <div class="count">{{ item.count }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {messageType} from "@/api/message_api.ts";
import {ref} from "vue";

interface Props {
  data: messageType[];
}

const props = defineProps<Props>();

const emits = defineEmits(["check"])

const active = ref<number>(0);

function checkItem(item: messageType) {
  active.value = item.user_id;
  emits("check", item);
}

</script>

<style scoped lang="scss">
.message_list {
  width: 100%;
  flex-direction: column;
  .item{
    width: 100%;
    height: 60px;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    .nick_name{
      width: 5rem;
      .arco-typography{
        margin-bottom: 0;
      }
    }
    .avatar{
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    &.active{
      border-radius: 5px;
      background: var(--color-fill-3);
    }
  }
}
</style>