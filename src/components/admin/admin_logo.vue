<template>
  <div class="admin_logo">
    <img src="/src/assets/kaierxi.png" alt="">
    <div class="admin_logo_text">
      <div>RoLingG</div>
      <div>rolingg@qq.com</div>
    </div>
  </div>
</template>

<style lang="scss">
.admin_logo{
  height: 100px;
  display: flex;
  padding: 20px;
  align-items: center;
  border-bottom: 1px solid var(--bgColor);
  img{
    transition: all .3s;
    border-radius: 5px;
    height: 95px;
    width: 70px;
    //border: 1px solid var(--bgColor);
  }
  .admin_logo_text{
    transform: scale(1);
    transform-origin: left;
    transition: all .3s;
    margin-left: 20px;
    color: var(--color-text-1);
    > div:nth-child(1){
      font-size: 22px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    > div:nth-child(2){
      font-size: 12px;
    }
  }
}
.collapsed{
  .admin_logo{
    padding: 8px;
    img{
      transition: all .3s;
      height: 38px;
      width: 38px;
    }
    .admin_logo_text{
      transform: scale(0);
      transition: all .3s;
    }
  }
}
</style>