<template>
	<!-- 这个商品列表功能其实没有封装的必要，只是让我们多了解封装的步骤 -->
	<view class="goods-item">
		<!-- 商品左侧信息区域 -->
		<view class="goods-item-left">
			<!-- 这里听取网友的建议，可以通过slot插槽实现 -->
			<label class="radio">
				<radio value="" :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioClickHandler"/><text></text>
			</label>
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
				<!-- 商品数量 -->
				<!-- 点击会触发click事件，数据变化会触发change事件 -->
				<!-- 在之前的版本这个组件会有一个问题，就是输入字母d时候会返回NaN，现在已经更新解决这个问题了 -->
				<!-- <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box> -->
				<uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
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
			},
			// 接受是否展示图片左侧radio的的参数
			showRadio:{
				type : Boolean,
				default: false
			},
			showNum:{
				type : Boolean,
				default: false
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
		},
		methods:{
			radioClickHandler(){
				// 通过 this.$emit() 触发外界通过@绑定的 radio-change事件
				// 同时把商品的id和勾选状态作为参数传递给radio-change事件处理函数
				this.$emit('radio-change',{
					// 商品的id
					goods_id:this.goods.goods_id,
					// 商品最新的勾选状态
					goods_state:!this.goods.goods_state
				})
			},
			// 监听到了 NumberBox 组件事件变化的事件
			numChangeHandler(val){
				this.$emit('num-cange',{
					// 商品的id
					goods_id:this.goods.goods_id,
					// 商品的数量 '+'表示限制val一定是个数字,也可以通过-0进行强制转换
					goods_count: +val
				})
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
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.goods-pic{
	width: 100px;
	height: 100px;
	display: block;
}
.goods-item-right{
	display: flex;
	/* 如果商品信息太少可能会出现盒子偏小的问题，所以让它占满整个区域 */
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
}
.goods-name{
	font-size: 13px;
}
.goods-info-box{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.goods-price{
	color: #C00000;
	font-size: 16px;
}
</style>