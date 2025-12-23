<template>
    <el-container>
        <el-header>
            <div style="cursor: pointer;" @click="toggleCollapse">|||
            </div>
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
                <el-menu style="background-color:#d7e3fa"
                    :default-active="activePath"
                    @select="handMenuSelect"
                    :collapse="isCollapse"
                    active-text-color="#409FFF">
                    <!--            一级菜单-->
                    <el-menu-item :index="item.path" v-for="item in menulist" :key="item.id">
                        <!-- <i :class="iconsObj[item.id]"></i> -->
                        <span>{{item.authName}}</span>
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
    {id: 0, path: '/admin/index', authName: '后台首页'},
    {id: 1, path: '/admin/blogs', authName: '博客管理'},
    {id: 2, path: '/admin/users', authName: '用户管理'},
    {id: 3, path: '/admin/blog-input', authName: '撰写博客'},
    {id: 4, path: '/admin/types', authName: '分类管理'},
    {id: 5, path: '/admin/tags', authName: '标签管理'},
    {id: 6, path: '/admin/comments', authName: '评论管理'},
    {id: 7, path: '/admin/essays', authName: '随笔管理'},
    {id: 8, path: '/admin/projects', authName: '项目管理'},
    {id: 9, path: '/admin/administrator', authName: '个人中心'},
    // {id: 10, path: '/admin/pictures', authName: '图片管理'},
])
const isCollapse = ref(false)
const activePath = ref('')
const toggleCollapse = ref(() => {
    isCollapse.value = !isCollapse.value
    stores.isLoginVisible = !stores.isLoginVisible
    // stores.isRegisterVisble = !stores.isRegisterVisble
})
const handMenuSelect = ref(
    (index) => {
        activePath.value = index;
        router.push(index)
    }
)
// 监听路由变化
// router.afterEach((to) => {
//     currentRoute.value = to;
//     activePath.value = to.path;  // 根据路由路径更新选中菜单
// });
// export default {
//     data() {
//         return {
//             menulist: [
//                 {id: 0, path: '/admin/index', authName: '后台首页'},
//                 {id: 1, path: '/admin/blogs', authName: '博客管理'},
//                 {id: 2, path: '/admin/users', authName: '用户管理'},
//                 {id: 3, path: '/admin/blog-input', authName: '撰写博客'},
//                 {id: 4, path: '/admin/types', authName: '分类管理'},
//                 {id: 5, path: '/admin/tags', authName: '标签管理'},
//                 {id: 6, path: '/admin/comments', authName: '评论管理'},
//                 {id: 7, path: '/admin/essays', authName: '随笔管理'},
//                 {id: 8, path: '/admin/projects', authName: '项目管理'},
//                 {id: 9, path: '/admin/administrator', authName: '个人中心'},
//                 // {id: 10, path: '/admin/pictures', authName: '图片管理'},
//             ],
//             iconsObj: {
//                 '0': 'iconfont icon-menu_home',
//                 '1': 'iconfont icon-huaban',
//                 '2': 'iconfont icon-guanyuwo1',
//                 '3': 'iconfont icon-jilu',
//                 '4': 'iconfont icon-leimupinleifenleileibie2',
//                 '5': 'iconfont icon-biaoqian',
//                 '6': 'iconfont icon-pinglun',
//                 '7': 'iconfont icon-jilu2',
//                 '8': 'iconfont icon-houtaiguanli',
//                 '9': 'iconfont icon-gerenzhongxin1',
//                 // '10':'iconfont icon-jinengliang',
//             },
//             isCollapse: false,
//             // 被激活的动态地址
//             activePath: '',
//             userInfo: {
//                 avatar: ''
//             },
//             screenWidth : document.documentElement.clientWidth
//         }
//     },
//     created() {
//         window.addEventListener('resize', this.screenAdapter)
//         this.activePath = window.sessionStorage.getItem('activePath')
//         this.userInfo = JSON.parse(window.sessionStorage.getItem('user'))
//     },
//     methods: {
//         calculateStyle(){
//             if(this.expandFlag===true){
//                 return '150'
//             } else {
//                 return '64'
//             }
//         },
//         logout() {
//             window.sessionStorage.clear()
//             this.$store.commit('getUserInfo')
//             this.$router.push('/')
//         },

//         toggleCollapse() {
//             this.isCollapse = !this.isCollapse
//         },
//         // 屏幕尺寸变化的监听函数
//         screenAdapter(){
//             this.screenWidth = document.documentElement.clientWidth;
//         }
//     },

// }
</script>

<style>

</style>
