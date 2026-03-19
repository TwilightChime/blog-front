<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-18 09:24:01
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-03-18 16:36:18
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
        <p>This's an example Application built by Vue 3, Element Plus, Axios</p>
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
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'

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
