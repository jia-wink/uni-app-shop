<template>
	<!-- 先判断goods_info有没有数据，如果有才显示,不一定要goods_name，随便一个属性就行 -->
	<view v-if="goods_info.goods_id" class="goods-detail-container">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item,index) in goods_info.pics" :key="index">
				<image :src="item.pics_big" mode="" @click="preview(index)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<!--  -->
		<view class="goods_info-box" >
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 商品信息的主体区域 -->
			<view class="goods-info-body">
				<!-- 商品的名字 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="grey"></uni-icons>
					<text>收藏</text>
			</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>
		<!-- 商品详情信息 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		
		<!-- 商品导航组件 -->
		<view class="goonds_nav">
			<!-- fill 控制右侧按钮的样式 -->
			<!-- options 左侧按钮的配置项 -->
			<!-- buttonGroup 右侧按钮的配置项 -->
			<!-- click 左侧按钮的点击事件处理函数 -->
			<!-- buttonClick 右侧按钮的点击事件处理函数 -->
			<uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods_info:{},
				options: [{
							icon: 'headphones',
							text: '客服'
						}, {
							// 图标
							icon: 'shop',
							// 名字
							text: '店铺',
							// 右上角角标
							info: 2,
							// 角标背景颜色
							// infoBackgroundColor:'#007aff',
							// 角标文字颜色
							// infoColor:"red"
						}, {
							icon: 'cart',
							text: '购物车',
							info: 2
						}],
					    buttonGroup: [{
					      text: '加入购物车',
					      backgroundColor: '#ff0000',
					      color: '#fff'
					    },
					    {
					      text: '立即购买',
					      backgroundColor: '#ffa200',
					      color: '#fff'
					    }
					    ]
			}
		},
		onLoad(options) {
			// 获取商品的id
			const goods_id = options.goods_id
			// 调用请求商品数据的方法
			this.getGoodsDetail(goods_id)
		},
		methods: {
			async getGoodsDetail(goods_id){
				const {data : res} = await uni.$http.get('http://api-ugo-web.itheima.net/api/public/v1/goods/detail',{goods_id:goods_id})
				if(res.meta.status !== 200) return uni.showMsg()
				// 正则替换,添加样式并且将web后缀改为jpg，解决ios手机不适配的问题
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g,'<img style="display:block;"').replace(/webp/g,'jpg')
				
				this.goods_info = res.message
			},
			// 图片预览点击事件
			preview(index){
				uni.previewImage({
					// 点击时获取图片的索引
					current: index,
					// 所有预览图片的数组
					urls: this.goods_info.pics.map(i => i.pics_big)
				})
			},
			// 底部商品导航左侧区域
			onClick(e){
				if (e.content.text === '购物车') {
					// 用switchTab会关闭所有别的非tabar页面，注意理解和navigateTo的区别
					uni.switchTab({
						url:'/pages/cart/cart'
					})
				}
			}
		}
	}
</script>

<style>
swiper{
	height: 750rpx;
}
image{
	width: 100%;
	height: 100%;
}
.goods_info-box{
	padding: 10px;
	padding-right: 0px;
}
.price{
	color: #c00000;
	font-size: 18px;
	margin: 10px 0;
}
.goods-info-body{
	display: flex;
	justify-content: space-between;
}
.goods-name{
	font-size: 13px;
	margin-right: 10px;
}
.favi{
	width: 120px;
	font-size: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-left: 1px solid #efefef;
	color: grey;
}
.yf{
	font-size: 12px;
	color: grey;
	margin: 10px 0px;
}
.goonds_nav{
	position: fixed;
	bottom: 0;
	width: 100%;
}
.goods-detail-container{
	padding-bottom: 50px;
}
</style>
