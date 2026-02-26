<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-12 12:49:43
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-02-25 15:06:01
 * @FilePath: \blog-front\src\components\admin\Blogs.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">Index</el-breadcrumb-item>
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
      <el-table :data="blogsList" style="width: 100%" stripe>
        <el-table-column type="expand">
          <template #default="props">
            <el-row :gutter="20">
              <el-col :sm="12" :lg="8">
                <el-card>
                  <h1>BlogPicture
                    <el-button :icon="Edit" type="primary" @click="editPic(props.row)" circle></el-button>
                  </h1>
                  <el-image :src="IMG.BASE_URL + props.row.firstPicture"></el-image>
                </el-card>
              </el-col>
              <el-col :sm="12" :lg="8">
                <el-card>
                  <h1>Description</h1>
                  <div>{{ props.row.description }}</div>
                </el-card>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="Title" prop="title"> </el-table-column>
        <el-table-column label="Category" prop="type.name"> </el-table-column>
        <el-table-column label="Tag" prop="tags">
          <template #default="props">
            <el-tag size="small" v-for="(tag, i) in props.row.tags" :key="tag.id" closable @close="tagDel(i, props.row)">
              {{ tag.name }}
            </el-tag>
            <el-input size="small" style="width: 100px" class="input-new-tag" v-if="props.row.tagInputVisible"
              v-model="props.row.tagInputValue" ref="tagInputRef" @keyup.enter.native="tagInputConfirm(props.row)"
              @blur="tagInputConfirm(props.row)"></el-input>
            <el-button v-else size="small" class="button-new-tag" @click="tagShowInput(props.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column label="CountView" prop="views"></el-table-column>
        <el-table-column label="UpdateTime" prop="updateTime"></el-table-column>
        <el-table-column label="Edit">
          <template #default="props">
            <el-button type="primary" :icon="Edit" circle @click="editBlogById(props.row)"></el-button>
            <el-button type="danger" :icon="Delete" circle @click="removeBlogById(props.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="pageCurrentChange" :current-page="pageNum" @size-change="pageSizeChange"
        :page-size="pageSize" :total="totalCount" :page-sizes="[1, 2, 3, 4]"
        layout="total, sizes, prev, pager, next, jumper" background>
      </el-pagination>
    </el-card>
  </div>
</template>
<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { blogApi } from '@/api/blog'
import { tagApi } from '@/api/tagApi'
import { useCounterStore } from '@/stores/counter'
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { IMG } from '@/utils/constants'
const stores = useCounterStore()
const router = useRouter()

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
const tagInputRef = ref(null)

const getBlogList = async () => {
  const res = await blogApi.getBlogList({
    title: queryBlog.title,
    typeId: queryBlog.typeId,
    pagenum: pageNum.value,
    pagesize: pageSize.value,
  })
  blogsList.value = res.data.data.content
  totalCount.value = res.data.data.totalElements
}

const clearSearch = () => {
  queryBlog.typeId = null
  queryBlog.title = ''
  type.value = ''
  getBlogList()
  stores.isLoginVisible = true
}

const getFullTagList = async () => {
  const { data: res } = await tagApi.getTagList()
  tagList.value = res.data
}

onMounted(() => {
  getBlogList()
  getFullTagList()
})

const tagDel = async (i, row) => {
  const tag = row.tags[i]
  row.tags.splice(i, 1)
  row.tagIds = row.tags
    .map((item) => {
      return item.id
    })
    .toString()
    .replace(/\[|]/g, '')
  const { data: res } = await tagApi.tagUpdateBlog(row)
  if (res.code === 200) {
    const { data: res2 } = await tagApi.delBlogTag(tag)
    if (res2.flag === true) {
      return ElMessage.success('修改博客标签成功')
    } else {
      ElMessage.error('修改博客标签失败')
    }
  }
}

const tagInputConfirm = async (row) => {
  if ((row.tagInputValue || '').trim().length === 0) {
    row.tagInputValue = ''
    row.tagInputVisible = false
    return
  }
  const newTag = tagList.value.find((item) => item.name === row.tagInputValue.trim()) || ''
  if (newTag !== '') {
    if (row.tags.find((item) => item.name === newTag.name)) {
      row.tagInputValue = ''
      row.tagInputVisible = false
      return ElMessage.error('标签已存在.')
    }
    row.tags.push(newTag)
    row.tagIds = row.tags
      .map((item) => {
        return item.id
      })
      .toString()
      .replace(/\[|]/g, '')
    console.log(row)
    const { data: res } = await tagApi.tagUpdateBlog(row)
    if (res.flag === true) {
      row.tagInputValue = ''
      row.tagInputVisible = false
      getFullTagList()
      return ElMessage.success('修改博客标签成功！')
    } else {
      ElMessage.error('修改博客标签失败！')
    }
  } else {
    const { data: res1 } = await tagApi.createTag(row.tagInputValue.trim())
    console.log('完整响应:', res1)
    console.log('res.data类型:', typeof res1.data)
    console.log('res.data值:', res1.data)
    if (res1.data === null) {
      ElMessage.error('修改博客标签失败！')
    } else {
      row.tags.push(res1.data)
      row.tagIds = row.tags
        .map((item) => {
          return item.id
        })
        .toString()
        .replace(/\[|]/g, '')
      const { data: res2 } = await tagApi.tagUpdateBlog(row)
      if (res2.flag === true) {
        row.tagInputValue = ''
        row.tagInputVisible = false
        getFullTagList()
        return ElMessage.success('修改博客标签成功！')
      } else {
        ElMessage.error('修改博客标签失败！')
      }
    }
  }
}

const tagShowInput = (row) => {
  row.tagInputVisible = true
  nextTick(() => {
    tagInputRef.value.input.focus()
  })
}

const editBlogById = (row) => {
  console.log(row)
  router.push({
    path: '/admin/blog-input',
    query: {
      blog: JSON.stringify(row),
    },
  })
}

const removeBlogById = (id) => {
  ElMessageBox.confirm('Delete the blog forever, continue?', 'warning', {
    confirmButtonText: 'confirm',
    cancelButtonText: 'cancel',
    type: 'warning',
  })
    .then(async () => {
      const { data: res } = await blogApi.delBlog(id)
      if (res.code === 200) {
        getBlogList()
        ElMessage.success('delete blog success')
      }
    })
    .catch(() => {
      ElMessage.info('canceled delete')
    })
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
