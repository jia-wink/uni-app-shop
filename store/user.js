 export default{
	 // 开启命名空间
	 namespaced: true,
	 
	 state:() =>({
		 // 收货地址
		 address: JSON.parse(uni.getStorageSync('address') || '{}')
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
	