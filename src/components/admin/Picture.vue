<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2026-01-20 18:23:06
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-09-21 15:30:28
 * @FilePath: \blog-front\src\components\admin\Picture.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="page-img">
    <el-upload class="upload-img" drag :action="IMG.UPLOAD_URL" :headers="uploadHeaders" multiple>
      <el-icon><UploadFilled /></el-icon>
      <div class="upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="upload__tip" slot="tip">只能上传jpg/png/ico文件，且不超过50MB</div>
    </el-upload>
    <Waterfall class="waterfall-img" :gap="20" :col="3" :list="pictureList">
      <template #default="{item, index}">
        <div class="img-area__item">
          <LazyImg :url="IMG.STORAGE_URL+item.file_path" />
          <div class="item-img__footer">
            <span>{{item.name}}</span>
            <el-button size="small" type="danger" :icon="Delete" circle @click="delPicture(item, index)"></el-button>
          </div>
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Delete, UploadFilled } from '@element-plus/icons-vue'
import { pictureApi } from '@/api/pictureApi'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { ElMessage } from 'element-plus';
import { useCounterStore } from '@/stores/counter';
import { IMG } from '@/utils/constants';

const pictureList = ref([])

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
.page-img {
  display: flex;
  flex-direction: column;
}

.upload-img {
  min-width: 400px;
  max-width: 80%;
}
.upload-img :deep(.el-upload-dragger){
  background-color: var(--bg-card);
  border-color: var(--border-dark);
  
}

.waterfall-img {
  background-color: var(--bg-card);

  .img-area__item {
    display: flex;
    flex-direction: column;
    padding: 7px;
    background-color: var(--bg-area);
    border-radius: 5px;
    color: var(--text-light);

    .item-img__footer {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      background-color: var(--hover-color);
      padding: 0 4px 4px 4px;
      
      >span {
        word-break: break-all;
        margin: 4px 0 4px 0;
        
      }

      .el-button {
        align-self: end;
      }
    }
  }
}
</style>