import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from "@/components/layout/Layout"
import Me from "@/views/me/Index"

Vue.use(VueRouter);

const routes = [

	{
		path: '/login',
		name: 'Login',
		component: () => import("@/views/Login")
	},

	{
		path: '/register',
		name: 'Register',
		component: () => import("@/views/Register")
	},

	//公共布局下的路由
	{
		path: '/',
		component: Layout,
		children: [{
				path: '',
				component: () => import("@/views/Home")
			},
			{
				path: '/film',
				component: () => import("@/views/film/Index"),
				children: [{
						path: 'info',
						component: () => import("@/views/film/Info")
					},
					// {
					// 	path: 'ticket',
					// 	component: () => import("@/views/film/Ticket")
					// }
				]
			},
			{
				path: '/films',
				component: () => import("@/views/Films")
			},
			{
				path: '/collect',
				component: () => import("@/views/Collect")
			},
			// {
			// 	path: '/love',
			// 	component: () => import("@/views/Love")
			// },
			// {
			// 	path: '/leaving',
			// 	component: () => import("@/views/Leaving")
			// },
			{
				path: '/me',
				component: Me,
				children: [{
						path: 'comment',
						component: () => import("@/views/me/Comment")
					},
					{
						path: 'persona',
						component: () => import("@/views/me/Persona")
					},
					{
						path: 'setting',
						component: () => import("@/views/me/Setting")
					},
					{
						path: 'similar',
						component: () => import("@/views/me/Similar")
					}
				]
			},
		]
	}

];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router
