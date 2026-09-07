/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-19 09:50:12
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-09-04 14:22:30
 * @FilePath: \blog-front\src\api\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'
import { removeToken, setToken } from '@/utils/token'
import { useCounterStore } from '@/stores/counter'
import { ElMessage } from 'element-plus'
import cryptoJs from 'crypto-js'

const salt = "ChillChime"
const hashedPassword = (pwd) => {
  return cryptoJs.SHA256(pwd + salt).toString()
}

export const authApi = {
  async login(loginForm) {
    try {
      loginForm.password = hashedPassword(loginForm.password)
      console.log(loginForm.password)
      const res = await request.post('/login', { user: loginForm })
      const token = res.data.data.token || res.data.data.accessToken
      const user = res.data.data.user
      const stores = useCounterStore()
      if (token) {
        setToken(token)
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        sessionStorage.setItem('user', JSON.stringify(user))
        stores.userInfo = user
      }
      stores.hideLoginDialog()
      stores.hideRegisterDialog()
      ElMessage.success('success')
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async register(registerForm) {
    try {
      const prevPwd = registerForm.password
      registerForm.password = hashedPassword(registerForm.password)
      const res = await request.post('/register', { user: registerForm })
      res.data.data.user.password = prevPwd
      await this.login(res.data.data.user)
      console.log(res)
      return Promise.resolve(res)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  logout() {
    const stores = useCounterStore()
    stores.token = ''
    stores.userInfo = null
    removeToken()
    ElMessage.success('退出登录成功')
  },

  getUserList() {
    return request.get('/admin/users')
  },

  updataUser(data) {
    return request.post('/admin/user', {user: data})
  },

  delUser(data) {
    return request.get(`/admin/users/${data}/delete`)
  },

  getUserAreaList() {
    return request.get('/admin/getUserAreaList')
  }
}
