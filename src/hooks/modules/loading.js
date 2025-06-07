import { useBoolean } from "./boolean"

export function useLoading() {
	const { bool: loading, setTrue, setFalse, toggleBoolean } = useBoolean()

	const startLoading = setTrue
	const endLoading = setFalse
	const toggleLoading = toggleBoolean

	return {
		loading,
		endLoading,
		startLoading,
		toggleLoading
	}
}
