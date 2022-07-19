 export default{
	 // 开启命名空间
	 namespaced: true,
	 
	 state:() =>({
		 // 收货地址
		 address: JSON.parse(uni.getStorageSync('address') || '{}'),
		 // 用户的基本信息
		 userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		 // 登录成功之后的token字符串
		 token: uni.getStorageSync('token') || '',
		 // 重新定向的objec对象{openType,from},{返回的方式,返回的路径}
		 redirectInfo:null
	 }),
	 
	 mutations:{
		 // 更新收货地址
		 updateAddress(state,address){
			 state.address = address
			 
			 // 将更新的收货地址持久化存储
			 this.commit('m_user/saveAddressToSrorage')
		 },
		 // 将地址数据持久化存储到本地
		 saveAddressToSrorage(state){
			 uni.setStorageSync('address',JSON.stringify(state.address))
		 },
		 // 更新用户的基本信息
		 updateUserInfo(state,userinfo){
			 state.userinfo = userinfo
			 
			 // 将用户信息持久化存储
			 this.commit('m_user/saveUserInfoStorage')
		 },
		 saveUserInfoStorage(state){
			 uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
		 },
		 // 获取服务器返回的Token
		 updateToken(state,token){
			 state.token = token
			 this.commit('m_user/saveTokenToSrorage')
		 },
		 // 将获取到的token持久化存储到vuex中
		 saveTokenToSrorage(state){
			 uni.setStorageSync('token',state.token)
		 },
		 // 记录登录之后返回页的信息
		 updateRedirectInfo(state,info){
			 state.redirectInfo = info
		 }
	 },
	 
	 action:{
		 
	 },
	 
	 getters:{
		 addstr(state){
		 	// 先判断是否有选中地址，如果没有返回空
		 	if (state.address.errMsg === '') return ''
		 	// 如果有选中地址，将身份城市街道和详细地址组合在一起
		 	return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		 }
	 }
	 
 }
	