<template>
  <div class="order-center">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="main-container">
      <div class="sidebar">
        <h2>订单中心</h2>
        <ul class="menu">
          <li v-for="item in menuItems" :key="item.path">
            <router-link :to="item.path" :class="{ active: $route.path === item.path }">
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
              <span v-if="item.count" class="count">({{ item.count }})</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderCenter',
  data() {
    return {
      menuItems: [
        { label: '我的订单', path: '/order/my-order', icon: 'el-icon-s-order', count: 5 },
        { label: '退货申请', path: '/order/return-apply', icon: 'el-icon-refresh-left', count: 2 },
        { label: '收货地址', path: '/order/address', icon: 'el-icon-location' },
        { label: '我的收藏', path: '/order/my-favorite', icon: 'el-icon-star-off', count: 8 },
        { label: '我的足迹', path: '/order/my-footprint', icon: 'el-icon-time', count: 12 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.order-center {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);

  .breadcrumb {
    margin-bottom: 20px;
    padding: 15px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }

  .main-container {
    display: flex;
    gap: 20px;
  }
  
  .sidebar {
    width: 240px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    padding: 20px 0;
    height: fit-content;

    h2 {
      padding: 0 20px 15px;
      margin: 0;
      font-size: 18px;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
    }

    .menu {
      list-style: none;
      padding: 10px 0;
      margin: 0;

      li {
        a {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #666;
          text-decoration: none;
          transition: all 0.3s;
          
          i {
            font-size: 18px;
            margin-right: 10px;
          }

          span {
            flex: 1;
          }

          .count {
            flex: none;
            font-size: 13px;
            color: #999;
          }

          &:hover {
            color: #409EFF;
            background: #ecf5ff;
          }

          &.active {
            color: #409EFF;
            background: #ecf5ff;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 3px;
              height: 20px;
              background: #409EFF;
              border-radius: 3px 0 0 3px;
            }
          }
        }
      }
    }
  }

  .content {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    padding: 20px;
    min-height: 600px;
  }
}
</style> 