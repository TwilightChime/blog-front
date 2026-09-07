<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-25 09:02:27
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-09-04 11:07:39
 * @FilePath: \blog-front\src\components\front-end\Index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-container id="indexId">
    <el-row justify="center" class="index-main">
      <el-col :xs="14" :sm="14" class="main-item-blog">
        <el-card class="blog-card">
          <div slot="header" class="blog-card-header">
            <div class="blog-header-title">
              <el-icon v-if="isFilterBlog" @click="backBlogList">
                <Back />
              </el-icon>
              <span style="font-size: 20px;">{{ titleBlog }}</span>
            </div>
            <span>共 <span style="color:#3a8ee6;font-size:20px">{{ totalCount }}</span> 篇</span>
          </div>
          <el-row v-for="blog in blogList" :key="blog.id" class="blog-card-main">
            <el-col class="main-blog-img" :xs="24" :sm="8">
              <el-image lazy :src="IMG.BASE_URL + blog.firstPicture"></el-image>
            </el-col>
            <el-col class="main-blog-content" :xs="24" :sm="16" @click="getBlogInfo(blog.id)">
              <h3>{{ blog.title }}</h3>
              <div class="blog-description">
                <p>{{ blog.description }}</p>
              </div>
              <div class="blog-info">
                <div class="blog-info-user">
                  <el-avatar size="small" :src="blog?.user?.avatar"></el-avatar>
                  <a href="#" class="info-nickname">{{ blog?.user?.nickname }}</a>
                </div>
                <div class="blog-info-date">
                  <el-icon style="margin-right: 2px;">
                    <Clock />
                  </el-icon>
                  <span>{{ $filters.dateFormat(blog.createTime) }}</span>
                </div>
                <div class="blog-info-view">
                  <el-icon style="margin-right: 2px;">
                    <View />
                  </el-icon>
                  <span>{{ blog.views }}</span>
                </div>
                <div class="blog-info-type">
                  <el-tag effect="plain">{{ blog?.type?.name }}</el-tag>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <el-pagination class="blog-page" :current-page="pageNum" @current-change="pageCurrentChange"
          @size-change="pageSizeChange" :page-size="pageSize" :layout="pageLayout" background :total="totalCount"
          :page-sizes="[1, 2, 3, 4]"></el-pagination>
      </el-col>
      <el-col :xs="4" :sm="4">
        <el-card class="right-item-type">
          <div slot="header" class="type-title">
            <b>分类</b>
          </div>
          <ul>
            <li class="type-list" v-for="type in typeList" :key="type.id" @click="selectType(type.id)"
              :class="type.id === typeId ? 'activeType' : ''">
              <div style="display: flex;align-items: center">
                <el-image lazy :src="IMG.BASE_URL + type.pic_url" fit="cover"
                  style="width: 28px;height: 28px;border-radius: 50%;margin-right: 10px"></el-image>
                {{ type.name }}
              </div>
              <div style="margin-left: auto;">{{ type.blogs.length }}</div>
            </li>
          </ul>
          <div class="type-fold" @click="typeFold">
            <el-icon v-if="notFullType">
              <ArrowDown />
            </el-icon>
            <el-icon v-else>
              <ArrowUp />
            </el-icon>
          </div>
        </el-card>
        <el-card class="right-item-tag">
          <div slot="header" class="tag-title">
            <b>标签</b>
          </div>
          <div class="tag-view">
            <div class="tag-list" v-for="tag in tagList" :key="tag.id" @click="selectTag(tag.id)"
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
          <div class="tag-fold" @click="tagFold">
            <el-icon v-if="notFullTag">
              <ArrowDown />
            </el-icon>
            <el-icon v-else>
              <ArrowUp />
            </el-icon>
          </div>
        </el-card>
        <el-card class="right-item-recommend">
          <div slot="header" class="recommend-title">
            <span>最新推荐</span>
          </div>
          <div class="recommend-list" v-for="blog in recommendBlogList" :key="blog.id" @click="getBlogInfo(blog.id)">
            <a>{{ blog.title }}</a>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script setup>
