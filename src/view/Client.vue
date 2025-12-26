<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-18 09:24:01
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-26 16:02:26
 * @FilePath: \blog-front\src\view\Client.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
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
</script>
