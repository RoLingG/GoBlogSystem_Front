<template>
  <div class="chat_index">
    <web_nav no-scroll></web_nav>
    <main>
      <div class="container">
        <chat_record no-manage></chat_record>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Web_nav from "@/components/web/web_nav.vue";
import Chat_record from "@/components/common/chat_record.vue";

</script>

<style lang="scss">
.chat_index{
  height: 100vh;
  main{
    padding-top: 70px;
    width: 100%;
    display: flex;
    justify-content: center;
    .container{
      width: var(--container_width);
    }
  }
}
</style>