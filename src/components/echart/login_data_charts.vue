<template>
  <div class="login_data_charts">
    <div class="select">
      <a-select v-model="params.date"
                :options="dateFilterOptions"
                @change="dateFilterChange"
                placeholder="时间过滤"></a-select>
    </div>
    <login_chart
        v-if="isShow"
        :date-list="data.date_list"
        :height="300"
        :login-list="data.login_data"
        :sign-list="data.sign_data"></login_chart>
  </div>
</template>
<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {dataLoginApi} from "@/api/data_api";
import type {loginDataType} from "@/api/data_api";
import type {loginDataRequest} from "@/api/data_api";
import {useStore} from "@/stores/counter.ts";
import Login_chart from "@/components/echart/login_chart.vue";

const isShow = ref(false)

const data = reactive<loginDataType>({
  date_list: [],
  login_data: [],
  sign_data: [],
})

const params = reactive<loginDataRequest>({
  date: 1
})

async function getData() {
  isShow.value = false
  let res = await dataLoginApi(params)
  Object.assign(data, res.data)
  isShow.value = true
}

getData()

const dateFilterOptions = [
  {label: "七天", value: 1},
  {label: "一个月", value: 2},
  {label: "两个月", value: 3},
  {label: "三个月", value: 4},
  {label: "六个月", value: 5},
  {label: "一年", value: 6},
]


const store = useStore()
watch(() => store.theme, () => {
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  })
})

function dateFilterChange() {
  getData()
}


</script>

<style lang="scss">
.login_data_charts {
  position: relative;

  .select {
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 1;
    width: 160px;
  }
}
</style>