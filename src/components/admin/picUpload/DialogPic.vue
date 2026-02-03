<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2026-01-22 17:58:31
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-01-23 10:09:12
 * @FilePath: \blog-front\src\components\utils\DialogPic.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog v-model="dialogPicVisible">
    <el-upload class="upload-demo" drag action="http://localhost:8090/admin/images/upload" :headers="uploadHeaders" multiple>
      <el-icon><UploadFilled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png/ico文件，且不超过50MB</div>
    </el-upload>
    <Waterfall :gap="20" :col="3" :list="pictureList">
      <template #default="{item, index}">
        <div style="width: 100%;height: 100%">
          <LazyImg :url="item.src" />
          <span>{{item.name}}</span>
          <el-button size="small" type="danger" :icon="Delete" circle @click="delPicture(item, index)"></el-button>
        </div>
      </template>
    </Waterfall>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Delete, UploadFilled } from '@element-plus/icons-vue'
import { pictureApi } from '@/api/pictureApi'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { ElMessage } from 'element-plus';
import { useCounterStore } from '@/stores/counter';

const pictureList = ref([])
const dialogPicVisible = ref(false)

const getPictureList = async () => {
  const {data: res} = await pictureApi.getPictureList()
  pictureList.value = res.data
}

const uploadHeaders = computed(() => {
  const token = useCounterStore().token
  const headers = {
    'X-Request-ID': Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  if(token) {
    headers['token'] = token
  }
  return headers
})

const delPicture = async (pic, index) => {
  const {data: res} = await pictureApi.delPicture(pic)
  if(res.code === 200) {
    pictureList.value.splice(index, 1)
    ElMessage.success('delete picture success')
  } else {
    ElMessage.error('delete fault')
  }
}

onMounted(() => {
  getPictureList()
})
</script>

<style scoped>

</style>