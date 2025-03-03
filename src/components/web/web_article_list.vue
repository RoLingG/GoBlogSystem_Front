<template>
  <div class="web_article_list">
    <template v-if="data.list.length">
      <div class="source">
        <admin_article v-for="item in data.list" :data="item" preview></admin_article>
      </div>
      <div class="page">
        <a-pagination :total="data.count"
                      :page-size="params.limit"
                      v-model:current="params.page"
                      @change="handlePageChange"
                      show-total>
        </a-pagination>
      </div>
    </template>
    <template v-else>
      <a-empty class="nodata"></a-empty>
    </template>
  </div>
</template>

<script setup lang="ts">
import {articleListApi, type articleParams} from "@/api/article_api";
import type {articleType} from "@/api/article_api";
import {reactive, watch} from "vue";
import {useRoute} from "vue-router";
import type {listData} from "@/components/admin/admin_table.vue";
import Admin_article from "@/components/admin/admin_article.vue";

const route = useRoute()

const data = reactive<listData<articleType>>({
  list: [],
  count: 0
})

const params = reactive<articleParams>({
  limit: 5,
  page: 1,
  tag: "",
  date: "",
})

async function getData(p?:articleParams){
  if (p) {
    Object.assign(params, p)
  }
  let res = await articleListApi(params)
  data.list = res.data.list
  data.count = res.data.count
}
getData()

defineExpose({
  getData,
})

watch(() => route.query, () => {
  if (route.query.date !== "") {
    params.date = route.query.date as string
  }
  if (route.query.tag !== "") {
    params.tag = route.query.tag as string
  }
  getData()
}, {deep: true, immediate: true})

function handlePageChange(current: number) {
  getData({ page: current }); // 调用 getData 并传入新的页码
}

</script>

<style lang="scss">
.web_article_list{

  .source{

  }
  .page{
    margin-top:20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>