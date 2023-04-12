<template>
	<div class="film">
		<div class="film-header">
		</div>
		<div class="film-card">
			<img alt="" style="width: 100%;height: 100%" :src="film.img">
		</div>
		<div class="film-des">
			<div class="p1">{{ film.name }}
				<!--评分-->
				<el-rate style="float: right;margin-left: 80px;margin-top: 6px;" v-model="value" disabled show-score
					text-color="#ff9900" score-template="{value}" :max="10">
				</el-rate>
			</div>
			<div class="p2">导演 : {{ film.director }}</div>
			<div class="p2">主演 : {{ film.starring }}</div>
			<div class="p2">电影类型 : {{ film.type }}</div>
			<div class="p2">时长 : {{ film.duration}}分钟</div>
			<div class="p2">上映日期 : {{ film.year }}年上映</div>
			<div style="padding-top: 30px">
				<el-button @click="collectMovie" v-if="film.flagCollect===false"
					style="width: 230px;letter-spacing: 2px">
					<i style="padding-right: 5px;font-size: 15px" class="el-icon-star-off"></i>收藏
				</el-button>
				<el-button @click="collectMovie" v-if="film.flagCollect===true"
					style="width: 230px;letter-spacing: 2px">
					<i style="padding-right: 5px;font-size: 15px" class="el-icon-star-on"></i>已收藏
				</el-button>
				<!-- <el-button @click="openComment" style="width: 130px;letter-spacing: 2px">
					<i style="padding-right: 5px;font-size: 15px" class="el-icon-circle-close"></i>不感兴趣
				</el-button> -->
				<el-button @click="openComment" style="margin-left: 100px;   width: 230px;letter-spacing: 2px">
					<i style="padding-right: 5px;font-size: 15px" class="el-icon-edit-outline"></i>去评价
				</el-button>
			</div>
		</div>

		<div class="film-content">
			<router-view />
		</div>

		<el-dialog :show-close=false title="电影评价" :visible.sync="dialogVisible" width="30%">
			<div class="block">
				<el-rate v-model="form.score" :colors="colors" :max="10">
				</el-rate>
			</div>
			<el-input style="margin-top: 40px" type="textarea" :rows="8" placeholder="请输入评论" v-model="form.detail">
			</el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitComment">确 认 提 交</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "Film",
		data() {
			return {
				collectParams: {
					kind: undefined,
					userId: undefined,
					commentId: undefined
				},
				colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
				filmId: this.$route.query.fid,
				value: null,
				// list: [{}, {}, {}],
				dialogVisible: false,
				film: null,
				form: {
					movieId: undefined,
					userId: undefined,
					score: undefined,
					detail: undefined,
				},
				scoreForm: {
					id: undefined,
					score: undefined
				}
			}
		},

		methods: {
			collectMovie() {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				this.collectParams = {
					kind: 1,
					userId: info.id,
					collectId: this.filmId
				}
				this.$axios.post("/userCollect/updateUserCollect", this.collectParams).then(res => {
					if (res.data.result === true) { //收藏成功
						this.getMovieById();
					}
				})
			},

			openComment() {
				this.dialogVisible = true
			},

			submitComment() {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				this.form.movieId = this.filmId
				this.form.userId = info.id
				console.log("form:" + JSON.stringify(this.form))
				this.$axios.post("/comment/addComment", this.form).then(
					res => {
						if (res.data.result === "您正被禁言，无法书写评论!") {
							this.dialogVisible = false
							let message = res.data.result
							this.modal.msgError(message)
							
						} else {
							this.scoreForm = {
								id: this.filmId,
								score: this.form.score
							}
							this.$axios.post("/movie/updateMovieScore", this.scoreForm).then(
								res => {
									this.dialogVisible = false
									let message = "发布成功"
									this.modal.notifySuccess(message)
									this.getMovieById()
								}
							)
						}
					}
				)
			},
			getMovieById() {
				this.$axios.post("/movie/getMovie?Id=" + this.filmId).then(res => {
					this.film = res.data.result
					var movieType = this.film.type[0] + ","
					var i = 1
					for (i = 1; i < this.film.type.length - 1; i++) {
						movieType += this.film.type[i] + ","
					}
					movieType += this.film.type[i]
					// console.log(movieType)
					this.film.type = movieType
					this.value = this.film.score
				})
			}
		},

		mounted() {
			this.getMovieById();
		}
	}
</script>

<style scoped>
	.film-header {
		position: relative;
		width: 100%;
		height: 380px;
		/* background: #5a84fd; */
		margin-top: 12px;
	}

	.film-content {
		padding: 80px 200px;
		letter-spacing: 2px;
	}

	.p1 {
		font-weight: bolder;
		letter-spacing: 3px;
		color: #000000;
		font-size: 30px;
		padding-top: 20px;
		padding-bottom: 10px;
	}

	.p2 {
		font-size: 14px;
		padding-top: 16px;
		letter-spacing: 2px;
		color: #000000;
	}

	.film-card {
		width: 240px;
		height: 300px;
		background: #FFFFFF;
		margin-right: 100px;
		margin-top: -44px;
		margin-left: 220px;
		position: absolute;
		overflow: hidden;
		top: 160px;
		z-index: 999;
	}

	.film-des {
		margin-top: -44px;
		margin-left: 540px;
		position: absolute;
		overflow: hidden;
		top: 150px;
		z-index: 999;
	}

	>>>.el-rate__icon {
		font-size: 25px;
	}

	>>>.el-rate__text {
		padding-left: 8px;
		font-size: 30px;
	}
</style>
