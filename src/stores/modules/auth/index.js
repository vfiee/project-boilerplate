import { STORAGE_USERINFO_KEY } from "@/config"
import router from "@/router"
import { getStorage, removeStorage, setStorage } from "@/utils"
import { useEventListener } from "@vueuse/core"
import { get, merge } from "lodash-es"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useAuthStore = defineStore("auth", () => {
	const userInfo = ref(getStorage(STORAGE_USERINFO_KEY))

	// getters
	const isLogin = computed(() => !!get(userInfo.value, "token"))

	const useHeaders = computed(() => {
		return {
			token: isLogin.value ? userInfo.value.token : ""
		}
	})
	const set = userinfo => {
		userInfo.value = userinfo
	}
	const update = updateUserinfo => {
		userInfo.value = merge(userInfo.value, updateUserinfo)
	}
	const remove = () => {
		userInfo.value = undefined
		removeStorage(STORAGE_USERINFO_KEY)
	}

	const logout = () => {
		remove()
		router.replace("/login")
	}

	useEventListener("beforeunload", () => {
		if (!userInfo.value) return
		setStorage(STORAGE_USERINFO_KEY, userInfo.value)
	})

	return {
		userInfo,
		roles,
		isLogin,
		useHeaders,
		set,
		update,
		remove,
		logout
	}
})
