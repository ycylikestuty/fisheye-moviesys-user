<template>
	<div class="films">
		<div class="tags-panel">
			<ul class="tags-lines">
				<!--电影类型-->
				<li class="tags-line">
					<div class="tags-title">类型 :</div>
					<ul class="tags">
						<li v-for="item in typeList" :class="selectType===item ? 'active' : ''"
							@click="handleTypeSelect(item)">
							<router-link :to=" '/films?area='+ selectArea + '&type=' + item + '&year=' + selectYear ">
								{{ item }}
							</router-link>
						</li>
					</ul>
				</li>
				<!--地区-->
				<li class="tags-line">
					<div class="tags-title">地区 :</div>
					<ul class="tags">
						<li v-for="item in areaList" :class="selectArea===item ? 'active' : ''"
							@click="handleAreaSelect(item)">
							<router-link :to=" '/films?area='+ item + '&type=' + selectType+ '&year=' + selectYear ">
								{{ item }}
							</router-link>
						</li>
					</ul>
				</li>
				<!--年份-->
				<li class="tags-line">
					<div class="tags-title">年份 :</div>
					<ul class="tags">
						<li v-for="item in yearList" :class="selectYear===item ? 'active' : ''"
							@click="handleYearSelect(item)">
							<router-link :to=" '/films?area='+ selectArea + '&type=' + selectType + '&year=' + item">
								{{ item }}
							</router-link>
						</li>
					</ul>
				</li>
			</ul>
		</div>

		<div>
			<el-row :gutter="20" style="padding-top: 60px;">
				<el-col style="padding-bottom: 40px;text-align: center;" v-for="(item, index) in filmList" :key="index"
					:span="4">
					<router-link :to=" '/film/info?fid=' + item.id">
						<el-card shadow="hover" style="padding: 0">
							<img style="width: 100%; height: 230px;padding-bottom: 10px" :src="item.img" alt="">
							<span class="s">{{ item.name }}</span>
						</el-card>
					</router-link>
				</el-col>
			</el-row>
			<Pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum"
				:limit.sync="queryParams.pageSize" @pagination="getAllMovieByTypeAreaYear" />
		</div>
	</div>
</template>

<script>
	export default {

		name: "Films",

		data() {
			return {
				total: 0,
				selectType: '全部',
				selectArea: '全部',
				selectYear: '全部',
				typeList: [],
				areaList: [],
				yearList: [],
				filmList: [],
				queryParams: {
					pageNum: 1,
					pageSize: 5,
					year: undefined,
					area: undefined,
					type: undefined
				}
			}
		},

		mounted() {
			this.getAllType()
			this.getAllArea()
			this.getAllYear()
			this.getAllMovieByTypeAreaYear()
		},


		methods: {
			getAllType() {
				this.typeList.push("全部")
				this.$axios.get("/type/list").then(res => {
					res.data.result.forEach(
						item => {
							this.typeList.push(
								item.name
							)
						}
					)
				})
			},
			getAllArea() {
				this.areaList.push("全部")
				this.$axios.get("/movie/getAllMovieArea").then(res => {
					res.data.result.forEach(
						item => {
							this.areaList.push(
								item
							)
						}
					)
				})
			},
			getAllYear() {
				this.yearList.push("全部")
				this.$axios.get("/movie/getAllMovieYear").then(res => {
					res.data.result.forEach(
						item => {
							this.yearList.push(
								item
							)
						}
					)
				})
			},
			getAllMovieByTypeAreaYear() {
				this.queryParams.year = this.selectYear,
					this.queryParams.area = this.selectArea,
					this.queryParams.type = this.selectType
				console.log("params:" + this.queryParams)
				this.$axios.post("/movie/getAllMovieByTypeAreaYear", this.queryParams).then(res => {
					this.filmList = res.data.result.rows
					this.total = res.data.result.total
				})
			},
			handleTypeSelect(item) {
				this.selectType = item;
				this.getAllMovieByTypeAreaYear()
			},

			handleAreaSelect(item) {
				this.selectArea = item;
				this.getAllMovieByTypeAreaYear()
			},

			handleYearSelect(item) {
				this.selectYear = item;
				this.getAllMovieByTypeAreaYear()
			},
		},

	}
</script>

<style scoped>
	@import "../assets/css/movie-list.css";

	.films {
		padding: 20px 220px;
	}

	>>>.el-card__body {
		padding: 0 0 10px;
	}

	.s {
		margin-bottom: 10px;
		padding: 0 8px;
		letter-spacing: 1px;
		color: coral;
		text-align: center;
	}
</style>
