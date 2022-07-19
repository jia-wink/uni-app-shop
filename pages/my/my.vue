<template>
	<view class="my-container">
		<!-- 用户未登录，展示登录组件 -->
		<my-login v-if="!token"></my-login>
		
		<!-- 用户登录之后展示用户信息组件 -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import { mapState,mapMutations } from "vuex"
	
	export default {
		// mixins是Vue的语法,可以将重复的js片段进行封装
		mixins:[badgeMix],
		computed:{
			...mapState('m_user',['token'])
			
		},
		data() {
			return {
				
			};
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
	// 每一个页面最后面都有一个page根节点
	page,.my-container{
		height: 100%;
	}
</style>
