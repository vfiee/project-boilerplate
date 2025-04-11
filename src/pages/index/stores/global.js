import { lapp } from '@/assets/js/NeoLappSdk'
import { defineStore } from 'pinia'

const loadXOQL = async (xoql) => {
  const { data } = await lapp.connection.invoke({
    url: '/rest/data/v2.0/scripts/api/callcenter/beCurrent',
    method: 'POST',
    data: {
      url: `/rest/data/v2.0/query/xoql`,
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      formData: {
        xoql
      }
    }
  })
  return data?.data?.records || []
}

export const useGlobalStore = defineStore('global', {
  state: () => ({
    // display: {
    //   user: true,
    //   trace: true,
    //   search: true,
    //   history: true,
    // },
    minimized: {
      search: false,
      history: false,
      recommend: false
    },
    // call: undefined,
    // current: undefined,
    // tid: undefined,
    // lead: undefined,
    // n: undefined,
    // auto: false,
    dict: {},
    dict_h: {},
    dict_t: {},
    dict_o: {},
    entityTypes: {},
    store: {},
    time: undefined,
    tab: '1',
    loading: false,
    factoryData: null, // 所有选项值数据
    factoryOptions1: [], // 一级分类
    factoryOptions2: [], // 二级分类
    factoryOptions3: [] // 三级分类
  }),
  getters: {},
  actions: {
    async init() {
      this.loading = false
      if (process.env.NODE_ENV === 'development') {
        const resp = await lapp.connection.invoke({
          // dev
          // url: `/oauth2/token.action?grant_type=password&client_id=95cd0c0731168bb748459a9917c292aa&client_secret=5b589ec5e31818fafe51eb6220db7b63&username=dongjun@96818.com.cn&password=Yd@96818TECPHHuw`,
          // uat
          url: `/oauth2/token.action?grant_type=password&client_id=70838ff3c2e3a541657638ee90396e97&client_secret=ee61b450183d4d4a81e380a41420f903&username=18338905555&password=2024927180311111111`
        })
        const { access_token } = resp.data
        localStorage.setItem('access_token', access_token)
      }

      await this.loadDict(1000)
    },
    async loadDict(delay = 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))

      const res = await lapp.connection.invoke({
        url: `/rest/data/v2.0/xobjects/clue__c/description`
      })
      if (res.data.code === '200') {
        res.data.data.fields
          .filter((field) => field.selectitem.length)
          .forEach((field) => {
            this.dict[field.apiKey] = field.selectitem.filter((f) => f.isActive)
          })
      }
      // await this.loadStore()
      // await this.loadEmployee()

      const res2 = await lapp.connection.invoke({
        url: `/rest/data/v2.0/xobjects/follow_up_records__c/description`
      })
      if (res2.data.code === '200') {
        res2.data.data.fields
          .filter((field) => field.selectitem.length)
          .forEach((field) => {
            this.dict_h[field.apiKey] = field.selectitem.filter(
              (f) => f.isActive
            )
          })
      }
      const res3 = await lapp.connection.invoke({
        url: `/rest/data/v2.0/xobjects/outbound_call_task__c/description`
      })
      if (res3.data.code === '200') {
        res3.data.data.fields
          .filter((field) => field.selectitem.length)
          .forEach((field) => {
            this.dict_t[field.apiKey] = field.selectitem.filter(
              (f) => f.isActive
            )
          })
      }

      await this.loadEntityType('follow_up_records__c')
      // await this.loadObjectDict('brand__c', ', brand_number__c')
      // await this.loadObjectDict('vehicle_model__c', ', series_code__c, yiche_id__c')
      // await this.loadObjectDict('car_series__c', ', brand_code__c , series_code__c')
    },
    // async loadStore() {
    //   const res = await lapp.connection.invoke({
    //     url: `/rest/data/v2/query?q=select id,name from store__c`,
    //   })
    //   if (res.data.code === 200) {
    //     this.dict['store__c'] = res.data.result.records.map(({ id, name }) => ({ label: name, value: id }))
    //   }
    // },
    async loadObjectDict(object, extra, conditions = '') {
      const xoql = `select id,name ${extra} from ${object} ${conditions}`
      const data = await loadXOQL(xoql)
      this.dict_o[object] = data.map((item) => ({
        label: item.name,
        value: item.id,
        ...item
      }))
    },
    async loadEmployee(storeId) {
      const res = await lapp.connection.invoke({
        url: `/rest/data/v2/query?q=select id,name, store_id__c, userId__c from Employee__c where store_id__c = ${storeId} and userId__c is not null`
      })
      if (res.data.code === 200) {
        this.store[storeId] = res.data.result.records.map(
          ({ id, name, store_id__c, userId__c }) => ({
            label: name,
            value: id,
            store: store_id__c,
            account: userId__c
          })
        )
      }
    },
    async loadTime() {
      const res = await lapp.connection.invoke({
        url: `/rest/data/v2.0/scripts/api/callcenter/todayDialingDuration`
      })
      this.time = res.data.result
    },
    async loadEntityType(object) {
      // // 查询 entityType
      const { data } = await lapp.connection.invoke({
        url: '/rest/data/v2.0/scripts/api/callcenter/beCurrent',
        method: 'POST',
        data: {
          url: `/rest/metadata/v2.0/xobjects/${object}/busiTypes`,
          method: 'GET'
        }
      })
      if (data?.code === '0') {
        this.entityTypes = this.entityTypes || {}
        data.data?.records?.forEach(({ id, label }) => {
          this.entityTypes[id] = label
        })
      }
    },
    async loadFactoryBrandOptions(object) {
      const { data } = await lapp.connection.invoke({
        url: `/rest/data/v2.0/scripts/api/public-config/getConfigByParentNameAndType?type=厂方品牌车系车型&parentName=${object}`
      })

      if (data.code === 200) {
        this.factoryData = this.transformData(data.result)
      }
    },
    // 数据转换
    transformData(rawData) {
      const result = {
        level1: [], // 一级分类
        level2: [], // 二级分类
        level3: [] // 三级分类
      }

      const traverse = (node, depth = 0) => {
        const levelKey = `level${depth + 1}`

        // 确保层级存在
        if (!result[levelKey]) {
          result[levelKey] = []
        }

        // 创建当前节点
        const currentItem = {
          label: node.name, // 使用name作为显示label
          value: node.id, // 使用id作为实际value
          parent: node.parentId // 使用父节点id
        }

        // 检查重复项
        if (!result[levelKey].some((item) => item.value === node.id)) {
          result[levelKey].push(currentItem)
        }

        // 递归处理子节点
        if (node.childrenList) {
          Object.values(node.childrenList).forEach((child) => {
            traverse(child, depth + 1)
          })
        }
      }

      Object.values(rawData).forEach((brand) => traverse(brand))
      return result
    },

    // 获取层级选项
    getLevelOptions(level, parentValue = null) {
      if (!this.factoryData) return []

      const levelKey = `level${level}`
      const options = this.factoryData[levelKey].filter((item) => {
        if (level === 1) return true
        return item.parent === parentValue
      })

      switch (level) {
        case 1:
          this.factoryOptions1 = options
          break
        case 2:
          this.factoryOptions2 = options
          break
        case 3:
          this.factoryOptions3 = options
          break
        default:
          return []
      }
    }
  },
  persist: {
    storage: localStorage
  }
})
