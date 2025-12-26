/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-09 13:42:18
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-25 09:08:08
 * @FilePath: \blog-front\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from 'vue-router'
const Client = () => import('../view/Client.vue')
const Index = () => import('../components/front-end/Index.vue')
const Login = () => import('../components/auth/login.vue')
const Register = () => import('../components/auth/register.vue')

const AdminManagement = () => import('../view/AdminManagement.vue')
const AdminIndex = () => import('../components/admin/Index.vue')
const AdminBlogs = () => import('../components/admin/Blogs.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Client,
      redirect: '/index',
      children: [
        {
          path: '/index',
          component: Index,
        },
      ],
    },
    {
      path: '/admin',
      component: AdminManagement,
      redirect: '/admin/index',
      children: [
        {
          path: '/admin/index',
          component: AdminIndex,
        },
        {
          path: '/admin/blogs',
          component: AdminBlogs,
        },
      ],
    },
  ],
})

export default router
