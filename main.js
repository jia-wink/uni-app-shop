
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store/store.js'


import {$http} from '@escook/request-miniprogram'

uni.$http = $http

// 请求拦截器
$http.beforeRequest = function(options){
	uni.showLoading({
		title:'数据加载中...'
	})
	
	// 判断当前请求的接口是否为有权限的接口,实际上就是判断有没有/my/这个后缀
	if(options.url.indexOf('/my/') !== -1){
		// 为请求头添加身份认证字段(token)
		options.header = {
			// 字段的值可以直接从vuex中获取
			Authorization: store.state.m_user.token,
		}
	}
}

// 隐藏拦截器
$http.afterRequest = function(options){
	uni.hideLoading()
}

// 封装弹窗的方法
uni.$showMsg = function(title = '数据请求失败啦！', duration = 1500){
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	// 将Vuex挂载到Vue实例上
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif