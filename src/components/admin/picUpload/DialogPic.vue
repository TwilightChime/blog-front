<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2026-01-22 17:58:31
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-03-13 14:57:15
 * @FilePath: \blog-front\src\components\utils\DialogPic.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog v-model="dialogPicVisible">
    <el-upload class="upload-demo" drag :action="IMG.UPLOAD_URL" :headers="uploadHeaders" multiple>
      <el-icon><UploadFilled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png/ico文件，且不超过50MB</div>
    </el-upload>
    <Waterfall :gap="20" :col="3" :list="pictureList">
      <template #default="{item, index}">
        <div style="width: 100%;height: 100%">
          <LazyImg @click="selectPic(item.src)" :url="IMG.BASE_URL + item.src" />
          <span>{{item.name}}</span>
          <el-button size="small" type="danger" :icon="Delete" circle @click="delPicture(item, index)"></el-button>
        </div>
      </template>
    </Waterfall>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Delete, UploadFilled } from '@element-plus/icons-vue'
import { pictureApi } from '@/api/pictureApi'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { ElMessage } from 'element-plus';
import { useCounterStore } from '@/stores/counter';
import { IMG } from '@/utils/constants';
import { eventBus } from '@/utils/eventBus'

const pictureList = ref([])

const dialogPicVisible = ref(false)

onMounted(() => {
  getPictureList()
  eventBus.on('dialogPicVisible', acceptVisible)
})
onUnmounted(() => {
  eventBus.off('dialogPicVisible', acceptVisible)
})

const acceptVisible = (data) => {
  dialogPicVisible.value = data.visible
}
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

const selectPic = (picUrl) => {
  eventBus.emit('pic_url', {
    from: 'dialogPic',
    url: picUrl
  })
  dialogPicVisible.value = false
}

const delPicture = async (pic, index) => {
  const {data: res} = await pictureApi.delPicture(pic)
  if(res.code === 200) {
    pictureList.value.splice(index, 1)
    ElMessage.success('delete picture success')
  } else {
    ElMessage.error('delete fault')
  }
}
</script>

<style scoped>

</style>