<template>
  <div class='nav-bar'>
    <div class='left'><slot name="left"></slot></div>
    <div class='center'><slot name="center"></slot></div>
    <div class='right'><slot name="right"></slot></div>
  </div>
</template>

<script>

</script>

<style scoped>
  .nav-bar {
    display: flex;
    height: 49px;
    line-height: 49px;
    text-align: center;
    box-shadow: 0 1px 1px rgba(100,100,100,.1);
    padding-bottom:0px;

  }

  .left,.right {
    width: 60px;

  }

  .center {
    flex:1;

  }
</style>
