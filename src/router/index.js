/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-09 13:42:18
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-29 18:22:39
 * @FilePath: \blog-front\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from 'vue-router'

const Client = () => import('../view/Client.vue')
const Index = () => import('../components/front-end/Index.vue')

const AdminManagement = () => import('../view/AdminManagement.vue')
const AdminIndex = () => import('../components/admin/Index.vue')
const AdminBlogs = () => import('../components/admin/Blogs.vue')
const Administrator = () => import('../components/admin/Administrator.vue')
const BlogComposition = () => import('../components/admin/BlogComposition.vue')
const Categories = () => import('../components/admin/Categories.vue')
const Tags = () => import('../components/admin/Tags.vue')
const AdminProjects = () => import('../components/admin/Projects.vue')
const AdminArticles = () => import('../components/admin/Articles.vue')
const Comments = () => import('../components/admin/Comments.vue')
const AdminUsers = () => import('../components/admin/Users.vue')

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
        {
          path: '/admin/users',
          component: AdminUsers,
        },
        {
          path: '/admin/blog-input',
          component: BlogComposition,
        },
        {
          path: '/admin/types',
          component: Categories,
        },
        {
          path: '/admin/tags',
          component: Tags,
        },
        {
          path: '/admin/comments',
          component: Comments,
        },
        {
          path: '/admin/essays',
          component: AdminArticles,
        },
        {
          path: '/admin/projects',
          component: AdminProjects,
        },
        {
          path: '/admin/administrator',
          component: Administrator,
        }
      ],
    },
  ],
})

export default router
