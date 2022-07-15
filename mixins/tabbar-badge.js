// mixins是Vue的语法,可以将重复的js片段进行封装
import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	// 在页面显示的时候就会触发(不只是加载完成,在从后台进入前台的时候也会触发)
	onShow() {
		this.setBadge()
	},
	// 监听购物车总数的变化,使得通过uni-number-box改变商品数量的时候底部的购物车角标能够立即刷新
	// 这是其中一个方法,另一个方法是直接在cart.vue中调用this.setBadge()
	watch:{
		// 监听total值的变化
		total(newVal){
			// 调用methods中的setBadge方法，重新为tabBar的数字赋值
			this.setBadge()
		}
	},
	methods: {
		setBadge() {
			// 这个方法用于设置购物车右上角的角标
			uni.setTabBarBadge({
				index: 2, // 索引,2表示第三,即购物车
				text: this.total + '' // 这里的text必须是字符串,不能是数字
			})
		}
	}
}
