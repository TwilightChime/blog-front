<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-11 16:51:12
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-25 17:39:55
 * @FilePath: \blog-front\src\view\AdminManagement.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-container>
    <el-header class="header-admin">
      <div>
        <div style="cursor: pointer" @click="toggleCollapse">|||</div>
        <span>BlogManagementAdmin</span>
      </div>
      <el-avatar></el-avatar>
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
import { computed, reactive, ref } from 'vue'
import { useCounterStore } from '../stores/counter'

const stores = useCounterStore()
const menulist = [
  { id: 0, path: '/admin/index', authName: 'Index' },
  { id: 1, path: '/admin/blogs', authName: 'Blog' },
  { id: 2, path: '/admin/users', authName: 'User' },
  { id: 3, path: '/admin/blog-input', authName: 'Composition' },
  { id: 4, path: '/admin/types', authName: 'Category' },
  { id: 5, path: '/admin/tags', authName: 'Tag' },
  { id: 6, path: '/admin/comments', authName: 'Comment' },
  { id: 7, path: '/admin/essays', authName: 'Article' },
  { id: 8, path: '/admin/projects', authName: 'Project' },
  { id: 9, path: '/admin/administrator', authName: 'Personal' },
  // {id: 10, path: '/admin/pictures', authName: '图片管理'},
]
const isCollapse = ref(false)
const activePath = ref('')
const toggleCollapse = () => (isCollapse.value = !isCollapse.value)
const handMenuSelect = (index) => {
  activePath.value = index
  router.push(index)
}
</script>

<style>
.header-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  background: linear-gradient(135deg, #141414 0%, #1f1f1f 100%);
  border-bottom: 1px solid #303030;
  height: 60px;
  color: #e0e0e0;
  > div {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
