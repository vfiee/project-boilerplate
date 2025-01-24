import { defineStore, StoreDefinition } from "pinia"
import { getStorage, setStorage } from "./utils"

export type EnvType = "development" | "test" | "production" | "mock"

export type EnvModuleName = "common" | string

export interface EnvModule {
	url: string
	proxyPrefix: string
	[key: string]: any
}

export interface EnvModules {
	[key: EnvModuleName]: EnvModule
}

export interface EnvConfig {
	env: EnvType
	name: string
	active?: boolean
	modules: EnvModules
	[key: string]: any
}

const CURRENT_STORAGE_ENV_KEY = `ENV_CONFIG_CURRENT_ENV_KEY`

function setActiveEnv(envs: EnvConfig[], index: number) {
	for (let i = 0; i < envs.length; i++) {
		envs[i].active = i === index
		setStorage(CURRENT_STORAGE_ENV_KEY, envs[index])
	}
	return envs
}

function getEnvs(configs: EnvConfig[]): EnvConfig[] {
	// 1. 查看本地缓存是否有当前环境,如果有对比配置是否发生改变
	// 2. 本地没有缓存,查看用户传入的配置是否有设置active
	// 3. 用户没有设置当前环境, 根据环境变量(process.env.NODE_ENV)匹配当前的环境

	const storageEnv = getStorage<EnvConfig>(CURRENT_STORAGE_ENV_KEY)!
	if (storageEnv) {
		const index = configs.findIndex(config => config.env === storageEnv.env)
		if (JSON.stringify(storageEnv) === JSON.stringify(configs[index]))
			return configs
		return setActiveEnv(configs, index)
	}
	const activeIndex = configs.findIndex(config => config.active)
	if (activeIndex !== -1) {
		return setActiveEnv(configs, activeIndex)
	}
	const envIndex = configs.findIndex(
		config => config.env === process.env.NODE_ENV
	)
	if (envIndex !== -1) {
		return setActiveEnv(configs, envIndex)
	}
	const prodEnvIndex = configs.findIndex(config => config.env === "production")
	return setActiveEnv(configs, prodEnvIndex)
}

export type EnvStore = StoreDefinition<
	string,
	EnvStoreState,
	EnvStoreGetters,
	EnvStoreActions
>

export interface EnvStoreState {
	visible: boolean
	envs: EnvConfig[]
}

export interface EnvStoreActions {
	setCurrentEnv: (env: EnvConfig) => void
	show: () => void
	hide: () => void
	toggle: (visible?: boolean) => void
	getCurrentEnvModule: (moduleName?: EnvModuleName) => EnvModule
	setCurrentEnvByIndex: (index: number) => void
}

export interface EnvStoreGetters {
	mapColumns: (this: EnvStore, state: EnvStoreState) => EnvConfig[]
	current: (this: EnvStore, state: EnvStoreState) => EnvConfig
}

export interface EnvStoreOptions {
	config: EnvConfig[]
}

let $envStore: EnvStore
export const initEnvStore = (options: EnvStoreOptions): EnvStore => {
	if ($envStore) return $envStore
	$envStore = defineStore("$env", {
		state() {
			return {
				visible: false,
				envs: getEnvs(options.config)
			}
		},
		actions: {
			show() {
				this.visible = true
			},
			hide() {
				this.visible = false
			},
			toggle(visible?: boolean) {
				const isBoolean = typeof visible === "boolean"
				if (isBoolean) {
					this.visible = visible
					return
				}
				this.visible = !this.visible
			},
			setCurrentEnvByIndex(index: number) {
				const envConfig = this.envs[index]
				if (!envConfig) return
				this.setCurrentEnv(envConfig)
			},
			setCurrentEnv(env: EnvConfig) {
				this.envs.forEach((item: EnvConfig) => {
					item.active = item.env === env.env
				})
				setStorage(CURRENT_STORAGE_ENV_KEY, env)
			},
			getCurrentEnvModule(moduleName: EnvModuleName = "common") {
				return this.current.modules?.[moduleName]
			}
		},
		getters: {
			current(state: EnvStoreState) {
				return state.envs.filter((item: EnvConfig) => item.active)?.[0]
			},
			mapColumns(state: EnvStoreState) {
				return state.envs.map(env => ({
					...env,
					className: env.active ? "text-[#2dd4bf] font-bold" : ""
				}))
			}
		}
	})
	return $envStore
}

export default initEnvStore
