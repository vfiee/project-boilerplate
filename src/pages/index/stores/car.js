import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCarStore = defineStore('car', () => {
  // 车架号
  const carNum = ref()

  const setCarNum = (_carNum) => {
    carNum.value = _carNum
  }

  return {
    carNum,
    setCarNum
  }
})
