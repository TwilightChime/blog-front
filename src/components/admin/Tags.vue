<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-29 16:57:15
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-01-15 17:17:18
 * @FilePath: \blog-front\src\components\admin\Tags.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>标签管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never">
      <el-button type="primary" style="margin-bottom: 20px" @click="dialogTagFromVisible = true">新建标签</el-button>
      <el-row :gutter="20">
        <el-col :sm="8" :lg="6" v-for="tag in tagList" style="margin-bottom: 20px" :key="tag.id">
          <el-card shadow="hover" style="position: relative; border: 2px solid #eee; text-align: left">
            <div class="op" style="position: absolute; right: 5px; top: 5px">
              <i @click="editTagById(tag.id)" class="el-icon-edit" style="color: #3a8ee6; margin-right: 5px"></i>
              <i @click="deleteTagById(tag.id)" class="el-icon-delete" style="color: red"></i>
            </div>
            <b>标签名称 <span style="color: #3a8ee6">{{ tag.name }}</span></b><br />
            <p style="margin-bottom: 0"> 博客数量 <span style="color: #2ac06d">{{ tag.blogs.length }}</span></p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="标签修改" v-model="dialogTagFromVisible">
      <el-form style="text-align: left" ref="dialogTagFormRef" :model="dialogTagForm" :rules="dialogTagFormRules" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="dialogTagForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backPage">取消</el-button>
        <el-button tag="primary" @click="createTag">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { tagApi } from '@/api/tagApi';
import { onMounted, reactive, ref } from 'vue';

const tagList = ref([])
const dialogTagFromVisible = ref(false)
const dialogTagFormRef = ref()
const dialogTagFormRules = {name: [{require: true, message: 'tag can not null', trigger: 'blur'}]}
const dialogTagForm = reactive({name: ''})
let tag = {id: null, name: ''}

const getTagList = async () => {
  const {data: res} = await tagApi.getTagList()
  tagList.value = res.data
}

onMounted(() => {
  getTagList()
})


</script>
