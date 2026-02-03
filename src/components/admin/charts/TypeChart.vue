<template>
  <div class="com-container">
    <div class="com-chart" ref="typeRef"></div>
  </div>
</template>

<script setup>
import { typeApi } from '@/api/typeApi';
import { inject, onMounted, ref } from 'vue'

let typeList = []
let data = []
let chartInstance = null
const echarts = inject('echarts')
const typeRef = ref()

onMounted(() => {
  initChart()
  getData()
  window.addEventListener('resize', screenAdapter)
  screenAdapter()
})

const screenAdapter = () => {
  chartInstance.resize()
}

const initChart = () => {
  chartInstance = echarts.init(typeRef.value)
  const initOption = {
    title: {
      text: '分类数据',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)',
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts'],
    },
    series: [
      {
        name: '分类',
        type: 'pie',
        roseType: 'radius',
        radius: [15, 95],
        center: ['50%', '38%'],
        data: [
          { value: 320, name: 'Industries' },
          { value: 240, name: 'Technology' },
          { value: 149, name: 'Forex' },
          { value: 100, name: 'Gold' },
          { value: 59, name: 'Forecasts' },
        ],
        animationEasing: 'cubicInOut',
        animationDuration: 2600,
      },
    ],
  }
  chartInstance.setOption(initOption)
}

const compare = (property) => {
  return (a, b) => {
    let value1 = a[property].length
    let value2 = b[property].length
    return value2 - value1
  }
}

const getData = async () => {
  const { data: res } = await typeApi.getTypeList()
  typeList = res.data.sort(compare('blogs'))
  data = typeList.slice(0, 4).map((item) => {
    return { name: item['name'], value: item['blogs'].length }
  })
  data = data.concat({
    name: '其他',
    value: eval(
      typeList.slice(4)
        .map((item) => {
          return item['blogs'].length
        }).join('+'),
    )
  })
  const dataOption = {
    legend: {
      data: data.map((item) => item['name']),
    },
    series: [
      {
        data: data,
      },
    ],
  }
  chartInstance.setOption(dataOption)
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
  border-radius: 0;
}
</style>
