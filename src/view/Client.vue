<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-18 09:24:01
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-09-01 11:59:35
 * @FilePath: \blog-front\src\view\Client.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home">
    <!-- 导航栏 -->
    <NavBar></NavBar>
    <!-- 主要内容 -->
    <section v-if="currentPath === '/index'">
      <div class="title"
        :style="{ 'background-image': `url(http://localhost:8080/uploads/backgroundImage/93d8f36e-dbd5-48b0-bab0-3a145703efef..png)` }">
      </div>
      <el-card shadow="never" id="welcomeId" class="welcome">
        <h1 class="welcome__title">
          欢迎来到Chimeの个人博客
          <div class="welcome__border-animation"></div>
        </h1>
        <h2 class="welcome__subtitle">{{ introduction }}</h2>
        <el-icon class="welcome__scroll-btn" @click="arrowDownBrowse" size="30">
          <ArrowDown class="welcome__svg"></ArrowDown>
        </el-icon>
        <div id="line" class="welcome__division-line"></div>
      </el-card>
    </section>
    <el-main class="main-content">
      <router-view></router-view>
      <div>
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
import { useRoute } from 'vue-router';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { eventBus } from '@/utils/eventBus';
import { ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const currentPath = computed(() => route.path)

const introduction = ref('')

const scrollY = ref(0)
const isWheelScroll = ref(false)

onMounted(() => {
  welcomeIntroTimer()
  handleScroll()
  window.addEventListener('scroll', debouncedScroll, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: false })
  window.addEventListener('wheel', wheelScrollDown, { passive: false })
})
onUnmounted(() => {
  window.removeEventListener('scroll', debouncedScroll)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('wheel', wheelScrollDown)
})

//顶部导航栏背景色渐变
const handleScroll = () => {
  scrollY.value = window.scrollY
  const element = document.getElementById('welcomeId')
  if (element) {
    const rect = element.getBoundingClientRect()
    if (rect.top <= 100 && rect.bottom >= 100) {
      const welcomeHeight = element.offsetHeight || window.innerHeight
      const opacity = Math.min(scrollY.value / welcomeHeight * 0.8, 0.95)
      const blur = Math.min(scrollY.value / 100 * 5, 10)
      eventBus.emit('navbarStyle', {
        from: 'Client.Vue',
        data: { backgroundColor: `rgba(0, 0, 0, ${opacity})`, backdropFilter: `blur(${blur}px)`, boxShadow: scrollY.value > 50 ? '0 2px 20px rgba(0,0,0,0.1)' : 'none' }
      })
    }
  }
}

//防抖动
const debouncedScroll = () => {
  let timeoutId = null
  return () => {
    if (timeoutId) {
      cancelAnimationFrame(timeoutId)
    }
    timeoutId = requestAnimationFrame(() => {
      handleScroll()
    })
  }
}

//欢迎页组件
const welcomeIntroTimer = () => {
  let num = 0
  let str = '这是我的个人博客、会分享关于编程，开发以及其他方面的一些内容，希望可以对您有所帮助...'
  function timer() {
    introduction.value = introduction.value + str.slice(num, num + 1)
    num > str.length ? (num = 0, introduction.value = '') : num++
    setTimeout(timer, 200)
  }
  setTimeout(timer, 2000)
}
const arrowDownBrowse = () => {
  nextTick(() => {
    document.getElementById('line').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}
const wheelScrollDown = (e) => {
  if (isWheelScroll.value) return
  const element = document.getElementById('welcomeId')
  if (scrollY.value < element.offsetHeight - 50 && e.deltaY > 0) {
    e.preventDefault()
    isWheelScroll.value = true
    nextTick(() => {
      document.getElementById('line').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      setTimeout(() => {
        isWheelScroll.value = false
      }, 800)
    })
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.title {
  position: relative;
  top: 0;
  width: 100%;
  height: 116vh;
  background-repeat: no-repeat;
  background-size: cover;
  border-bottom: 3px solid #fff;
  z-index: -100;
}

.welcome {
  position: absolute;
  height: 100%;
  width: 96%;
  top: 10%;
  left: 2%;
  background-color: rgba(0, 0, 0, 0.1);
  border: 0px;
}

.welcome__title {
  position: relative;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  width: 700px;
  height: 100px;
  border: 2px solid #ffff;
  text-align: center;
  line-height: 100px;
  color: #ffff;
  font-size: 40px;
  font-weight: normal;
  letter-spacing: 10px;

  .welcome__border-animation {
    width: 812px;
    height: 112px;
    position: absolute;
    top: -3px;
    left: -10px;
    border: 2px solid #ffff;
    animation: clipMe 5s linear infinite;
  }
}

.welcome__subtitle {
  position: relative;
  top: 20%;
  text-align: center;
  color: #ffff;
}

.welcome__scroll-btn {
  position: absolute;
  left: 50%;
  bottom: 20%;
  transform: translate(-50%, 0) scale(2);
  border: 1px solid rgb(255, 255, 255, 0.9);
  border-radius: 50%;

  .welcome__svg {
    transform: translate(0, 5%) scale(0.5);
    color: rgb(255, 255, 255, 0.9);
  }
}

.welcome__division-line {
  position: absolute;
  bottom: 0%;
  height: 0%;
}

@keyframes clipMe {

  0%,
  100% {
    clip: rect(0px, 806px, 6px, 0px);
  }

  25% {
    clip: rect(0px, 6px, 112px, 0px);
  }

  50% {
    clip: rect(112px, 812px, 112px, 0px);
  }

  75% {
    clip: rect(0px, 812px, 112px, 806px);
  }
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translate(-50%, 0);
  }

  40% {
    transform: translate(-50%, -30px);
  }

  60% {
    transform: translate(-50%, -15px);
  }
}

.main-content {
  align-items: center;
  justify-content: center;
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
}
</style>
