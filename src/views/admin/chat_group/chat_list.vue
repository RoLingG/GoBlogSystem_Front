<template>
  <div class="chat_list">
    <chat_record class="chat_record_list"></chat_record>
    <div class="config">
      <chat_group_setting></chat_group_setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chat_group_setting from "@/components/common/chat_group_setting.vue";
import Chat_record from "@/components/common/chat_record.vue";

</script>

<style lang="scss">
.chat_list{
  display: flex;
  height: calc(100vh - 120px);
  .chat_record_list{
    width: calc(100% - 380px);
    padding: 20px;
    height: 100%;
    background-color: var(--color-bg-1);
    border-radius: 5px;
    margin-right: 10px;
    overflow-y: auto;
  }
  .config{
    width: 380px;
    height: 100%;
    background-color: var(--color-bg-1);
    border-radius: 5px;
  }
}
</style>