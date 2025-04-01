import { useToggle } from "@vueuse/core"

export function useBoolean(initialValue = false) {
	const [bool, toggleBoolean] = useToggle(initialValue)

	const setFalse = () => {
		toggleBoolean(false)
	}
	const setTrue = () => {
		toggleBoolean(true)
	}
	return {
		bool,
		setTrue,
		setFalse,
		toggleBoolean
	}
}
