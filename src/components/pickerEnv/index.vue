<script setup>
import { useEnvStore } from "@/stores"

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
</script>
<template>
	<van-popup
		v-model:show="envStore.visible"
		destroy-on-close
		round
		position="bottom"
		safe-area-inset-bottom
		teleport="body"
		class="h-1/3 overflow-hidden">
		<van-picker
			title="请选择环境"
			:model-value="[envStore.currentEnv.env]"
			:columns="envStore.mapColumns"
			:columnsFieldNames="columnsFieldNames"
			@cancel="envStore.hide"
			@confirm="onConfirm" />
	</van-popup>
</template>
