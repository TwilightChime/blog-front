<template>
    <el-dialog
        v-model="dialogVisible"
        title="login"
        width="400px"
        :before-close="handleClose"
        destroy-on-close>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" status-icon>
            <el-form-item label="user" prop="username">
                <el-input 
                    v-model="loginForm.username"
                    placeholder="username"
                    clearable
                    @keyup.enter="handleLogin">
                    <template #prefix>
                        <el-icon><User></User></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="password" prop="password">
                <el-input 
                    v-model="loginForm.password"
                    type="password"
                    placeholder="password"
                    show-password
                    clearable
                    @keyup.enter="handleLogin">
                    <template #prefix>
                        <el-icon><Lock></Lock></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="loginForm.rememberMe">rememberMe</el-checkbox>
                <el-link type="primary" @click="handleForgetPassword" :underline="false" style="float: right;">forgotPassword</el-link>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click="handleLogin" style="width: 100%;">
                    {{ loading ? '登录中...' : '登录' }}
                </el-button>
            </el-form-item>
            <el-form-item>
                <div>
                    <el-link type="primary" @click="switchToRegister" :underline="false">toRegister</el-link>
                </div>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script setup>
import { useCounterStore } from '../../stores/counter'
import { computed, reactive, ref, watch } from 'vue';
import { authApi } from '../../api/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
const stores = useCounterStore()
const dialogVisible = computed({
    get: () => stores.isLoginVisible,
    set: (value) => {
        if(!value){
            stores.hideAllDialog()
        }
    }
})
const loading = ref(false)
const loginFormRef = ref()
const loginForm = reactive({
    username: localStorage.getItem('rememberedUsername') || '',
    password: '',
    rememberMe: !!localStorage.getItem('rememberedUsername')
})
let user = {
    username:'', password:'', 
    loginProvince:'四川省', loginCity:'成都市', 
    loginLat:34.27, loginLng:108.08, //经度
}
const loginRules = {
    username: [
        {required: true, message: 'inputusername', trigger: 'blur'},
        {min: 3, max: 20, message: 'lengthofUsername is 3-20char', trigger: 'blur'}
    ],
    password: [
        {required: true, message: 'password', trogger: 'blur'},
        {min: 5, max: 20, message: 'lengthofPassword is 5-20char', trigger: 'blur'}
    ]
}
const handleLogin = async () => {
    if(!loginFormRef.value) return
    const valid = await loginFormRef.value.validate()
    if(!valid) return

    loading.value = true
    try{
        user.username = loginForm.username
        user.password = loginForm.password
        await authApi.login(user)
        if(loginForm.rememberMe){
            localStorage.setItem('rememberedUsername', loginForm.username)
        } else{
            localStorage.removeItem('rememberedUsername')
        }
        resetForm()
    } catch(error){
        console.error('falseLogin', error)
    } finally{
        loading.value = false
    }
}

const handleForgetPassword = () => {
    ElMessageBox.prompt('inputYourEmail', 'getBackPassword', {
        confirmButtonText: 'sentResetEmail',
        cancelButtonText: 'cancel',
        inputPattern: /\S+@\S+\.\S+/,
        inputErrorMessage: 'EmailPatternError'
    }).then(({ value }) => {
        
        ElMessage.success(`sent resetPassword at${value}`)
    }).catch(() => {
        
    })
}

const switchToRegister = () => {
    stores.hideAllDialog()
    stores.showRegisterDialog()
}

const resetForm = () => {
    loginForm.password = ''
    if(loginFormRef.value){
        loginFormRef.value.resetFields()
    }
}

const handleClose = (done) => {
    if(loading.value){
        ElMessage.warning('logining, wait a few')
        return
    }
    resetForm()
    done()
}

watch(dialogVisible, (visible) => {
    if(visible && loginFormRef.value){
        setTimeout(() => {
            resetForm()
        }, 0)
    }
})
</script>