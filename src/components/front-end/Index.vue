<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-25 09:02:27
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-03-19 18:27:02
 * @FilePath: \blog-front\src\components\front-end\Index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-card shadow="none" id="welcomeId" class="welcome-card" ref="welcomeRef">
    <h1 class="welcome-title">
      欢迎来到Chimeの个人博客
      <div class="welcome-border"></div>
    </h1>
    <h2 class="welcome-introduction">{{ introduction }}</h2>
    <el-icon class="welcome-arrowdown" @click="arrowDownBrowse" size="30">
      <ArrowDown class="arrowdown-svg"></ArrowDown>
    </el-icon>
    <div style="position: absolute; bottom: 0%; height: 0%;" id="line"></div>
  </el-card>
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
              <el-image lazy :src="IMG.BASE_URL + blog.firstPicture" style="border-radius: 5px;flex-shrink: 0;"></el-image>
            </el-col>
            <el-col class="main-blog-content" :xs="24" :sm="16" @click="getBlogInfo(blog.id)">
              <h3>{{ blog.title }}</h3>
              <p class="blog-description">{{ blog.description }}</p>
              <div class="blog-info">
                <div class="blog-info-user">
                  <el-avatar size="small" :src="blog.user.avatar"></el-avatar>
                  <a href="#" class="info-nickname">{{ blog.user.nickname }}</a>
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
                  <el-tag effect="plain">{{ blog.type.name }}</el-tag>
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
            <li class="type-list" v-for="type in typeList" :key="type.id" @click="selectType(type.id)" :class="type.id === typeId ? 'activeType' : ''">
              <div style="display: flex;align-items: center">
                <el-image lazy :src="IMG.BASE_URL + type.pic_url" fit="cover" style="width: 28px;height: 28px;border-radius: 50%;margin-right: 10px"></el-image>
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
            <div class="tag-list" v-for="tag in tagList" :key="tag.id" @click="selectTag(tag.id)" :class="tag.id === tagId ? 'activeTag' : ''">
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
          <div class="recommend-list" v-for="blog in recommendBlogList" :key="blog.id"
            @click="getBlogInfo(blog.id)">
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
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { Back, Clock, View, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { eventBus } from '@/utils/eventBus';

const blogList = ref([])
const typeList = ref([])
const tagList = ref([])
const recommendBlogList = ref([])

const introduction = ref('')
const isFilterBlog = ref(false)
const titleBlog = ref('全部博客')

const welcomeRef = ref(null)
const scrollY = ref(0)
const activeSection = ref('welcomeId')

const pageNum = ref(1)
const pageSize = ref(8)
const pageLayout = "total, sizes, prev, pager, next, jumper"
const totalCount = ref(0)

const typeId = ref(-1)
const tagId = ref(-1)
const notFullType = ref(true)
const notFullTag = ref(true)

onMounted(() => {
  getBlogList()
  getTypeList()
  getTagList()
  getRecommendBlogList()
  welcomeIntroTimer()
  window.addEventListener('scroll', debouncedScroll(), { passive: true })
  handleScroll()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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

const handleScroll = () => {
  scrollY.value = window.scrollY
  const sections = ['welcomeId', 'indexId']
  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 100 && rect.bottom >= 100) {
        activeSection.value = section
        const welcomeHeight = welcomeRef.value?.offsetHeight || window.innerHeight
        const opacity = Math.min(scrollY.value / welcomeHeight * 1.5, 0.95)
        const blur = Math.min(scrollY.value / 100 * 5, 10)
        eventBus.emit('navbarStyle', {
          from: 'frontendIndex',
          data: {backgroundColor: `rgba(0, 0, 0, ${opacity})`, backdropFilter: `blur(${blur}px)`, boxShadow: scrollY.value > 50 ? '0 2px 20px rgba(0,0,0,0.1)' : 'none'}
        })
        break
      }
    }
  }
}
const debouncedScroll = () => {
  let timeoutId = null
  return () => {
    if (timeoutId) {
      cancelAnimationFrame(timeoutId)
    }
    timeoutId = requestAnimationFrame(() => {
      handleScroll()
    })
  }
}

//欢迎页组件
const welcomeIntroTimer = () => {
  let num = 0
  let str = '这是我的个人博客、会分享关于编程，开发以及其他方面的一些内容，希望可以对您有所帮助...'
  function timer() {
    introduction.value = introduction.value + str.slice(num, num + 1)
    num > str.length ? (num = 0, introduction.value = '') : num++
    setTimeout(timer, 200)
  }
  setTimeout(timer, 2000)
}
const arrowDownBrowse = () => {
  nextTick(() => {
    document.getElementById('line').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
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
.welcome-card {
  position: absolute;
  height: 100%;
  width: 96%;
  top: 10%;
  left: 2%;
  background-color: rgba(0, 0, 0, 0.1);
  border: 0px;
}

.welcome-title {
  position: relative;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  width: 700px;
  height: 100px;
  border: 2px solid #ffff;
  text-align: center;
  line-height: 100px;
  color: #ffff;
  font-size: 40px;
  font-weight: normal;
  letter-spacing: 10px;

  .welcome-border {
    width: 812px;
    height: 112px;
    position: absolute;
    top: -3px;
    left: -10px;
    border: 2px solid #ffff;
    animation: clipMe 5s linear infinite;
  }
}

.welcome-introduction {
  position: relative;
  top: 20%;
  text-align: center;
  color: #ffff;
}

.welcome-arrowdown {
  position: absolute;
  left: 50%;
  bottom: 20%;
  transform: translate(-50%, 0) scale(2);
  border: 1px solid rgb(255, 255, 255, 0.9);
  border-radius: 50%;

  .arrowdown-svg {
    transform: translate(0, 5%) scale(0.5);
    color: rgb(255, 255, 255, 0.9);
  }
}

@keyframes clipMe {

  0%,
  100% {
    clip: rect(0px, 806px, 6px, 0px);
  }

  25% {
    clip: rect(0px, 6px, 112px, 0px);
  }

  50% {
    clip: rect(112px, 812px, 112px, 0px);
  }

  75% {
    clip: rect(0px, 812px, 112px, 806px);
  }
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translate(-50%, 0);
  }

  40% {
    transform: translate(-50%, -30px);
  }

  60% {
    transform: translate(-50%, -15px);
  }
}

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
    padding-right: 15px;
  }
  .main-blog-content {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }

  .blog-description {
    width: 100%;
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

.right-item-type, .right-item-tag, .right-item-recommend {
  margin-bottom: 20px;
}

.type-title, .tag-title, .recommend-title {
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