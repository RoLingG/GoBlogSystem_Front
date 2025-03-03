<template>
  <div class="article_list">
  <admin_table :url="articleCollectListApi" :columns="columns"
                 default-remove ref="adminTable"
                 search-placeholder="搜索文章标题"
                 @remove="remove" no-add no-checkbox-edit>
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
    </admin_table>
  </div>
</template>

<script setup lang="ts">
import admin_table from "@/components/admin/admin_table.vue";
import {ref} from "vue";
import {
  articleCollectListApi,
  type articleType,
} from "@/api/article_api.ts";
import {Random} from "mockjs";

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

const columns = [
  {title: '标题', slotName: 'title'},
  {title: '分类', dataIndex: 'category'},
  {title: '封面', slotName: 'image_url'},
  {title: '作者', dataIndex: 'user_nick_name'},
  {title: '标签', slotName: 'tags'},
  {title: '文章数据', slotName: 'data'},
  {title: '收藏时间', slotName: 'create_at'},
  {title: '操作', slotName: 'action'}
]

const adminTable = ref()

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
      margin-right: 10px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  .article_tags{
    .tags{
      margin-right: 5px;
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