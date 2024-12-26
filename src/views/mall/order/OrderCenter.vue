<template>
  <div class="order-center">
    <div class="sidebar">
      <h2>订单中心</h2>
      <ul class="menu">
        <li>
          <router-link to="/order/my-order">我的订单</router-link>
        </li>
        <li>
          <router-link to="/order/return-apply">退货申请</router-link>
        </li>
        <li>
          <router-link to="/order/address">收货地址</router-link>
        </li>
        <li>
          <router-link to="/order/my-favorite">我的收藏</router-link>
        </li>
        <li>
          <router-link to="/order/my-footprint">我的足迹</router-link>
        </li>
      </ul>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderCenter'
}
</script>

<style lang="scss" scoped>
.order-center {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  min-height: 600px;
  
  .sidebar {
    width: 200px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);

    h2 {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .menu {
      li {
        margin: 10px 0;
        
        a {
          display: block;
          padding: 10px;
          color: #333;
          text-decoration: none;
          border-radius: 4px;

          &:hover, &.router-link-active {
            background: #f0f0f0;
            color: #409EFF;
          }
        }
      }
    }
  }

  .content {
    flex: 1;
    margin-left: 20px;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
}
</style> 