import { frontEndBlog } from '@/api/blog';
import { frontEndType } from '@/api/typeApi'
import { frontEndTag } from '@/api/tagApi'
import { IMG } from '@/utils/constants';
import { onMounted, onUnmounted, ref } from 'vue';
import { Back, Clock, View, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const blogList = ref([])
const typeList = ref([])
const tagList = ref([])
const recommendBlogList = ref([])

const isFilterBlog = ref(false)
const titleBlog = ref('全部博客')

const pageNum = ref(1)
const pageSize = ref(8)
const pageLayout = "total, sizes, prev, pager, next, jumper"
const totalCount = ref(0)

const typeId = ref(-1)
const tagId = ref(-1)
const notFullType = ref(true)
const notFullTag = ref(true)

const router = useRouter()

onMounted(() => {
  getBlogList()
  getTypeList()
  getTagList()
  getRecommendBlogList()
})
onUnmounted(() => {
})

//数据列表获取
const getBlogList = async () => {
  const { data: res } = await frontEndBlog.getBlogList({
    pageNumber: pageNum.value,
    pageSize: pageSize.value
  })
  blogList.value = res.data.content
  totalCount.value = res.data.totalElements
}
const getTypeList = async () => {
  const { data: res } = await frontEndType.getTypeList()
  typeList.value = res.data.content
}
const getTagList = async () => {
  const { data: res } = await frontEndTag.getTagList()
  tagList.value = res.data.content
}
const getRecommendBlogList = async () => {
  const { data: res } = await frontEndBlog.getRecommendBlogList()
  recommendBlogList.value = res.data
}

//跳转博客详情
const getBlogInfo = async (blogId) => {
  await router.push({ path: '/blog', query: { id: blogId } })
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

//分类标签展开收展
const typeFold = async () => {
  if (notFullType.value) {
    const { data: res } = await frontEndType.getFullTypeList()
    typeList.value = res.data
    notFullType.value = false
  } else {
    const { data: res } = await frontEndType.getTypeList()
    typeList.value = res.data
    notFullType.value = true
  }
}
const tagFold = async () => {
  if (notFullTag.value) {
    const { data: res } = await frontEndTag.getFullTagList()
    tagList.value = res.data
    notFullTag.value = false
  } else {
    const { data: res } = await frontEndTag.getTagList()
    tagList.value = res.data
    notFullTag.value = true
  }
}
</script>

<style scoped>
.index-main {
  min-width: 100%;
  margin-top: 10px;
}

.main-item-blog {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-right: 10px;

  .blog-card {
    background-color: rgba(255, 255, 255, 0.9);
    margin: 0 auto;
  }

  .blog-page {
    margin: 0 auto;
  }
}

.blog-card-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}

.blog-card-main {
  padding: 10px 0;
  height: auto;

  .main-blog-img {
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 5px;
    padding-right: 15px;

    .el-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      flex-shrink: 0;
    }

    :deep(.el-image__inner) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .main-blog-content {
    width: 100%;
    height: 150px;
    aspect-ratio: 5 / 1;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;

    h3 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      word-break: break-all;
    }
  }

  .blog-description {
    width: 100%;
    height: 100px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    word-break: break-all;
  }

  .blog-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .blog-info-user {
      display: flex;
      justify-content: space-around;

      .info-nickname {
        margin-left: 5px;
      }
    }

    .blog-info-date {
      margin: 0 15px;
      display: flex;
      align-items: center;
    }

    .blog-info-view {
      display: flex;
      align-items: center;
    }

    .blog-info-type {
      margin-left: auto;
    }
  }
}

.right-item-type,
.right-item-tag,
.right-item-recommend {
  margin-bottom: 20px;
}

.type-title,
.tag-title,
.recommend-title {
  margin-bottom: 10px;
}

.tag-view {
  display: flex;
  flex-wrap: wrap;
}

.tag-list {
  margin: 0 10px;
}

.type-list {
  display: flex;
  margin: 10px 0;
}
</style>