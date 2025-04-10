<script setup>
import { ref } from 'vue'
import { isEmpty } from 'lodash-es'
import AppointmentDate from './appointmentDate.vue'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'SendTextMessage' })

const visible = defineModel('visible')

const form = ref()
const rules = {
  carNum: [{ required: true, message: '请输入车牌号' }]
}
const model = ref({ date: {} })
const steps = [
  { key: 'step-1', title: '选择时间' },
  { key: 'step-2', title: '填写预约信息' }
]
const currentStep = ref(0)

const handleSubmit = async () => {
  await form.value.validate()
}
</script>
<template>
  <a-modal v-model:open="visible" width="800px">
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
          :disabled="isEmpty(model.date)"
          class="ml-12px"
          type="primary"
          @click="currentStep = 1"
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
      labelAlign="left"
      :labelCol="{ span: 7 }"
      :rules="rules"
    >
      <a-form-item-rest v-if="currentStep === 0">
        <a-form-item>
          <AppointmentDate v-model="model.date" />
        </a-form-item>
      </a-form-item-rest>
      <a-form-item-rest v-else-if="currentStep === 1">
        <div class="flex-y-center bg-blue-100 rounded pl-16px my-30px">
          <Icon class="text-20px mr-6px" icon="flat-color-icons:info" />
          <div class="text-15px">
            当前选择时间：{{ model.date.date.format('YYYY/MM/DD') }}
            {{ model.date.timeText || '' }}
          </div>
          <a-button class="ml-auto" type="link" @click="currentStep = 0">
            修改时间
          </a-button>
        </div>
        <a-row gutter="24">
          <a-col span="10">
            <a-form-item required label="车牌号" name="carNum">
              <a-select
                v-model:value="model.carNum"
                placeholder="请选择车牌号"
              />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item name="temporaryCar">
              <a-checkbox v-model:checked="model.temporaryCar">临牌</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row gutter="24">
          <a-col span="10">
            <a-form-item required label="品牌" name="brand">
              <a-select v-model:value="model.brand" placeholder="请选择品牌" />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item required label="车系" name="carBrand">
              <a-select
                v-model:value="model.carBrand"
                placeholder="请选择车系"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row gutter="24">
          <a-col span="10">
            <a-form-item required label="客户姓名" name="customerName">
              <a-input
                v-model:value="model.customerName"
                placeholder="请输入客户姓名"
              />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item required label="联系方式" name="customerTel">
              <a-input
                v-model:value="model.customerTel"
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
            <a-form-item required label="服务类型" name="serveType">
              <a-select
                v-model:value="model.serveType"
                placeholder="请选择服务类型"
              />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item required label="到店方式" name="storeType">
              <a-radio-group v-model:value="model.storeType">
                <a-radio :value="1">自行到店</a-radio>
                <a-radio :value="2">取送车</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row gutter="24">
          <a-col span="10">
            <a-form-item required label="服务顾问" name="serveUser">
              <a-select
                v-model:value="model.serveUser"
                placeholder="请选择服务顾问"
              />
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item required label="预约备注" name="remark">
              <a-input
                v-model:value="model.remark"
                placeholder="请输入预约备注"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item-rest>
    </a-form>
  </a-modal>
</template>
