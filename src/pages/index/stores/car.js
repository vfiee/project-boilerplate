import { useAxios } from '@/services'
import { getUrlParams } from '@/utils'
import { get } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCarStore = defineStore('car', () => {
  const car = ref()
  // 当前线索任务 clue__c
  const taskId = ref()

  // 车架号
  const carNum = computed(() =>
    get(car.value, 'vin_no__c', 'SUJLPKJ0987678057')
  )
  // 店铺id
  const storeId = computed(() => get(car.value, 'store__c'))

  // 保单信息车架号： CHENJUN2019062101
  // 客户权益车架号： SUJLPKJ0987678057
  // SUJLPKJ0987678057,LSJE36099RS049731,AAABBB12423459999

  async function getCarDetail() {
    const { recordId } = getUrlParams()
    const { execute, data } = useAxios('/rest/data/v2.0/query/xoql', {
      module: 'crm',
      method: 'POST',
      data: {
        xoql: `select id,store__c,vin_no__c from first_maintenance_artificial_examine_records__c where id='${recordId}'`
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    await execute()
    car.value = get(data.value, 'records[0]')
  }

  return {
    taskId,
    carNum,
    storeId,
    getCarDetail
  }
})
