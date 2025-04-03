export default [
	{
		path: "/login",
		meta: {
			title: "登录"
		},
		component: () => import("@/views/login/index.vue")
	},
	{
		path: "/",
		meta: {
			title: "首页"
		},
		component: () => import("@/views/index/index.vue")
	}
]
