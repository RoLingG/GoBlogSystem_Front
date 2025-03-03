<template>
  <div class="help">
    <admin_setting_title :title="helpTitle"></admin_setting_title>
    <div class="col" v-for="item in props.data">
      <div class="title">
        <div class="column">{{ item.title }}</div>
        <div class="abs">{{ item.abs }}</div>
      </div>
      <div class="content" v-html="item.content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Admin_setting_title from "@/components/admin/admin_setting_title.vue";

interface helpData {
  title: string;
  abs?: string;
  content?: string;
}

interface Props {
  helpTitle?: string;
  data: helpData[];
}

const props = defineProps<Props>();

const {helpTitle="帮助信息"} = props

</script>

<style scoped lang="scss">
.help{
  max-height: calc(100vh - 170px);
  overflow-y: auto;
  margin-left: 40px;
  .col{
    margin-top: 20px;
    .title{
      display: flex;
      .column{
        font-weight: 600;
        margin-right: 10px;
        &::after{
          content: ":";
        }
      }
      .abs{

      }
    }
    .content{
      margin-top: 10px;
      line-height: 1.5rem;
      a{
        color: var(--active);
      }
    }
  }
}
</style>