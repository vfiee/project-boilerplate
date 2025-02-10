export default [
	{
		path: "/",
		meta: {
			title: "首页"
		},
		component: () => import("@/views/home/index.vue")
	}
]
