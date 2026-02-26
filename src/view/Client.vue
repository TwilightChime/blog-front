<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-18 09:24:01
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-02-12 15:11:34
 * @FilePath: \blog-front\src\view\Client.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- <template>
  <div class="client-layout">
    <el-header>
      <template v-if="!isLoggedIn">
        <el-button @click="loginbtn">login</el-button>
        <el-button @click="registerbtn">register</el-button>
      </template>
      <template v-else>
        <el-button @click="accessAdmin">loggedIn</el-button>
      </template>
    </el-header>
    <el-main>Main</el-main>
    <el-footer>Footer</el-footer>
  </div>
  <login></login>
  <register></register>
</template>
<script setup>
import { useCounterStore } from '@/stores/counter'
import { computed } from 'vue'
import login from '@/components/auth/login.vue'
import register from '@/components/auth/register.vue'
import router from '@/router'

const stores = useCounterStore()
const isLoggedIn = computed(() => stores.isLoggedIn)
const loginbtn = () => {
  stores.showLoginDialog()
}
const registerbtn = () => {
  stores.showRegisterDialog()
}
const accessAdmin = () => {
  router.push('/admin')
}
</script> -->
<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="nav-container">
        <div class="logo">
          <el-icon><ElementPlus /></el-icon>
          <span>My Blog</span>
        </div>

        <div class="nav-menu">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="1">Index</el-menu-item>
            <el-menu-item index="2">Pro</el-menu-item>
            <el-menu-item index="3">About</el-menu-item>
          </el-menu>
        </div>

        <div class="user-actions">
          <template v-if="!isLoggedIn">
            <el-button type="text" @click="showLogin">Login</el-button>
            <el-button type="primary" @click="showRegister">Register</el-button>
          </template>

          <template v-else>
            <el-dropdown @command="handleUserCommand">
              <div class="user-info">
                <el-avatar :size="32" :src="IMG.AVATAR_URL+userInfo.avatar" />
                <span class="username">{{ username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>Personal
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>Setting
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>Logout
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </div>
    </el-header>

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
import { ref, computed } from 'vue'
import { ElementPlus, User, Setting, SwitchButton, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCounterStore } from '@/stores/counter'
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import { useRouter } from 'vue-router'
import { IMG } from '@/utils/constants'
const router = useRouter()
const activeIndex = ref('1')
const stores = useCounterStore()

const isLoggedIn = computed(() => stores.isLoggedIn)
const username = computed(() => stores.username)
const userInfo = computed(() => stores.userInfo || {})

const showLogin = () => {
  stores.showLoginDialog()
}

const showRegister = () => {
  stores.showRegisterDialog()
}

const handleSelect = (index) => {
  console.log('选中菜单:', index)
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = async () => {
  try {
    stores.logout()
    await router.push('/')
  } catch (error) {

  }
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

.header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 24px;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-info .username {
  margin: 0 8px;
  font-size: 14px;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
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
}
</style>
