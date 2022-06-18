<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧滑动区域 -->
			<!-- 这里的高度也可以使用100vh -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height:`${wh}px;`}">
				<view :class="['left-scroll-view-item',index === active?'active' : '']" 
				v-for="(item,index) in cateList" :key="index"
				@click="activeChanged(index)">{{item.cat_name}}</view>
				<!-- 也可以用 active=index -->
			</scroll-view>
			<!-- 右侧华东区域 -->
			<scroll-view class="right-scroll-view" scroll-y="true" :style="{height:`${wh}px;`}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="item2">
					<!-- 二级分类 -->
					<view class="cate-lv2-title">/{{item2.cat_name}}/</view>
					<!-- 三级分类 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key="index3" @click="gotoGoodList(item3)">
							<!-- 图片 -->
							<image class="cate-lv3-img" :src="item3.cat_icon.replace('dev','web')" mode=""></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>	
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 当前设备可用的高度
				wh:0,
				// 分类列表
				cateList:[],
				active: 0,
				cateLevel2:[],
				scrollTop: 0,
			}
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync();
			this.wh = sysInfo.windowHeight;
			this.getCateList();
		},
		methods: {
			// 获取分类列的数据
			async getCateList(){
				const {data:res} = await uni.$http.get('https://api-ugo-web.itheima.net/api/public/v1/categories')
				if (res.meta.status !== 200) return uni.showMsg();
				this.cateList = res.message;
				// 为二级分类赋值
				this.cateLevel2 = res.message[0].children;
			},
			activeChanged(index){
				//  刷新左侧点击焦点
				this.active = index;
				// 重新为二级分类赋值
				this.cateLevel2 = this.cateList[index].children;
				// 将高度重置为0  这里用三元操作是因为，不能赋予相同的值，所以在0和1之间来回切换欺骗用户
				this.scrollTop = this.scrollTop === 0?0.001:0; 
			},
			gotoGoodList(item3){
				uni.navigateTo({
					url:`/subpkg/goods_list/goods_list?cid=${item3.cat_id}`
				})
			}
		}
	}
</script>

<style>
.scroll-view-container{
	display: flex;
}
.left-scroll-view{
	width: 120px;
}
.left-scroll-view-item{
	background-color: #F7F7F7;
	line-height: 60px;
	text-align: center;
	font-size: 12px;
}
.right-scroll-view{
	background-color: #FFFFFF;
}
.active{
	background-color: #FFFFFF;
	position: relative;
}
.active::before{
	content: ' ';
	display: block;
	width: 3px;
	height: 30px;
	background-color: #C00000;
	position: absolute;
	top: 25%;
	
}
.cate-lv2-title{
	font-size: 12px;
	font-weight: bold;
	text-align: center;
	padding: 15px 0;
}
.cate-lv3-list{
	display: flex;
	/* 自动换行 */
	flex-wrap: wrap;
}
.cate-lv3-item{
	width: 33.33%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-bottom: 10px;
}
.cate-lv3-img{
	width: 60px;
	height: 60px;
}
text{
	font-size: 12px;
}
</style>
