<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-12 12:48:26
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-01-27 17:30:17
 * @FilePath: \blog-front\src\admin\Index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-row :gutter="32">
      <el-col :xs="12" :sm="6" style="text-align: center; margin-bottom: 32px">
        <el-card shadow="hover" @click="selectCard(0)">
          <p>总阅读量</p>
          <h2>{{ viewCount }}</h2>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" style="text-align: center; margin-bottom: 32px">
        <el-card shadow="hover" @click="selectCard(1)">
          <p>文章总数</p>
          <h2>{{ blogCount }}</h2>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" style="text-align: center; margin-bottom: 32px">
        <el-card shadow="hover" @click.native="selectCard(2)">
          <p>点赞数</p>
          <h2>{{ appreciateCount }}</h2>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" style="text-align: center; margin-bottom: 32px">
        <el-card shadow="hover" @click.native="selectCard(3)">
          <p>评论数</p>
          <h2>{{ commentCount }}</h2>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="24" style="text-align: center">
        <el-card shadow="hover">
          <div class="com-page">
            <BlogChart style="width: 100%; height: 350px" :psMsg="selectedCard"></BlogChart>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="8" :lg="8" style="text-align: center; margin-bottom: 20px">
        <el-card class="chart-wrapper" shadow="hover">
          <TagChart style="width: 100%; height: 300px"></TagChart>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="8" style="text-align: center; margin-bottom: 20px">
        <el-card class="chart-wrapper" shadow="hover">
          <TypeChart style="width: 100%; height: 300px"></TypeChart>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="8" style="text-align: center; margin-bottom: 20px">
        <el-card class="chart-wrapper" shadow="hover">
          <VisitorMap style="width: 100%; height: 300px"></VisitorMap>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 12 }"
        :lg="{ span: 12 }"
        :xl="{ span: 12 }"
        style="padding-right: 8px; margin-bottom: 30px"
      >
        <recent-blog-list />
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 6 }"
        :lg="{ span: 6 }"
        :xl="{ span: 6 }"
        style="margin-bottom: 30px"
      >
        <comment-list />
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 6 }"
        :lg="{ span: 6 }"
        :xl="{ span: 6 }"
        style="margin-bottom: 30px"
      >
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import BlogChart from './charts/BlogChart.vue'
import TagChart from './charts/TagChart.vue'
import TypeChart from './charts/TypeChart.vue'
import RecentBlogList from './charts/RecentBlogList.vue'
import CommentList from './charts/CommentList.vue'
import BoxCard from './charts/BoxCard.vue'
import VisitorMap from './charts/VisitorMap.vue'
import { indexApi } from '@/api/index'
import { onMounted, ref } from 'vue'

const blogCount = ref(1000)
const viewCount = ref(1000)
const appreciateCount = ref(1000)
const commentCount = ref(1000)
const selectedCard = ref(0)
// let recommendList = []

const getCountList = async () => {
  const { data: res } = await indexApi.getBlogCount()
  blogCount.value = res.data
  const { data: res2 } = await indexApi.getViewCount()
  viewCount.value = res2.data
  const { data: res3 } = await indexApi.getAppreciateCount()
  appreciateCount.value = res3.data
  const { data: res4 } = await indexApi.getCommentCount()
  commentCount.value = res4.data
}

onMounted(() => {
  getCountList()
})
const selectCard = (id) => {
  selectedCard.value = id
  console.log(selectedCard.value)
}
</script>

<style scoped>
.com-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.el-card:hover {
  cursor: pointer;
}

.chart-wrapper {
  height: 300px;
  margin-top: 30px;
}

.el-card :deep(.el-card__body) {
  padding: 0;
}
</style>
