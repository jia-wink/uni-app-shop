<template>
	<view class="login-container">
		<!-- 未登录的头像 -->
		<uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
		
		<!-- 登录按钮 -->
		<!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
		<!-- 2022/4/13之后微信官方更改了用户登录的接口，所以下面代码失效 -->
		<!-- <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> -->
		
		<!-- 新的用法 -->
		<button type="primary" class="btn-login" @click="getUserProfile()">速度点我登录！</button>
		
		<!-- 登录图标 -->
		<view class="tips-text">登陆了才可以买东西！</view>
	</view>
</template>

<script>
	import { mapMutations,mapState } from "vuex"
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		computed:{
			...mapState('m_user',['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
			// 获取微信用户的基本信息  4.13
			getUserProfile() {
				uni.getUserProfile({
					desc: '你的授权信息',
					success: (res) => {
						// console.log(res);
						// 将信息存到 vuex 中
						this.updateUserInfo(res.userInfo)
						this.getToken(res)
					},
					fail: (res) => {
						return uni.$showMsg('您取消了登录授权')
					}
				})
			},
			// 不再使用
			// getUserInfo(e) {
			//     // 判断是否获取用户信息成功
			//     if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
			
			//     // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
			//     console.log(e.detail.userInfo)
			//   }
			
			// 拿到code的值再实现真正的登录
			async getToken(info){
				// 获取token的值
				const [err,res] = await uni.login().catch(err => err)
				if( err || res.errMsg != 'login:ok') return uni.$showMsg('登录失败！')
				
				// 整理登录需要的参数
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					rawData: info.rawData,
					iv: info.iv,
					signature: info.signature
				}
				// console.log(query);
				
				// 向后台服务器获取token
				// 由于这个接口需要特殊权限,使用不了了,所以在之后的token的都是手动进行赋值
				const {data:loginResult} = await uni.$http.post('http://api-ugo-web.itheima.net/api/public/v1/users/wxlogin',query)
				// 
				if(loginResult.meta.status == 200) return uni.$showMsg("登陆失败啦！")
				uni.$showMsg("登陆成功！")
				// console.log(loginResult);
				
				// 将获取到的token持久化存储到本地
				// this.updateToken(loginResult.message.token)
				
				// 由于无法获取到token,选择手动赋值
				this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
				
				// 登录成功之后,跳转回之前的页面
				this.navigateBack()
			},
			// 跳转回之前的页面
			navigateBack(){
				if(this.redirectInfo && this.redirectInfo.openType ==='switchTab'){
					uni.switchTab({
						url:this.redirectInfo.from,
						complete:() =>{
							// 将vuex中的updateRedirectInfo重定向对象置为空
							this.updateRedirectInfo(null)
						}
					})					
				}
			}
		}
	}
</script>

<style>
	.login-container {
		height: 750rpx;
		background-color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;
	}

	.login-container::after {
		content: '';
		display: block;
		width: 100%;
		height: 50px;
		background-color: #f5f5f5;
		/* 子绝父相 */
		position: absolute;
		border-radius: 100%;
		/* 在y方向向下移动自身高度的50%，正表示往下，负表示往上 */
		transform: translateY(50%);
		bottom: 0;
	}

	.btn-login {
		width: 90%;
		border-radius: 100px;
		margin: 15px 0;
		background-color: #c00000;
	}

	.tips-text {
		font-size: 12px;
		color: gray;
	}
</style>
