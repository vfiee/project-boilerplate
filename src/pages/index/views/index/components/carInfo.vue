<script setup>
import { useBoolean } from '@/hooks'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const { bool: visible, toggleBoolean } = useBoolean()
const icon = computed(() =>
  visible.value ? 'ph:eye-light' : 'solar:eye-closed-bold'
)

// 车辆信息
const carList = [
  {
    label: '- 所有人',
    value: ''
  },
  {
    label: '- 品牌',
    value: ''
  },
  {
    label: '- 车系',
    value: ''
  },
  {
    label: '- 车型',
    value: '',
    class: 'text-ellipsis'
  },
  {
    label: '- 车架号',
    value: ''
  },
  {
    label: '- 发动机号',
    value: ''
  },
  {
    label: '- 注册日期',
    value: ''
  }
]
// 保险信息
const insuranceList = [
  { label: '- 交强止期', value: '' },
  { label: '- 商业止期', value: '' },
  { label: '- 质保止期', value: '' }
]
// 人车关系
const carRelationshipList = [
  { name: '张三', tel: '156****8899', fav: true, relation: 0 },
  { name: '李四', tel: '174****9966', fav: true, relation: 1 }
]
</script>

<template>
  <div class="w-300px bg-white h-full pt-16px rounded-md">
    <!-- 车辆基本信息 -->
    <div class="font-500 text-22px bar mb-20px">沪E BX319</div>
    <div
      v-for="({ label, value, class: cls }, index) in carList"
      :key="index"
      :class="cls"
      class="pl-10px mt-4px"
    >
      {{ label }}：{{ value || '-' }}
    </div>
    <a-divider class="px-10 w-280px min-w-280px mx-10px my-20px" />
    <!-- 保险信息 -->
    <div
      v-for="({ label, value, class: cls }, index) in insuranceList"
      :key="index"
      :class="cls"
      class="pl-10px mt-4px"
    >
      {{ label }}：{{ value || '-' }}
    </div>
    <a-divider class="px-10 w-280px min-w-280px mx-10px my-20px" />
    <!-- 人车关系 -->
    <div class="px-10px flex-y-center">
      <span class="text-18px font-500">人车关系</span>
      <Icon
        class="ml-6px text-20px cursor-pointer"
        :icon="icon"
        @click="() => toggleBoolean()"
      />
      <Icon
        icon="material-symbols-light:contract-edit-outline-sharp"
        class="ml-auto text-20px cursor-pointer"
      />
    </div>
    <div
      class="flex-y-center px-10px mt-16px"
      v-for="({ name, tel, fav, relation }, index) in carRelationshipList"
      :key="'relation-' + index"
    >
      <div
        class="size-20px rounded-full text-center line-height-20px text-white text-12px"
        :class="relation == 0 ? 'bg-blue' : 'bg-green'"
      >
        {{ relation == 0 ? '所' : '用' }}
      </div>
      <div class="text-16px text-#333 ml-6px flex-1">{{ name }}</div>
      <div class="text-16px text-#333 ml-14px flex-1">{{ tel }}</div>
      <Icon
        class="text-20px ml-12px"
        :class="{ 'text-yellow': fav }"
        :icon="fav ? 'line-md:star-filled' : 'line-md:star'"
      />
      <Icon class="text-16px ml-12px" icon="iconoir:phone-solid" />
    </div>
  </div>
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
    background-color: #4e80f5;
  }
}
</style>
