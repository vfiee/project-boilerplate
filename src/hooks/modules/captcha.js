import { REG_PHONE } from "@/config"
import { showSuccessToast, showToast } from "@/utils"
import { computed } from "vue"
import { useCountDown } from "./countDown"
import { useLoading } from "./loading"

export function useCaptcha() {
	const { loading, startLoading, endLoading } = useLoading()
	const { count, start, stop, isCounting } = useCountDown(60)

	const label = computed(() => {
		let text = "获取验证码"

		const countingLabel = `${count.value} 秒后重新获取`

		if (loading.value) {
			text = ""
		}

		if (isCounting.value) {
			text = countingLabel
		}

		return text
	})

	function isPhoneValid(phone) {
		if (phone.trim() === "") {
			showToast("请输入手机号")
			return false
		}

		if (!REG_PHONE.test(phone)) {
			showToast("手机号不正确")
			return false
		}

		return true
	}

	async function getCaptcha(phone) {
		const valid = isPhoneValid(phone)

		if (!valid || loading.value) return

		startLoading()

		// request
		await new Promise(resolve => {
			setTimeout(resolve, 500)
		})

		showSuccessToast("验证码发送成功")

		start()

		endLoading()
	}

	return {
		label,
		start,
		stop,
		isCounting,
		loading,
		getCaptcha
	}
}
