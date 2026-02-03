<template>
  <div class="com-container">
    <div class="com-chart" ref="blogRef"></div>
  </div>
</template>

<script setup>
import { indexApi } from '@/api'
import { inject, onMounted, ref, watch } from 'vue'

const echarts = inject('echarts')

let countByMonth = []
let commentCountByMonth = []
let chartInstance = null
let xAxisData = []
let seriesData = []
let timeList = []
const selectList = ['阅读量', '文章数', '点赞数', '评论数']
const blogRef = ref()
const props = defineProps({
  psMsg: Number,
})

onMounted(() => {
  initChart()
  getViewsData()
  window.addEventListener('resize', screenAdapter)
})

watch(() => props.psMsg, (value) => {
  if (value === 0) {
    getViewsData()
  } else if (value === 1) {
    getBlogData()
  } else if (value === 2) {
    getAppreciateCountByMonth()
  } else if (value === 3) {
    getCommentCountByMonth()
  }
})

const initChart = () => {
  chartInstance = echarts.init(blogRef.value)
  const initOption = {
    backgroundColor: '#fff',
    legend: {
      // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
      orient: 'horizontal',
      // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
      x: 'center',
      // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
      y: 'top',
      data: ['阅读量'],
    },

    //  图表距边框的距离,可选值：'百分比'¦ {number}（单位px）
    grid: {
      top: '3%', // 等价于 y: '16%'
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true,
    },

    // 提示框
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      padding: [5, 10],
    },
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
    xAxis: {
      name: '周几',
      type: 'category',
      // 设置X轴数据旋转倾斜
      axisLabel: {
        rotate: 20, // 旋转角度
        interval: 0, //设置X轴数据间隔几个显示一个，为0表示都显示
      },
      // boundaryGap值为false的时候，折线第一个点在y轴上
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },

    yAxis: {
      name: '数值',
      type: 'value',
    },

    series: [
      {
        name: '阅读量',
        data: [820, 932, 301, 1434, 1290, 1330, 1320],
        type: 'line',
        // 设置小圆点消失
        // 注意：设置symbol: 'none'以后，拐点不存在了，设置拐点上显示数值无效
        symbol: 'none',
        // 设置折线弧度，取值：0-1之间
        smooth: 0.5,
        itemStyle: {
          color: '#3888fa',
          lineStyle: {
            color: '#3888fa',
            width: 2,
          },
          areaStyle: {
            color: '#f3f8ff',
          },
        },
        animationDuration: 2800,
        animationEasing: 'cubicInOut',
      },
    ],
  }
  chartInstance.setOption(initOption)
}
const getViewsData = async () => {
  const { data: res } = await indexApi.getViewCountByMonth()
  let list = []
  res.data.forEach((item) => {
    let ls = item.split(',')
    list = list.concat({ date: ls[0], views: ls[1] })
  })
  countByMonth = list
  updateChart()
}
const getBlogData = async () => {
  const { data: res } = await indexApi.getBlogCountByMonth()
  let list = []
  res.data.forEach((item) => {
    let ls = item.split(',')
    list = list.concat({ date: ls[0], views: ls[1] })
  })
  countByMonth = list
  updateChart()
}
const getAppreciateCountByMonth = async () => {
  const { data: res } = await indexApi.getAppreciateCountByMonth()
  let list = []
  res.data.forEach((item) => {
    let ls = item.split(',')
    list = list.concat({ date: ls[0], views: ls[1] })
  })
  countByMonth = list
  updateChart()
}
const getCommentCountByMonth = async () => {
  const { data: res } = await indexApi.getCommentCountByMonth()
  let list = []
  res.data.forEach((item) => {
    let ls = item.split(',')
    list = list.concat({ date: ls[0], views: ls[1] })
  })
  countByMonth = list
  updateChart()
}
const dateFormat2 = (originVal) => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  return `${y}-${m}`
}
const getTimeList = () => {
  let time = new Date()
  let month = time.getMonth()
  let year = time.getFullYear()
  let dateList = []
  for (let i = 0; i < 7; i++) {
    dateList = dateList.concat(dateFormat2(time))
    if (month === 0) {
      month = 11
      year = year - 1
    } else {
      month = month - 1
    }
    time.setFullYear(year)
    time.setMonth(month)
  }
  timeList = dateList.reverse()
}
const updateChart = () => {
  getTimeList()
  xAxisData = timeList
  let sl = []
  for (const item of timeList) {
    let a = countByMonth.find((i) => i.date === item)
    sl = sl.concat(a === undefined ? 0 : a.views)
  }
  seriesData = sl
  const dataOption = {
    legend: {
      data: [selectList[props.psMsg]],
    },
    xAxis: {
      data: xAxisData,
    },
    series: [
      {
        name: selectList[props.psMsg],
        data: seriesData,
      },
    ],
  }
  chartInstance.setOption(dataOption)
}
const screenAdapter = () => {
  chartInstance.resize()
}
</script>

<style scoped>
.com-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.com-chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

canvas {
  border-radius: 20px;
}
</style>
