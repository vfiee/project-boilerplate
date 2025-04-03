<script setup>
import { PieChart } from 'echarts/charts'
import {
    GraphicComponent,
    LegendComponent,
    TooltipComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { onMounted, ref } from 'vue'

echarts.use([
  GraphicComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])

const option = {
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  tooltip: {
    trigger: 'item'
  },
  graphic: {
    elements: [
      {
        type: 'text',
        left: '37px',
        top: 'center',
        style: {
          text: '19',
          fontSize: 20
        }
      },
      {
        type: 'text',
        left: '58px',
        top: '46px',
        z: 1,
        zlevel: 100,
        style: {
          text: '天',
          fontSize: 12
        }
      }
    ]
  },
  series: [
    {
      name: '定保线索',
      type: 'pie',
      radius: ['50%', '100%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 2,
        borderColor: '#fff',
        borderWidth: 2
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 100, name: '空调滤芯' },
        { value: 100, name: '机油机滤' },
        { value: 100, name: '发动机保养' },
        { value: 100, name: '整车精洗' }
      ]
    }
  ]
}

const echartDom = ref()
function initEchart() {
  const pieChart = echarts.init(echartDom.value)
  pieChart.setOption(option)
}

onMounted(initEchart)
</script>
<template>
  <div ref="echartDom"></div>
</template>
