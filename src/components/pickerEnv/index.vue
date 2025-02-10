<script setup>
import { watch } from "vue"
import { getEnvs, useEnvStore } from "./store"

defineOptions({
	name: "PickerEnv"
})

const props = defineProps({
	envs: {
		type: Array,
		default: () => []
	}
})

const envStore = useEnvStore()
const columnsFieldNames = { text: "name", value: "env" }

const onConfirm = ({ selectedIndexes }) => {
	const [selectedIndex] = selectedIndexes
	envStore.setCurrentEnvByIndex(selectedIndex)
	envStore.hide()
}

watch(
	() => props.envs,
	newEnvs => {
		envStore.envs.value = getEnvs(newEnvs)
	},
	{ immediate: true }
)
</script>
<template>
	<van-popup
		v-model:show="envStore.visible.value"
		destroy-on-close
		round
		position="bottom"
		safe-area-inset-bottom
		teleport="body"
		class="h-1/3 overflow-hidden">
		<van-picker
			title="请选择环境"
			:model-value="[envStore.currentEnv.value.env]"
			:columns="envStore.mapColumns.value"
			:columnsFieldNames="columnsFieldNames"
			@cancel="envStore.hide"
			@confirm="onConfirm" />
	</van-popup>
</template>
