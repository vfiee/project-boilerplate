import { defineStore } from 'pinia'
import { useGlobalStore } from './global'

export const useTaskStore = defineStore('task', {
  state: () => ({
    current: undefined,
    list: [],
    fake: false
  }),
  getters: {},
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
