<template>
  <div class="system">
    <div class="system_menu">
      <router-link :to="{name:'web_config'}">网站配置</router-link>
      <router-link :to="{name:'email_config'}">邮箱配置</router-link>
      <router-link :to="{name:'qiniu_config'}">七牛云配置</router-link>
      <router-link :to="{name:'jwt_config'}">jwt配置</router-link>
    </div>
    <div class="system_container">
      <router-view/>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.system{
  display: flex;
  .system_menu{
    width: 160px;
    height: calc(100vh - 140px);
    border-radius: 5px;
    background-color: var(--color-bg-1);
    display: flex;
    flex-direction: column;
    padding: 20px;
    a {
      display: flex;
      text-decoration: none;
      color: var(--color-text-2);
      background-color: var(--color-fill-2);
      border-radius: 5px;
      height: 50px;
      margin-bottom: 20px;
      justify-content: center;
      align-items: center;
      &.router-link-exact-active {
        background-color: var(--active);
        color: var(--collapse-color);
      }

      &:hover {
        background-color: var(--active);
        color: var(--collapse-color);
      }
    }
  }
  .system_container {
    padding: 20px;
    margin-left: 10px;
    width: calc(100% - 160px);
    min-height: calc(100vh - 140px);
    border-radius: 5px;
    background-color: var(--color-bg-1);
  }
}
</style>