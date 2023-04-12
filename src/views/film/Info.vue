<template>
	<div>
		<!-- <el-page-header @back="goBack">
		</el-page-header> -->
		<div style="font-weight: bolder;font-size: 25px;margin-top: -60px;padding-bottom: 10px;margin-left: 20px">剧情简介
		</div>
		<div
			style="width: 1000px;   line-height: 30px;text-indent:2.5em;padding-top: 10px;padding-bottom: 10px;margin-left: 20px">
			{{film.synopsis}}
		</div>
		<div style="font-weight: bolder;font-size: 25px;padding-top: 10px;padding-bottom: 40px;margin-left: 20px">电影评论
		</div>
		<!--加精影评-->
		<div v-if="refinementList.id!==null" style="padding-right: 100px" >
			<div class="item">
				<img alt="" 
					style="float: left;width: 55px;height: 55px;border-radius: 50%;margin-left: 20px"
					:src="refinementList.userImg">
				<div class="header-name">
					<!-- <div v-if="refinementList.userNickName===null"
						style="font-weight: 400;color: darkgrey; padding-left: 5px;">
						匿名用户</div> -->
					<div
						style="font-weight: 400;color: darkgrey; padding-left: 5px;margin-top: 10px">
						{{ refinementList.userNickName }}
					</div>
				</div>
				<div
					style="text-indent:2.5em;line-height: 28px;padding-left: 60px;padding-top: 66px;padding-bottom: 20px;color: #91949c">
					{{ refinementList.detail}}
				</div>
				<!--按钮的自定义icon的样式不能写在scoped 否则不生效-->
				<a style="padding-left: 600px;color: #91949c;padding-top:10px;font-size: 14px;">
					{{refinementList.createTime}}
				</a>
				<el-button v-if="refinementList.flagStar===false" style="padding-left: 18px;color: #91949c" type="text"
					icon="el-icon-no-star" @click="starComment(refinementList.id)">
					{{refinementList.star}}
				</el-button>
				<el-button v-if="refinementList.flagStar===true" style="padding-left: 18px;color: #FF0000" type="text"
					icon="el-icon-star" @click="starComment(refinementList.id)">
					{{refinementList.star}}
				</el-button>
				<el-button style="padding-left: 18px;color: #91B1D5" type="text"
					icon="el-icon-top">置 顶
				</el-button>
				<el-button v-if="refinementList.flagCollect===false" style="padding-left: 18px;color: #91949c"
					type="text" icon="el-icon-no-collect" @click="collectComment(refinementList.id)">
					{{refinementList.collect}}
				</el-button>
				<el-button v-if="refinementList.flagCollect===true" style="padding-left: 18px;color: #FF0000"
					type="text" icon="el-icon-collect" @click="collectComment(refinementList.id)">
					{{refinementList.collect}}
				</el-button>
			</div>
		</div>
		<!--最热/最新-->
		<el-button v-if="this.hot===true"
			style="font-size: 20px;padding-top: 10px;padding-bottom: 40px;margin-left: 20px;color:#91B1D5" type="text"
			@click="getHotComments()">最热</el-button>
		<el-button v-if="this.hot!==true"
			style="font-size: 20px;padding-top: 10px;padding-bottom: 40px;margin-left: 20px;color:#000000" type="text"
			@click="getHotComments()">最热</el-button>
		<font style="font-size: 20px;padding-bottom: 40px">/</font>
		<el-button v-if="this.hot===false" style="font-size: 20px;padding-top: 10px;padding-bottom: 40px;color:#91B1D5"
			type="text" @click="getLastComments()">
			最新</el-button>
		<el-button v-if="this.hot!==false" style="font-size: 20px;padding-top: 10px;padding-bottom: 40px;color:#000000"
			type="text" @click="getLastComments()">
			最新</el-button>
		<div style="padding-right: 100px">
			<div class="item" v-for="item in evaluateList">
				<img alt="" style="float: left;width: 55px;height: 55px;border-radius: 50%;margin-left: 20px"
					:src="item.userImg">
				<div class="header-name">
					<div v-if="item.userNickName===null" style="font-weight: 400;color: darkgrey; padding-left: 5px;">
						匿名用户</div>
					<div v-if="item.userNickName!==null"
						style="font-weight: 400;color: darkgrey; padding-left: 5px;margin-top: 10px">
						{{ item.userNickName }}
					</div>
				</div>
				<div
					style="text-indent:2.5em;line-height: 28px;padding-left: 60px;padding-top: 66px;padding-bottom: 20px;color: #91949c">
					{{ item.detail }}
				</div>
				<!--按钮的自定义icon的样式不能写在scoped 否则不生效-->
				<a style="padding-left: 600px;color: #91949c;padding-top:10px;font-size: 14px;">
					{{item.createTime}}
				</a>
				<el-button v-if="item.flagStar===false" style="padding-left: 18px;color: #91949c" type="text"
					icon="el-icon-no-star" @click="starComment(item.id)">
					{{item.star}}
				</el-button>
				<el-button v-if="item.flagStar===true" style="padding-left: 18px;color: #FF0000" type="text"
					icon="el-icon-star" @click="starComment(item.id)">
					{{item.star}}
				</el-button>
				<el-button v-if="item.status===0" style="padding-left: 18px;color: #91949c" type="text"
					icon="el-icon-warning-outline" @click="reportComment(item.id)">举 报</el-button>
				<el-button v-if="item.status===2" style="padding-left: 14px;color: #91949c" type="text"
					icon="el-icon-lock">审核中</el-button>
				<el-button v-if="item.flagCollect===false" style="padding-left: 18px;color: #91949c" type="text"
					icon="el-icon-no-collect" @click="collectComment(item.id)">
					{{item.collect}}
				</el-button>
				<el-button v-if="item.flagCollect===true" style="padding-left: 18px;color: #FF0000" type="text"
					icon="el-icon-collect" @click="collectComment(item.id)">
					{{item.collect}}
				</el-button>
			</div>
			<Pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum"
				:limit.sync="queryParams.pageSize" @pagination="getCommentList" />
		</div>

	</div>
