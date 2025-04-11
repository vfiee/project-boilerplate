<script setup lang="jsx">
import { useBoolean } from '@/hooks'
import { useAxios } from '@/services'
import { Icon } from '@iconify/vue'
import { createReusableTemplate } from '@vueuse/core'
import { toLength } from 'lodash-es'
import { ref } from 'vue'
import CouponDetail from './couponDetail.vue'

const storeId = ref()
const detailRecord = ref(null)
const { bool, setTrue } = useBoolean()
const [DefineTemplate, CardTemplate] = createReusableTemplate()

// 卡卷列表接口
const { isLoading, data, execute } = useAxios(
  '/rest/data/v2.0/scripts/api/central/card_Coupon_List',
  {
    method: 'POST',
    data: {
      source: 'CRM',
      belongVin: 'SUJLPKJ0987678057',
      guid: 'A21E32CB-0459-B376-C236-E2592FACE849'
    }
  }
)

// 积分列表接口
const {
  isLoading: isLoading2,
  data: data2,
  execute: execute2
} = useAxios('/rest/data/v2.0/scripts/api/central/points_Balance_List', {
  method: 'POST',
  data: {
    source: 'CRM',
    itemType: 'integral',
    belongVin: 'SUJLPKJ0987678057',
    guid: 'A21E32CB-0459-B376-C236-E2592FACE849'
  }
})

// 储值列表接口
const {
  isLoading: isLoading3,
  data: data3,
  execute: execute3
} = useAxios('/rest/data/v2.0/scripts/api/central/points_Balance_List', {
  method: 'POST',
  data: {
    source: 'CRM',
    itemType: 'balance',
    belongVin: 'SUJLPKJ0987678057'
  }
})

function init() {
  Promise.all([execute(), execute2(), execute3()]).catch(console.error)
}

const options = [{ label: '全部', value: '' }]

const columnsOne = [
  {
    key: 'itemName',
    dataIndex: 'itemName',
    title: '卡卷名称/类型',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.itemName}</div>
          <div>{record.itemTypeName}</div>
        </div>
      )
    }
  },
  {
    key: 'couponAmount',
    dataIndex: 'couponAmount',
    title: '价值/项目',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.couponAmount || '-'}</div>
          <div>{record.relevantItemName}</div>
        </div>
      )
    }
  },
  {
    key: 'belongName',
    dataIndex: 'belongName',
    title: '客户姓名/手机号',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.belongName || '-'}</div>
          <div>{record.belongPhone || '-'}</div>
        </div>
      )
    }
  },
  {
    key: 'bizTypeName',
    dataIndex: 'bizTypeName',
    title: '发放形式/期限',
    customRender: ({ record }) => {
      const {
        validType,
        bizTypeName,
        validValue,
        couponUseFulLifeStart,
        couponUseFulLifeEnd
      } = record
      return (
        <div>
          <div>{bizTypeName || '-'}</div>
          <div>
            {validType == 1
              ? validValue
              : `${couponUseFulLifeStart} - ${couponUseFulLifeEnd}` || '-'}
          </div>
        </div>
      )
    }
  },
  {
    key: 'applyFirmName',
    dataIndex: 'applyFirmName',
    title: '适用企业'
  }
]

const columnsTwo = [
  {
    key: 'num',
    dataIndex: 'num',
    title: '积分数量'
  },
  {
    key: '1-2',
    dataIndex: '1-2',
    title: '有效期限',
    customRender: ({ record }) => {
      const {
        validType,
        validValue,
        couponUseFulLifeStart,
        couponUseFulLifeEnd
      } = record
      return (
        <div>
          {validType == 1
            ? validValue
            : `${couponUseFulLifeStart} - ${couponUseFulLifeEnd}` || '-'}
        </div>
      )
    }
  },
  {
    key: 'belongName',
    dataIndex: 'belongName',
    title: '客户姓名'
  },
  {
    key: '1-4',
    dataIndex: '1-4',
    title: '手机号码/信用代码',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.belongPhone || '-'}</div>
          <div>{record.belongIdCardNo || '-'}</div>
        </div>
      )
    }
  },
  {
    key: 'applyFirmName',
    dataIndex: 'applyFirmName',
    title: '适用企业'
  }
]

