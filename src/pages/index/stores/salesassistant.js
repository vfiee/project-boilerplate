import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'

export const useAssistantStore = defineStore('assistant', {
  state: () => ({
    sendText: null,
    ws: null,
    isConnecting: false,
    phone: undefined,
    status: '未连接',
    responseMap: {}, // 语音翻译
    agentOneMap: {}, // 话术推荐
    agentTwoMap: {}, // 车型提取
    config: {
      endpoint: 'wss://ydma.yddop.com/crm-tools/webSocket'
    }
  }),
  getters: {
    callId: (state) => state.phone?._phone_callId
  },
  actions: {
    async connect() {
      try {
        console.log(
          'holly.phone._phone_callId***',
          JSON.stringify(holly.phone._phone_callId)
        )
        this.phone = holly.phone
        this.responseMap = {}
        this.agentOneMap = {}
        this.agentTwoMap = {}
        console.log('初始化连接...')
        // 建立WebSocket连接
        this.ws = new WebSocket(this.config.endpoint)
        await this.setupWebSocket()
      } catch (error) {
        return message.error(`连接错误: ${error.message}`)
      }
    },
    setupWebSocket() {
      this.ws.onopen = async () => {
        this.status = '已连接'
        console.log('连接已建立')
        console.log(
          'holly.phone._phone_callId***',
          JSON.stringify(holly.phone._phone_callId)
        )
        this.ws.send(
          JSON.stringify({
            header: {
              client_type: 'CRM'
            },
            payload: {
              call_sheet_id: holly.phone._phone_callId
            }
          })
        )
      }

      this.ws.onmessage = async (event) => {
        let eventData = event.data
        const asrFlag = '|DAT|60|' // 语音翻译
        const agentFlag = '|DAT|63|' // 话术提取
        if (eventData && eventData.indexOf(asrFlag) !== -1) {
          eventData = eventData.substring(
            eventData.indexOf(asrFlag) + asrFlag.length
          )
          this.setAsr(eventData)
        } else if (eventData && eventData.indexOf(agentFlag) !== -1) {
          eventData = eventData.substring(
            eventData.indexOf(agentFlag) + agentFlag.length
          )
          this.setAgent(eventData)
        }
      }

      this.ws.onerror = (error) => {
        this.status = '未连接'
        return message.error(`WebSocket 连接错误: ${error}`)
      }

      this.ws.onclose = async () => {
        this.status = '连接关闭'
        console.log('连接关闭')
        this.status = '未连接'
      }
    },
    setAsr(eventData) {
      // 语音翻译结果处理
      try {
        const data = JSON.parse(eventData)

        const id = data.data.id
        const speaker = data.data.asrData.speaker
        const text = data.data.asrData.text

        this.responseMap[id] = {
          speaker,
          time: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
          text
        }
      } catch {
        // this.responses.push(data)
      }
    },
    setAgent(eventData) {
      // 话术提取
      try {
        const data = JSON.parse(eventData)
        const id = data.data.id
        const agentID = data.data.llmData.agentID // 信息提取：IEA93255612；话术推荐：KX2026252
        const outputs = data.data.llmData.outputs
        const time = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
        outputs.forEach((item) => {
          if (item.Type == 101 && agentID == 'KX2026252') {
            // 话术推荐 取101
            this.agentOneMap[id] = {
              time: time,
              query: item.Text
            }
          } else if (item.Type == 10 && agentID == 'IEA93255612') {
            // 车型 取10
            this.agentTwoMap[id] = {
              time: time,
              query: item.Text
            }
          }
        })
      } catch {
        // this.responses.push(data)
      }
    }
  }
})
