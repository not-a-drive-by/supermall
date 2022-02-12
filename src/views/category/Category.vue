<template>
    <div class="wrapper">
    <h2>分类</h2>
      <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>
</template>

<script>
import {backTopMixin} from 'common/mixin'
import BScroll from 'better-scroll'

export default {
  name: 'Category',
  components:{

  },
  mixins:[backTopMixin],

}
</script>

<style scoped>
.wrapper {
  height:150px;
  background-color:red;
}
</style>