const columnsThree = [
  {
    key: 'num',
    dataIndex: 'num',
    title: '储值数量'
  },
  {
    key: 'belongName',
    dataIndex: 'belongName',
    title: '客户姓名'
  },
  {
    key: '3-4',
    dataIndex: '3-4',
    title: '手机号码/信用代码',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.belongPhone || '-'}</div>
          <div>{record.belongIdCardNo || '-'}</div>
        </div>
      )
    }
  },
  {
    key: 'applyFirmName',
    dataIndex: 'applyFirmName',
    title: '适用企业'
  }
]

const handleChange = (value) => {
  console.log(`选中的店铺ID: `, value)
}

const filterOption = (input, option) => {
  const { value } = option
  return value.indexOf(input) >= 0
}

const {
  execute: getDetail,
  data: couponDetail,
  error,
  isLoading: isCouponDetailLoading
} = useAxios('/rest/data/v2.0/scripts/api/central/getCouponDetailYD', {
  method: 'POST',
  module: 'crm'
})
const showCouponDetail = async ({ id }) => {
  if (isCouponDetailLoading.value) return
  await getDetail({
    data: {
      couponInstanceId: id
    }
  })
  if (error.value) return
  detailRecord.value = couponDetail.value
  setTrue()
}

const customRow = (record) => {
  return {
    onClick: () => showCouponDetail(record)
  }
}

init()
</script>
<template>
  <DefineTemplate
    v-slot="{
      icon,
      iconClass,
      title,
      count,
      description,
      handleClick,
      containerClass
    }"
  >
    <div
      class="border border-#e8e8e8 border-solid rounded p-16px bg-white shadow ml-16px min-w-200px"
      :class="containerClass"
      @click="handleClick"
    >
      <div class="flex-y-center">
        <Icon :icon="icon" class="text-30px" :class="iconClass" />
        <span class="ml-4px">{{ title }}</span>
        <span class="ml-auto text-20px font-bold">{{ count }}</span>
      </div>
      <div class="mt-8px">{{ description }}</div>
    </div>
  </DefineTemplate>
  <div>
    <div class="flex-y-center">
      <!-- show-search allow-clear -->
      <a-select
        v-model:value="storeId"
        placeholder="请选择店铺"
        class="w-200px"
        :options="options"
        :filter-option="filterOption"
        @change="handleChange"
      />
      <CardTemplate
        icon="lsicon:coupon-outline"
        iconClass="text-yellow-500"
        title="卡卷"
        :count="toLength(data?.length)"
        description="暂无即将到期的卡劵"
        containerClass="min-w-180px"
      />
      <CardTemplate
        icon="mynaui:bitcoin-square"
        iconClass="text-green-500"
        title="积分"
        :count="toLength(data2?.integralOrBalanceVOList?.length)"
        description="暂无即将到期的积分"
        containerClass="min-w-180px"
      />
      <CardTemplate
        icon="bx:wallet"
        iconClass="text-blue-500"
        title="储值"
        :count="toLength(data3?.integralOrBalanceVOList?.length)"
        description="储值无有效限期"
        containerClass="min-w-180px"
      />
    </div>
    <a-table
      :loading="isLoading"
      :columns="columnsOne"
      :data-source="data"
      class="mt-16px"
      :pagination="false"
      :scroll="{ y: 200 }"
      :customRow="customRow"
      :rowKey="(record) => record.id"
    />
    <a-table
      :columns="columnsTwo"
      :loading="isLoading2"
      :data-source="data2?.integralOrBalanceVOList"
      class="mt-16px"
      :pagination="false"
      :scroll="{ y: 200 }"
      :rowKey="(record) => record.id"
    />
    <a-table
      :columns="columnsThree"
      :loading="isLoading3"
      :data-source="data3?.integralOrBalanceVOList"
      class="mt-16px"
      :pagination="false"
      :scroll="{ y: 100 }"
      :rowKey="(record) => record.id"
    />
  </div>
  <CouponDetail v-model:visible="bool" :data="detailRecord" />
</template>
