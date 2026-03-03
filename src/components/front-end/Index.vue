<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-25 09:02:27
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-03-03 18:19:31
 * @FilePath: \blog-front\src\components\front-end\Index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-card shadow="none" class="welcome">
      <h1 class="tit">
        欢迎来到TwilightChimeの个人博客
        <div class="border"></div>
      </h1>
      <h2 class="intro">这是我的个人博客、会分享关于编程，开发以及其他方面的一些内容，希望可以对您有所帮助...</h2>
      <el-icon class="bounce down" @click="startRead" style="color: black"><ArrowDown /></el-icon>
    </el-card>
    <el-container id="index">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="17">
          <el-card style="background-color: rgba(255,255,255,0.9)" class="left-item">
            <div slot="header" class="total">
              <div class="title">
                <el-icon v-if="isFilterBlog" @click="backBlogList">
                  <Back />
                </el-icon>
                <span>{{ titleBlog }}</span>
              </div>
              <span>共 <span style="color: #3a8ee6; font-size: 20px">{{ totalCount }}</span> 篇</span>
            </div>
            <el-row type="flex" align="middle" style="flex-wrap: wrap" :gutter="20" v-for="blog in blogList"
              :key="blog.id" shadow="never" class="blog-content">
              <el-col class="img" :xs="24" :sm="8">
                <el-image lazy :src="IMG.BASE_URL + blog.firstPicture"></el-image>
              </el-col>
              <el-col :xs="24" :sm="16">
                <div @click="getBlogInfo(blog.id)">
                  <h3>{{ blog.title }}</h3>
                  <p class="description">{{ blog.description }}</p>
                  <div class="blog-info">
                    <div class="user-info">
                      <el-avatar size="small" :src="blog.user.avatar"></el-avatar>
                      <a href="#" class="header">{{ blog.user.nickname }}</a>
                    </div>
                    <div class="blog-date">
                      <el-icon><Clock /></el-icon>
                      <span>{{ blog.createTime | dataFormat }}</span>
                    </div>
                    <div>
                      <el-icon><View /></el-icon>
                      <span>{{ blog.views }}</span>
                    </div>
                    <div class="blog-type">
                      <el-tag effect="plain">{{ blog.type.name }}</el-tag>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
          <el-pagination :current-page="pageNum" @current-change="pageCurrentChange" @size-change="pageSizeChange"
            :page-size="pageSize" :layout="pageLayout" background :total="totalCount"
            :page-sizes="[1, 2, 3, 4]"></el-pagination>
        </el-col>
        <el-col :xs="24" :sm="7">
          <el-card style="background-color: rgba(255,255,255,0.9)" class="right-item">
            <div slot="header" class="attributes">
              <b>分类</b>
            </div>
            <ul>
              <li class="blog-type" v-for="type in typeList" :key="type.id" @click="selectType(type.id)"
                :class="type.id === typeId ? 'activeType' : ''">
                <div style="display: flex;align-items: center">
                  <el-image lazy :src="IMG.BASE_URL + type.pic_url"
                    style="width: 28px;height: 28px; border-radius: 50%; margin-right: 10px"></el-image>
                  {{ type.name }}
                </div>
                <div>{{ type.blogs.length }}</div>
              </li>
            </ul>
            <div class="more" @click="dealType">
              <el-icon v-if="moreType"><ArrowDown /></el-icon>
              <el-icon v-else><ArrowUp /></el-icon>
            </div>
          </el-card>
          <el-card style="background-color: rgba(255,255,255,0.9)" class="right-item">
            <div slot="header" class="attributes">
              <b>标签</b>
            </div>
            <div class="tags">
              <div class="tag-item" v-for="tag in tagList" :key="tag.id" @click="selectTag(tag.id)"
                :class="tag.id === tagId ? 'activeTag' : ''">
                <div class="sjx-outer">
                  <div class="sjx-inner"></div>
                </div>
                <div class="tag">
                  {{ tag.name }}
                  {{ tag.blogs.length }}
                </div>
              </div>
            </div>
            <div class="more" @click="dealTag">
              <el-icon v-if="moreTag"><ArrowDown /></el-icon>
              <el-icon v-else><ArrowUp /></el-icon>
            </div>
          </el-card>
          <el-card style="background-color: rgba(255,255,255,0.9)" class="right-item">
            <div slot="header" class="attributes">
              <span>最新推荐</span>
            </div>
            <div class="recommend-blog l-text" v-for="blog in recommendBlogList" :key="blog.id"
              @click="getBlogInfo(blog.id)">
              <a>{{ blog.title }}</a>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script setup>
import { frontEndBlog } from '@/api/blog';
import { frontEndType } from '@/api/typeApi'
import { frontEndTag } from '@/api/tagApi'
import { IMG } from '@/utils/constants';
import { onMounted, reactive, ref } from 'vue';
import { Back, Clock, View, ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const blogList = ref([])
const typeList = ref([])
const tagList = ref([])
const recommendBlogList = ref([])

const isFilterBlog = ref(false)
const titleBlog = ref('全部博客')

const pageNum = ref(1)
const pageSize = ref(2)
const pageLayout = "total, sizes, prev, pager, next, jumper"
const totalCount = ref(0)

const typeId = ref(-1)
const tagId = ref(-1)

onMounted(() => {
  getBlogList()
  getTypeList()
  getTagList()
  getRecommendBlogList()
})

//数据列表获取
const getBlogList = async () => {
  const { data: res } = await frontEndBlog.getBlogList({
    pagenum: pageNum.value,
    pagesize: pageSize.value
  })
  blogList.value = res.data.content
  totalCount.value = res.data.totalElements
}
const getTypeList = async () => {
  const { data: res } = await frontEndType.getTypeList()
  typeList.value = res.data
}
const getTagList = async () => {
  const { data: res } = await frontEndTag.getTagList()
  tagList.value = res.data
}
const getRecommendBlogList = async () => {
  const { data: res } = await frontEndBlog.getRecommendBlogList()
  recommendBlogList.value = res.data
}

//跳转博客详情
const getBlogInfo = async (id) => {

}

//博客分页
const pageSizeChange = (newValue) => {
  pageSize.value = newValue
  getBlogList()
}
const pageCurrentChange = (newValue) => {
  pageNum.value = newValue
  getBlogList()
}

//博客列表筛选
const selectType = async (id) => {
  typeId.value = id
  const { data: res } = await frontEndType.getTypeBlogList(id)
  blogList.value = res.data.content
  totalCount.value = res.data.totalElements
  titleBlog.value = '分类: ' + typeList.value.find((item) => item.id === id).name
  isFilterBlog.value = true
}
const selectTag = async (id) => {
  tagId.value = id
  const { data: res } = await frontEndTag.getTagBlogList(id)
  blogList.value = res.data.content
  totalCount.value = res.data.totalElements
  titleBlog.value = '标签: ' + tagList.value.find((item) => item.id === id).name
  isFilterBlog.value = true
}
const backBlogList = () => {
  typeId.value = -1
  tagId.value = -1
  isFilterBlog.value = false
  titleBlog.value = '全部博客'
  getBlogList()
}
</script>