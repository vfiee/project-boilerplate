<script lang="ts" setup>
import { useEnvStore } from "~/src/stores";

const columnsFieldNames = { text: "name", value: "env" }
const envStore = useEnvStore()

const onConfirm = ({ selectedIndexes }) => {
	const [selectedIndex] = selectedIndexes
	envStore.setCurrentEnvByIndex(selectedIndex)
	envStore.hide()
	console.log(envStore.getCurrentEnvModule())
}
</script>
<template>
	<van-popup
		v-model:show="envStore.visible"
		destroy-on-close
		round
		position="bottom"
		safe-area-inset-bottom
		safe-area-inset-top
		teleport="body">
		<van-picker
			title="请选择环境"
			:model-value="[envStore.current.env]"
			:columns="envStore.mapColumns"
			:columnsFieldNames="columnsFieldNames"
			@cancel="envStore.hide"
			@confirm="onConfirm" />
	</van-popup>
</template>
<style lang="less" scoped></style>
