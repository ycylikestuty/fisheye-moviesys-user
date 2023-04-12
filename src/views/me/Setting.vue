<template>
	<div class="main-class">
		<el-row :gutter="20">
			<el-col :span="16" :xs="24">
				<el-tabs v-model="activeName">
					<el-tab-pane label="修改基本资料" name="basic">
						<el-form ref="basic" :model="basic" :rules="rules" label-width="80px">
							<el-form-item label="用户昵称" prop="nickname">
								<el-input v-model="basic.nickname" maxlength="30" />
							</el-form-item>
							<el-form-item label="用户头像">
								<UserAvatar style="text-align: center" :user="user"></UserAvatar>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" size="mini" @click="submit">提交保存</el-button>
							</el-form-item>
						</el-form>
					</el-tab-pane>
					<el-tab-pane label="修改密码" name="reset">
						<el-form ref="pwd" :model="pwd" :rules="pwdRules" label-width="80px">
							<el-form-item label="旧密码" prop="oldPassword">
								<el-input v-model="pwd.oldPassword" placeholder="请输入旧密码" type="password"
									show-password />
							</el-form-item>
							<el-form-item label="新密码" prop="newPassword">
								<el-input v-model="pwd.newPassword" placeholder="请输入新密码" type="password"
									show-password />
							</el-form-item>
							<el-form-item label="确认密码" prop="confirmPassword">
								<el-input v-model="pwd.confirmPassword" placeholder="请确认密码" type="password"
									show-password />
							</el-form-item>
							<el-form-item>
								<el-button type="primary" size="mini" @click="reset">保存</el-button>
							</el-form-item>
						</el-form>
					</el-tab-pane>
				</el-tabs>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import UserAvatar from "../../components/UserAvatar";
	export default {
		components: {
			UserAvatar
		},
		data() {
			const equalToPassword = (rule, value, callback) => {
				if (this.pwd.newPassword !== value) {
					callback(new Error("两次输入的密码不一致"));
				} else {
					callback();
				}
			};
			return {
				user: {},
				dept: {},
				basic: {
					id: '',
					nickname: ''
				},
				pwd: {
					oldPassword: undefined,
					newPassword: undefined,
					confirmPassword: undefined
				},
				activeName: 'basic',
				rules: {
					nickname: [{
						required: true,
						message: "用户昵称不能为空",
						trigger: "blur"
					}]
				},
				pwdRules: {
					oldPassword: [{
						required: true,
						message: "旧密码不能为空",
						trigger: "blur"
					}],
					newPassword: [{
							required: true,
							message: "新密码不能为空",
							trigger: "blur"
						},
						{
							min: 6,
							max: 20,
							message: "长度在 6 到 20 个字符",
							trigger: "blur"
						}
					],
					confirmPassword: [{
							required: true,
							message: "确认密码不能为空",
							trigger: "blur"
						},
						{
							required: true,
							validator: equalToPassword,
							trigger: "blur"
						}
					]
				}
			}
		},
		created() {
			this.getUserInfo()
		},
		methods: {
			getUserInfo() {
				this.$axios.get("/userInfo").then(res => {
					this.$store.commit('SET_USER_INFO', res.data.data.user)
					this.user = res.data.data.user
					this.basic.id = this.user.id
					this.basic.nickname = this.user.nickname
				})
			},
			submit() {
				this.$refs['basic'].validate((valid) => {
					if (valid) {
						this.$axios.post("/user/updateInfo", this.basic).then(res => {
							if (res.data.code === 200) {
								this.modal.notifySuccess(res.data.data)		    
							}
							this.getUserInfo()
						})
					}
				})
			},
			reset() {
				this.$refs["pwd"].validate(valid => {
					if (valid) {
						this.$axios.get("/user/updatePassword", {
							params: {
								oldPassword: this.pwd.oldPassword,
								newPassword: this.pwd.newPassword,
								confirmPassword: this.pwd.confirmPassword
							}
						}).then(res => {
							if (res.data.code === 200) {
								this.modal.notifySuccess(res.data.data)
							}
						})
					}
				});
			}
		}
	}
</script>

<style scoped>
	.pull-right {
		float: right;
		margin-right: 30px;
	}

	.list {
		list-style: none;
	}

	.icon {
		margin-left: 30px;
		margin-right: 15px;
	}

	.list-group-item {
		border-bottom: 1px solid #e7eaec;
		padding: 11px 0;
	}

	ul {
		padding-inline-start: 0;
	}
</style>
