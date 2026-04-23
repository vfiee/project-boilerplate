<script setup>
/**
 * CustomerSearch 配置化搜索组件
 *
 * @example
 * <CustomerSearch
 *   :fields="[
 *     { key: 'name', type: 'input', label: '客户名称', placeholder: '请输入' },
 *     { key: 'status', type: 'select', label: '状态', options: [{ label: '启用', value: 1 }] },
 *     { key: 'dateRange', type: 'daterange', label: '日期' },
 *     { key: 'custom', type: 'slot', slotName: 'custom-slot' },
 *     { key: 'customRender', label: '自定义', render: (value, formData) => h('span', value) }
 *   ]"
 *   :show-submit-button="true"
 *   :show-reset-button="true"
 *   @search="handleSearch"
 * />
 *
 * // 自定义slot用法
 * <template #custom-slot="{ value, update, formData }">
 *   <a-input :value="value" @change="e => update(e.target.value)" />
 * </template>
 */
import { debounce, isFunction } from 'lodash-es'
import { onMounted, onUnmounted, ref, useSlots } from 'vue'

defineOptions({
  name: 'CustomerSearch'
})

const props = defineProps({
  /** 字段配置 */
  fields: {
    type: Array,
    default: () => []
  },
  /** 是否显示重置按钮 */
  showResetButton: {
    type: Boolean,
    default: false
  },
  /** 是否显示提交按钮 */
  showSubmitButton: {
    type: Boolean,
    default: false
  },
  /** 无提交按钮时，输入变化是否自动搜索 */
  autoSearchOnChange: {
    type: Boolean,
    default: true
  },
  /** 组件挂载时是否自动搜索 */
  searchOnMount: {
    type: Boolean,
    default: false
  },
  /** 默认值 */
  defaultValues: {
    type: Object,
    default: () => ({})
  },
  /** 表单布局 */
  layout: {
    type: String,
    default: 'inline'
  }
})

const emit = defineEmits(['search', 'update:modelValue'])

/** 搜索参数双向绑定 */
const modelValue = defineModel('modelValue', {
  type: Object,
  default: () => ({})
})

/** 内部表单数据 */
const formData = ref({})

/** 表单引用 */
const formRef = ref(null)

/** 响应式列数 */
const span = ref(6)

/** 防抖搜索 */
const debouncedSearch = debounce((val) => {
  emit('search', val)
}, 500)

/** 初始化默认值 */
onMounted(() => {
  const initial = {}
  props.fields.forEach((field) => {
    const key = field.key
    initial[key] = props.defaultValues[key] ?? null
  })
  formData.value = initial
  modelValue.value = { ...initial }

  updateSpan()
  window.addEventListener('resize', updateSpan)

  if (props.searchOnMount) {
    emit('search', { ...formData.value })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSpan)
})

/** 更新响应式列数 */
function updateSpan() {
  const width = window.innerWidth
  if (width < 768) {
    span.value = 24
  } else if (width < 1200) {
    span.value = 12
  } else {
    span.value = 8
  }
}

/** 字段更新 */
function updateFieldValue(key, value) {
  formData.value = { ...formData.value, [key]: value }
  modelValue.value = { ...formData.value }
  if (!props.showSubmitButton && props.autoSearchOnChange) {
    debouncedSearch({ ...formData.value })
  }
}

/** 提交搜索 */
function handleSubmit() {
  emit('search', { ...formData.value })
}

/** 重置表单 */
function handleReset() {
  const resetData = {}
  props.fields.forEach((field) => {
    resetData[field.key] = props.defaultValues[field.key] ?? null
  })
  formData.value = resetData
  modelValue.value = { ...resetData }
  emit('search', { ...resetData })
}

/** 字段是否有自定义渲染函数 */
function hasCustomRender(field) {
  return isFunction(field.render)
}

/** 执行自定义渲染 */
function execCustomRender(field) {
  if (hasCustomRender(field)) {
    return field.render(formData.value[field.key], formData.value)
  }
  return null
}

/** 检查是否有自定义slot */
function hasSlot(name) {
  return !!useSlots()[name]
}

/** 获取 select 组件的选项 */
function getSelectOptions(field) {
  return field.options || []
}

// 暴露方法
defineExpose({
  submit: handleSubmit,
  reset: handleReset,
  getFormData: () => ({ ...formData.value }),
  validate: () => formRef.value?.validate(),
  clearValidate: () => formRef.value?.clearValidate()
})
</script>

<template>
  <div class="customer-search flex justify-between items-center">
    <a-form ref="formRef" :model="formData" :layout="layout" class="flex-1">
      <div class="flex items-center gap-4 flex-wrap">
        <a-form-item v-for="field in fields" :key="field.key" :name="field.key" :label="field.label" class="!mb-0">
          <!-- 自定义渲染函数 -->
          <template v-if="hasCustomRender(field)">
            <component :is="execCustomRender(field)" />
          </template>

          <!-- 自定义slot -->
          <slot v-else-if="field.type === 'slot' && hasSlot(field.slotName)" :name="field.slotName"
            :value="formData[field.key]" :update="(val) => updateFieldValue(field.key, val)" :formData="formData" />

          <!-- input -->
          <a-input v-else-if="field.type === 'input'" :value="formData[field.key]"
            :placeholder="field.placeholder || '请输入'" allow-clear class="w-full" v-bind="field.props"
            @update:value="(val) => updateFieldValue(field.key, val)" />

          <!-- select -->
          <a-select v-else-if="field.type === 'select'" :value="formData[field.key]"
            :placeholder="field.placeholder || '请选择'" allow-clear class="w-full" v-bind="field.props"
            @update:value="(val) => updateFieldValue(field.key, val)">
            <a-select-option v-for="opt in getSelectOptions(field)" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>

          <!-- date -->
          <a-date-picker v-else-if="field.type === 'date'" :value="formData[field.key]"
            :placeholder="field.placeholder || '请选择日期'" allow-clear class="w-full" v-bind="field.props"
            @update:value="(val) => updateFieldValue(field.key, val)" />

          <!-- daterange -->
          <a-range-picker v-else-if="field.type === 'daterange'" :value="formData[field.key]"
            :placeholder="field.placeholder || ['开始日期', '结束日期']" allow-clear class="w-full" v-bind="field.props"
            @update:value="(val) => updateFieldValue(field.key, val)" />

          <!-- cascader -->
          <a-cascader v-else-if="field.type === 'cascader'" :value="formData[field.key]"
            :placeholder="field.placeholder || '请选择'" allow-clear class="w-full" v-bind="field.props"
            @update:value="(val) => updateFieldValue(field.key, val)" />
        </a-form-item>
      </div>
    </a-form>

    <!-- 操作按钮 -->
    <div v-if="showResetButton || showSubmitButton" class="flex gap-2 shrink-0">
      <a-button v-if="showResetButton" @click="handleReset">重置</a-button>
      <a-button v-if="showSubmitButton" type="primary" @click="handleSubmit">搜索</a-button>
    </div>
  </div>
</template>

<style scoped>
.customer-search :deep(.ant-picker) {
  width: 100%;
}

.customer-search :deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>