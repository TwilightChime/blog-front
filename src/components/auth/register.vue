<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-22 16:21:01
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-02-26 18:32:52
 * @FilePath: \blog-front\src\components\auth\Register.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog v-model="dialogVisible" title="register" width="500px" :before-close="handleClose" destroy-on-close>
    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="100px" status-icon>
      <el-form-item label="nickname" prop="nickname">
        <el-input v-model="registerForm.nickname" placeholder="nickname(3-20)" clearable :prefix-icon="User"></el-input>
      </el-form-item>
      <el-form-item label="username" prop="username">
        <el-input v-model="registerForm.username" placeholder="username(3-20)" clearable :prefix-icon="User"></el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="password(5-20)" show-password clearable
          :prefix-icon="Lock"></el-input>
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model="registerForm.email" placeholder="email" clearable :prefix-icon="Message"></el-input>
      </el-form-item>
      <el-form-item label="avatar">
        <el-upload ref="uploadRef" :action="IMG.UPLOAD_AVATAR_REGISTER" list-type="picture-card" :limit="1" :file-list="fileList"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
        </el-upload>
        <el-dialog v-model="dialogImgVisible">
          <img width="100%" :src="dialogImgUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleRegister" style="width: 100%">
          {{ loading ? 'registering' : 'toregister' }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { User, Lock, Message, Iphone, Key } from '@element-plus/icons-vue'
import { useCounterStore } from '@/stores/counter'
import { authApi } from '@/api/auth'
import { ElMessage } from 'element-plus'
import { IMG } from '@/utils/constants'

const stores = useCounterStore()
let user = {
  username: '',
  nickname: '',
  avatar: '',
  email: '',
  password: '',
  type: 0,
  loginProvince: '',
  loginCity: '',
  loginLat: 0,
  loginLng: 0, //经度
}

const dialogVisible = computed({
  get: () => {
    return stores.isRegisterVisible
  },
  set: (value) => {
    if (!value) {
      stores.hideRegisterDialog()
    } else {
      stores.showRegisterDialog()
    }
  },
})

const registerFormRef = ref()
const registerForm = reactive({
  nickname: '',
  username: '',
  password: '',
  email: '',
})
const registerRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 3, max: 20, message: '昵称长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '昵称只能包含字母、数字、下划线和中文字符', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/, message: '密码必须包含大小写字母和数字', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效邮箱地址', trigger: 'blur' },
  ],
}

const dialogImgVisible = ref(false)
const fileList = ref([])
let dialogImgUrl = ''
const loading = ref(false)

const handleRegister = async () => {
  if (!registerFormRef.value) return
  const valid = await registerFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await fetch('http://ip-api.com/json/?fields=country,regionName,city,lat,lon,query')
      .then((res) => res.json())
      .then((data) => {
        user.loginProvince = data.regionName
        user.loginCity = data.city
        user.loginLat = data.lat
        user.loginLng = data.lon
      })
    user.avatar = dialogImgUrl.split(IMG.AVATAR_URL).join('')
    Object.assign(user, registerForm)
    console.log(user)
    await authApi.register(user)
    resetForm()
  } catch (error) {
    console.error('registerfalse', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (registerFormRef.value) {
    registerFormRef.value.resetFields()
  }
}

const handleClose = (done) => {
  if (loading.value) {
    ElMessage.warning('registering, wait a few')
    return
  }
  resetForm()
  done()
}

const handleRemove = () => {
  dialogImgUrl = ''
}

const handlePictureCardPreview = (file) => {
  // dialogImgUrl = file.url
  dialogImgVisible.value = true
}

const handleSuccess = (res) => {
  dialogImgUrl = IMG.AVATAR_URL + res.data
  fileList.value = [{url: dialogImgUrl}]
}

// watch(dialogVisible, (visible) => {
//   if (visible && registerFormRef.value) {
//     // 对话框显示时重置表单
//     setTimeout(() => {
//       resetForm()
//     }, 0)
//   }
// })
</script>
