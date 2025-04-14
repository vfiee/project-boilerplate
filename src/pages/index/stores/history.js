import { defineStore } from 'pinia'
import { useTaskStore } from './task'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    current: undefined,
    history: [],
    historyAll: []
  }),
  getters: {},
  actions: {
    async loadHistory() {
      const taskStore = useTaskStore()

      if (!taskStore.current) return
      const { data } = await lapp.connection.invoke({
        url: `/rest/data/v2.0/scripts/api/callcenter/queryFollowUpList?outboundCallTask=${taskStore.current.id}`
      })

      if (data.code === 200) {
        this.history = data.result
        const [latest] = data.result
        if (String(latest?.saveReadsAndFollowUp__c) === '2') {
          this.current = latest
        } else {
          this.current = undefined
        }
      }
    },
    async loadHistoryAll() {
      const taskStore = useTaskStore()

      if (taskStore.current) {
        const { data } = await lapp.connection.invoke({
          url: `/rest/data/v2.0/scripts/api/callcenter/followUpRecordPermissions`,
          method: 'POST',
          data: {
            id: taskStore?.current?.clue__c,
            parent_id__c: taskStore.current.parentId
            // mobile__c: taskStore.current.mobile__c,
          }
        })

        if (data?.code === 200) {
          this.historyAll = data.result
        }
      }
    },

    async loadCurrent(n) {
      const taskStore = useTaskStore()
      if (taskStore.current) {
        const { data } = await lapp.connection.invoke({
          url: `/rest/data/v2.0/scripts/api/callcenter/queryFollowUpList?outboundCallTask=${taskStore.current.id}&numberOfCalls=${n}`
        })

        if (data.code === 200) {
          const [latest] = data.result
          this.current = latest
        }
      }
    },
    async create() {
      const taskStore = useTaskStore()

      if (taskStore.current) {
        const res = await lapp.connection.invoke({
          url: '/rest/data/v2.0/scripts/api/callcenter/followUpRecords',
          method: 'POST',
          data: {
            outbound_call_task__c: taskStore?.current?.id,
            clue__c: taskStore?.current?.clue__c
          }
        })
        await this.loadCurrent(res.data)
      }
    }
  },
  persist: {
    storage: localStorage
  }
})
