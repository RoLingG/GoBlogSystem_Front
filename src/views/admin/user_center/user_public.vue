<template>
  <div class="article_list">
    <article_update v-model:visible="updateVisible" :data="updateData" @ok="getList"></article_update>
    <admin_article_drawer :visible="createVisible" @update:visible="createVisible = $event" @ok="getList"></admin_article_drawer>
    <admin_content_drawer v-model:visible="contentVisible" :id="articleUpdateID" @ok="getList"></admin_content_drawer>
    <admin_table :url="articleListApi" :columns="columns"
                 default-remove ref="adminTable" @edit="editArticleInfo"
                 :default-params="params"
                 search-placeholder="搜索文章标题" @add="createVisible = true"
                 @remove="remove" add-text="发布文章">
      <template #image_url="{record}: {record: articleType}">
        <a-image class="article_Image" :src="imagePath(record.image_url)"></a-image>
      </template>
      <template #data="{record}: {record: articleType}">
        <div class="article_data">
          <span>
            <icon-thumb-up />
            <span>{{ record.digg_count }}</span>
          </span>
          <span>
            <icon-eye />
            <span>{{ record.look_count }}</span>
          </span>
          <span>
            <icon-message />
            <span>{{ record.comment_count }}</span>
          </span>
          <span>
            <icon-star />
            <span>{{ record.collect_count }}</span>
          </span>
        </div>
      </template>
      <template #tags="{record}: {record: articleType}">
        <div class="article_tags">
          <a-tag class="tags" v-for="item in record.tags" :color="colorList[Random.integer(0, 12)]">{{ item }}</a-tag>
        </div>
      </template>
      <template #title="{record}: {record: articleType}">
        <div class="article_title" v-html="record.title"/>
      </template>
      <template #action_middle="{record}: {record: articleType}">
        <a-button type="outline" @click="editArticleContent(record)">编辑正文</a-button>
      </template>
    </admin_table>
  </div>
</template>

<script setup lang="ts">
import admin_table, {type filterOptionType} from "@/components/admin/admin_table.vue";
import {reactive, ref} from "vue";
import {articleCategoryListApi, articleListApi, type articleType, type articleUpdateType} from "@/api/article_api.ts";
import {Random} from "mockjs";
import Article_update from "@/components/common/article_update.vue";
import Admin_article_drawer from "@/components/admin/admin_article_drawer.vue";
import Admin_content_drawer from "@/components/admin/admin_content_drawer.vue";
import type {paramsType} from "@/api";

const colorList = [
  'red',
  'orangered',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'arcoblue',
  'purple',
  'pinkpurple',
  'magenta',
  'gray',
]

const params = reactive<paramsType&{is_user: boolean}>({
  is_user: true,
})

const filterGroup:filterOptionType[] = [
  {
    label:"文章分类",
    value: 0,
    column:"category",
    source: articleCategoryListApi
  }
]

const columns = [
  {title: '标题', slotName: 'title'},
  {title: '分类', dataIndex: 'category'},
  {title: '封面', slotName: 'image_url'},
  {title: '作者', dataIndex: 'user_nick_name'},
  {title: '标签', slotName: 'tags'},
  {title: '文章数据', slotName: 'data'},
  {title: '上传时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'}
]

const createVisible = ref(false)

const updateVisible = ref(false)

const contentVisible = ref(false)

const adminTable = ref()

const updateData = reactive<articleUpdateType>({
  id: "",
})

const articleUpdateID = ref<string|undefined>(undefined)

function remove(idList: (number | string)[]) {
  console.log(idList)
}

function imagePath(path: string) {
  if (path.startsWith('http') ) {
    return path;
  } else {
    return `http://127.0.0.1:8080/${path}`;
  }
}

function editArticleInfo(record: articleType) {
  updateVisible.value = true
  updateData.id = record.id
  updateData.title = record.title
  updateData.abstract = record.abstract
  updateData.category = record.category
  updateData.image_id = record.image_id
  updateData.tags = record.tags
  updateData.image_url = record.image_url
  updateData.source = record.source
  updateData.link = record.link
}

function getList() {
  // 延迟调用，防止后端es慢更新出现前后端数据显示不同步问题
  setTimeout(() => {
    adminTable.value.getList()
  }, 800);
}

function editArticleContent(record: articleType) {
  contentVisible.value = true
  articleUpdateID.value = record.id
}

</script>

<style lang="scss">
.article_list{
  .article_Image img{
    height: 50px;
    width: 50px;
    border-radius: 5px;
  }
  .article_data{
    >span{
      margin-right: 5px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  .article_tags{
    .tags{
      margin-right: 10px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  .article_title{
    em{
      color: rgb(var(--red-6));
      font-style: normal;
    }
  }
}

</style>