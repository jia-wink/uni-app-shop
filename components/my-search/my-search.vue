<template>
	<!-- 通过Vue模拟出一个搜索框。。并不是真的 -->
	<view class="my-search-container" :style="{'background-color':`${bgcolor}`}" @click="searchBoxHandler()">
		<view class="my-search-box" :style="{'border-radius':`${radius}px`}">
			<!-- 使用uni-ui提供的图表组件（官方） -->
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		// 设定两个参数运行更改搜索框的背景颜色和尺寸
		props:{
			// 背景颜色
			bgcolor:{
				type:String,
				default: '#C00000',
			},
			// 圆角尺寸
			radius:{
				type:Number,
				default:18 //默认单位是px
			}
		},
		data() {
			return {

			};
		},
		methods: {
			searchBoxHandler(){
				console.log('111');
				// 触发外界传递的事件
				this.$emit('click');
			},
		}
	}
</script>

<style>
	.my-search-container{
		height: 50px;
		display: flex;
		/* 颜色  通过自定义属性 */
		align-items: center;
		padding: 0 10px;
	}
	.my-search-box{
		/* 设置搜索框高度 */
		height: 36px;
		background-color: aliceblue;
		/* 圆角，通过自定义属性 */
		/* 搜索框宽度百分百 */
		width: 100%;
		display: flex;
		/* 水平居中 */
		justify-content: center;
		/* 垂直居中 */
		align-items: center;
	}
	.placeholder{
		font-size: 15px;
		/* 让文字和搜索图标有一定的间隙 */
		margin-left: 5px;
	}
</style>