export default{
	// 为当前模块开启命名空间
	namespaced: true,
	
	// state里的数据只能被mutations里的方法更改
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		    // 每个商品的信息对象，都包含如下 6 个属性：
		    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
	}),
	
	// 模块的 mutations 方法，修改satus里的的状态或者数据
	mutations:{
		// 加入购物车
		// stete是数据，goods是商品对象
		addToCart(state,goods){
			// 根据提交的商品id，查询购物车中是否存在这样的商品
			// 如果不存在，则 findResult 为 undefined（false）；否则，为查找到商品信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 如果购物车不存在这个商品就添加进去，如果存在就把数量加一
			if (!findResult) {
				state.cart.push(goods)
			} else{
				findResult.goods_count++
			}
			
			// 通过commit方法，调用m_cart命名空间下的saveToStorage方法
			// 在这里想调用mutations里的方法只能通过commit方法
			this.commit('m_cart/saveToStorage')
		},
		// 将购物车数据持久化存储
		saveToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		// 更新商品的选中状态
		updateGoodsState(state,goods){
			// 根据goods_id查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			// 如果有对应的商品信息对象
			if (findResult) {
				// 更新对应商品的选中状态
				findResult.goods_state = goods.goods_state
				// 持久化存储到本地,通过commit方法调用自己的saveToStorage方法
				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新购物车每个商品的数量
		updateGoodsCount(state,goods){
			// 根据goods_id查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			// 如果有对应的商品信息对象
			if (findResult) {
				// 更新对应商品的s数量
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地,通过commit方法调用自己的saveToStorage方法
				this.commit('m_cart/saveToStorage')
			}
			
		},
		// 根据商品的id删除对应的商品
		removeGoodsById(state,goods_id){
			// 只保留没删除的商品
			state.cart =  state.cart.filter(x => x.goods_id !== goods_id)
			this.commit('m_cart/saveToStorage')
		},
		// 更新所有商品的勾选状态
		updateAllGoodsState(state,newState){
			// 循环更新每个商品的选中状态
			state.cart.forEach(x => x.goods_state = newState)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		}
		
	},
	
	// 异步操作数据  view层通过store.display来分发action
	action:{
		
	},
	
	// 模块的 getters 属性(类似于Vue的计算属性，主要用来过滤一些数据)  书包装器
	getters:{
		// 统计购物车中所有商品的总数量
		total(state){
			// 循环统计商品的数量，累加到变量c中
			// let c = 0
			// state.cart.forEach(x => c += x.goods_count)
			// return c
			
			// 也可以使用数组的reduce方法
			return state.cart.reduce((total,item) => total += item.goods_count,0 )
			
		},
		// 统计购物车中已选中的商品的数量
		checkCount(state){
			// filter方法是过滤出购物车里已经选中的商品
			// reduce方法是统计已经选中的商品的数量
			// 最后的返回值就是一个已经选中商品的总数量
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count,0 )
		},
		// 统计购物车中已勾选的商品的总价格
		checkedGoodsAmount(state){
			// 先过滤出已勾选的商品，然后统计已勾选商品的总价格，最后将价格保留两位小数
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count * item.goods_price,0 ).toFixed(2)
		}
	}
}