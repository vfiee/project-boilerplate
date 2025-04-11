<script setup>
import { createReusableTemplate } from '@vueuse/core'
import { isFunction, get, isEmpty } from 'lodash-es'
import { watch } from 'vue'
import { useAxios } from '@/services'

const props = defineProps({
  record: {
    type: Object,
    required: true
  }
})

const visible = defineModel('visible')

const [DefineTemplate, CouponList] = createReusableTemplate()

const { execute, data, isLoading } = useAxios(
  '/rest/data/v2.0/scripts/api/central/getCouponDetailYD',
  {
    method: 'POST',
    module: 'crm',
    interceptors: {
      response: false
    }
  }
)

watch(
  () => props.record,
  (record) => {
    if (isEmpty(record)) return
    execute({ data: { couponInstanceId: props.record.byteId } })
  },
  {
    immediate: true
  }
)

const couponInfoList = [
  { label: '卡券名称：', value: 'data.name' },
  {
    label: '卡券类型：',
    value: (data) => {
      return get(
        {
          1: '代金券',
          2: '折扣券',
          3: '兑换券',
          4: '资格券',
          5: '次卡'
        },
        get(data, 'couponType'),
        ''
      )
    }
  },
  { label: '券面价值：', value: 'data.showText' },
  { label: '相关项目：', value: 'data.itemName' },
  { label: '有效期限：', value: 'data.validTime' },
  //  0不更新，1实时更新，2按自然月更新，3按自然年更新 4按自然天更新
  {
    label: '卡券属性：',
    value: ''
  },
  {
    label: '更新周期：',
    value: (data) =>
      get(
        {
          0: '不更新',
          1: '实时更新',
          2: '按自然月更新',
          3: '按自然年更新',
          4: '按自然天更新'
        },
        get(data, 'data.secondCycleType'),
        ''
      )
  },
  { label: '次数：', value: 'secondLessNum' }
]
const carInfoList = [
  { label: '车牌号码：', value: 'data.carCode' },
  { label: '车架号码：', value: 'data.vinCode' },
  { label: '客户姓名：', value: '' },
  { label: '相关项目：', value: 'data.itemName' },
  {
    label: '手机号码/信用代码：',
    value: (data) => {
      const { receiveUserMobile, creditCode } = data || {}
      return `${receiveUserMobile || ''}/${creditCode || ''}`
    }
  },
  {
    label: '业务范围：',
    value: (data) =>
      get(
        {
          1: '销售',
          2: '售后',
          3: '保险',
          4: '其它',
          5: '二手车'
        },
        get(data, 'business'),
        ''
      )
  },
  { label: '物料组：', value: 'data.materialGroupCodeList' },
  { label: '适用品牌：', value: 'data.applicableBrandNameList' },
  { label: '适用车系：', value: 'data.applicableSeriesNameList' },
  { label: '适用企业：', value: 'data.shopCode' },
  { label: '备注说明：', value: '' }
]

const couponRecordList = [
  { label: '发放时间：', value: 'data.sendHistory.sendTime' },
  { label: '发放企业：', value: 'data.sendHistory.sendShopName' },
  { label: '发放部门：', value: 'data.sendHistory.sendDepartment' },
  { label: '发放形式：', value: 'data.sendHistory.sendType' },
  { label: '权益订单：', value: 'data.sendHistory.sendCouponOrderFormId' },
  { label: 'DOP订单：', value: 'data.sendHistory.ecmOrderFormId' },
  { label: '产品ID：', value: 'data.sendHistory.productId' },
  { label: '活动名称：', value: 'data.sendHistory.productName' },
  { label: '订单金额：', value: 'data.sendHistory.commodityPrice' },
  { label: '发放说明：', value: 'data.sendHistory.sendComment' }
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
      <div class="min-w-80px whitespace-nowrap pl-12px">
        {{ label }}
      </div>
      <div class="flex-1">
        {{ isFunction(value) ? value(data?.data) : get(data, value, '') }}
      </div>
    </div>
  </DefineTemplate>
  <a-drawer title="卡卷详情" width="600px" v-model:open="visible">
    <a-spin :spinning="isLoading">
      <CouponList :list="couponInfoList" title="卡卷信息" />
      <a-divider />
      <CouponList :list="carInfoList" />
      <CouponList :list="couponRecordList" title="发放记录" />
    </a-spin>
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