</template>

<script>
	export default {
		name: "Info",
		data() {
			return {
				total: 0,
				starParams: {
					userId: undefined,
					commentId: undefined
				},
				collectParams: {
					kind: undefined,
					userId: undefined,
					commentId: undefined
				},
				queryParams: {
					pageNum: 1,
					pageSize: 2,
					movieId: undefined
				},
				film: null,
				refinementList: null,
				hot: true,
				evaluateList: null,
				filmId: this.$route.query.fid,
			}
		},

		methods: {
			getCommentList() {
				this.queryParams.movieId = this.filmId
				if (this.hot === true) {
					this.$axios.post("/comment/getHotCommentList", this.queryParams).then(res => {
						this.evaluateList = res.data.result.rows
						this.total = res.data.result.total
						console.log(this.evaluateList)
					})
				} else if (this.hot === false) {
					this.$axios.post("/comment/getLastCommentList", this.queryParams).then(res => {
						this.evaluateList = res.data.result.rows
						this.total = res.data.result.total
					})
				}
			},
			getHotComments() {
				// this.queryParams.status=this.hot
				// this.queryParams.movieId = this.filmId
				// this.$axios.post("/comment/getHotCommentList" ,this.queryParams).then(res => {
				// 	this.evaluateList = res.data.result
				// })
				this.hot = true
				this.getCommentList()
			},
			getLastComments() {
				this.hot = false
				this.getCommentList()
				// this.hot = true
				// this.queryParams.status=this.hot
				// this.queryParams.movieId = this.filmId
				// this.$axios.post("/comment/getLastCommentList", this.queryParams).then(res => {
				// 	this.evaluateList = res.data.result
				// 	this.loading = true
				// })
			},
			starComment(commentId) {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				//info.id和commentId都是numer类型
				this.starParams = {
					userId: info.id,
					commentId: commentId
				}
				//下面为错误写法
				// this.starParams.userId = info.id
				// this.starParams.commentId = commentId
				this.$axios.post("/userStar/updateUserStar", this.starParams).then(res => {
					if (res.data.result === true) { //点赞成功
						if (this.hot === true) {
							this.getHotComments()
						} else if (this.hot === false) {
							this.getLastComments()
						}
					}
					this.getRefinementCommentsByMovieId()
				})
			},
			collectComment(collectId) {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				this.collectParams = {
					kind: 2,
					userId: info.id,
					collectId: collectId
				}
				this.$axios.post("/userCollect/updateUserCollect", this.collectParams).then(res => {
					if (res.data.result === true) { //收藏成功
						if (this.hot === true) {
							this.getHotComments()
						} else if (this.hot === false) {
							this.getLastComments()
						}
					}
					this.getRefinementCommentsByMovieId()
				})
			},
			reportComment(commentId) {
				this.$axios.post("/comment/updateCommentStatusById?commentId=" + commentId).then(res => {
					if (res.data.result === true) { //修改成功
						let message = "举报成功"
						this.modal.notifySuccess(message)
						if (this.hot === true) {
							this.getHotComments()
						} else if (this.hot === false) {
							this.getLastComments()
						}
					}
					this.getRefinementCommentsByMovieId()
				})
			},
			goBack() {
				this.$router.go(-1)
			},
			getMovieById() {
				this.$axios.post("/movie/getMovie?Id=" + this.filmId).then(res => {
					this.film = res.data.result
				})
			},
			getRefinementCommentsByMovieId() {
				this.$axios.post("/comment/getRefinementComment?movieId=" + this.filmId).then(res => {
					this.refinementList = res.data.result
				})
			}
		},

		mounted() {
			// this.getCommentList()
			this.getMovieById();
			this.getRefinementCommentsByMovieId();
			this.getHotComments();
		}
	}
