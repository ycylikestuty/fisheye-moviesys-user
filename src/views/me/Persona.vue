<template>
	<div style="width: 100%">
		<h3 style="letter-spacing: 1px;font-weight: 400;padding-bottom: 6px">我的画像</h3>
		<div class="panel-header">
			<span class="panel-title">
				<span class="textcolor_orange">当前画像</span>
			</span>
			<div style="margin-top:-80px;">
				<div id="newChart" style="width: 600px; height: 500px"></div>
			</div>
		</div>
		<div class="panel-header">
			<span class="panel-title">
				<span class="textcolor_orange">历史画像</span>
			</span>
			<div style="margin-top:-80px;">
				<div id="oldChart" style="width: 600px; height: 500px"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import * as echarts from "echarts";
	import "echarts-wordcloud";

	export default {
		data() {
			return {
				newWordList: [],
				oldWordList: []
			}
		},

		mounted() {
			this.getOldWordList()
		},

		methods: {
			getOldWordList() {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				const oldUserLabelDTO = {
					userId: info.id,
					status: 0
				};
				this.$axios.post("/label/getOldUserLabelList", JSON.stringify(oldUserLabelDTO)).then(res => {
					res.data.result.forEach(
						item => {
							this.oldWordList.push({
								name: item.name,
								value: item.rate
							})
						}
					)
					this.initchart()
				})
				this.$axios.post("/label/getNewUserLabelList", JSON.stringify(oldUserLabelDTO)).then(res => {
					res.data.result.forEach(
						item => {
							this.newWordList.push({
								name: item.name,
								value: item.rate
							})
						}
					)
					this.initchart()
				})
			},
			initchart() {
				let maskImage = new Image(); //可以根据图片形状生成有形状的词云图
				//自定义形状需要一张黑白图（渲染的时候会在黑色形状内部渲染，白色背景会被忽略，
				//所以最好是填充的，后文有图	可以转换回来看看）
				//然后将其转换为base64编码
				maskImage.src =
					"data:image/png;base64,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";
				let newChart = echarts.init(document.querySelector("#newChart"));
				let oldChart = echarts.init(document.querySelector("#oldChart"));
				newChart.setOption({
					series: [{
						type: "wordCloud",
						//词之间的距离
						gridSize: 8,
						//字的大小范围: minimum 12px and maximum 60px
						sizeRange: [14, 40],
						//词的旋转方向，范围为[-90,90]，步长为45
						//[0,0]--代表着没有角度即词为水平方向
						// rotationRange: [-45, 0, 45, 90],
						// rotationRange: [ 0,90],
						rotationRange: [0, 0],
						maskImage: maskImage, // 图片形状
						//随机生成字体颜色
						textStyle: {
							color: function() {
								return (
									"rgb(" +
									Math.round(Math.random() * 255) +
									", " +
									Math.round(Math.random() * 255) +
									", " +
									Math.round(Math.random() * 255) +
									")"
								);
							},
						},
						//位置
						left: "center",
						top: "center",
						right: null,
						bottom: null,
						width: "200%",
						height: "200%",
						//数据
						data: this.newWordList
					}]
				})

				oldChart.setOption({
					series: [{
						type: "wordCloud",
						gridSize: 8,
						sizeRange: [14, 40],
						rotationRange: [0, 0],
						maskImage: maskImage, // 图片形状
						textStyle: {
							color: function() {
								return (
									"rgb(" +
									Math.round(Math.random() * 255) +
									", " +
									Math.round(Math.random() * 255) +
									", " +
									Math.round(Math.random() * 255) +
									")"
								);
							},
						},
						left: "center",
						top: "center",
						right: null,
						bottom: null,
						width: "200%",
						height: "200%",
						data: this.oldWordList
					}],
				})
			}
		}
	}
</script>

<style scoped>
	.box-card {
		margin-bottom: 5px;
	}

	>>>.el-card__header {
		background: #C0C4CC;
	}

	.item-film-img {
		float: left;
		width: 80px;
		height: 100px;
		padding-bottom: 20px;
		padding-right: 10px;
	}

	.item-film-name {
		letter-spacing: 2px;
		font-weight: 500;
		font-size: 18px;
		padding-bottom: 13px;
	}

	.item-film-seat {
		letter-spacing: 1px;
		font-size: 12px;
		padding-bottom: 8px;
		padding-left: 10px;
		color: #91949c;
	}


	.item-film-time {
		font-size: 12px;
		padding-left: 10px;
		letter-spacing: 1px;
		color: #91949c;
	}

	.c-img {
		width: 100%;
		height: 100%;
	}

	.sub-btn {
		float: right;
		color: #000000;
		height: 60px;
		width: 120px;
		background: #f34d41;
		letter-spacing: 2px;
		line-height: 33px;
		text-align: center;
		font-weight: 500;
		font-size: 18px;
	}

	.order-footer1 {
		float: right;
		line-height: 60px;
		padding-right: 40px;
	}

	a {
		color: #333333;
	}

	.di {
		text-align: center;
		font-size: 20px;
		letter-spacing: 3px;
		font-weight: bold;
		padding-top: 10px;
	}
</style>
