<script setup>
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app"
import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only"

onLaunch(() => {
	console.log("App Launch")
	plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
		console.log(`widgetInfo:`, JSON.stringify(widgetInfo))
	})
})
onShow(() => {
	console.log("App Show")
})
onHide(() => {
	console.log("App Hide")
})
</script>
