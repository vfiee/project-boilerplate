import { STORAGE_USERINFO_KEY } from "@/config"
import { get } from "lodash-es"
import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
	state() {
		return {
			userinfo: getStorage(STORAGE_USERINFO_KEY)
		}
	},
	actions: {},
	getters: {
		isLogin() {
			return !!get(this.userinfo, "token")
		},
		useHeader() {
			return this.isLogin ? `Bearer ${get(this.userinfo, "token")}` : ""
		}
	}
})
