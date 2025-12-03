<script setup>
import { useAxios } from "@/services"
import { debounce, get } from "lodash-es"
import { ref } from "vue"

defineOptions({
	name: "SelectWithSearch"
})

const props = defineProps({
	url: {
		type: String,
		default: "/rest/data/v2.0/query/xoql"
	},
	getXoql: {
		type: Function,
		required: true
	},
	debounceTime: {
		type: Number,
		default: 300
	}
})

let lastFetchId = 0

const value = defineModel()
const fetching = ref(false)
const list = ref([])

const handleSearch = debounce(async keyword => {
	if (!keyword) {
		list.value = []
	}
	lastFetchId += 1
	const fetchId = lastFetchId
	list.value = []
	fetching.value = true
	const { execute, data } = useAxios(props.url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded "
		},
		data: { xoql: props.getXoql(keyword) }
	})
	await execute()
	if (fetchId !== lastFetchId) return
	list.value = get(data.value, "records")
	fetching.value = false
}, props.debounceTime)

const setOptions = (options = []) => {
	list.value = options
}

defineExpose({
	setOptions
})
</script>
<template>
	<a-select
		v-model:value="value"
		class="w-full"
		show-search
		allow-clear
		placeholder="请输入关键字查询"
		:default-active-first-option="false"
		:show-arrow="true"
		:filter-option="false"
		not-found-content="未找到"
		:options="list"
		@search="handleSearch"
		v-bind="$attrs">
		<template #notFoundContent>
			<a-spin v-if="fetching" size="small" />
		</template>
	</a-select>
</template>
