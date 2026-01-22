<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-11 16:51:12
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-01-21 11:59:01
 * @FilePath: \blog-front\src\view\AdminManagement.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-container>
    <el-header class="admin-header">
      <div class="logo">
        <div @click="toggleCollapse">|||</div>
        <span>BlogManagementAdmin</span>
      </div>
      <div class="user-actions">
        <template v-if="!isLoggedIn">
          <el-button type="text" @click="showLogin">Login</el-button>
          <el-button type="primary" @click="showRegister">Register</el-button>
        </template>
        <template v-else>
          <el-dropdown @command="handleUserCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar" />
              <span class="username">{{ username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="personal">
                  <el-icon><User /></el-icon>Personal
                </el-dropdown-item>
                <el-dropdown-item command="front-end">
                  <el-icon><Setting /></el-icon>Back to Front-end
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>Log out
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
      <!-- <div class="loginInfo">
                <el-avatar :src="userInfo.avatar"></el-avatar>
                <div class="user-option">
                    <h3 class="web-font nickname">{{userInfo.nickname}}</h3>
                    <p class="logout" @click="logout">退出登录</p>
                </div>
            </div> -->
    </el-header>
    <el-container>
      <el-aside style="height: 100vh; width: 200px">
        <el-menu
          style="background-color: #d7e3fa"
          :default-active="activePath"
          @select="handMenuSelect"
          :collapse="isCollapse"
        >
          <!--            一级菜单-->
          <el-menu-item :index="item.path" v-for="item in menuList" :key="item.id">
            <el-icon><component :is="item.icon"></component></el-icon>
            <span>{{ item.authName }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    
  </el-container>
</template>

<script setup>
import { House, Notebook, User, EditPen, Collection, CollectionTag, MessageBox, Mug, Files, Avatar, Picture, Setting, SwitchButton, ArrowDown } from '@element-plus/icons-vue'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '../stores/counter'
const router = useRouter()
const stores = useCounterStore()

const menuList = [
  { id: 0, path: '/admin/index', authName: 'Index', icon: House},
  { id: 1, path: '/admin/blogs', authName: 'Blog', icon: Notebook},
  { id: 2, path: '/admin/users', authName: 'User', icon: User},
  { id: 3, path: '/admin/blog-input', authName: 'Composition', icon: EditPen},
  { id: 4, path: '/admin/types', authName: 'Category', icon: Collection},
  { id: 5, path: '/admin/tags', authName: 'Tag', icon: CollectionTag},
  { id: 6, path: '/admin/comments', authName: 'Comment', icon: MessageBox},
  { id: 7, path: '/admin/essays', authName: 'Article', icon: Mug},
  { id: 8, path: '/admin/projects', authName: 'Project', icon: Files},
  { id: 9, path: '/admin/administrator', authName: 'Personal', icon: Avatar},
  { id: 10, path: '/admin/pictures', authName: 'Picture', icon: Picture},
]
const isCollapse = ref(false)
const activePath = ref('')
const toggleCollapse = () => (isCollapse.value = !isCollapse.value)
const handMenuSelect = (index) => {
  activePath.value = index
  router.push(index)
}

const isLoggedIn = computed(() => stores.isLoggedIn)
const username = computed(() => stores.username)
const userInfo = computed(() => stores.userInfo || {})

const handleUserCommand = (command) => {
  switch (command) {
    case 'personal':
      router.push('/admin/administrator')
      break
    case 'front-end':
      router.push('/')
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
    // 用户取消
  }
}
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-dark) 100%);
  border-bottom: 1px solid var(--border-dark);
  height: 60px;

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-light);

    > div {
      cursor: pointer;
      margin-right: 10px;
      
      & :hover {
        background-color: aqua;
      }
    }
  }
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-dropdown{
  border-color: var(--border-dark);
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
  background-color: var(--border-dark);
  border-color: var(--border-dark);
}

.user-info .username {
  margin: 0 8px;
  font-size: 14px;
}
</style>
