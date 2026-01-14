<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-29 16:56:39
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-01-14 18:31:27
 * @FilePath: \blog-front\src\components\admin\Categories.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never">
      <el-button type="primary" @click="createType">新建分类</el-button>
      <el-table :data="typeList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="图片" prop="pic_url" width="150px">
          <template #default="props">
            <el-image :src="props.row.pic_url"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="name"></el-table-column>
        <el-table-column label="博客数量" prop="blogs.length"></el-table-column>
        <el-table-column label="操作">
          <template #default="props">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="editTypeDialog(props.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeType(props.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分类修改" v-model="dialogTypeFormVisible">
      <el-form style="text-align: left" ref="dialogTypeFormRef" :model="dialogTypeForm" :rules="dialogTypeFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dialogTypeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
            ref="upload"
            action="http://localhost:8090/upload"
            list-type="picture-card"
            :limit="1"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog v-model="dialogImgVisible">
            <img width="100%" :src="dialogImgUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="commitType">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { typeApi } from '@/api/typeApi';
import { onMounted, ref } from 'vue';


const typeList = ref([])

const getTypeList = async() => {
  const {data: res} = await typeApi.getTypeList()
  typeList.value = res.data
}
onMounted(() => {
  getTypeList
})
</script>
