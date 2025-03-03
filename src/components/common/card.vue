<template>
  <div class="card">
    <div class="card_head">
      <div class="card_title">
        {{ props.title }}
      </div>
      <div class="card_right">
        <slot name="head_right"></slot>
      </div>
    </div>

    <div class="card_body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

const props = defineProps<Props>()

</script>

<style lang="scss">
.card{
  background-color: var(--color-bg-1);
  border-radius: 5px;
  width: 100%;
  .card_head{
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--bgColor);
    justify-content: space-between;
    .card_title{
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text-1);
    }
    .card_right{
      a{
        color: var(--color-text-1);
        text-decoration: none;
      }
    }
  }
  .card_body{
    padding: 20px;
  }
}
</style>