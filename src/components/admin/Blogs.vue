<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-12 12:49:43
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-22 18:31:57
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
            <el-table :data="blogsList">
                <el-table-column prop="title" label="1"></el-table-column>
                <el-table-column prop="content"></el-table-column>
            </el-table>
        </el-card>
        
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { blogApi } from '@/api/blog'
import { useCounterStore } from '@/stores/counter';
const stores = useCounterStore()

    const queryBlog = ref({
        title: "",
        typeId: null,
    })
    const pagenum = ref(1)
    const pagesize = ref(8)
    const blogsList = ref([])
    const type = ref('')

    const getBlogList = async () => {
        const res = await blogApi.getBlogList({
            title: queryBlog.value.title,
            typeId: queryBlog.value.typeId,
            pagenum: pagenum.value,
            pagesize: pagesize.value
        })
        console.log(res)
        blogsList.value = res.data.data.content
    }
    const clearSearch = () => {
        queryBlog.value.typeId = null
        queryBlog.value.title = ''
        type.value = ''
        getBlogList()
        stores.isLoginVisible=true
        console.log(stores.isLoginVisible)
    }

    onMounted(() => {
        getBlogList()
    })
</script>
<style>
</style>