<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-12 12:49:43
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-01-04 08:56:59
 * @FilePath: \blog-front\src\components\admin\Blogs.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }"></el-breadcrumb-item>
      <el-breadcrumb-item>blogmanagement</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div>
        <h1>BlogManagement</h1>
      </div>
      <el-input aria-placeholder="title" v-model="queryBlog.title"></el-input>
      <el-button @click="clearSearch">clear</el-button>
      <el-button type="primary" @click="getBlogList">search</el-button>
      <!-- <el-table :data="blogsList">
        <el-table-column prop="title" label="1"></el-table-column>
        <el-table-column prop="content"></el-table-column>
      </el-table> -->
      <el-table :data="blogsList" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div>
              <el-row :gutter="20">
                <el-col :sm="12" :lg="8">
                  <el-card>
                    <div>
                      <h1>
                        BlogPicture
                        <el-button
                          :icon="Edit"
                          type="primary"
                          @click="editPic(props.row)"
                          circle
                        ></el-button>
                      </h1>
                      <el-image :src="props.row.firstPicture"></el-image>
                    </div>
                  </el-card>
                </el-col>
                <el-col :sm="12" :lg="8">
                  <el-card>
                    <h1>Description</h1>
                    <div>{{ props.row.description }}</div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Title" prop="title"> </el-table-column>
        <el-table-column label="Category" prop="type.name"> </el-table-column>
        <el-table-column label="Tag" prop="tags">
          <template #default="props">
            <el-tag
              size="medium"
              v-for="(tag, i) in props.row.tags"
              :key="tag.id"
              closable
              @close="tagClose(i, props.row)"
            >
              {{ tag.name }}
            </el-tag>
            <el-input
              size="small"
              style="width: 100px"
              class="input-new-tag"
              v-if="props.row.tagInputVisible"
              v-model="props.row.tagInputValue"
              ref="saveTagInput"
              @keyup.enter.native="tagInputConfirm(props.row)"
              @blur="tagInputConfirm(props.row)"
            >
            </el-input>
            <el-button v-else size="mini" class="button-new-tag" @click="tagShowInput(props.row)"
              >+ New Tag
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="CountView" prop="views"></el-table-column>
        <el-table-column label="UpdateTime" prop="updateTime"></el-table-column>
        <el-table-column label="Edit">
          <template #default="props">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              @click="editBlogById(props.row)"
            ></el-button>
            <el-button
              type="danger"
              :icon="Delete"
              circle
              @click="removeBlogById(props.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="pageCurrentChange"
        :current-page="pageNum"
        @size-change="pageSizeChange"
        :page-size="pageSize"
        :total="totalCount"
        :page-sizes="[1, 2, 3, 4]"
        layout="total, sizes, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { blogApi } from '@/api/blog'
import { tagApi } from '@/api/tagApi'
import { useCounterStore } from '@/stores/counter'
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
const stores = useCounterStore()

const queryBlog = reactive({
  title: '',
  typeId: null,
})
const pageNum = ref(1)
const pageSize = ref(1)
const totalCount = ref(0)
const blogsList = ref([])
const type = ref('')
const tagList = ref([])

const getBlogList = async () => {
  const res = await blogApi.getBlogList({
    title: queryBlog.title,
    typeId: queryBlog.typeId,
    pagenum: pageNum.value,
    pagesize: pageSize.value,
  })
  console.log(res)
  blogsList.value = res.data.data.content
  totalCount.value = res.data.data.totalElements
}

const clearSearch = () => {
  queryBlog.typeId = null
  queryBlog.title = ''
  type.value = ''
  getBlogList()
  stores.isLoginVisible = true
  console.log(stores.isLoginVisible)
}

const getFullTagList = async () => {
  const {data: res} = await tagApi.getTagList()
  tagList.value = res.data
}

onMounted(() => {
  getBlogList()
  getFullTagList()
})

const tagInputConfirm = async (row) => {
  if (row.tagInputValue.trim().length === 0) {
    row.tagInputValue = ''
    row.tagInputVisible = false
    return
  }
  const newTag = tagList.value.find((item) => item.name === row.tagInputValue.trim())
  if (newTag !== undefined) {
    row.tags.push(newTag)
    row.tagIds = row.tags
      .map((item) => {
        return item.id
      })
      .toString()
      .replace(/\[|]/g, '')
    console.log(row)
    const {data: res} = await tagApi.tagUpdateBlog(row)
    if (res.data === true) {
      row.tagInputValue = ''
      row.tagInputVisible = false
      return ElMessage.success('修改博客标签成功！')
    } else {
      ElMessage.error('修改博客标签失败！')
    }
  } else {
    const {data: res1} = await tagApi.createTag(row.tagInputValue.trim())
    if (res1.data == null) {
      ElMessage.error('修改博客标签失败！')
    } else {
      row.tags.push(res1.data)
      row.tagIds = row.tags
        .map((item) => {
          return item.id
        })
        .toString()
        .replace(/\[|]/g, '')
      const {data: res2} = await tagApi.tagUpdateBlog(row)
      if (res2.data === true) {
        row.tagInputValue = ''
        row.tagInputVisible = false
        return ElMessage.success('修改博客标签成功！')
      } else {
        ElMessage.error('修改博客标签失败！')
      }
    }
  }
}

const tagShowInput = (row) => {
  row.tagInputVisible = true
}

const pageSizeChange = (newValue) => {
  pageSize.value = newValue
  getBlogList()
}
const pageCurrentChange = (newValue) => {
  pageNum.value = newValue
  getBlogList()
}
</script>
<style></style>
