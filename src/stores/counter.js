/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-09 13:42:18
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-29 16:02:29
 * @FilePath: \blog-front\src\stores\counter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { removeToken } from '@/utils/token'
import { ElMessage } from 'element-plus'

export const useCounterStore = defineStore('user', {
  state: () => {
    return {
      token: localStorage.getItem('token') || '',
      userInfo: JSON.parse(localStorage.getItem('user')) || '',
      isLoginVisible: false,
      isRegisterVisible: false,
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '',
  },

  actions: {
    showLoginDialog() {
      this.isLoginVisible = true
    },
    showRegisterDialog() {
      this.isRegisterVisible = true
    },
    hideLoginDialog() {
      this.isLoginVisible = false
    },
    hideRegisterDialog() {
      this.isRegisterVisible = false
    },
    logout() {
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      this.userInfo = null
      removeToken()
      ElMessage.success('log out successly')
    },
  },
})
// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, doubleCount, increment }
// })
