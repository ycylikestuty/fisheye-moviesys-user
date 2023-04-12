<template>
	<div class="login">
		<div class="login-form">
			<div class="login-form-header">
				<img style="width: 75px; height: 75px;float: left;padding-right: 40px;" src="../assets/img/logo.png"
					alt="" />
				<div class="login-form-text">鱼眼电影 - 登录</div>
			</div>
			<div style="color: #91949c;font-weight: bolder;margin-top: -20px;">
				<div style="display: flex;">
					<p style="margin-top: 4px">Username</p>
					<el-input style="margin-top: -12px;margin-left: 40px;" v-model="loginForm.username"
						placeholder="账 号" />
				</div>
				<div style="display: flex;margin-bottom: 30px">
					<p style="margin-top: 30px">Password</p>
					<el-input style="margin-top: 20px;margin-left: 42px;" v-model="loginForm.password" placeholder="密 码"
						show-password></el-input>
				</div>
				<!-- <p>Username</p>
				<el-input class="login-form-input" v-model="loginForm.username" placeholder="账 号"></el-input>
				<p>Password</p>
				<el-input class="login-form-input" placeholder="密 码" v-model="loginForm.password" show-password>
				</el-input> -->
				<el-input placeholder="验证码" name="code" prefix-icon="el-icon-c-scale-to-original" class="login-input"
					style="width: 52%;float: left" type="text" v-model="loginForm.code" />
				<img style="width: 200px; height: 48px;float: left;margin-left: 36px" :src="captchaImg"
					@click="getCaptchaImg" />
				<!-- <div style="padding-top: 10px">
					<el-checkbox v-model="remember">记住密码</el-checkbox>
					<div style="float: right">
						<el-link href="/forget" style="font-weight: bolder;font-size: 14px;color: #91949c;"
							:underline="false">
							忘记密码?
						</el-link>
					</div>
				</div> -->
				<el-button @click="postLogin('loginForm')" class="login-form-button" type="primary">SIGN IN</el-button>
			</div>
			<div class="login-form-footer">
				<el-link href="/register" style="font-weight: bolder;font-size: 16px;color: #91949c;"
					:underline="false">
					还没有账号？去注册
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
				loginForm: {
					username: '',
					password: '',
					code: '',
					key: ''
				},
				captchaImg: null
			}
		},
		methods: {
			postLogin(formName) {
				console.log(this.$qs.stringify(this.loginForm));
				this.$axios.post('/login?' + this.$qs.stringify(this.loginForm)).then(res => {
					const jwt = res.headers['authorization']
					this.$store.commit('SET_TOKEN', jwt)
					this.$axios.get("/userInfo").then(res => {
						this.$store.commit('SET_USER_INFO', res.data.data.user)
					})
					setTimeout(() => {
						this.$router.push({
							path: '/'
						})
					}, 1000)
					// this.$router.push({
					// 	path: '/'
					// })
					// let message
					// if (new Date().getHours() < 12) {
					// 	message = "上午好！" + this.loginForm.username
					// } else {
					// 	message = "下午好！" + this.loginForm.username
					// }
					// this.modal.notifySuccess(message)
				}).catch(() => {
					console.log("错误")
				})
			},
			getCaptchaImg() {
				this.$axios.get('/captcha').then(res => {
					this.loginForm.key = res.data.data.key
					this.captchaImg = res.data.data.base64
					this.loginForm.code = ''
				})
			}
		},
		created() {
			this.getCaptchaImg()
			// let tag = {
			// 	path: '/',
			// 	title: '首页',
			// 	name: 'index',
			// 	parentTitle: "首页"
			// }
			this.$store.commit('SET_TOKEN', undefined)
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
		margin-top: -16px;
		transform: translate(-50%, -60%);
		letter-spacing: 2px;
	}

	.login-form-header {
		height: 20px;
		padding-left: 45px;
		margin-top: -78px;
		padding-bottom: 100px;
	}

	.login-form-text {
		color: #000000;
		font-weight: bold;
		font-size: 30px;
		padding-top: 15px;
	}

	.login-form-input {
		margin-bottom: 10px;
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
		margin-top: 35px;
	}

	.login-form-footer {
		font-weight: bolder;
		color: #91949c;
		padding-top: 40px;
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
