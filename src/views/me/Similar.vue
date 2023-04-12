<template>
	<div style="width: 100%">
		<h3 style="letter-spacing: 1px;font-weight: 400;padding-bottom: 6px">与你相似</h3>
		<!--表格-->
		<el-table style="margin-top: -4px;margin-left:-20px" width="600px" :data="commentList">
			<el-table-column label="评论详情" align="center" key="detail" prop="detail" width="450px">
				<template slot-scope="scope">
					<span @click="showCommentDetail(scope.row.detail)">{{ scope.row.detail | ellipsis(48) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="电影名" align="center" key="movieName" prop="movieName" />
			<el-table-column label="发表时间" align="center" key="createTime" width="100px" prop="createTime" />
			<el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button size="mini" type="text" icon="el-icon-edit"
						@click="handleUpdate(JSON.stringify(scope.row))">修改
					</el-button>
					<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-permission="['comment:delete']">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<Pagination v-show="total>0" :total="total" :page.sync="UserCommentQueryParams.pageNum"
			:limit.sync="UserCommentQueryParams.pageSize" @pagination="getUserComments" />
		<!-- 添加或修改电影配置对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="评论" prop="detail" style="margin-top:-15px">
							<el-input v-model="form.detail" type="textarea" placeholder="请输入评论" maxlength="30"
								:rows="5" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('form')">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form: {},
				title: undefined,
				open: false,
				total: 0,
				commentList: [],
				UserCommentQueryParams: {
					pageNum: 1,
					pageSize: 10,
					userId: undefined
				}
			}
		},

		mounted() {
			this.getUserComments()
		},

		methods: {
			resetForm(formName) {
				if (this.$refs[formName]) {
					this.$refs[formName].resetFields();
				}
			},
			// 表单重置
			reset() {
				this.form = {
					detail: undefined
				}
			
				this.resetForm("form")
			},
			// 取消按钮
			cancel() {
				this.open = false
				this.reset()
			},
			getUserComments() {
				let info = this.$store.state.userInfo
				if (info === null || info === '' || info === undefined) {
					info = JSON.parse(localStorage.getItem('userInfo'))
				}
				this.UserCommentQueryParams.userId = info.id
				this.$axios.post("/comment/getCommentsByUserId", this.UserCommentQueryParams).then(res => {
					this.commentList = res.data.result.rows
					this.total = res.data.result.total
				})
			},
			handleDelete(row) {
				const movieIds = row.id
				this.modal.confirm('确定要删除评论吗？').then(function() {}).then(() => {
					this.$axios.delete("/comment/delete?ids=" + movieIds).then(res => {
						if (res.data.code === 200) {
							this.modal.notifySuccess(res.data.result)
							this.getUserComments()
						}
					})
				}).catch(() => {
					this.getUserComments()
				})
			},
			handleUpdate(row) {
				this.form = JSON.parse(row)
				this.open = true
				this.title = "修改影评"
			},
			submitForm(formName) {
				if (this.title === "修改影评") {
					this.$axios.post("/comment/updateCommentDetail", this.form).then(res => {
						if (res.data.code === 200) {
							let message = "修改成功"
							this.modal.notifySuccess(message)
							this.getUserComments()
						}
						
					})
				}
				this.open = false
			},
		},
		//设置过滤器,当文本长度超过limit使用省略号
		filters: {
			ellipsis(value, limit) {
				if (!value) return ''
				if (value.length > limit) {
					return value.slice(0, limit) + '...'
				}
				return value
			},
		},
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
