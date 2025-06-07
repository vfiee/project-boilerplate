import { GLOBAL_USERINFO } from "@/constant"
import { getStorage } from "@/utils"
import { get, merge } from "lodash-es"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useAuthStore = defineStore("auth", () => {
	const userInfo = ref(getStorage(GLOBAL_USERINFO))

	// getters
	const token = computed(() => get(userInfo.value, "token", ""))
	const isLogin = computed(() => Boolean(token.value))
	const useHeaders = computed(() => {
		return {
			Authorization: token.value
		}
	})

	// 更新用户信息
	const updateUserinfo = userinfo => {
		userInfo.value = merge(userInfo.value || {}, userinfo)
	}

	// 移除用户信息
	const removeUserinfo = () => (userInfo.value = undefined)

	// 退出登录
	function logout() {
		removeUserinfo()
	}

	return {
		userInfo,
		isLogin,
		token,
		logout,
		useHeaders,
		updateUserinfo,
		removeUserinfo
	}
})
