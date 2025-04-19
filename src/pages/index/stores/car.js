import { get } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCarStore = defineStore('car', () => {
  const car = ref()
  // 当前线索任务 clue__c
  const taskId = ref()

  // 车架号
  const carNum = computed(() => get(car.value, 'vin'))
  // 店铺id
  const storeId = computed(() => get(car.value, 'storeId'))

  function setCar(carValue) {
    car.value = carValue
  }

  function updateCar(carValue) {
    car.value = {
      ...(car.value || {}),
      ...(carValue || {})
    }
  }

  return {
    car,
    taskId,
    carNum,
    storeId,
    setCar,
    updateCar
  }
})
