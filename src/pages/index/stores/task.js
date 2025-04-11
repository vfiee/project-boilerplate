import { defineStore } from 'pinia'
import { useGlobalStore } from './global'

export const useTaskStore = defineStore('task', {
  state: () => ({
    current: undefined,
    list: [],
    fake: false
  }),
  getters: {
    // current(state) {
    //   const globalStore = useGlobalStore()
    //   // return {
    //   //   outbound_call_time__c: '1722760219803',
    //   //   createdAt: '1722758420261',
    //   //   next_outbound_call_time__c: '1722760219803',
    //   //   ownerName: '董骏',
    //   //   mobile__c: '18338905792',
    //   //   name: 'T20240804001',
    //   //   follow_up_content__c: '',
    //   //   status__c: ['首次外呼'],
    //   //   name__c: '诸葛森旺',
    //   //   store: '奥迪南京店',
    //   //   id: '3407767281207313',
    //   //   clue__c: '3407753974186967',
    //   // }
    //   return state.list.find((item) => item.id === globalStore.tid)
    // },
  },
  actions: {
    async load(param = {}) {
      if (this.fake && this.list.length) {
        return
      }
      const globalStore = useGlobalStore()
      const taskType = globalStore.tab === '2' ? '7' : globalStore.tab || '1'
      const res = await lapp.connection.invoke({
        url: '/rest/data/v2.0/scripts/api/callcenter/myTaskList',
        method: 'POST',
        data: {
          taskType,
          phone: '',
          pageNum: 1,
          pageSize: 100,
          ...param
        }
      })
      const { data } = res

      if (data.code === 200) {
        this.list = data.result
      }
    },
    async loadCurrent() {
      if (this.current) {
        const res = await lapp.connection.invoke({
          url: '/rest/data/v2.0/scripts/api/callcenter/myTaskList',
          method: 'POST',
          data: {
            id: this.current?.id,
            taskType: '6',
            pageNum: 1,
            pageSize: 1
          }
        })

        const { data } = res

        if (data.code === 200) {
          const [current] = data.result || []
          this.current = current
        }
      }
    }
  },
  persist: {
    storage: localStorage
  }
})
