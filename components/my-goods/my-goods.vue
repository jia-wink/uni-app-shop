<template>
	<!-- 这个商品列表功能其实没有封装的必要，只是让我们多了解封装的步骤 -->
	<view class="goods-item">
		<!-- 商品左侧信息区域 -->
		<view class="goods-item-left">
			<image class="goods-pic" :src="goods.goods_small_logo || defaultPic"></image>
		</view>
		<!-- 右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<!-- 商品价格 -->
			<view class="goods-info-box">
				<!-- “|” 是管道符，用来调用过滤器 -->
				<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
			</view>
		</view>	
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		// 定义props属性，用来接收外界传递到当前组件的数据
		props:{
			goods:{
				type : Object,
				default:{}
			}
		},
		data() {
			return {
				// 默认的图片
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		// 过滤器节点
		filters:{
			// 把数字处理为带两位小数点的数字
			tofixed(num){
				// 这个方法可以实现
				return Number(num).toFixed(2)
			}
		}
	}
</script>

<style>
.goods-item{
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;
}
.goods-item-left{
	margin-right: 5px;
}
.goods-pic{
	width: 100px;
	height: 100px;
	display: block;
}
.goods-item-right{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.goods-name{
	font-size: 13px;
}
.goods-price{
	color: #C00000;
	font-size: 16px;
}
</style>