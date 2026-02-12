<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2026-01-26 15:50:37
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-02-12 14:47:36
 * @FilePath: \blog-front\src\components\admin\charts\CommentList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-table :data="commentlist" class="comment-list" style="width: 100%; padding-top: 15px; height: 450px; overflow: auto">
    <el-table-column label="最新评论">
      <template #default="props">
        <div style="display: flex">
          <el-avatar :src="IMG.BASE_URL+props.row.avatar" style="flex-shrink: 0"></el-avatar>
          <div class="content" style="margin-left: 10px">
            <div style="display: flex; justify-content: space-between; width: 100%">
              <div class="nkname">
                <span class="name">{{ props.row.nickname }} </span>
                <span class="date">{{ props.row.createTime }}</span>
              </div>
            </div>
            <p class="reply">{{ props.row.content }}</p>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { commentApi } from '@/api/commentApi';
import { onMounted, ref } from 'vue';
import { IMG } from '@/utils/constants'
let editing = false
const commentlist = ref([])
let title = '最新评论'

onMounted(() => {
  getCommentList()
})

const getCommentList = async () => {
  const { data: res } = await commentApi.getCommentList()
  commentlist.value = res.data
}
const deleteCommentById = async (id) => {
  const { data: res } = await commentApi.delComment()
}
</script>
