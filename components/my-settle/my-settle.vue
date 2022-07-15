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
		<view class="btn-settle">结算({{checkCount}})</view>
	</view>
</template>

<script>
	import { mapGetters,mapMutations } from "vuex"
	export default {
		name:"my-settle",
		data() {
			return {
				
			};
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			// 当点击全选那妞时，更新购物车中所有商品的选中状态
			changeAllState(){
				// his.isFullcheck是当前商品的全选状态，取反就是最新的勾选状态
				this.updateAllGoodsState(!this.isFullcheck)
			}
		},
		computed: {
			...mapGetters('m_cart',['checkCount','total','checkedGoodsAmount']),
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