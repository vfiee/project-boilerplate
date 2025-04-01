import {
    GLOBAL_APP_BEFORE_UPDATE,
    GLOBAL_APP_INSTALL_FAILED,
    GLOBAL_APP_INSTALL_START,
    GLOBAL_APP_INSTALL_SUCCESS,
    GLOBAL_APP_UPDATE,
    GLOBAL_APP_UPDATE_CANCEL,
    GLOBAL_APP_UPDATE_PROGRESS,
    GLOBAL_APP_UPDATE_SUCCESS
} from "@/constant"
import { version } from "~/package.json"
import { useAxios } from "./axios"

export async function checkUpdate() {
	const { data, execute } = useAxios("/latest/version", {
		method: "get"
	})
	await execute()
	// @ts-expect-error there is not real version in mock
	const latestVersion = data.value?.version || version
	if (latestVersion <= version) return
	uni
		.showModal({
			title: "检查更新",
			content: `当前应用版本为：${version}，最新版本为：${latestVersion}，前往更新？`,
			cancelText: "暂不更新",
			cancelColor: "#666",
			confirmColor: "#00ab84",
			confirmText: "马上更新"
		})
		.then(() => {
			uni.$emit(GLOBAL_APP_BEFORE_UPDATE)
			// @ts-ignore ignore to check data type
			downloadLatestApp(data.value)
			uni.$emit(GLOBAL_APP_UPDATE)
		})
		.catch(() => {
			uni.$emit(GLOBAL_APP_UPDATE_CANCEL)
			console.log("用户取消了更新")
		})
}

async function downloadLatestApp({ url }) {
	const task = plus.downloader.createDownload(
		url,
		{ filename: "_doc/download/" },
		(downloader, status) => {
			if (status !== 200) {
				uni.$emit(GLOBAL_APP_INSTALL_FAILED)
				return
			}
			uni.$emit(GLOBAL_APP_UPDATE_SUCCESS)
			uni.$emit(GLOBAL_APP_INSTALL_START)
			plus.runtime.install(
				downloader.filename,
				{},
				() => {
					uni.$emit(GLOBAL_APP_INSTALL_SUCCESS)
				},
				() => {
					uni.$emit(GLOBAL_APP_INSTALL_FAILED)
				}
			)
		}
	)
	task.addEventListener("statechanged", (task, status) => {
		if (status !== 3) return
		const progress = (task.downloadedSize / task.totalSize) * 100
		uni.$emit(GLOBAL_APP_UPDATE_PROGRESS, { task, progress })
	})
	task.start()
}
