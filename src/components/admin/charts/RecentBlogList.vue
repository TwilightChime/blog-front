<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2026-01-26 15:50:37
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-02-05 17:11:41
 * @FilePath: \blog-front\src\components\admin\charts\RecentBlogList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-table :data="list" style="width: 100%; padding-top: 15px; height: 450px">
    <el-table-column label="最新博客" min-width="180">
      <template #default="props">
        <p class="title" @click="getBlogInfo(props.row.id)">
          {{ props.row.title }}
        </p>
      </template>
    </el-table-column>
    <el-table-column label="类型" width="100" align="center">
      <template #default="props">
        {{ props.row.type.name }}
      </template>
    </el-table-column>
    <el-table-column label="类别" width="100" align="center">
      <template #default="props">
        <el-tag>
          {{ props.row.flag }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { blogApi } from '@/api/blog';

const list = ref([])
let total = 0

onMounted(() => {
  getRecommendList()
})

const getRecommendList = async () => {
  const {data: res} = await blogApi.getRecommendList()
  list.value = res.data.slice(0, 5)
  total = res.total
}
// export default {
//   filters: {
//     statusFilter(status) {
//       const statusMap = {
//         success: 'success',
//         pending: 'danger'
//       }
//       return statusMap[status]
//     },
//     orderNoFilter(str) {
//       return str.substring(0, 30)
//     }
//   },
//   data() {
//     return {
//       list: null,
//       total:0
//     }
//   },
//   created() {
//     this.getRecommendList()
//   },
//   methods: {
//       // 获取最新博客列表
//       async getRecommendList() {
//         const {data: res} = await this.$blog.get('/getRecommendBlogList')
//         // console.log(res.data)
//         this.list = res.data.slice(0,5)
//         this.total = res.total
//       },
//       // 跳转到博客详情页
//       getBlogInfo(blogId) {
//           this.$router.push({path: '/blogInfo', query: {id: blogId}});
//       },
//   }
// }
</script>
<style scoped>
.title:hover {
  color: #3a8ee6;
  cursor: pointer;
}
</style>
