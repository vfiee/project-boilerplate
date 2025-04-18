import { get } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCarStore = defineStore('car', () => {
  const car = ref()
  // 当前线索任务 clue__c
  const taskId = ref()

  // 车架号
  const carNum = computed(() => get(car.value, 'vin_no__c'))
  // 店铺id
  const storeId = computed(() => get(car.value, 'store__c'))

  function setCar(carValue) {
    car.value = carValue
  }

  function updateCar(carValue) {
    car.value = {
      ...(car.value || {}),
      ...(carValue || {})
    }
  }

  // 保单信息车架号： CHENJUN2019062101
  // 客户权益车架号： SUJLPKJ0987678057
  // SUJLPKJ0987678057,LSJE36099RS049731,AAABBB12423459999

  return {
    taskId,
    carNum,
    storeId,
    setCar,
    updateCar
  }
})
