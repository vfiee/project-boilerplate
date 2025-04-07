<script setup>
import { Icon } from '@iconify/vue'
import Clue from './clue.vue'
import FollowUp from './followUp.vue'
import FollowUpRecords from './followUpRecords.vue'
import ButtonIcon from '@/components/buttonIcon/index.vue'

const visible = defineModel('visible')

function closeDrawer() {
  console.log(`关闭弹框`)
}
</script>
<template>
  <div
    class="bg-white rounded px-10px flex-1 transition-all"
    :class="{ 'h-50px overflow-hidden flex-none': !visible }"
  >
    <div class="flex-y-center h-50px">
      <div class="flex-y-center text-#999" @click="closeDrawer">
        <Icon icon="famicons:arrow-back" class="text-20px" />
        <span class="ml-6px">返回</span>
      </div>
      <div class="text-18px font-500 ml-20px">售后招揽任务</div>
      <a-tag class="ml-4px" color="processing">+10</a-tag>
      <div
        class="bg-#DEB874 text-white ml-auto px-10px py-6px rounded cursor-pointer"
      >
        <Icon
          icon="solar:calendar-line-duotone"
          class="text-16px translate-y-2px mr-10px"
        />
        立即预约
      </div>
      <ButtonIcon
        class="text-20px ml-16px mr-6px"
        :icon="visible ? 'octicon:fold-24' : 'octicon:unfold-24'"
        @click="() => (visible = !visible)"
        :tooltipContent="visible ? '收起' : '展开'"
      />
    </div>
    <a-divider class="m-0 border-2px" />
    <div class="flex py-16px">
      <Clue />
      <FollowUp />
    </div>
    <FollowUpRecords />
  </div>
</template>
