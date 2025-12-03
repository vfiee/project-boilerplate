import {
  breakpointsTailwind,
  useBreakpoints,
  useElementSize
} from '@vueuse/core'
import { cloneDeep, isNil } from 'lodash-es'
import { computed, reactive, ref, shallowRef, toRaw, toValue } from 'vue'
import { useBoolean } from './boolean'
import { useLoading } from './loading'

export function useHookTable(config) {
  const { loading, startLoading, endLoading } = useLoading()
  const { bool: empty, toggleBoolean: setEmpty } = useBoolean()

  const {
    apiFn,
    apiParams,
    transformerResponse,
    immediate = true,
    getColumnChecks,
    getColumns
  } = config

  const searchParams = reactive(Object.assign({}, apiParams))
  const allColumns = ref(config.columns())
  const data = ref([])
  const columnChecks = ref(getColumnChecks(allColumns.value))
  const columns = computed(() =>
    getColumns(allColumns.value, columnChecks.value)
  )
  function reloadColumns() {
    allColumns.value = config.columns()

    const checkMap = new Map(
      columnChecks.value.map((col) => [col.key, col.checked])
    )

    const defaultChecks = getColumnChecks(allColumns.value)

    columnChecks.value = defaultChecks.map((col) => ({
      ...col,
      checked: checkMap.get(col.key) ?? col.checked
    }))
  }

  async function getData() {
    startLoading()
    const formattedParams = formatSearchParams(searchParams)
    const response = await apiFn(formattedParams).finally(() => {
      endLoading()
    })
    const transformed = transformerResponse(response)
    data.value = transformed.data
    setEmpty(transformed.data.length === 0)
    await config.onFetched?.(transformed, response)
    endLoading()
  }

  function formatSearchParams(params) {
    const formattedParams = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formattedParams[key] = value
      }
    })
    return formattedParams
  }
  /**
   * update search params
   *
   * @param params
   */
  function updateSearchParams(params) {
    Object.assign(searchParams, params)
  }
  /** reset search params */
  function resetSearchParams() {
    Object.assign(searchParams, cloneDeep(apiParams))
  }

  if (immediate) {
    getData()
  }

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  }
}

export function useTable(config) {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('sm')
  const { apiFn, apiParams, immediate, transformerResponse } = config
  const defaultTransformerResponse = (res) => {
    const { list = [], total, page, size } = res.data || {}
    const pageSize = size <= 0 ? 15 : size
    const listWithIndex = list.map((item, index) => {
      return {
        ...item,
        index: (page - 1) * pageSize + index + 1
      }
    })
    return {
      total,
      size: pageSize,
      data: listWithIndex,
      page: page || 1
    }
  }
  const {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  } = useHookTable({
    apiFn,
    apiParams,
    immediate,
    columns: config.columns,
    transformerResponse: transformerResponse || defaultTransformerResponse,
    getColumnChecks: (cols) => {
      const checks = []
      cols.forEach((column) => {
        if (column.key) {
          checks.push({
            key: column.key,
            title: column.title,
            checked: isNil(column.checked) ? true : column.checked
          })
        }
      })
      return checks
    },
    getColumns: (cols, checks, apiParams) => {
      const columnMap = new Map()
      cols.forEach((column) => {
        if (column.key) {
          columnMap.set(column.key, column)
        }
      })
      const filteredColumns = checks
        .filter((item) => item.checked)
        .map((check) => columnMap.get(check.key))
      return filteredColumns
    },
    onFetched: async (transformed) => {
      const { page, size, total } = transformed
      updatePagination({
        total,
        pageSize: size,
        current: page
      })
    }
  })
  const pagination = reactive({
    total: 0,
    current: 1,
    pageSize: 15,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '15', '20', '25', '30'],
    onChange: async (current, size) => {
      pagination.current = current
      updateSearchParams({ pageSize: size, page: current })
      getData()
    }
  })
  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    return Object.assign(Object.assign({}, pagination), {
      simple: isMobile.value
    })
  })
  function updatePagination(update) {
    Object.assign(pagination, update)
  }
  /**
   * get data by page number
   *
   * @param page the page number. default is 1
   */
  async function getDataByPage(page = 1) {
    updatePagination({ page })
    updateSearchParams({
      page,
      size: pagination.pageSize
    })
    await getData()
  }
  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    updatePagination,
    getData,
    getDataByPage,
    searchParams,
    updateSearchParams,
    resetSearchParams
  }
}

export function useTableOperate(data, getData) {
  const {
    bool: drawerVisible,
    setTrue: openDrawer,
    setFalse: closeDrawer
  } = useBoolean()

  const operateType = ref('add')
  const rowData = ref(null)

  const getFlattenData = (data, children = 'children') => {
    let result = []
    data.forEach((item) => {
      result.push(item)
      if (item[children]) {
        result.push(...getFlattenData(item[children]))
      }
    })
    return result
  }

  function setRowData(id) {
    if (!id) return
    const flattenData = getFlattenData(data.value)
    const findItem = flattenData.find((item) => item.id === id) || null
    rowData.value = cloneDeep(toRaw(findItem))
  }

  function handleAdd(id) {
    operateType.value = 'add'
    setRowData(id)
    openDrawer()
  }
  function handleEdit(id) {
    operateType.value = 'edit'
    setRowData(id)
    openDrawer()
  }
  function handleView(id) {
    operateType.value = 'view'
    setRowData(id)
    openDrawer()
  }
  /** the checked row keys of table */
  const checkedRowKeys = ref([])
  function onSelectChange(keys) {
    checkedRowKeys.value = keys
  }
  const rowSelection = computed(() => {
    return {
      columnWidth: 30,
      type: 'checkbox',
      fixed: true,
      onChange: onSelectChange,
      selectedRowKeys: checkedRowKeys.value
    }
  })
  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    checkedRowKeys.value = []
    await onDeleted()
  }
  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success('删除成功')
    await getData()
  }
  return {
    // drawer visible
    drawerVisible,
    openDrawer,
    closeDrawer,
    // drawer operate
    operateType,
    handleAdd,
    handleEdit,
    handleView,
    // drawer row data
    rowData,
    checkedRowKeys,
    rowSelection,
    // drawer operate callback
    onSelectChange,
    onBatchDeleted,
    onDeleted,
    setRowData
  }
}
export function useTableScroll(scrollX = 702) {
  const tableWrapperRef = shallowRef(null)
  const { height: wrapperElHeight } = useElementSize(tableWrapperRef)
  const scrollConfig = computed(() => {
    return {
      y: wrapperElHeight.value - 72,
      x: toValue(scrollX)
    }
  })
  return {
    tableWrapperRef,
    scrollConfig
  }
}
