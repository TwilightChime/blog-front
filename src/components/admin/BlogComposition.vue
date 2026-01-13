<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-29 09:59:47
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-01-13 11:21:38
 * @FilePath: \blog-front\src\components\admin\BlogComposition.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path: '/admin'}">Index</el-breadcrumb-item>
      <el-breadcrumb-item>BlogComposition</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="5">
      <el-col :span="21">
        <el-input placeholder="title" v-model="blog.title"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button style="border-radius: 20px;" type="danger" @click="publishBtn">publishBlog</el-button>
      </el-col>
    </el-row>
    <el-row>
      <mavon-editor v-model="blog.content" style="margin: 10px;min-height: 70vh"/>
    </el-row>
    <el-dialog v-model="publishDialogVisible">
      <el-form :model="publishForm" :rules="publishFormRules" ref="publishFormRef">
        <el-form-item label="blog type" prop="type">
          <el-select placeholder="select type">
            <el-option :for="type in typeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
          </el-select>
          <el-button>+ new type</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { blogApi } from '@/api/blog'
import { ElMessage } from 'element-plus';
import { tagApi } from '@/api/tagApi';
import { typeApi } from '@/api/typeApi'
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()

const content = ref(``)
const publishDialogVisible = ref(false)
const blog = reactive({
  id: null,
  title: '',
  content: '',
  flag: '',
  type: {},
  tagIds: '',
  firstPicture: '',
  appreciation: 0,
  user: {},
  views: 0,
  commentabled: true
})
const tagList = ref([])
const typeList = ref([])

const publishBtn = async() => {
  if(blog.id !== null) {
    const {data: res} = await blogApi.getBlog(blog)
    if (res.code !== 200){
      return ElMessage.error('publishBlogfault')
    }else{
      publishDialogVisible.value = false
      router.go(-1);
      return ElMessage.success('publishBlog')
    }
  }else {
    const {data: resTag} = await tagApi.getTagList()
    const {data: resType} = await typeApi.getTypeList()
    tagList.value = resTag.data
    typeList.value = resType.data
    publishDialogVisible = true
  }
}

onMounted(() => { 
  if(route.query.blog){
    Object.assign(blog, JSON.parse(route.query.blog))
  }
  console.log(blog)
})
</script>