import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCarStore = defineStore('car', () => {
  // 车架号
  const carNum = ref()
  // 当前线索任务 clue__c
  const taskId = ref()

  const setCarNum = (_carNum) => {
    carNum.value = _carNum
  }

  return {
    taskId,
    carNum,
    setCarNum
  }
})
