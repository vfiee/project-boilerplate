import {
	GLOBAL_APP_BEFORE_INSTALL,
	GLOBAL_APP_BEFORE_UPDATE,
	GLOBAL_APP_INSTALL_FAILED,
	GLOBAL_APP_INSTALL_SUCCESS,
	GLOBAL_APP_UPDATE,
	GLOBAL_APP_UPDATE_CANCEL,
	GLOBAL_APP_UPDATE_FAILED,
	GLOBAL_APP_UPDATE_PROGRESS,
	GLOBAL_APP_UPDATE_SUCCESS
} from "@/constant"
import { version } from "~/package.json"
import { useAxios } from "./useAxios"

export async function checkUpdate() {
	const { data, execute } = useAxios("/latest/version", { method: "get" })
	await execute()
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
			// 更新前
			uni.$emit(GLOBAL_APP_BEFORE_UPDATE)
			// 下载最新版本
			downloadLatestApp(data.value)
			// 更新中
			uni.$emit(GLOBAL_APP_UPDATE)
		})
		.catch(() => {
			// 更新取消
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
				// 更新失败
				uni.$emit(GLOBAL_APP_UPDATE_FAILED)
				return
			}
			// 更新成功
			uni.$emit(GLOBAL_APP_UPDATE_SUCCESS)
			// 安装前
			uni.$emit(GLOBAL_APP_BEFORE_INSTALL)
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
