<template>
	<view>
		<!-- 这是搜索组件 -->
		<view class="search-box">
			<!-- 触发自定义事件 -->
			<my-search @myclick="gotoSearch"></my-search>
		</view>
		<!-- 轮播图 -->
		<!-- 属性从左到右分别是 是否显示小圆点，是否自动切换，轮播间隔，轮播时间，是否循环 -->
		<swiper class="swiper-aa" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<!-- 用模板字符串更好理解 -->
				<navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id = ${item.goods_id}`">
					<!-- // 这里的轮播图地址也要和src绑定，不然胡报错渲染层网络错误 -->
					<image :src="item.image_src" mode="" class="swiper-img"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<!-- 楼层的容器 -->
		<view class="floor-list">
			<!-- 每一个楼层的item项 -->
			<view class="floor-item" v-for="(item,index) in floorList" :key="index">
				<!-- 楼层的标题 -->
				<image class="floor-title" :src="item.floor_title.image_src"></image>
				<!-- 楼层的图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<!-- mode配置图片高度自适应 -->
						<image :src="item.product_list[0].image_src" :style="{width: `${item.product_list[0].image_width}rpx`}" mode="widthFix"></image>
					<!-- `${width: item.product_list[0].image_width}rpx` -->
					</navigator>
					<!-- 右侧小图片的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2,index2) in item.product_list" :key="index2" :url="item2.url">
							<!-- 在vue中，v-if和v-for不能在同一个标签里面，会报错，但是在uniapp中不会 -->
							<view v-if="index2 !==0">
								<image  :src="item2.image_src" mode="widthFix" :style="{width: `${item2.image_width}rpx`}"></image>
							</view>	
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	
	export default {
		// mixins是Vue的语法,可以将重复的js片段进行封装
		mixins:[badgeMix],
		data() {
			return {
				// 轮播图的列表
				swiperList: [],
				// 分类导航的数据列表
				navList: [],
				// 楼层的数据
				floorList: []
			}
		},
		onLoad(){
			// 调用方法，获取轮播图的数据
			this.getSwiperList();
			this.getNavList();
			this.getFloorList();
		},
		methods: {
			async getSwiperList(){
				const {data: res} = await uni.$http.get('http://api-ugo-web.itheima.net/api/public/v1/home/swiperdata');
				// console.log('jiajia');
				// 大佬说的另一种方法
				// uni.request({
				// 	url:'https://api-ugo-web.itheima.net/api/public/v1/home/swiperdata',
				// 	method:"GET"
				// }) 
				
				// 请求失败
				// if (res.meta.status != 200) {
				// 	return uni.showToast({
				// 		title: '出错啦！',
				// 		// 弹框事件，1.5瞄之后自动隐藏
				// 		duration: 1500,
				// 		// 隐藏图标
				// 		icon: 'none'
				// 	})
				// }
				if (res.meta.status != 200) return uni.showMsg();
				this.swiperList = res.message;
				// uni.$showMsg('数据请求成功');
			},
			async getNavList(){
				const {data: res} = await uni.$http.get('http://api-ugo-web.itheima.net/api/public/v1/home/catitems');
				if (res.meta.status !== 200) return uni.showMsg();
				this.navList = res.message;
			},
			// 导航菜单点击事件，如果点击的是分类，就跳转到分类视图
			navClickHandler(item){
				if(item.name === '分类'){
					uni.switchTab({
						url:'/pages/cate/cate'
					})
				}
			},
			async getFloorList(){
				const {data: res} = await uni.$http.get('https://api-ugo-web.itheima.net/api/public/v1/home/floordata');
				if (res.meta.status !== 200) return uni.showMsg();
				res.message.forEach(floor =>{
					floor.product_list.forEach(prod =>{
						// 这里的split('?')是以问好来分割，将问号左右分为两项，prod.navigator_url.split('?')[1]就是取?后面的第二项
						prod.url = `/subpkg/goods_list/goods_list?${prod.navigator_url.split('?')[1]}`
					})
				})
				this.floorList = res.message;
			},
			gotoSearch(){
				// console.log('222');
				// 这个页面跳转不建议写在组件里面，那样太死了，因为不同的界面可能会有不同的跳转路径
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		},
	}
</script>

<!-- 这里的css遇到了很大的问题，急需要解决 -->
<!--
<style lang="scss">
	swiper {
	    height: 330rpx;
	 
	    .swiper-item,
	    image {
	      width: 100%;
	      height: 100%;
	    }
	  }
	
	  .nav-list {
	    display: flex;
	    justify-content: space-around;
	    margin: 15px 0;
	
	    .nav-img {
	      width: 128rpx;
	      height: 140rpx;
	    }
	  }
</style>
-->

<style>
	swiper{
		height: 330rpx;
	}
	.swiper-item,.swiper-img{
		width: 100%;
		height: 100%;
	}
	.nav-list{
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
	}
	.nav-img{
		width: 128rpx;
		height: 140rpx;
	}
	.floor-title{
		width: 100%;
		height: 60rpx;
	}
	.right-img-box{
		display: flex;
		/* 在必要的时候换行或者换列 */
		flex-wrap: wrap;
		/* 分散对齐 */
		justify-content: space-around;
		/* align-items: center; */
	}
	.floor-img-box{
		display: flex;
		/* padding: 0 0 0 10px; */
		padding-left: 10px;
	}
	.search-box{
		/* 效果：固定 */
		position: sticky;
		/* 替代代码
		position: fixed;
		width:100%;
		 */
		top: 0;
		z-index: 999;
	}
</style>
