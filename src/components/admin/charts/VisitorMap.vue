<template>
  <div class="com-container">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>

<script setup>
import 'echarts/lib/component/geo'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/visualMap'
import { inject, onMounted, ref } from 'vue'
import { authApi } from '@/api/auth'
import { ElMessage } from 'element-plus'

let allData = []
let chartInstance = null
const mapRef = ref()
const echarts = inject('echarts')

onMounted(() => {
  initChart()
  getData()
  window.addEventListener('resize', screenAdapter)
  screenAdapter()
})

const screenAdapter = () => {
  chartInstance.resize()
}

const initChart = async () => {
  chartInstance = echarts.init(mapRef.value)
  const res = await import('@/assets/map/china.json')
  echarts.registerMap('china', res)
  const initOption = {
    title: {
      text: '用户来源',
    },
    geo: {
      type: 'map',
      roam: true, // 鼠标滑动放大缩小
      map: 'china',
    },
    // '<img src="'+lt.avatar+'"/>'
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        let html = ''
        if (!params.data || !Array.isArray(params.data.users)) {
          // 返回默认提示或空字符串
          html += '<div style="color: #999;">暂无用户数据</div>'
          return html
        }

        // 检查数组是否为空
        if (params.data.users.length === 0) {
          html += '<div style="color: #999;">暂无用户数据</div>'
          return html
        }
        // if (!params.data) return html
        for (const lt of params.data.users) {
          if (!lt) continue
          html +=
            '<div style="display: flex;align-items: center"><img style="width: 18px;border-radius: 50%" src="' +
            lt.avatar +
            '"/><span style="font-size: x-small;margin-left: 5px">' +
            lt.nickname +
            '</span></div> '
        }
        return html
      },
    },
    legend: {
      left: '5%',
      bottom: '5%',
      orient: 'vertical',
    },
    visualMap: {
      itemWidth: 4,
      min: 0,
      max: 50,
      hoverLink: false,
      textStyle: {
        color: 'rgba(0,0,0,0.65)',
      },
      pieces: [
        {
          gte: 50,
          label: '>= 50',
          color: '#FF7C32',
        },
        {
          gte: 30,
          lte: 49,
          label: '30 - 49',
          color: '#FDCC1A',
        },
        {
          gte: 10,
          lte: 29,
          label: '10 - 29',
          color: '#5AD7D8',
        },
        {
          gte: 1,
          lte: 9,
          label: '1 - 9',
          color: '#4174fe',
        },
        {
          gte: 0,
          lte: 0,
          label: '0',
          value: 0,
          color: '#f5f5f5',
        },
      ],
    },
    series: [
      {
        type: 'map',
        geoIndex: 0,
        data: [],
      },
    ],
  }
  chartInstance.setOption(initOption)
}

const getData = async () => {
  const { data: res } = await authApi.getUserAreaList()
  if (res.code === 200) {
    let list = {}
    res.data.forEach((item) => {
      if (typeof list[item.loginProvince] === 'undefined') {
        list[item.loginProvince] = [item]
      } else {
        list[item.loginProvince].push(item)
      }
    })
    Object.entries(list).forEach((item) => {
      allData.push({ name: item[0], value: item[1].length, users: item[1] })
    })
    setTimeout(() => {
      updateChart()
    }, 300)
  } else {
    ElMessage.error('获取用户数据错误!')
  }
}

const updateChart = () => {
  const dataOption = {
    series: [
      {
        data: allData,
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
</style>
