<script setup>
import { watch, ref, computed } from 'vue'
import { find, first, get, isEmpty, method } from 'lodash-es'
import AppointmentDate from './appointmentDate.vue'
import { Icon } from '@iconify/vue'
import { useAxios } from '@/services'
import { useCallStore, useCarStore } from '../stores'
import dayjs from 'dayjs'
import { getUrlParams } from '@/utils'

defineOptions({ name: 'SendTextMessage' })

const form = ref()
const currentStep = ref(0)
const selectedTimeText = ref()
const carStore = useCarStore()
const callStore = useCallStore()
const visible = defineModel('visible')
const model = ref({ date: {} })
const rules = {
  carNum: [{ required: true, message: '请输入车牌号' }]
}

// 车系选项
const carSeriesOptions = [
  {
    label: carStore.car.series_name__c,
    value: carStore.car.series_code
  }
]
// 车辆品牌选项
const carBrandOptions = [
  {
    label: carStore.car.brand_name__c,
    value: carStore.car.brandId
  }
]

const steps = [
  { key: 'step-1', title: '选择时间' },
  { key: 'step-2', title: '填写预约信息' }
]
// 服务类型选项
const serveOptions = [
  { label: '维修', value: '202001' },
  { label: '保养', value: '202002' },
  { label: '贴膜', value: '202003' },
  { label: '加装', value: '202004' }
]

// 设置选择的时间
function setSelectedTime() {
  const { dateId, timeId } = model.value.date || {}
  const dates = get(data.value, 'dates') || []
  const { times } = find(dates, { id: dateId }) || {}
  const { startTime } = find(times, { id: timeId }) || {}
  selectedTimeText.value = startTime
}

function nextStep() {
  currentStep.value = 1
  setSelectedTime()
  // 获取接口选项
  getOptions({
    data: {
      storeId: carStore.storeId,
      date: dayjs(selectedTimeText.value).format('YYYY-MM-DD HH-MM')
    }
  })
}

function prevStep() {
  currentStep.value = 0
}

// 可预约时间列表
const { data, execute } = useAxios(
  '/rest/data/v2.0/scripts/api/central2/appointment_time',
  {
    method: 'POST'
  }
)

// 可接待顾问接口
const { data: res, execute: getOptions } = useAxios(
  '/rest/data/v2.0/scripts/api/central2/consultants_available',
  { method: 'POST' }
)

// 可接待顾问选项
const consultantOptions = computed(() => {
  const consultants = get(res.value, 'employeeList') || []
  return consultants.map((item) => {
    return {
      ...item,
      label: item.name,
      value: 'code'
    }
  })
})

const dateFeedback = async (dataFeedbackId) => {
  const { recordId } = getUrlParams()
  const { execute } = useAxios(
    '/rest/data/v2.0/scripts/api/crmapi/up_submissionInfo/up',
    {
      method: 'POST',

      data: {
        id: recordId,
        reservationId: dataFeedbackId
      }
    }
  )
  await execute()
}

const handleSubmit = async () => {
  await form.value.validate()
  const {
    date,
    carNum,
    isTmp,
    brandCode,
    seriesCode,
    name,
    phoneNum,
    serveType,
    reservationType,
    reservationAppointmentType
  } = model.value || {}
  const { dateId, timeId } = date || {}
  const dates = get(data.value, 'dates') || []
  const { times } = find(dates, { id: dateId }) || {}
  const { startTime } = find(times, { id: timeId }) || {}
  const {
    execute,
    error,
    data: dateData
  } = useAxios('/rest/data/v2.0/scripts/api/central2/appointment_submission', {
    method: 'POST',

    data: {
      createUser: callStore.user.name,
      genderCode: callStore.user.gender,
      reservationOrigin: '205001',
      guid: 'E81FC51F-8B07-6ADD-DBCD-32CBC08FC4EA',
      name,
      carNum,
      phoneNum,
      serveType,
      brandCode,
      seriesCode,
      storeId: carStore.storeId,
      reservationType,
      isTmp: isTmp ? 1 : 0,
      reservationAppointmentType,
      reservationDateTime: startTime
    }
  })
  await execute()
  if (error.value) return
  // 保存预约ID
  dateFeedback(get(dateData.value, 'reservationId'))
  window.$message.success('预约成功')
  visible.value = false
}

function getDates() {
  execute({ data: { storeId: carStore.storeId } }).then(() => {
    const dates = get(data.value, 'dates') || []
    const { id } = find(dates, { isOpen: 1 }) || {}
    if (id) {
      model.value.date = {
        dateId: id
      }
    }
  })
}

