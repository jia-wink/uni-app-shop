<template>
	<view>
		<view class="goods-list">
			<view class="goods-item" v-for="(goods,index) in goodsList" :key="index" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj:{
					// 查询关键词
					query:'',
					// 商品分类id
					cid:'',
					// 页码值
					pagenum:1,
					// 每页显示多少条数据
					pagesize:10				
				},
				// 商品列表数据
				goodsList:[],
				// 总数量，用来实现分页
				total:0,
				// 判断是否正在请求数据
				isloading:false
			}
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 调用获取商品列表数据的方法
			this.getGoodsList()
		},
		methods: {
			// 获取商品列表数据的方法
			async getGoodsList(cb){
				// 打开节流阀
				this.isloading = true
				// 发起数据请求
				const {data:res} = await uni.$http.get('http://api-ugo-web.itheima.net/api/public/v1/goods/search',this.queryObj)
				// 关闭节流阀
				this.isloading = false
				// 当数据请求完毕，就立即调用cb回调函数，来关闭当前页面的刷新效果
				// 短路运算？如果这个值存在，就调用
				cb && cb()
				if(res.meta.status !==200) return uni.showMsg();
				// 为数据赋值  后面的【】是实现了一个数据的拼接功能
				this.goodsList = [...this.goodsList,...res.message.goods]
				this.total = res.message.total
			},
			// 点击跳转到商品详情页面
			gotoDetail(item){
				uni.navigateTo({
					url:`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
				})
			},
		},
		// 触底的事件
		onReachBottom(){
			// 判断是否还有下一页的数据。减少不必要的请求
			if(this.queryObj.pagenum*this.queryObj.pagesize>=this.total) return uni.$showMsg('数据加载完毕！')
			if(this.isloading) return
			// 让页码值自增+1
			this.queryObj.pagenum++
			this.getGoodsList()
		},
		// 下拉刷新的事件(打开)
		onPullDownRefresh(){
			// 1.先重置关键的数据
			this.queryObj.pagenum = 1,
			this.total = 0,
			this.goodsList = [],
			this.isloading = false
			// 2.重新发起请求，并且关闭页面的下拉刷新效果，括号里的的箭头函数就是关闭下拉刷新，传一个回调函数
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
}
</script>

<style>

</style>
