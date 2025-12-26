<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-12 12:49:43
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-26 10:47:00
 * @FilePath: \blog-front\src\admin\Blogs.vue
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
                        <el-button size="mini" type="primary" @click="editPic(props.row)">
                          <i class="el-icon-edit"></i>
                        </el-button>
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
        <el-table-column label="Title" prop="title" />
        <el-table-column label="Category" prop="type.name" />
        <el-table-column label="Tag" prop="tags"></el-table-column>
        <el-table-column label="CountView" prop="views"></el-table-column>
        <el-table-column label="UpdateTime" prop="updateTime"></el-table-column>
        <el-table-column label="Edit">
          <template #default="props">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              cricle
              @click="editBlogById(props.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              cricle
              @click="removeBlogById(props.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { blogApi } from '@/api/blog'
import { useCounterStore } from '@/stores/counter'
const stores = useCounterStore()

const queryBlog = reactive({
  title: '',
  typeId: null,
})
const pagenum = ref(1)
const pagesize = ref(8)
const blogsList = ref([])
const type = ref('')

const getBlogList = async () => {
  const res = await blogApi.getBlogList({
    title: queryBlog.title,
    typeId: queryBlog.typeId,
    pagenum: pagenum.value,
    pagesize: pagesize.value,
  })
  console.log(res)
  blogsList.value = res.data.data.content
}

const clearSearch = () => {
  queryBlog.typeId = null
  queryBlog.title = ''
  type.value = ''
  getBlogList()
  stores.isLoginVisible = true
  console.log(stores.isLoginVisible)
}

onMounted(() => {
  getBlogList()
})
</script>
<style></style>
