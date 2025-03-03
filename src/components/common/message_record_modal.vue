<template>
  <div>
    <a-modal width="50%" body-class="message_record_modal" title="聊天" :visible="props.visible" :footer="false" @cancel="close" @close="close">
      <message_record :send-user_id="props.sendUser_id"
                      :rev-user_id="revUser_id"
                      :rev-user_name="revUser_name">
      </message_record>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import message_record from "@/components/common/message_record.vue";

interface Props {
  visible: boolean;
  sendUser_id: number;
  revUser_id: number;
  revUser_name: string;
}

const props = defineProps<Props>()

const emits = defineEmits(["update:visible"]);

function close() {
  emits("update:visible", false);
}

</script>

<style lang="scss">
.message_record_modal{
  padding: 0;
}
</style>