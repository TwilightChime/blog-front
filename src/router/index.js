/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-09 13:42:18
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-17 11:00:28
 * @FilePath: \blog-front\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from 'vue-router'
const AdminManagement = () => import('../view/AdminManagement.vue')
const Index = () => import('../components/admin/Index.vue')
const Blog = () => import('../components/admin/Blogs.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminManagement,
      children: [
        {
          path: '/admin/index',
          component: Index
        },{
          path: '/admin/blogs',
          component: Blog
        }
      ]
    }
  ],
})

export default router
