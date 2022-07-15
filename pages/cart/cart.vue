<template>
	<view class="cart-container" v-if="cart.length !==0">
		<view class="address-choose-box">
			<my-address></my-address>
		</view>
		
		<!-- 商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18" color="grey"></uni-icons>
			<!-- 右侧的文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		
		<!-- 滑动删除基本结构，快捷方式“uswipeaction” -->
		<uni-swipe-action>
			<!-- 循环显示商品列表 -->
			<view class="" v-for="(item,index) in cart" :key="index" @click="gotoDetail(item)">
				<uni-swipe-action-item :right-options="options" @click="swiperItemClickHanler(item)">
					<!-- 这里用到了之前定义的自定义组件 -->
					<my-goods :goods="item" :showRadio="true" :showNum="true" @radio-change="radioChangeHandler()" @num-cange="numberChangeHandler()"></my-goods>
				</uni-swipe-action-item>
			</view>
		</uni-swipe-action>
		
		<!-- 使用自定义的结算组件 -->
		<my-settle></my-settle>
	</view>
	
	<!-- 当购物车空白时显示的界面 -->
	<view class="tmpty-cart" v-else>
		<image src="/static/cart_empty@2x.png" mode="" class="empty-image"></image>
		<text class="tip-text">为啥一个都没有？你跟哥说实话你是不是买不起?</text>
	</view>
</template>


<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	
	// 按需导入
	import { mapState,mapMutations } from "vuex"
	
	export default {
		computed:{
			...mapState('m_cart',['cart'])
		},
		// mixins是Vue的语法,可以将重复的js片段进行封装
		mixins:[badgeMix],
		data() {
			return {
				options:[{
					// 显示的文本内容
					text:'删除',
					style:{
						// 按钮的文本颜色
						backgroundColor:'#C00000'
					}
				}]
			}
		},
		methods:{
			...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
			// 商品勾选状态发生了变化
			radioChangeHandler(i){
				this.updateGoodsState(i)
			},
			// 增加或减少某个商品的数量
			numberChangeHandler(i){
				this.updateGoodsCount(i)
				// 然后立即刷新底部购物车角标的数量
				// this.setBadge()
			},
			// 滑动删除购物车商品
			swiperItemClickHanler(goods){
				// console.log(goods);
				this.removeGoodsById(goods.goods_id)
			},
			// 点击跳转到商品详情页面
			gotoDetail(item){
				uni.navigateTo({
					url:`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
				})
			},
		}
	}
</script>

<style>
	.cart-container{
		padding-bottom: 50px;
	}
.cart-title{
	height: 40px;
	display: flex;
	align-items: center;
	padding-left: 5px;
	border-bottom: 1px solid #efefef;
}
.cart-title-text{
	font-size: 14px;
	margin-left: 10px;
}
.tmpty-cart{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 150px;
}
.empty-image{
	width: 90px;
	height: 90px;
}
.tip-text{
	font-size: 15px;
	color: gray;
	margin-top: 15px;
}
</style>
