<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-18 09:24:01
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-03-12 14:20:47
 * @FilePath: \blog-front\src\view\Client.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <NavBar></NavBar>
    <!-- 主要内容 -->
    <el-main class="main-content">
      <router-view></router-view>
      <div class="welcome">
        <h1>Welcome to Myblog</h1>
        <p>This's an example Application built by Vue 3, Element Plus, Axios</p>

        <div class="action-buttons" v-if="!isLoggedIn">
          <el-button type="primary" size="large" @click="showLogin"> toLogin </el-button>
          <el-button size="large" @click="showRegister"> toRegister </el-button>
        </div>

        <div class="user-welcome" v-else>
          <el-result icon="success" title="Welcome Back" :sub-title="`Hello，${username}！`">
            <template #extra>
              <el-button type="primary" @click="goToDashboard"> get in Admin-end </el-button>
            </template>
          </el-result>
        </div>
      </div>
    </el-main>
    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="footer-content">
        <p>© 2025 Myblog. All rights reserved.</p>
      </div>
    </el-footer>

    <Login></Login>
    <Register></Register>
  </div>
</template>

<script setup>
import NavBar from '@/components/front-end/layout/NavBar.vue'
import { ref, computed } from 'vue'
import { useCounterStore } from '@/stores/counter'
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const stores = useCounterStore()

const isLoggedIn = computed(() => stores.isLoggedIn)
const username = computed(() => stores.username)

const showLogin = () => {
  stores.showLoginDialog()
}

const showRegister = () => {
  stores.showRegisterDialog()
}

const goToDashboard = () => {
  router.push('/admin')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  align-items: center;
  justify-content: center;
}

.welcome {
  text-align: center;
  max-width: 800px;
}

.welcome h1 {
  font-size: 48px;
  margin-bottom: 20px;
  color: #303133;
}

.welcome p {
  font-size: 18px;
  color: #606266;
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.user-welcome {
  max-width: 500px;
  margin: 0 auto;
}

.footer {
  background-color: #fafafa;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  text-align: center;
  color: #909399;
  font-size: 14px;
}</style>
