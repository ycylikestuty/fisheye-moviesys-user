<template>
	<div class="app">
		<!--收藏的电影-->
		<div class="main">
			<div style="margin-top: -40px;margin-left:-10px" class="most-expect-wrapper">
				<div class="panel">
					<div class="panel-header">
						<span class="panel-title">
							<span class="textcolor_orange">收藏的电影</span>
						</span>
					</div>
					<div class="panel-content">
						<dl class="movie-list">
							<dd v-for="item in filmList">
								<div class="movie-item">
									<div class="movie-poster">
										<img class="movie-poster-img" :src="item.img">
									</div>
								</div>
								<div class="movie-detail movie-rt">{{ item.name }}</div>
								<div class="movie-detail movie-rt">
									<el-button style="color: #91949c" type="text" icon="el-icon-delete"
										@click="deletMovie(item.id)">删 除
									</el-button>
								</div>
							</dd>

						</dl>
						<Pagination style="margin-right: 135px;margin-top: 4px;" v-show="movieTotal>0"
							:total="movieTotal" :page.sync="movieQueryParams.pageNum"
							:limit.sync="movieQueryParams.pageSize" @pagination="getCollectMovies" />
					</div>
				</div>
			</div>
		</div>
		<!--收藏的评论-->
		<div class="main">
			<div style="margin-top: -40px;margin-left:-10px" class="most-expect-wrapper">
				<div class="panel">
					<div class="panel-header">
						<span class="panel-title">
							<span class="textcolor_orange">收藏的评论</span>
						</span>
					</div>
					<!--最多收藏/最新-->
					<el-button v-if="this.hot===true"
						style="font-size: 20px;padding-top: 20px;margin-bottom: -10px;margin-left: -16px;color:#5E39B2"
						type="text" @click="getHotComments()">最多收藏</el-button>
					<el-button v-if="this.hot!==true"
						style="font-size: 20px;padding-top: 20px;margin-bottom: -10px;margin-left: -16px;color:#000000"
						type="text" @click="getHotComments()">最多收藏</el-button>
					<font style="font-size: 20px;margin-bottom: -10px;">/</font>
					<el-button v-if="this.hot===false"
						style="font-size: 20px;margin-bottom: -10px;padding-top: 20px;color:#5E39B2" type="text"
						@click="getLastComments()">
						最新</el-button>
					<el-button v-if="this.hot!==false"
						style="font-size: 20px;padding-top: 10px;margin-bottom: -10px;color:#000000" type="text"
						@click="getLastComments()">
						最新</el-button>
					<el-row :gutter="20">
						<!--评论数据-->
						<el-col :span="24" :xs="24">
							<!--表格-->
							<el-table style="margin-top: -4px;margin-left:-20px" width="600px" v-loading="loading" :data="commentList" @selection-change="handleSelectionChange">
								<el-table-column label="评论详情" align="center" key="detail" prop="detail" width="600px">
									<template slot-scope="scope">
										<span
											@click="showCommentDetail(scope.row.detail)">{{ scope.row.detail | ellipsis(15) }}</span>
									</template>
								</el-table-column>
								<el-table-column label="收藏数" align="center" key="collect"  prop="collect" />
								<el-table-column label="发表时间" align="center" key="createTime" width="100px"
									prop="createTime" />
								<el-table-column label="操作" align="center" width="250px"
									class-name="small-padding fixed-width">
									<template slot-scope="scope">
										<el-button size="mini" type="text" icon="el-icon-delete"
											@click="handleDelete(scope.row)">删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-col>
						<Pagination v-show="commentTotal>0" :total="commentTotal"
							:page.sync="commentQueryParams.pageNum" :limit.sync="commentQueryParams.pageSize"
							@pagination="getCollectComments" />
					</el-row>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	export default {

		data() {
			return {
				movieQueryParams: {
					pageNum: 1,
					pageSize: 10,
					userId: undefined,
					kind: 1
				},
				commentQueryParams: {
					pageNum: 1,
					pageSize: 10,
					userId: undefined,
					kind: 2
				},
				collectParams: {
					kind: undefined,
					userId: undefined,
					collectId: undefined
				},
				hot: true,
				commentList: null,
				commentTotal: 0,
				movieTotal: 0,
				filmList: null
			}
		},
		methods: {
			getHotComments() {
				this.hot = true
				this.getCollectComments()
			},
			getLastComments() {
				this.hot = false
				this.getCollectComments()
			},
			getCollectComments() {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				this.commentQueryParams.userId = info.id
				if (this.hot === true) {
					this.$axios.post("/comment/getHotCollectComments", this.commentQueryParams).then(res => {
						this.commentList = res.data.result.rows
						this.commentTotal = res.data.result.total
					})
				} else if (this.hot === false) {
					this.$axios.post("/comment/getLastCollectComments", this.commentQueryParams).then(res => {
						this.commentList = res.data.result.rows
						this.commentTotal = res.data.result.total
					})
				}

			},
			getCollectMovies() {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				this.movieQueryParams.userId = info.id
				this.$axios.post("/movie/getCollectMovies", this.movieQueryParams).then(res => {
					this.filmList = res.data.result.rows
					this.movieTotal = res.data.result.total
				})
			},
			handleDelete(row) {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				this.collectParams = {
					kind: 2,
					userId: info.id,
					collectId: row.id
				}
				this.modal.confirm('确定要删除吗？').then(function() {}).then(() => {
					this.$axios.post("/comment/deleteCollect", this.collectParams).then(res => {
						if (res.data.code === 200) {
							let message = "删除成功"
							this.modal.notifySuccess(message)
							if (this.hot === true) {
								this.getHotComments()
							} else if (this.hot === false) {
								this.getLastComments()
							}
							this.getCollectMovies()
						}
					})
				}).catch(() => {
					if (this.hot === true) {
						this.getHotComments()
					} else if (this.hot === false) {
						this.getLastComments()
					}
					this.getCollectMovies()
				})
			},
			deletMovie(movieId) {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				this.collectParams = {
					kind: 1,
					userId: info.id,
					collectId: movieId,
				}
				this.modal.confirm('确定要删除吗？').then(function() {}).then(() => {
					this.$axios.post("/comment/deleteCollect", this.collectParams).then(res => {
						if (res.data.code === 200) {
							let message = "删除成功"
							this.modal.notifySuccess(message)
							if (this.hot === true) {
								this.getHotComments()
							} else if (this.hot === false) {
								this.getLastComments()
							}
							this.getCollectMovies()
						}
					})
				}).catch(() => {
					if (this.hot === true) {
						this.getHotComments()
					} else if (this.hot === false) {
						this.getLastComments()
					}
					this.getCollectMovies()
				})
			}
		},

		mounted() {
			this.getHotComments()
			this.getCollectMovies()
		}
	}
</script>

<style scoped>
	@import "../assets/css/home.css";

	.app {
		padding: 50px 220px;
	}

	/* .as {
		float: right;
	} */

	.main {
		float: left;
		padding-top: 40px;
	}
</style>
