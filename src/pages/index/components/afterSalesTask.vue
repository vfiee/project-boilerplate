<script setup>
import { useBoolean } from '@/hooks'
import { closeDialog } from '@/services'
import { Icon } from '@iconify/vue'
import Appointment from './appointment.vue'
import CallBar from './callBar.vue'
import Clue from './clue.vue'
import FollowUp from './followUp.vue'
import FollowUpRecords from './followUpRecords.vue'
import SendMessage from './seedMessage.vue'

const { bool, setTrue } = useBoolean()
const { bool: visible, setTrue: setVisibleTrue } = useBoolean()

//此js用于在开发页面注入ctx,以便在开发页面中使用ctx中的能力，后续加入版本管理
</script>
<template>
  <div class="bg-white rounded px-10px transition-all">
    <div class="flex-y-center h-50px">
      <div class="flex-y-center text-#999 cursor-pointer" @click="closeDialog">
        <Icon icon="famicons:arrow-back" class="text-20px" />
        <span class="ml-6px">返回</span>
      </div>
      <div class="text-18px font-500 ml-20px">售后招揽任务</div>
      <CallBar class="!ml-auto" />
      <div
        class="bg-blue text-white ml-20px px-10px py-6px rounded cursor-pointer flex-y-center"
        @click="setTrue"
      >
        <Icon icon="mynaui:message" class="text-16px mr-10px" />
        发送短信
      </div>
      <div
        @click="setVisibleTrue"
        class="bg-#DEB874 text-white ml-20px px-10px py-6px rounded cursor-pointer flex-y-center"
      >
        <Icon icon="solar:calendar-line-duotone" class="text-16px mr-10px" />
        立即预约
      </div>
    </div>
    <a-divider class="m-0 border-2px" />
    <div class="flex py-16px">
      <Clue />
      <FollowUp />
    </div>
    <FollowUpRecords />
    <SendMessage v-model:visible="bool" />
    <Appointment v-model:visible="visible" />
  </div>
</template>
