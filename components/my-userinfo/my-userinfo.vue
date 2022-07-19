<template>
	<view class="my-userinfo-container">
		<!-- 头像昵称区域 -->
		<view class="top-box">
			<image :src="userinfo.avatarUrl" mode="" class="avatar"></image>
			<view class="nickname">{{userinfo.nickName}}</view>
		</view>

		<!-- 面板区域 -->
		<view class="penel-list">
			<!-- 第一个面板 -->
			<view class="penel">
				<view class="penel-body">
					<view class="penel-item">
						<text>8</text>
						<text>收藏的店铺</text>
					</view>
					<view class="penel-item">
						<text>8</text>
						<text>收藏的商品</text>
					</view>
					<view class="penel-item">
						<text>8</text>
						<text>关注的商品</text>
					</view>
					<view class="penel-item">
						<text>8</text>
						<text>足迹</text>
					</view>
				</view>
			</view>
			<!-- 第二个面板 -->
			<view class="penel">
				<view class="penel-title">
					我的订单
				</view>
				<view class="penel-body">
					<view class="penel-item">
						<image src="../../static/my-icons/icon1.png" mode="" class="icon"></image>
						<text>待付款</text>
					</view>
					<view class="penel-item">
						<image src="../../static/my-icons/icon2.png" mode="" class="icon"></image>
						<text>待收货</text>
					</view>
					<view class="penel-item">
						<image src="../../static/my-icons/icon3.png" mode="" class="icon"></image>
						<text>退款/退货</text>
					</view>
					<view class="penel-item">
						<image src="../../static/my-icons/icon4.png" mode="" class="icon"></image>
						<text>全部订单</text>
					</view>
				</view>
			</view>
			<!-- 第三个面板 -->
			<view class="penel">
				<view class="penel-list-item">
					<text>收货地址</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="penel-list-item">
					<text>联系客服</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="penel-list-item" @click="logout">
					<text>退出登录</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,mapMutations
	} from "vuex"
	export default {
		name: "my-userinfo",
		computed: {
			...mapState('m_user', ['userinfo']),
		},
		data() {
			return {

			};
		},
		methods:{
			...mapMutations('m_user',['updateToken','updateUserInfo','updateAddress']),
			
			async logout(){
				const [err,suc] = await uni.showModal({
					title:"提示",
					content:"真的要退出登录嘛..."
				}).catch(err => err)
				
				if(suc && suc.confirm){
					this.updateAddress({})
					this.updateUserInfo({})
					this.updateToken('')	
				}
			}
		}
	}
</script>

<style>
	.my-userinfo-container {
		height: 100%;
		background-color: #f4f4f4;
	}

	.top-box {
		height: 400rpx;
		background-color: #c00000;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.avatar {
		height: 80px;
		width: 80px;
		border: 2px solid white;
		border-radius: 45px;
		box-shadow: 0 0 40px 5px #383838;
	}

	.nickname {
		color: white;
		font-weight: bold;
		font-size: 16px;
		margin-top: 10px;
	}
	.penel-list{
		padding: 0 10px;
		position: relative;
		top:-10px
	}
	.penel{
		background-color: white;
		border-radius: 3px;
		margin-bottom: 8px;
		
	}
	.penel-title{
		line-height: 45px;
		padding-left: 10px;
		font-size: 15px;
		border-bottom: 1px solid #f4f4f4;
	}
	.penel-body{
		display: flex;
		justify-content: space-around;
	}
	.penel-item{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		padding: 10px 0;
		font-size: 13px;
	}
	.icon{
		width: 35px;
		height: 35px;
	}
	.penel-list-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 15px;
		padding: 0 10px;
		line-height: 45px;
	}
</style>
