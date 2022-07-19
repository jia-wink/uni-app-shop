<template>
	<view class="my-settle-container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			<radio value="" class="radio" color="#c00000" :checked="isFullcheck"/><text>全选</text>
		</label>
		<!-- 合计 -->
		<view class="amount-box">
			合计<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算 -->
		<view class="btn-settle" @click="settlement">结算({{checkCount}})</view>
	</view>
</template>

<script>
	import { mapGetters,mapMutations,mapState } from "vuex"
	export default {
		name:"my-settle",
		data() {
			return {
				// 倒计时的秒速
				second:3,
				// 定时器的id
				timer:null
			};
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			...mapMutations('m_user',['updateRedirectInfo']),
			// 当点击全选那妞时，更新购物车中所有商品的选中状态
			changeAllState(){
				// his.isFullcheck是当前商品的全选状态，取反就是最新的勾选状态
				this.updateAllGoodsState(!this.isFullcheck)
			},
			// 点击结算按钮的事件
			settlement(){
				// 先判断是否勾选了商品
				if(!this.checkCount) return uni.$showMsg('你倒是要买什么呀?')
				
				// 判断是否选择了收货地址
				if(!this.addstr) return uni.$showMsg('还没有选择收货地址~')
				
				// 判断是否登录,如果没有登录,就调用 delayNavigate() 进行倒计时的跳转
				// if(!this.token) return uni.$showMsg('请先登录呀!')
				if(!this.token) return this.delayNavigate()  
				
				// 发起微信支付
				this.payOrder()
				
			},
			// 微信支付
			async payOrder(){
				// 创建订单
				// 组织订单的信息对象
				const orderInfo = {
					// 在开发期间，注释掉真实的订单价格
					// order_prise: this.checkedGoodsAmount,
					// 订单价格写死为一分钱
					order_price: 0.01,
					consignee_addr: this.addstr,
					goods: this.cart.filter(x => x.goods_state).map(x => ({
						goods_id: x.goods_id,
						goods_number: x.goods_count,
						goods_price: x.goods_price
					}))
				}
				
				// 1.发起订单请求
				const {data:res} = await uni.$http.post('http://api-ugo-web.itheima.net/api/public/v1/my/orders/create',orderInfo)
				if(res.meta.status !== 200) return uni.$showMsg('创建订单失败啦！')
				// 得到服务器响应的订单编号
				const orderNumber = res.message.order_number
				
				// 2.订单预支付
				// 发起请求获取订单的支付信息
				const { data:res2 } = await uni.$http.post('http://api-ugo-web.itheima.net/api/public/v1/my/orders/req_unifiedorder',{ order_number:orderNumber})
				// 预付订单生成失败
				if(res2.meta.status !== 200) return uni.$showMsg('由于没有微信支付的权限，所以预付订单生成失败啦！')
				// 得到订单支付相关的必要参数
				const payInfo = res2.message.pay
				
				// 3.发起微信支付
				const [err,succ] = await uni.requestPayment(payInfo)
				// 未完成支付
				if(err) return uni.$showMsg('订单未支付！')
				// 完成了支付，再查询一次支付的结果
				const {data : res3 } = await uni.$http.post('http://api-ugo-web.itheima.net/api/public/v1/my/orders/chkOrder',{ order_number:orderNumber})
				// 检测到订单未支付
				if(res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 检测到订单支付成功
				uni.showToast({
					title:'支付完成！',
					icon:"success"
				})
			},
			// 闫池导航到my页面
			delayNavigate(){
				// 1.展示提示消息
				this.showTips(this.second)
				
				// 创建定时器,每隔一秒执行一次
				this.timer = setInterval(() => {
					// 让秒数自减一
					this.second--
					
					// 防止倒计时的秒数为负数
					if(this.second <= 0){
						// 清除定时器
						clearInterval(this.timer)
						
						// 跳转到登录界面
						uni.switchTab({
							url:'../../pages/my/my',
							// 页面跳转成功之后的回调函数
							success:() => {
								// 调用vuex的updateRedirectInfo方法,把跳转信息存储到vuex中
								this.updateRedirectInfo({
									// 跳转的方式
									openType:'switchTab',
									// 从那个页面跳转过去的
									from:'/pages/cart/cart'
								})
							}
						})
						return this.second = 3
					}
					
					// 再根据最新的秒数,进行消息提示
					this.showTips(this.second)
				},1000)
			},
			// 展示倒计时的信息
			showTips(n){
				// 调用uni,showToast方法,展示提示消息
				uni.showToast({
					// 不展示任何图标
					icon:'none',
					// 提示的信息
					title:`请登陆后再结算!${n}秒后自动跳转到登录页`,
					// 为页面添加透明遮罩,防止点击穿透
					mask:true,
					// 1.5秒后自动小时
					duration:1500
				})
			},
		},
		computed: {
			...mapGetters('m_cart',['checkCount','total','checkedGoodsAmount']),
			...mapGetters('m_user',['addstr']),
			...mapState('m_user',['token']),
			...mapState('m_cart',['cart']),
			// 判断商品是否全部为选中状态
			isFullcheck(){
					return this.checkCount === this.total
			}
		}
	}
</script>

<style>
	.my-settle-container{
		/* 设置固定定位 */
		position: fixed;
		width: 100%;
		height: 50px;
		bottom: 0;
		left: 0;
		background-color: white;
		z-index: 999;
		font-size: 14px;
		padding-left: 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.radio{
		display: flex;
		align-items: center;
	}
	.amount{
		color: #c00000;
		font-weight: bold;
	}
	.btn-settle{
		padding-right: 10px;
		background-color: #c00000;
		min-width: 100px;
		color: white;
		/* 水平居中 */
		text-align: center;
		/* 垂直居中 */
		height: 50px;
		line-height: 50px;
	}
</style>