</script>

<style scoped>
	.item {
		padding-bottom: 40px;
	}

	.header-name {
		color: #000000;
		padding-top: 5px;
		float: left;
		padding-left: 20px;
		font-weight: bolder;
		font-size: 14px;
		letter-spacing: 2px;
	}

	.film-content {
		padding: 80px 200px;
		letter-spacing: 2px;
	}

	>>>.el-rate__icon {
		font-size: 25px;
	}

	>>>.el-rate__text {
		padding-left: 8px;
		font-size: 30px;
	}
</style>

<style>
	.el-icon-no-star {
		background: url('../../assets/img/未点赞.png') no-repeat;
		font-size: 16px;
		background-size: cover;
	}

	.el-icon-no-star:before {
		content: '替';
		font-size: 16px;
		visibility: hidden;
	}

	.el-icon-star {
		background: url('../../assets/img/已点赞.png') no-repeat;
		font-size: 16px;
		background-size: cover;
	}

	.el-icon-star:before {
		content: '替';
		font-size: 16px;
		visibility: hidden;
	}

	.el-icon-no-collect {
		background: url('../../assets/img/未收藏.png') no-repeat;
		font-size: 16px;
		background-size: cover;
	}

	.el-icon-no-collect:before {
		content: '替';
		font-size: 16px;
		visibility: hidden;
	}

	.el-icon-collect {
		background: url('../../assets/img/已收藏.png') no-repeat;
		font-size: 16px;
		background-size: cover;
	}

	.el-icon-collect:before {
		content: '替';
		font-size: 16px;
		visibility: hidden;
	}

	.el-icon-top {
		background: url('../../assets/img/set-top.png') no-repeat;
		font-size: 16px;
		background-size: cover;
	}

	.el-icon-top:before {
		content: '替';
		font-size: 16px;
		visibility: hidden;
	}
</style>
