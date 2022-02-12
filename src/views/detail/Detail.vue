<template>
  <div id="detail">
    <detail-nav-bar class="detial-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probeType="3"
            @scroll="contentScroll">
      <h2>
        <ul>
          <li v-for="item in $store.state.CartList">{{item.count}}</li>
        </ul>
      </h2>
      <detail-swiper :topImages="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailinfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommends"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!--<toast />-->

    <detail-bottom-bar @addCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailComment from './childComps/DetailComment'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  //import Toast from 'components/common/toast/Toast'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
  import {debounce} from 'common/utils'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'


  export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailComment,
      Scroll,
      GoodsList,
      DetailBottomBar,
      //Toast,
    },
    data(){
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop:{},
        detailinfo: {},
        paramInfo: {},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        currentIndex: 0,
        // message:"",
        // show:false
      }
    },
    created(){
      //1.保存传入的iid
      this.iid = this.$route.params.id;

      //2.根据iid请求详细数据
      getDetail(this.iid).then(res => {
        //数据分离
        const data = res.result;
        //console.log(res)
        //1.顶部轮播图
        this.topImages = data.itemInfo.topImages;
        //2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        //3.创建店铺信息
        this.shop = new Shop(data.shopInfo)
        //4.保存商品的详情数据
        this.detailinfo = data.detailInfo
        //5.获取商品参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        //6.获取评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0];
        }



      })

      //3.获取推荐商品数据
      getRecommend().then(res => {
        //console.log(res);
        this.recommends = res.data.list;
      })
    },

    destroyed(){
      //没有keep-alive，要在destroyed里取消
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },


    mixins:[itemListenerMixin, backTopMixin],
    mounted(){
      // let refresh = debounce(this.$refs.scroll.refresh,500)

      // //对监听事件进行保存
      // this.itemImgListener = ()=> {
      //   refresh()
      // }

      // this.$bus.$on('ItemImageLoad', this.itemImgListener)
      // //详情页中的事件监听
      // //this.$bus.$on('itemImgLoad')



    },


    methods:{
      imageLoad(){
        this.$refs.scroll.refresh();
        this.themeTopYs=[];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);

        //console.log(this.themeTopYs);
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index],100);
      },
      contentScroll(position){
        //1.获取y值
        const positionY = -position.y;

        let length = this.themeTopYs.length
        //2.positionY和主题中的Y对比
        for (let i = 0; i < this.themeTopYs.length ; i++) {
          if (this.currentIndex !== i && ((i < length-1 && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]))
              || (i === length-1 && positionY > this.themeTopYs[i])) ){
            this.currentIndex = i;
            //console.log(this.currentIndex)
            this.$refs.nav.currentIndex = this.currentIndex;

          }
        }

        //3.判断BackTop是否显示
        this.isShowBackTop = - position.y >1000

      },

      addToCart(){
        //1.获取购物车需要展示的信息
        const product = {};

        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //2.将商品添加到购物车里
        //this.$store.commit('addCart',product)
        this.$store.dispatch('addCart',product).then(res => {
          this.$toast.show(res, 30000)
          //console.log(this.$toast)
        })

        //3.弹出添加成功的提示
      }


    }


  }
</script>

<style scoped>
#detail {
  position: relative;
  z-index:9;
  background-color: #fff;
}

.nav-detail {
  position: relative;
  z-index:9;
  background-color: #fff;

}

.content {
  height: calc(100vh - 44px - 58px);
}


</style>
