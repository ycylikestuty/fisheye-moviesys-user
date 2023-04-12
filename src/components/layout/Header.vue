<template>
	<div class="header">
		<div style="height: 70px;width: 100%">
			<div class="header-logo">
				<img style="width: 50px; height: 50px;float: left" src="../../assets/img/logo.png" alt="" />
				<div class="header-logo-text">鱼眼电影</div>
			</div>
			<div class="header-links">
				<el-link href="/" class="header-link" :underline="false">首页</el-link>
				<el-link href="/films" class="header-link" :underline="false">电影</el-link>
				<el-link href="/collect" class="header-link" :underline="false">收藏</el-link>
				<!-- <el-link href="/love" class="header-link" :underline="false">猜你喜欢</el-link> -->
			</div>
			<div class="header-search">
				<el-autocomplete style="width: 250px" v-model="state" :fetch-suggestions="querySearchAsync"
					placeholder="请输入电影名" @select="handleSelect" />
			</div>
			<el-link v-if="!isLogin" href="/login" style="float: right;padding-top: 23px;padding-right: 50px"
				class="header-link" :underline="false">
				登录
			</el-link>
			<el-dropdown v-if="isLogin" style="float: right;padding-right: 10px">
				<el-button type="text">
					<div class="header-name">{{user.nickname }}
						<i class="el-icon-caret-bottom"></i>
					</div>
					<img alt="" style="width: 45px;height: 45px;border-radius: 50%" :src="user.img">
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>
						<el-link :underline="false" href="/me/comment" style="padding-right: 7px">
							<i style="font-size: 15px; padding-right: 3px" class="el-icon-shopping-cart-2"></i>我的评论
						</el-link>
					</el-dropdown-item>
					<el-dropdown-item>
						<el-link :underline="false" href="/me/persona" style="padding-right: 7px">
							<i style="font-size: 15px; padding-right: 3px" class="el-icon-star-off"></i>我的画像
						</el-link>
					</el-dropdown-item>
					<!-- <el-dropdown-item>
						<el-link :underline="false" href="/me/similar" style="padding-right: 7px">
							<i style="font-size: 15px; padding-right: 3px" class="el-icon-set-up"></i>与你相似
						</el-link>
					</el-dropdown-item> -->
					<el-dropdown-item>
						<el-link :underline="false" href="/me/setting" style="padding-right: 7px">
							<i style="font-size: 15px; padding-right: 3px" class="el-icon-user"></i>个人信息更改
						</el-link>
					</el-dropdown-item>
					<el-dropdown-item divided>
						<el-button type="text" @click="handleLogout()" :underline="false">
							<i style="font-size: 15px; padding-right: 3px" class="el-icon-switch-button"></i>退出登录
						</el-button>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
	// import {
	// 	findById
	// } from "@/api/user";
	import config from "@/config";
	// import {
	// 	SearchFilm
	// } from "@/api/film";

	export default {
		name: "Header",
		data() {
			return {
				isLogin: false,
				searchList: [],
				state: '',
				// timeout: null,
				user: {},
			}
		},

		methods: {
			querySearchAsync(queryString, cb) {
				if (queryString) {
					this.$axios.post("/movie/getMoviesByName",queryString).then(res => {
						setTimeout(() => {
							this.searchList = res.data.result
							cb(this.loadSearchList())
						}, 600)
					})
				}else{
					cb()
				}
			},
			loadSearchList() {
				let arr = new Array(0)
				for (let i = 0; i < this.searchList.length; i++) {
					arr.push({
						id: this.searchList[i].id,
						value: this.searchList[i].name,
					})
				}
				return arr
			},
			handleSelect(item) {
				this.$router.push('/film/info?fid=' + item.id)
			},
			handleLogout() {
				// localStorage.removeItem("uid")
				// localStorage.removeItem("token")
				// this.$router.push('/login')
				this.modal.confirm('确定要退出系统吗？').then(function() {}).then(() => {
					this.$axios.post("/logout").then(res => {
						localStorage.clear()
						sessionStorage.clear();
						this.$store.commit('clearData')
						// this.$store.commit('initTag')
						// this.$store.commit("changeRouteStatus", false)
						this.$router.push('/login')
					})
				}).catch(function() {
					this.modal.msgError("退出失败")
				})
			},
			getUserInfo() {
				// if (localStorage.getItem("uid") !== null) {
				// 	findById(localStorage.getItem("uid")).then(res => {
				// 		this.isLogin = true;
				// 		this.user = res.data;
				// 	})
				// }

				let info = this.$store.state.userInfo
				console.log(info)
				console.log(localStorage.getItem('userInfo'))
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				console.log(info)
				this.isLogin = true;
				this.user = info
			}
		},
		mounted() {//与create方法不同，具体在于vue的生命周期
			this.getUserInfo();
			// setTimeout(() => {
			// 	this.getUserInfo()
			// }, 100)
		}
	}
</script>

<style scoped>
	.header {
		height: 70px;
		background: #FFFFFF;
		box-shadow: 0 2px 12px 0 rgb(0 0 0/10%);
		border: 1px solid #EBEEF5;
	}

	.header-logo {
		padding-top: 10px;
		padding-left: 10%;
		float: left;
		letter-spacing: 2px;
	}

	.header-logo-text {
		font-size: 30px;
		padding-top: 3px;
		font-weight: bolder;
		padding-left: 15px;
		float: left;
	}

	.header-search {
		float: left;
		width: 300px;
		border-radius: 20px;
		padding-top: 16px;
	}

	.header-links {
		float: left;
		padding-left: 50px;
		padding-top: 23px;
	}

	.header-link {
		letter-spacing: 2px;
		font-size: 17px;
		padding-right: 40px;
	}

	.header-name {
		color: #000000;
		float: right;
		padding-top: 15px;
		padding-left: 15px;
		font-weight: bolder;
		font-size: 15px;
		letter-spacing: 2px;
	}

	>>>.el-input__inner {
		border-radius: 20px;
		height: 40px;
	}
</style>
