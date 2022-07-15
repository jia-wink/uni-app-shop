// 导入Vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'
// 导入购物车的vuex模块
import moduleCart from '@/store/cart.js'
// 导入用户的vuex模块
import moduleUser from '@/store/user.js'

// 将Vuex安装为Vue插件
Vue.use(Vuex)

// 创建store的实例对象
const store = new Vuex.Store({
	// 挂载store模块
	modules: {
		// 挂载购物车的vuex模块
		m_cart: moduleCart,
		// 挂载用户的vuex模块
		m_user: moduleUser,
	},
})

// 向外共享Store的实例对象
export default store