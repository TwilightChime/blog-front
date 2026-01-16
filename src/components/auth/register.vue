<template>
  <el-dialog v-model="dialogVisible" title="register" width="500px" :before-close="handleClose" destroy-on-close>
    <el-form ref="registerFormRef" :model="registerForm" :ruler="registerRules" label-width="100px" status-icon>
      <el-form-item label="username" prop="username">
        <el-input v-model="registerForm.username" palaceholder="username(3-20)" clearable>
          <template #prefix>
            <el-icon><User></User></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="password(5-20)" show-password clearable>
          <template #prefix>
            <el-icon><Lock></Lock></el-icon>
          </template>
        </el-input>
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

const registerFormRef = ref()
const loading = ref(false)
const stores = useCounterStore()
const registerForm = reactive({
  username: '',
  password: '',
})

let user = {
  username: '',
  nickname: 'safsdd',
  avatar: '',
  email: '423523234@qq.com',
  password: '',
  type: 1,
  loginProvince: '四川省',
  loginCity: '成都市',
  loginLat: 34.27,
  loginLng: 108.08, //经度
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

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/,
      message: '密码必须包含大小写字母和数字',
      trigger: 'blur',
    },
  ],
}
const handleRegister = async () => {
  if (!registerFormRef.value) return
  const valid = await registerFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    user.username = registerForm.username
    user.password = registerForm.password
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

watch(dialogVisible, (visible) => {
  if (visible && registerFormRef.value) {
    // 对话框显示时重置表单
    setTimeout(() => {
      resetForm()
    }, 0)
  }
})
</script>
