import {debounce} from 'common/utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data(){
    return {
      itemImgListener: null,
    }
  },
  mounted(){
    let refresh = debounce(this.$refs.scroll.refresh, 500)

    this.itemImgListener = ()=> {
      refresh()
    }
    this.$bus.$on('ItemImageLoad', this.itemImgListener)
    //console.log('我是混入中的内容')
  }
}

export const backTopMixin = {
  components:{
    BackTop,
  },
  data(){
    return {
      isShowBackTop:false,
    }
  },
  methods:{
    backClick() {
      //用refs直接获得组件
      this.$refs.scroll.scrollTo(0,0,500)
    },
  }
}
