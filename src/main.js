import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'components/common/toast'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//Vue实例可以作为事件总线
Vue.prototype.$bus = new Vue()
//安装toast插件
Vue.use(toast)

//解决移动端点击300毫秒的延时
FastClick.attach(document.body)
//使用懒加载
Vue.use(VueLazyLoad)

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
