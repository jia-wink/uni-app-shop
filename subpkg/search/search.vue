<template>
	<view>
		<view class="search-box">
			<!-- :focus是自动获取焦点 -->
			<uni-search-bar v-model="kw" focus="true" class="acac" @confirm="search" @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="kw.length!== 0">
			<view class="sugg-item" v-for="(item,index) in searchResults" :key="index" @click="gotoDetail(item)">
				<view class="goods_name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史区域 -->
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<view class="history-list">
				<!-- 文本标签 官方提供 -->
				<uni-tag :text="item" v-for="(item,index) in histories" :key="index" @click="input(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 延时器的 timerID
				timer:null,
				// 输入的搜索关键词
				kw:'',
				// 存放搜索建议的数组
				searchResults:[],
				// 存放搜索历史的数组
				historyList:[]
			};
		},
		onLoad() {
			// 在页面加载的时候，获取之前的历史搜索数据
			
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods:{
			// input输入事件的处理函数
			input(e){
				// 防抖动（就算防止用户输入一个字符就进行一次ajax请求，浪费资源并且影响体验）
				// 当用户进行输入的时候，清除timer
				clearTimeout(this.timer);
				// 启动一个延时器，并且把timerId赋值给this.timer
				this.timer = setTimeout(() =>{
					// 如果500毫秒内，没有触发新的输入事件，则为搜索关键词赋值
					this.kw = e;
					this.getSearchList()
				},500)
			},
			async getSearchList(){
				// 判断输入的字符是否为空
				if(this.kw === ''){
					// 如果为空，返回空数组
					this.searchResults =[]
					return
				}
				// 如果不为空，发起请求，获得搜索建议的列表
				const {data : res} = await uni.$http.get('http://api-ugo-web.itheima.net/api/public/v1/goods/qsearch',{query: this.kw})
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message
				this.saveSearchHistory()
			},
			gotoDetail(item){
				// console.log(item.goods_id)
				// 点击搜索建议跳转到商品详情界面
				uni.navigateTo({
					url:`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
				})
			},
			saveSearchHistory(){
				// 注意，这里是用push方法压入尾部，为什么不用unshif方法压入头部呢，因为会改变索引值，所以会导致key的顺序发生变化，产生bug
				this.historyList.push(this.kw)
				
				// 以下是老师给去除重复搜索记录的代码，但自己总结了一个更好的
				// const set = new Set(this.historyList)
				// set.delete(this.kw)
				// set.add(this.kw)
				// this.historyList = Array.from(set)
				
				// 将搜索记录持久化存储在本地
				// setStorageSync(key,value)方法可以把数据持久化存在本地
				// JSON.stringify()用于把数组转化为字符串
				uni.setStorageSync('kw',JSON.stringify(this.historyList))
			},
			clean(){
				// 清除本地的所有历史记录
				this.historyList = [],
				uni.setStorageSync('kw','[]')
			}
		},
		computed:{
			histories(){
				// 这里的三个点的意思就是，将historyList里的每一个元素都拿出来放在一个空数组中，避免了修改原数组
				// return [...this.historyList].reverse()
				// 自己总结的实现去除重复记录并且将新的移到最前的代码，必老师给的简洁。
				return [...new Set([...this.historyList].reverse())]
			}
		}
	}
</script>

<style>
	.search-box{
		background-color: #C00000;
		position: sticky;
		top: 0;
		z-index: 999;
	}
	.sugg-list{
		padding: 0 5px;
	}
	.sugg-item{
		display: flex;
		align-items: center;
		/* 两端贴标对齐 */
		justify-content: space-between;
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
	}
	.goods_name{
		/* 使文本不换行 */
		white-space: nowrap;
		/* 超出部分隐藏 */
		overflow: hidden;
		/* 超出的内容为三个小点 ... */
		text-overflow: ellipsis;
	}
	.history-box{
		padding: 0 5px;
	}
	.history-title{
		display: flex;
		justify-content: space-between;
		height: 40px;
		align-items: center;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	.history-list{
		display: flex;
		/* 使文本标签自动换行 */
		flex-wrap: wrap;
	}
	/* uni-tap以前是个类名，现在已经变成一个标签了！ */
	uni-tag{
		/* 设置文本标签的间距 */
		margin: 5px 5px 0 0;
	}
</style>
