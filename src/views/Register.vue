<template>
	<div class="login">
		<div class="login-form">
			<div class="login-form-header">
				<img style="width: 75px; height: 75px;float: left;padding-right: 40px;" src="../assets/img/logo.png"
					alt="" />
				<div class="login-form-text">鱼眼电影 - 注册</div>
			</div>
			<div style="color: #91949c;font-weight: bolder;margin-top: -20px;">
				<!--display: flex保证div内部元素水平排列-->
				<div style="display: flex;">
					<p>Nickname</p>
					<el-input style="margin-bottom: 10px;margin-left: 40px;" v-model="nickname" placeholder="昵 称" />
				</div>
				<div style="display: flex;">
					<p>Username</p>
					<el-input style="margin-bottom: 12px;margin-left: 40px;" v-model="username" placeholder="账 号"></el-input>
				</div>
				<div style="display: flex;">
					<p>Password</p>
					<el-input style="margin-bottom: 12px;margin-left: 44px;" placeholder="密 码" v-model="password" show-password></el-input>
				</div>
				<div style="display: flex;">
					<p style="margin-top: 8px">Check Password</p>
					<el-input style="margin-bottom: 12px;margin-left: 21px;" placeholder="确 认 密 码" v-model="checkPassword" show-password></el-input>
				</div>
				<div style="display: flex;">
					<p style="margin-top: 8px">Type</p>
					<el-select style="margin-bottom: 12px;margin-left: 90px;width: 1200px" v-model="type" placeholder="选择您所感兴趣的电影类型" clearable multiple
						@change="controllerType" size="small" >
						<template v-for="item in typeOptions">
							<el-option :label="item.name" :value="item.name"></el-option>
						</template>
					</el-select>
				</div>
				<div style="display: flex;">
					<p style="margin-top: 8px">Area</p>
					<el-select style="margin-bottom: 12px;margin-left: 90px;width: 1200px" v-model="area" placeholder="选择您所感兴趣的电影地区" 
					@change="controllerType"
					multiple clearable>
						<el-option :key="1" label="内地" :value="1" />
						<el-option :key="2" label="港台" :value="2" />
						<el-option :key="3" label="欧美" :value="3" />
						<el-option :key="4" label="韩国" :value="4" />
						<el-option :key="5" label="日本" :value="5" />
						<el-option :key="6" label="其他" :value="6" />
					</el-select>
				</div>
				<div style="display: flex;">
					<p style="margin-top: 8px">Year</p>
					<el-select style="margin-bottom: 12px;margin-left: 90px;width: 1200px" v-model="year" placeholder="选择您所感兴趣的电影年份" clearable multiple
						@change="controllerType" size="small" >
						<template v-for="item in yearOptions">
							<el-option :label="item" :value="item"></el-option>
						</template>
					</el-select>
				</div>
				<div style="margin-top: -10px">
					<el-checkbox v-model="agree">我已同意"鱼眼电影"用户注册协议</el-checkbox>
				</div>
				<el-button @click="postLogin" class="login-form-button" type="primary">SIGN UP</el-button>
			</div>
			<div class="login-form-footer">
				<el-link href="/login" style="font-weight: bolder;font-size: 16px;color: #91949c;" :underline="false">
					已有账号 去登录
					<i style="font-weight: bolder;font-size: 15px" class="el-icon-right"></i>
				</el-link>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				typeOptions: undefined,
				yearOptions:undefined,
				type:[],
				area:[],
				year:[],
				nickname: '',
				username: '',
				password: '',
				checkPassword: '',
				agree: false,
			}
		},
		mounted() {
			this.getTypeList()
			this.getYearList()
		},
		methods: {
			postLogin() {
				if (this.nickname.length < 4) {
					this.$message({
						message: '请输入不少于4位的昵称',
						type: 'warning'
					});
					return
				}
				if (this.username.length < 12 || this.username.length > 12) {
					this.$message({
						message: '请输入12位的用户名',
						type: 'warning'
					});
					return
				}
				if (this.agree === false) {
					this.$message({
						message: '请勾选 "鱼眼电影"用户注册协议!',
						type: 'warning'
					});
					return
				}
				if (this.password !== this.checkPassword) {
					this.$message({
						message: '两次输入的密码不同,请再次输入',
						type: 'warning'
					});
					return
				}
				if(this.area == undefined || this.area.length <= 0){
					this.$message({
						message: '请选择您所感兴趣的电影地区',
						type: 'warning'
					});
					return
				}
				if(this.type == undefined || this.type.length <= 0){
					this.$message({
						message: '请选择您所感兴趣的电影类型',
						type: 'warning'
					});
					return
				}
				if(this.year == undefined || this.year.length <= 0){
					this.$message({
						message: '请选择您所感兴趣的电影年份',
						type: 'warning'
					});
					return
				}
				const LoginData = {
					nickname: this.nickname,
					username: this.username,
					password: this.password,
					area:this.area,
					year:this.year,
					type:this.type
				};
				//object类型
				console.log(typeof(LoginData));
				//string类型
				console.log(typeof(JSON.stringify(LoginData)));
				this.$axios.post("/user/register", JSON.stringify(LoginData)).then(res => {
					if (res.data.code === 200) {
						this.modal.notifySuccess("注册成功，将转往登陆界面")
						// setTimeout(() => {
						// 	router.push({
						// 		path: '/login'
						// 	})
						// }, 3000)
						this.$router.push('/login')
					} else {
						this.modal.msgError(res.data.message)
					}
					// Register(LoginData).then(res => {
					// 	if (res.success) {
					// 		this.$router.push("/login")
					// 	}
					// })
				})
				// .catch(() => {
				// 	console.log("222")
				// 	// console.log(err)
				// 	this.modal.msgError("注册失败")
				// })
			},
			//控制选择电影类型操作
			controllerType(e) {
				this.$forceUpdate();
				if (e.length > 3) {
					this.$message.warning("最多只能选择三个选项");
					this.type.splice(-1);
					this.year.splice(-1);
					this.area.splice(-1);
				}
				// else if(e.length==0){
				// 	this.$message({
				// 		message: '请选择您的感兴趣领域',
				// 		type: 'warning'
				// 	});;
				// }
			},
			getTypeList() {
				this.$axios.get("/type/list").then(res => {
					this.typeOptions = res.data.result
				})
			},
			getYearList() {
				this.$axios.get("/movie/getAllMovieYear").then(res => {
					this.yearOptions=res.data.result
				})
			}
		}
	}
</script>

<style scoped>
	.login {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
	}

	.login-form {
		width: 500px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		letter-spacing: 2px;
	}

	.login-form-header {
		height: 20px;
		padding-left: 45px;
		margin-top: -10px;
		padding-bottom: 100px;
	}

	.login-form-text {
		color: #000000;
		font-weight: bold;
		font-size: 30px;
		padding-top: 15px;
	}

	.login-form-button {
		border-radius: 3px;
		width: 100%;
		font-weight: 600;
		font-size: 15px;
		letter-spacing: 2px;
		height: 60px;
		background: #5a84fd;
		box-shadow: 0 5px 30px rgb(0 66 8.5%);
		margin-top: 15px;
	}

	.login-form-footer {
		font-weight: bolder;
		color: #91949c;
		margin-top: 10px;
		text-align: center;
	}

	>>>.el-input__inner {
		height: 48px;
	}

	.el-checkbox {
		color: #91949c;
		font-weight: bolder;
		font-size: 15px;
	}
</style>
