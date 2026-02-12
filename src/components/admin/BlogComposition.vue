<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-29 09:59:47
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-02-12 14:25:52
 * @FilePath: \blog-front\src\components\admin\BlogComposition.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>BlogComposition</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="5">
      <el-col :span="21">
        <el-input placeholder="title" v-model="blog.title"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button style="border-radius: 20px" type="danger" @click="publishBtn">publishBlog</el-button>
      </el-col>
    </el-row>
    <el-row>
      <mavon-editor v-model="blog.content" style="margin: 10px; min-height: 70vh" />
    </el-row>
    <el-dialog v-model="publishDialogVisible">
      <el-form :model="publishForm" :rules="publishFormRules" ref="publishFormRef">
        <el-form-item label="blog type" prop="type">
          <el-select placeholder="select type" size="small" v-model="publishForm.type" @change="setBlogType">
            <el-option v-for="type in typeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
          </el-select>
          <el-button size="small">+ new type</el-button>
        </el-form-item>
        <el-form-item lable="blog tags" prop="tags">
          <el-checkbox-group v-model="publishForm.tags">
            <el-checkbox v-for="tag in tagList" :label="tag.id" :key="tag.id">{{ tag.name }}</el-checkbox>  
          </el-checkbox-group>
          <el-button size="small">+ new tag</el-button>
        </el-form-item>
        <el-form-item label="blog flag" prop="flag">
          <el-select size="small" v-model="publishForm.flag">
            <el-option v-for="item in flags" :key="item.id" :label="item.label" :value="item.value"></el-option>  
          </el-select>
        </el-form-item>
        <el-form-item label="blog firstPicture">
          <el-upload ref="upLoad" :action="IMG.UPLOAD_URL" list-type="picture-card" :limit="1" 
            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSucess">
            <i class="el-icon-plus"></i>  
          </el-upload>
          <el-dialog v-model="dialogImgVisible">
            <img width="100%" :src="IMG.BASE_URL+dialogImageUrl" alt="blog picture">  
          </el-dialog>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancelPublish">cancel</el-button>
        <el-button @click="publishBlog" type="primary">publishBlog</el-button>  
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { blogApi } from '@/api/blog'
import { ElMessage } from 'element-plus'
import { tagApi } from '@/api/tagApi'
import { typeApi } from '@/api/typeApi'
import { useRoute, useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'
import { IMG } from '@/utils/constants'
const route = useRoute()
const router = useRouter()

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
  commentabled: true,
})
let dialogImageUrl = ''
const publishForm = reactive({
  type: {},
  tags: [],
  flag: '原创'
})
const publishFormRules = {
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  tags: [{ required: true, message: '请选择至少一种标签', trigger: 'blur' }],
  flag: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
}
const flags = ref([
  {value: "原创", label: "原创"},
  {value: "转载", label: "转载"},
  {value: "翻译", label: "翻译"}
])
const tagList = ref([])
const typeList = ref([])
const dialogImgVisible = ref(false)
const publishFormRef = ref()
const upLoad = ref()

const publishBtn = async () => {
  if (blog.id !== null) {
    const { data: res } = await blogApi.getBlog(blog)
    if (res.code !== 200) {
      return ElMessage.error('publishBlogfault')
    } else {
      publishDialogVisible.value = false
      router.go(-1)
      return ElMessage.success('publishBlog')
    }
  } else {
    const { data: resTag } = await tagApi.getTagList()
    const { data: resType } = await typeApi.getTypeList()
    tagList.value = resTag.data
    typeList.value = resType.data
    publishDialogVisible.value = true
  }
}

const cancelPublish = () => {
  upLoad.value.clearFiles()
  blog.firstPicture = ''
  publishDialogVisible.value = false
  publishFormRef.value.resetFields()
}

const publishBlog = async() => {
  if (!publishFormRef.value) return
  const valid = await publishFormRef.value.validate()
  if(!valid) return
  blog.firstPicture = dialogImageUrl
  blog.tagIds = publishForm.tags.toString().replace(/\[|]/g, '')
  blog.flag = publishForm.flag
  blog.user = useCounterStore().userInfo
  const {data: res} = await blogApi.getBlog(blog)
  if(res.code == 200) {
    publishDialogVisible.value = false
    return ElMessage.success('publishSucess')
  }else{
    publishDialogVisible.value = false
    return ElMessage.error('publishFault')
  }
}

const setBlogType = (res) => {
  blog.type = typeList.value.find(item => item.id === res)
}

const handlePictureCardPreview = (res) => {
  dialogImageUrl = res.url
  dialogImgVisible.value = true
}

const handleSucess = (res) => {
  dialogImageUrl = res.data
}

const handleRemove = () => {
  dialogImageUrl = ''
}

onMounted(() => {
  if (route.query.blog) {
    Object.assign(blog, JSON.parse(route.query.blog))
  }
})
</script>
