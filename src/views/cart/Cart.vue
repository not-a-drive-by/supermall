<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!--商品列表-->
    <cart-list/>
    <!--底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import {backTopMixin} from "common/mixin"
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import Scroll from 'components/common/scroll/Scroll'
import CartBottomBar from './childComps/CartBottomBar'

import {mapGetters} from 'vuex'

export default {
  name: 'Cart',
  mixins:[backTopMixin],
  components: {
    NavBar,
    CartList,
    Scroll,
    CartBottomBar,
  },
  computed:{
    //抽取成getter放在store，然后从vuex导入
    ...mapGetters(['cartLength','cartList'])

  }
}
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color:#fff;
  font-weight:700;
}
</style>
