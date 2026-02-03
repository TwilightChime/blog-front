<template>
  <div class="com-container">
    <h3 class="title">标签数据</h3>
    <div class="com-chart" ref="tagRef">
      <div class="tag" v-for="tag in randerList" :key="tag.id" :style="getTagStyle(tag)">
        {{ tag.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { tagApi } from '@/api/tagApi'
import { onMounted, onUnmounted, reactive, ref } from 'vue'

let tagList = []
let randerList = ref([])
const tagRef = ref()
const config = reactive({
  radius: 100,
  distance: 150,
  centerX: 200,
  centerY: 150,
  baseFontSize: 7,
  rotationSpeed: Math.PI/700,
  maxTags: 50,
  animationEnabled: true
})

// 生命周期
onMounted(() => {
  getData()
  window.addEventListener('resize', screenAdapter)
  
  // 初始化容器大小
  setTimeout(() => {
    screenAdapter()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', screenAdapter)
})

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 屏幕适配
const screenAdapter = debounce(() => {
  if (!tagRef.value) return

  const { width, height } = tagRef.value.getBoundingClientRect()

  // 根据容器大小调整中心点
  config.centerX = width / 2
  config.centerY = height / 2
  
  // 调整球体大小
  const minDimension = Math.min(width, height)
  config.radius = minDimension * 0.2
  config.distance = minDimension * 0.35
}, 100)

const getData = async () => {
  const { data: res } = await tagApi.getTagList()
  tagList = res.data.map((item) => {
    return item['name']
  })
  initPosition()
}

const getTagStyle = (tag) => {
  return {
    left: `${tag.x}px`,
    top: `${tag.y}px`,
    color: tag.color,
    opacity: tag.opacity,
    filter: tag.filter,
    fontSize: `${tag.fontSize}px`,
    transform: tag.transform,
  }
}

const initPosition = () => {
  let len = tagList.length
  let radius = config.radius //球体半径
  let distance = config.distance //焦距
  for (let i = 0; i < len; i++) {
    let k = (2 * (i + 1) - 1) / len - 1
    let a = Math.acos(k)
    let b = a * Math.sqrt(len * Math.PI)
    let x = radius * Math.sin(a) * Math.cos(b)
    let y = radius * Math.sin(a) * Math.sin(b)
    let z = radius * Math.cos(a)
    let color = `rgb(${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)})`
    let alpha = (z + radius) / (2 * radius)
    let opacity = alpha + 0.5
    let filter = 'alpha(opacity = ' + (alpha + 0.5) * 100 + ')'
    randerList.value = randerList.value.concat({
      name: tagList[i],
      x: x,
      y: y,
      z: z,
      color: color,
      opacity: opacity,
      filter: filter,
      fontSize: config.baseFontSize,
    })
  }
  animate()
}

const animate = () => {
  randerList.value.forEach(function (item) {
    let distance = 187
    let radius = 112
    let cx = 200
    let cy = 150
    let scale = distance / (distance - item.z)
    let alpha = (item.z + radius) / (2 * radius)
    let left = item.x + cx
    let top = item.y + cy
    let transform = 'translate(-50%,-50%) scale(' + scale + ')'
    item.opacity = alpha + 0.5
    item.zIndex = parseInt(scale * 100)
    item.transform = transform
    item.webkitTransform = transform
  })
  rotateX()
  rotateY()
  // console.log(this.randerList)
  requestAnimationFrame(animate)
}

const rotateX = () => {
  let angleX = Math.PI / 500
  let angleY = Math.PI / 500
  let cos = Math.cos(angleX)
  let sin = Math.sin(angleX)
  randerList.value.forEach(function (item) {
    let y1 = item.y * cos - item.z * sin
    let z1 = item.z * cos + item.y * sin
    item.y = y1
    item.z = z1
  })
}

const rotateY = () => {
  let angleX = Math.PI / 500
  let angleY = Math.PI / 500
  let cos = Math.cos(angleY)
  let sin = Math.sin(angleY)
  randerList.value.forEach(function (item) {
    let x1 = item.x * cos - item.z * sin
    let z1 = item.z * cos + item.x * sin
    item.x = x1
    item.z = z1
  })
}
</script>

<style scoped>
.com-container {
  width: 100%;
  height: 284px;
  position: relative;
}

.com-chart {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
}

.tag {
  position: absolute;
}

.tag:hover {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.title {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
}

canvas {
  border-radius: 20px;
}
</style>

<!-- 
<template>
  <div class="com-container">
    <h3 class="title">标签数据 (共 {{ randerList.length }} 个标签)</h3>
    
    <div class="control-panel">
      <button @click="toggleAnimation">
        {{ isAnimating ? '暂停动画' : '继续动画' }}
      </button>
      <div class="rotation-info">
        旋转速度: {{ rotationSpeed.toFixed(4) }}
      </div>
    </div>
    
    <div class="com-chart" ref="tagRef">
      <div class="sphere-bg" ref="sphereRef"></div>
      <div
        class="tag"
        v-for="(tag, index) in randerList"
        :key="tag.id || index"
        :style="getTagStyle(tag)"
        @mouseenter="handleTagHover(tag)"
        @mouseleave="handleTagLeave"
        @click="handleTagClick(tag)"
        :class="{ 'tag-hovered': hoveredTag === tag }"
      >
        {{ tag.name }}
        <div v-if="hoveredTag === tag" class="tag-tooltip">
          {{ tag.name }} (深度: {{ tag.z.toFixed(1) }})
        </div>
      </div>
      
      <div class="coordinate-info">
        <span class="coord-x">X</span>
        <span class="coord-y">Y</span>
        <span class="coord-z">Z</span>
      </div>
    </div>
    
    <div class="tag-stats">
      <div class="stat-item">
        <span class="stat-label">可见标签:</span>
        <span class="stat-value">{{ visibleTagCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">平均深度:</span>
        <span class="stat-value">{{ averageDepth.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { tagApi } from '@/api/tagApi'

// ========== 响应式数据 ==========
const tagRef = ref(null)
const sphereRef = ref(null)
const animationFrame = ref(null)

// 配置参数
const config = reactive({
  radius: 100,        // 球体半径
  distance: 150,      // 焦距
  centerX: 200,       // 中心点X
  centerY: 150,       // 中心点Y
  baseFontSize: 7,   // 基础字体大小
  rotationSpeed: Math.PI / 700, // 旋转速度
  maxTags: 50,        // 最大标签数量
  animationEnabled: true
})

// 状态数据
const randerList = ref([])
const tagList = ref([])
const hoveredTag = ref(null)
const isAnimating = ref(true)
const containerSize = reactive({ width: 0, height: 0 })

// ========== 计算属性 ==========
const visibleTagCount = computed(() => {
  return randerList.value.filter(tag => tag.opacity > 0.3).length
})

const averageDepth = computed(() => {
  if (randerList.value.length === 0) return 0
  const sum = randerList.value.reduce((acc, tag) => acc + tag.z, 0)
  return sum / randerList.value.length
})

const rotationSpeed = computed(() => config.rotationSpeed)

// 生命周期
onMounted(() => {
  getData()
  window.addEventListener('resize', screenAdapter)
  
  // 初始化容器大小
  setTimeout(() => {
    screenAdapter()
  }, 100)
})

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
  window.removeEventListener('resize', screenAdapter)
})

// ========== 方法 ==========

// 获取标签样式
const getTagStyle = (tag) => {
  const left = config.centerX + tag.x
  const top = config.centerY + tag.y
  const scale = config.distance / (config.distance - tag.z)
  const fontSize = config.baseFontSize * (1 + scale * 0.5)
  
  return {
    left: `${left}px`,
    top: `${top}px`,
    color: tag.color,
    backgroundColor: tag.backgroundColor || 'transparent',
    opacity: tag.opacity,
    filter: tag.filter,
    fontSize: `${fontSize}px`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    zIndex: Math.floor(scale * 100),
    fontWeight: tag.z > 0 ? 'bold' : 'normal',
    textShadow: tag.opacity > 0.7 ? `0 0 10px ${tag.color}40` : 'none'
  }
}

// 生成更美观的颜色
const generateColor = (index, total) => {
  // 使用HSL颜色空间生成均匀分布的颜色
  const hue = (index * 137.508) % 360 // 黄金角度近似值
  const saturation = 70 + Math.random() * 20 // 70-90%
  const lightness = 50 + Math.random() * 10 // 50-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// 防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 屏幕适配
const screenAdapter = debounce(() => {
  if (!tagRef.value) return
  
  const { width, height } = tagRef.value.getBoundingClientRect()
  containerSize.width = width
  containerSize.height = height
  
  // 根据容器大小调整中心点
  config.centerX = width / 2
  config.centerY = height / 2
  
  // 调整球体大小
  const minDimension = Math.min(width, height)
  config.radius = minDimension * 0.2
  config.distance = minDimension * 0.35
}, 100)

// 初始化位置
const initPosition = () => {
  const len = Math.min(tagList.value.length, config.maxTags)
  const { radius, distance } = config
  const newList = []
  
  for (let i = 0; i < len; i++) {
    // 使用斐波那契球面采样（均匀分布）
    const k = (2 * (i + 1) - 1) / len - 1
    const a = Math.acos(k)
    const b = a * Math.sqrt(len * Math.PI)
    
    // 3D球面坐标
    const x = radius * Math.sin(a) * Math.cos(b)
    const y = radius * Math.sin(a) * Math.sin(b)
    const z = radius * Math.cos(a)
    
    // 透视效果
    const alpha = (z + radius) / (2 * radius)
    const opacity = 0.3 + alpha * 0.7 // 基础透明度0.3-1.0
    
    // 创建标签对象
    const tag = {
      id: `tag-${i}-${Date.now()}`,
      name: tagList.value[i],
      x, y, z,
      originalX: x,
      originalY: y,
      originalZ: z,
      color: generateColor(i, len),
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`,
      opacity,
      filter: `alpha(opacity=${opacity * 100})`,
      hovered: false
    }
    
    newList.push(tag)
  }
  
  randerList.value = newList
  startAnimation()
}

// 动画循环
const startAnimation = () => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
  
  const animate = () => {
    if (isAnimating.value) {
      updatePositions()
      rotateX()
      rotateY()
    }
    
    animationFrame.value = requestAnimationFrame(animate)
  }
  
  animate()
}

// 更新标签位置
const updatePositions = () => {
  const { distance, radius, centerX, centerY } = config
  
  randerList.value.forEach(tag => {
    // 透视投影
    const scale = distance / (distance - tag.z)
    const alpha = (tag.z + radius) / (2 * radius)
    
    // 更新属性
    tag.opacity = 0.3 + alpha * 0.7
    tag.filter = `alpha(opacity=${tag.opacity * 100})`
    
    // 更新屏幕坐标
    tag.screenX = centerX + tag.x
    tag.screenY = centerY + tag.y
    
    // 悬停效果增强
    if (tag.hovered) {
      tag.opacity = Math.min(tag.opacity + 0.2, 1)
    }
  })
  
  // 按深度排序（远的先渲染）
  randerList.value.sort((a, b) => b.z - a.z)
}

// 绕X轴旋转
const rotateX = () => {
  const angle = config.rotationSpeed
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  
  randerList.value.forEach(tag => {
    const y1 = tag.y * cos - tag.z * sin
    const z1 = tag.z * cos + tag.y * sin
    tag.y = y1
    tag.z = z1
  })
}

// 绕Y轴旋转
const rotateY = () => {
  const angle = config.rotationSpeed
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  
  randerList.value.forEach(tag => {
    const x1 = tag.x * cos - tag.z * sin
    const z1 = tag.z * cos + tag.x * sin
    tag.x = x1
    tag.z = z1
  })
}

// 绕Z轴旋转（可选）
const rotateZ = () => {
  const angle = config.rotationSpeed * 0.5
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  
  randerList.value.forEach(tag => {
    const x1 = tag.x * cos - tag.y * sin
    const y1 = tag.y * cos + tag.x * sin
    tag.x = x1
    tag.y = y1
  })
}

// 标签交互处理
const handleTagHover = (tag) => {
  hoveredTag.value = tag
  tag.hovered = true
  
  // 悬停时轻微放大
  tag.originalScale = config.distance / (config.distance - tag.z)
}

const handleTagLeave = () => {
  if (hoveredTag.value) {
    hoveredTag.value.hovered = false
  }
  hoveredTag.value = null
}

const handleTagClick = (tag) => {
  console.log('点击标签:', tag.name, '深度:', tag.z.toFixed(2))
  
  // 点击时标签跳动效果
  const originalY = tag.y
  tag.y -= 10
  setTimeout(() => {
    tag.y = originalY
  }, 300)
  
  // 可以在这里触发其他操作，如跳转到标签相关页面
}

// 控制方法
const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value
  if (isAnimating.value) {
    startAnimation()
  }
}

// 获取数据
const getData = async () => {
  try {
    const { data: res } = await tagApi.getTagList()
    tagList.value = res.data.map(item => item.name)
    initPosition()
  } catch (error) {
    console.error('获取标签数据失败:', error)
    // 使用示例数据
    tagList.value = [
      'JavaScript', 'TypeScript', 'Vue.js', 'React', 'Angular',
      'Node.js', 'Python', 'Java', 'C#', 'Go', 'Rust',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
      'MySQL', 'MongoDB', 'Redis', 'PostgreSQL',
      'Webpack', 'Vite', 'Git', 'CI/CD', 'DevOps',
      '机器学习', '人工智能', '大数据', '云计算'
    ]
    initPosition()
  }
}

</script>

<style scoped>
.com-container {
  width: 100%;
  height: 400px;
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.title {
  position: absolute;
  top: 16px;
  left: 20px;
  margin: 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.control-panel {
  position: absolute;
  top: 16px;
  right: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 10;
}

.control-panel button {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.control-panel button:hover {
  background: rgba(0, 150, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 150, 255, 0.2);
}

.rotation-info {
  color: #ffffff;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.com-chart {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.sphere-bg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--sphere-size, 224px);
  height: var(--sphere-size, 224px);
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(0, 150, 255, 0.1) 0%,
    rgba(0, 100, 255, 0.05) 30%,
    transparent 70%
  );
  box-shadow: 
    inset 0 0 50px rgba(0, 150, 255, 0.1),
    0 0 80px rgba(0, 150, 255, 0.05);
  pointer-events: none;
  z-index: 1;
}

.tag {
  position: absolute;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
  transition: 
    transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.3s ease,
    background-color 0.3s ease;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  text-align: center;
  transform-origin: center center;
  pointer-events: auto;
  will-change: transform, opacity, left, top;
  backface-visibility: hidden;
}

.tag:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
  transform: translate(-50%, -50%) scale(1.2) !important;
  z-index: 1000 !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.tag-hovered {
  background-color: rgba(255, 255, 255, 0.2) !important;
  z-index: 1000 !important;
}

.tag-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1001;
}

.tag-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 4px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
}

.coordinate-info {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 15px;
  z-index: 5;
}

.coordinate-info span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
}

.coord-x { color: #ff6b6b !important; }
.coord-y { color: #4ecdc4 !important; }
.coord-z { color: #45b7d1 !important; }

.tag-stats {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 20px;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2px;
}

.stat-value {
  font-size: 16px;
  color: #ffffff;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .com-container {
    height: 300px;
  }
  
  .control-panel {
    flex-direction: column;
    gap: 5px;
    right: 10px;
  }
  
  .title {
    font-size: 16px;
  }
  
  .tag-stats {
    flex-direction: column;
    gap: 10px;
    padding: 8px 12px;
  }
}

/* 动画 */
@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.sphere-bg {
  animation: pulse 4s ease-in-out infinite;
}

/* 性能优化 */
.tag {
  contain: layout style paint;
}
</style> -->
