<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-11 16:51:12
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-24 18:02:07
 * @FilePath: \blog-front\src\view\AdminManagement.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-container>
    <el-header>
      <div style="cursor: pointer" @click="toggleCollapse">|||</div>
      <div>
        <span>BlogManagementAdmin</span>
      </div>
      <login></login>
      <register></register>
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
          active-text-color="#409FFF"
        >
          <!--            一级菜单-->
          <el-menu-item :index="item.path" v-for="item in menulist" :key="item.id">
            <!-- <i :class="iconsObj[item.id]"></i> -->
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
import router from '@/router'
import { ref } from 'vue'
import { useCounterStore } from '../stores/counter'
import login from '../components/auth/login.vue'
import register from '@/components/auth/register.vue'

const stores = useCounterStore()
const menulist = ref([
  { id: 0, path: '/admin/index', authName: '后台首页' },
  { id: 1, path: '/admin/blogs', authName: '博客管理' },
  { id: 2, path: '/admin/users', authName: '用户管理' },
  { id: 3, path: '/admin/blog-input', authName: '撰写博客' },
  { id: 4, path: '/admin/types', authName: '分类管理' },
  { id: 5, path: '/admin/tags', authName: '标签管理' },
  { id: 6, path: '/admin/comments', authName: '评论管理' },
  { id: 7, path: '/admin/essays', authName: '随笔管理' },
  { id: 8, path: '/admin/projects', authName: '项目管理' },
  { id: 9, path: '/admin/administrator', authName: '个人中心' },
  // {id: 10, path: '/admin/pictures', authName: '图片管理'},
])
const isCollapse = ref(false)
const activePath = ref('')
const toggleCollapse = ref(() => {
  isCollapse.value = !isCollapse.value
  // stores.isLoginVisible = !stores.isLoginVisible
  stores.isRegisterVisble = !stores.isRegisterVisble
})
const handMenuSelect = ref((index) => {
  activePath.value = index
  router.push(index)
})
</script>

<style></style>
