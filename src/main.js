import Router from "@/router"
import dayjs from "dayjs"
import Duration from "dayjs/plugin/duration"
import { createPinia } from "pinia"
import { Lazyload } from "vant"
import { createApp } from "vue"
import App from "./App.vue"

function initDayjs() {
	dayjs.locale("zh-cn")
	dayjs.extend(Duration)
}

initDayjs()

createApp(App).use(createPinia()).use(Lazyload).use(Router).mount("#app")
