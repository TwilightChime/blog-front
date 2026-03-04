<template>
  <div>
    <!-- <div class="animate__animated animate__fadeIn title" :key="key" :style="{'background-image': bgUrl}"></div> -->
    <el-header>
      <div class="nav-container">
        <div class="logo"><el-icon>
            <ElementPlus />
          </el-icon>
          <span>My Blog</span>
        </div>
        <div class="nav-menu">
          <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
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
                <el-avatar :size="32" :src="IMG.AVATAR_URL + userInfo.avatar" />
                <span class="username">{{ username }}</span>
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon>
                      <User />
                    </el-icon>Personal
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon>
                      <Setting />
                    </el-icon>Setting
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>Logout
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </div>
    </el-header>
    <div class="title"
      :style="{ 'background-image': `url(http://localhost:8090/uploads/backgroundImage/93d8f36e-dbd5-48b0-bab0-3a145703efef..png)` }">
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { ElementPlus, User, Setting, SwitchButton, ArrowDown } from '@element-plus/icons-vue'
import { useCounterStore } from '@/stores/counter'
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
  console.log(stores.isLoginVisible)
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
.title {
  position: relative;
  top: 0;
  width: 100%;
  height: 110vh;
  background-repeat: no-repeat;
  background-size: cover;
  border-bottom: 3px solid #fff;
  z-index: -100;
}

.el-header {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid #404045;
  padding: 0;
  z-index: 1000;
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

  .el-menu {
    border: 0px;
    background-color: rgba(0, 0, 0, 0);

    .el-menu-item {
      color: #d8e0e8;
    }
  }
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
}</style>