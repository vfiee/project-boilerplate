import { useAxios } from '@/services'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { useHistoryStore } from './history'
import { useTaskStore } from './task'

export const useCallStore = defineStore('call', {
  state: () => ({
    user: undefined,
    account: undefined,
    password: undefined,
    loaded: false,
    logged: false,
    auto: false
  }),
  getters: {
    name: (state) => state.user?.flexibleEmployment__c || state.user?.name
  },
  actions: {
    async dial() {
      const taskStore = useTaskStore()
      const historyStore = useHistoryStore()
      const callStore = useCallStore()
      const phoneNumber = $('#dialout_input').val()

      if (!callStore.logged) {
        window.$message.error('请先进行签入操作！')
        return
      }
      if (callStore.account && callStore.password) {
        holly.loginPhoneBar(callStore.account, callStore.password, 'sip')
        callStore.logged = true
      } else {
        return message.error('当前账号未配置外呼坐席!')
      }
      if (!phoneNumber) {
        return message.warning('请输入有效手机号再发起外呼！')
      }
      if (taskStore.current) {
        await historyStore.create()
        holly.dialout(phoneNumber, {
          clueType: 'clue',
          leadId: taskStore.current.id,
          numberOfCalls: historyStore.current['numberOfCalls__c']
        })
      } else {
        holly.dialout(phoneNumber)
      }
    },
    async loadUser() {
      const { data, execute } = useAxios(
        '/rest/data/v2.0/scripts/api/callcenter/user',
        {
          module: 'crm',
          method: 'GET',
          interceptors: {
            response: false
          }
        }
      )
      await execute()
      this.user = data.value
    },
    clear() {
      $('#dialout_input').val('')
    }
  }
})
