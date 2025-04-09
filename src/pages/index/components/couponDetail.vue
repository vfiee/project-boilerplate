<script setup>
import { createReusableTemplate } from '@vueuse/core'

const [DefineTemplate, CouponList] = createReusableTemplate()

const visible = defineModel('visible')

const couponInfoList = [
  { label: '卡券名称：', value: '' },
  { label: '卡券类型：', value: '' },
  { label: '券面价值：', value: '' },
  { label: '相关项目：', value: '' },
  { label: '有效期限：', value: '' },
  { label: '卡券属性：', value: '' },
  { label: '更新周期：', value: '' },
  { label: '次数：', value: '' }
]
const carInfoList = [
  { label: '车牌号码：', value: '' },
  { label: '车架号码：', value: '' },
  { label: '客户姓名：', value: '' },
  { label: '相关项目：', value: '' },
  { label: '手机号码/信用代码：', value: '' },
  { label: '业务范围：', value: '' },
  { label: '物料组：', value: '' },
  { label: '适用品牌：', value: '' },
  { label: '适用车系：', value: '' },
  { label: '适用企业：', value: '' },
  { label: '备注说明：', value: '' }
]

const couponRecordList = [
  { label: '发放时间：', value: '' },
  { label: '发放企业：', value: '' },
  { label: '发放部门：', value: '' },
  { label: '发放形式：', value: '' },
  { label: '权益订单：', value: '' },
  { label: 'DOP订单：', value: '' },
  { label: '产品ID：', value: '' },
  { label: '活动名称：', value: '' },
  { label: '订单金额：', value: '' },
  { label: '发放说明：', value: '' }
]
</script>
<template>
  <DefineTemplate v-slot="{ list, title }">
    <div class="bar text-18px font-bold mb-10px not-first:mt-26px" v-if="title">
      {{ title }}
    </div>
    <div
      v-for="{ label, value } in list"
      :key="label"
      class="flex text-#333 text-14px mt-12px"
    >
      <div class="min-w-80px whitespace-nowrap pl-12px">{{ label }}</div>
      <div class="flex-1">{{ value }}</div>
    </div>
  </DefineTemplate>
  <a-drawer title="卡卷详情" width="600px" v-model:open="visible">
    <CouponList :list="couponInfoList" title="卡卷信息" />
    <a-divider />
    <CouponList :list="carInfoList" />
    <CouponList :list="couponRecordList" title="发放记录" />
  </a-drawer>
</template>
<style lang="less" scoped>
.bar {
  position: relative;
  padding-left: 10px;
  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 4px;
    background-color: blue;
  }
}
</style>
