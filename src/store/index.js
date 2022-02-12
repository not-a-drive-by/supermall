import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

//1.安装插件
Vue.use(Vuex)

//2.创建store对象
const store = new Vuex.Store({
  state: {
    //关于购物车商品的变量
    CartList:[]
  },
  getters,
  mutations:{
    //单一操作原则，复杂操作放在actions里
    addCounter(state,payload) {
      payload.count ++ ;
    },
    addToCart(state,payload){
      payload.checked = true;
      state.CartList.push(payload)
    }
  },
  actions: {
    addCart(context,payload) {
      return new Promise((resolve, reject) => {
        let oldProduct = null;
        //1.先判断商品是否已经存在
        for (let item of context.state.CartList){
          if (item.iid === payload.iid)
            oldProduct = item;
        }
        //2.判断oldProduct
        if(oldProduct) {
          //数量加一
          //oldProduct.count += 1;
          context.commit('addCounter',oldProduct);
          resolve('数量增加');
        } else {
          //添加新的商品
          payload.count = 1
          //state.CartList.push(payload)
          context.commit('addToCart',payload);
          resolve('商品增加')
        }
      })
    }
  }
})

//3.挂载到Vue实例上
export default store
