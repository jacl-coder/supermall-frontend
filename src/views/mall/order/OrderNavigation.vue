<template>
  <div class="order-navigation">
    <div class="nav-menu">
      <router-link 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }">
        <i :class="item.icon"></i>
        <span class="text">{{ item.text }}</span>
        <span v-if="item.count" class="badge">{{ item.count }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderNavigation',
  data() {
    return {
      navItems: [
        { text: '我的订单', path: '/order/my-order', icon: 'el-icon-s-order', count: 5 },
        { text: '退货申请', path: '/order/return-apply', icon: 'el-icon-refresh-left', count: 2 },
        { text: '收货地址', path: '/order/address', icon: 'el-icon-location' },
        { text: '我的收藏', path: '/order/my-favorite', icon: 'el-icon-star-off', count: 8 },
        { text: '我的足迹', path: '/order/my-footprint', icon: 'el-icon-time', count: 12 }
      ]
    }
  },
  methods: {
    isActive(path) {
      return this.$route.path === path
    }
  }
}
</script>

<style lang="scss" scoped>
.order-navigation {
  width: 200px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px 0;

  .nav-menu {
    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: #666;
      text-decoration: none;
      transition: all 0.3s;

      &:hover {
        color: #409EFF;
        background: #ecf5ff;
      }

      &.active {
        color: #409EFF;
        background: #ecf5ff;
        border-right: 3px solid #409EFF;
      }

      i {
        font-size: 18px;
        margin-right: 10px;
      }

      .text {
        flex: 1;
      }

      .badge {
        background: #f56c6c;
        color: #fff;
        border-radius: 10px;
        padding: 0 6px;
        font-size: 12px;
        height: 16px;
        line-height: 16px;
        min-width: 16px;
        text-align: center;
      }
    }
  }
}
</style> 