watch(visible, (isVisible) => {
  if (isVisible) {
    getDates()
    model.value = {
      ...model.value,
      carNum: carStore.car.license_plate_number__c,
      brandCode: carStore.car.brandId,
      seriesCode: carStore.car.series_code,
      vinNo: carStore.car.vin_no__c,
      storeId: carStore.car.store__c,
      reservationAppointmentType: 208001
    }
  } else {
    model.value = { date: {} }
    prevStep()
  }
})
getDates()
</script>
<template>
  <a-modal v-model:open="visible" destroyOnClose width="800px">
    <template #title>
      <div class="flex-y-center">
        <span class="whitespace-nowrap text-20px">售后预约</span>
        <a-steps
          class="ml-auto w-300px mr-50px"
          :current="currentStep"
          :items="steps"
        ></a-steps>
      </div>
    </template>
    <template #footer>
      <template v-if="currentStep == 0">
        <a-button @click="visible = false">取消</a-button>
        <a-button
          :disabled="!model.date.timeId"
          class="ml-12px"
          type="primary"
          @click="nextStep"
          >下一步</a-button
        >
      </template>
      <template v-else-if="currentStep == 1">
        <a-button @click="visible = false">取消</a-button>
        <a-button class="ml-12px" @click="currentStep = 0">上一步</a-button>
        <a-button class="ml-12px" type="primary" @click="handleSubmit">
          提交
        </a-button>
      </template>
    </template>
    <a-form
      ref="form"
      v-model:model="model"
      labelAlign="right"
      :labelCol="{ span: 7 }"
      :rules="rules"
    >
      <a-form-item-rest v-if="currentStep === 0">
        <a-form-item>
          <AppointmentDate :dates="data?.dates || []" v-model="model.date" />
        </a-form-item>
      </a-form-item-rest>
      <a-form-item-rest v-else-if="currentStep === 1">
        <div class="flex-y-center bg-blue-100 rounded pl-16px my-30px">
          <Icon class="text-20px mr-6px" icon="flat-color-icons:info" />
          <div class="text-15px">当前选择时间：{{ selectedTimeText }}</div>
          <a-button class="ml-auto" type="link" @click="prevStep">
            修改时间
          </a-button>
        </div>
        <a-row gutter="24">
          <a-col span="10">
            <a-form-item required label="车牌号" name="carNum">
              <a-input
                v-model:value="model.carNum"
                placeholder="请输入车牌号"
              />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item name="isTmp">
              <a-checkbox v-model:checked="model.isTmp">临牌</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row gutter="24">
          <a-col span="10">
            <a-form-item label="品牌" name="brandCode">
              <a-select
                :options="carBrandOptions"
                v-model:value="model.brandCode"
                placeholder="请选择品牌"
              />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item label="车系" name="seriesCode">
              <a-select
                :options="carSeriesOptions"
                v-model:value="model.seriesCode"
                placeholder="请选择车系"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row gutter="24">
          <a-col span="10">
            <a-form-item required label="客户姓名" name="name">
              <a-input
                :disabled="!model.other"
                v-model:value="model.name"
                placeholder="请输入客户姓名"
              />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item required label="联系方式" name="phoneNum">
              <a-input
                :disabled="!model.other"
                v-model:value="model.phoneNum"
                placeholder="请输入联系方式"
              />
            </a-form-item>
          </a-col>
          <a-col span="4">
            <a-form-item name="other">
              <a-checkbox v-model:checked="model.other">其他</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row gutter="24">
          <a-col span="10">
            <a-form-item required label="服务类型" name="reservationType">
              <a-select
                v-model:value="model.reservationType"
                :options="serveOptions"
                placeholder="请选择服务类型"
              />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item
              required
              label="到店方式"
              name="reservationAppointmentType"
            >
              <a-radio-group v-model:value="model.reservationAppointmentType">
                <a-radio :value="208001">自行到店</a-radio>
                <a-radio :value="208002">取送车</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row gutter="24">
          <a-col span="10">
            <a-form-item required label="服务顾问" name="receiveCode">
              <a-select
                v-model:value="model.receiveCode"
                :options="consultantOptions"
                placeholder="请选择服务顾问"
              />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item required label="预约备注" name="remarks">
              <a-input
                v-model:value="model.remarks"
                placeholder="请输入预约备注"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item-rest>
    </a-form>
  </a-modal>
</template>
