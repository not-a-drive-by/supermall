<template>
    <div >
      <nav-bar class="home-nav"><div slot="center" >购物街</div></nav-bar>
      <tab-control :titles="['流行','新款','精选']"
                    @tabClick="tabClick"
                    ref="tabControl1"
                    class="tab-control"
                    v-show="isTabFixed"></tab-control>
      <scroll class="content"
              ref="scroll"
              :probe-type="3"
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <home-swiper :banners="banners"
                     @swiperImageLoad="swiperImageLoad"></home-swiper>
        <recommend-view :recommends="recommends"></recommend-view>
        <feature-view/>
        <tab-control :titles="['流行','新款','精选']"
                    @tabClick="tabClick"
                    ref="tabControl2"></tab-control>
        <goods-list :goods="showGoods"> </goods-list>
      </scroll>

      <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import {getHomeMultidata,getHomeGoods,} from 'network/home' //只有default导出才不用删除大括号
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'



export default {
  name: 'Home',
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
  },


  data(){
    return {
      //result: null,//存储请求到的数据
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0, list:[]},
        'new':{page:0, list:[]},
        'sell':{page:0, list:[]},
      },
      currentType:'pop',
      tabOffsetTop:0,
      isTabFixed:false,
      saveY:0,
    }
  },

  computed: {
    showGoods(){
      return this.goods[this.currentType].list;
    }
  },

  deactivated(){
    //1、记录页面位置
    this.saveY = this.$refs.scroll.getScrollY();
    //2.取消全局事件监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },


  activated(){
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.saveY, 0);

  },


  created() {
    //首页创建好就发送网络请求
    //1.请求多个数据
    this.getHomeMultidata()

    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

  },

  mixins:[itemListenerMixin, backTopMixin],
  mounted(){
    // //mounted中监听保证能拿到$refs

    // //防止太频繁，进行防抖
    // const refresh = debounce(this.$refs.scroll.refresh,500)

    // //对监听事件进行保存
    // this.itemImgListener = ()=> {
    //   refresh()
    // }

    // //监听Item中图片加载完成
    // this.$bus.$on('ItemImageLoad', this.itemImgListener)
    // //吸顶效果
    // //所有的组件都有一个属性$el：用于获取元素
    // //this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
  },


  methods:{
    getHomeMultidata(){
      //1.请求多个数据
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
      //不能在这里打印this.result由于异步操作会返回null
      //console.log(this.result)
    },
    getHomeGoods(type){
      const page =this.goods[type].page + 1;
      getHomeGoods(type,1).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp()
      })
    },

    //事件监听相关
    tabClick(index) {
      switch(index){
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index;
    },
    contentScroll(position){

      //1.判断BackTop是否显示
      this.isShowBackTop = - position.y >1000

      //2.判断tabControl是否吸顶
      this.isTabFixed = -position.y > this.tabOffsetTop

    },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    }
  }
}
</script>

<style scoped>
#home {
    /*padding-top: 44px;*/
    height: 100vh;
  }
.home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;*/
  }

.tab-control {
  position: relative;
  z-index:9;
}

.content {
  /*height:calc(100vh - 98px);*/
  overflow:hidden;

  position:absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

/*.fix {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
}*/
</style>
