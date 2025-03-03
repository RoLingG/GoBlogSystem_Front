<template>
  <div class="web_article_calendar">
    <web_article_calendar_chart v-if="isShow" :date-list="data.dateList"
                             :count-list="data.countList" :theme="store.theme"></web_article_calendar_chart>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import Web_article_calendar_chart from "@/components/web/web_article_calendar_chart.vue";
import {useStore} from "@/stores/counter.ts";
import {articleCalendarApi} from "@/api/article_api.ts";

const store = useStore()

const data = reactive<{ dateList: string[], countList: Array<[string, number]> }>({
  dateList: [],
  countList: [],
})

const isShow = ref(false)

async function getData() {
  let res = await articleCalendarApi()
  data.dateList = [res.data[0].date, res.data[res.data.length - 1].date]
  data.countList = []
  res.data.forEach((item) => {
    data.countList.push([item.date, item.count])
  })
  isShow.value = true
}

watch(()=>store.theme, ()=>{
  isShow.value = false
  setTimeout(()=>{
    isShow.value = true
  }, 500)
})

onMounted(() => {
  getData();
});

</script>

<style lang="scss">
.web_article_calendar{

}
</style>