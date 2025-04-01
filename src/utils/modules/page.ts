import { pages, subPackages, tabBar } from "@/pages.json"
import { isEmpty } from "lodash-es"
import qs from "qs"

const getLastPage = () => {
	const pages = getCurrentPages()
	return pages[pages.length - 1]
}

export const isTabbarPage = () => {
	if (isEmpty(tabBar)) return false
	const lastPage = getLastPage()
	return tabBar.list.some(e => e.pagePath === lastPage.route)
}

export const getCurrentRoute = () => {
	const lastPage = getLastPage()
	const currRoute = (lastPage as any).$page
	const { fullPath } = currRoute as { fullPath: string }
	const [url, query] = fullPath.split("?")
	return {
		url,
		query: query ? qs.parse(query) : {}
	}
}

/**
 * 得到所有的需要登录的 pages，包括主包和分包的
 * 这里设计得通用一点，可以传递 key 作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的 pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = "needLogin") => {
	// 这里处理主包
	const mainPages = [
		...pages
			.filter(page => !key || page[key])
			.map(page => ({
				...page,
				path: `/${page.path}`
			}))
	]
	// 这里处理分包
	const subPages: any[] = []
	subPackages.forEach(subPackage => {
		const { root, pages } = subPackage
		pages
			.filter((page: object) => !key || page[key])
			.forEach((page: { path: string } & Record<string, any>) => {
				subPages.push({
					...page,
					path: `/${root}/${page.path}`
				})
			})
	})
	return [...mainPages, ...subPages]
}

export const getNeedLoginPages = (): string[] =>
	getAllPages("needLogin").map(page => page.path)

export const needLoginPages: string[] = getNeedLoginPages()
