<template>
	<!-- 收货地址组件 -->
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button class="btnChooseAddress" type="primary" size="mini" @click="chooseAddress">请选择收获地址</button>
		</view>
		
		<!-- 渲染收获地址信息的盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress()">
			<view class="row1">
				<view class="row1-left">
					<view class="username">收货人：{{address.userName}}</view>
				</view>
				<view class="row1-right">
					<view class="phone">电话：{{address.telNumber}}</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2-left">收货地址：</view>
				<view class="row2-right">{{addstr}}</view>
			</view>
		</view>
		
		<!-- 底部的边框线 -->
		<image src="/static/cart_border@2x.png" mode="" class="address-border"></image>
	</view>
</template>

<script>
	import { mapState,mapMutations,mapGetters } from "vuex"
	
	export default {
		name:"my-address",
		data() {
			return {
				// 地址对象,由于使用了vuex,所以就不再使用这里的数据对象
				// address:{
					
				// }
			}
		},
		methods:{
			...mapMutations('m_user',['updateAddress']),
			// 选择收货地址
			async chooseAddress(){
				// uni.chooseAddress()是小程序提供的一个方法，可以使用选择收货地址功能
				// 由于uni.chooseAddress()的返回值是一个promises对象，所以需要搭配上async和await
				// 返回值是一个数组，第一项为错误对象，第二项为选中之后的收货地址对象
				const [err,suc] = await uni.chooseAddress().catch(err => err)
				
				if (err ===null && suc.errMsg ==='chooseAddress:ok') {
					// 将sec地址对象赋值给data里的address
					// this.address = suc
					// console.log(suc);
					// 将数据存在vuex中
					this.updateAddress(suc)
				}
				
				// 在旧版本中，如果在选择收货地址的时候，用户点击了取消授权，则需要进行特殊的处理，否则用户将无法再次选择收货地址！
				// 但是现在新版强制授权了，所以不会出现这个问题，但还是可以学到一些东西
				// if(err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')){
				// 	// 通过调用这个方法，让用户重新授权
				// 	this.reAuth()
				// }
			},
			
			// 调用此方法，重新发起收货地址的授权
			// 由于授权接口的更新，现在已经不会出现这个问题了
			async reAuth() {
			  // 3.1 提示用户对地址进行授权
			  const [err2, confirmResult] = await uni.showModal({
			    content: '检测到您没打开地址权限，是否去设置打开？',
			    confirmText: "确认",
			    cancelText: "取消",
			  })
			
			  // 3.2 如果弹框异常，则直接退出
			  if (err2) return
			
			  // 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
			  if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
			
			  // 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
			  if (confirmResult.confirm) return uni.openSetting({
			    // 3.4.1 授权结束，需要对授权的结果做进一步判断
			    success: (settingResult) => {
			      // 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
			      if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
			      // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
			      if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
			    }
			  })
			}
		},
		computed:{
			// 把m_user中的address对象映射到当前组件中使用,代替data中的address对象
			...mapState('m_user',['address']),
			...mapGetters('m_user',['addstr']),
			// 组合收货地址的计算属性,将其抽离为getters
			// addstr(){
			// 	// 先判断是否有选中地址，如果没有返回空
			// 	if (this.errMsg === '') return ''
			// 	// 如果有选中地址，将身份城市街道和详细地址组合在一起
			// 	return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
			// }
		}
	}
</script>

<style>
	.address-border{
		width: 100%;
		height: 5px;
		display: block;
	}
	.address-choose-box{
		height: 90px;
		display: flex;
		/*  */
		justify-content: center;
		align-items: center;
		
	}
	.address-info-box{
		font-size: 12px;
		height: 90px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 5px;
	}
	.row1{
		display: flex;
		justify-content: space-between;
	}
	.row1-right{
		display:flex;
		justify-content: space-between;
	}
	.row2{
		display: flex;
		/* justify-content: space-between; */
		align-items: center;
		margin-top: 10px;
	}
	.row2-left{
		white-space: nowrap;
	}
</style>