<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"
                    :is-checked="isSelectAll"
                    @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去结算({{checklength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'
  import {mapGetters} from 'vuex'

  export default {
    name:'CartBottomBar',
    components:{
      CheckButton,
    },
    data(){
      return{
        check: false
      }
    },
    methods: {
      checkClick(){
        if (this.isSelectAll){
          this.cartList.forEach(item => item.checked = false)
        }else {
          this.cartList.forEach(item => item.checked = true)
        }
        //this.$toast.methods.isShow
      },
      calcClick(){
        if( !this.isSelectAll ) {
          this.$toast.show('请选择购买的商品',3000)
        }
      }

    },
    computed:{
      ...mapGetters(['cartLength','cartList']),
      totalPrice(){
        return '￥'+this.$store.state.CartList.filter(item => {
          return item.checked //checked为true才返回
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        },0)
      },
      checklength(){
        return this.$store.state.CartList.filter(item => item.checked ).length
      },
      isSelectAll(){
        if (this.cartLength === 0) {
          return false
        }else {
          return !(this.$store.state.CartList.filter(item => !item.checked).length)
        }
      }
    }
  }
</script>

<style scoped>
 .bottom-bar {
   height: 52px;
   background-color: #dbe5ec;
   position: relative;
   display: flex;

 }

 .check-content{
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-left: 10px;
  width: 60px;
  padding-top:10px;
}

 .check-button{
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 10px;
}

 .price {
   font-size: 15px;
   padding-left: 40px;
   padding-top: 20px;
   flex:1;
 }

 .calculate{
  width: 90px;
  color: white;
  text-align: center;
  background-color: #ff8198;
  padding-top: 20px;
  font-size: 14px;

}
</style>
