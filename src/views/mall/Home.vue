<template>
  <div class="mall-container">
    <!-- 顶部工具栏 -->
    <el-affix position="top">
      <div class="header">
        <div class="header-content">
          <div class="logo">
            <el-link :underline="false" href="/" class="logo-link">
              <el-icon size="24"><HomeFilled /></el-icon>
              家居优品
            </el-link>
          </div>
          <div class="search-box">
            <el-input
              v-model="searchText"
              placeholder="搜索心仪的商品..."
              class="search-input"
            >
              <template #append>
                <el-button type="primary">
                  <el-icon><Search /></el-icon>
                  搜索
                </el-button>
              </template>
            </el-input>
          </div>
          <div class="user-actions">
            <el-button text>
              <el-icon><User /></el-icon>
              个人中心
            </el-button>
            <el-button text>
              <el-icon><List /></el-icon>
              我的订单
            </el-button>
            <el-button text>
              <el-icon><Star /></el-icon>
              我的收藏
            </el-button>
            <el-badge :value="cartCount" :max="99" class="cart-badge">
              <el-button text>
                <el-icon><ShoppingCart /></el-icon>
                购物车
              </el-button>
            </el-badge>
          </div>
        </div>
      </div>
    </el-affix>

    <!-- 主导航菜单 -->
    <div class="nav-menu">
      <div class="nav-content">
        <div class="category-btn">
          <el-icon><Menu /></el-icon>
          商城分类
        </div>
        <div class="nav-items">
          <router-link to="/" class="nav-item active">商城首页</router-link>
          <router-link to="/all" class="nav-item">全部商品</router-link>
          <router-link to="/new" class="nav-item">新品热销</router-link>
          <router-link to="/activity" class="nav-item">活动专区</router-link>
          <router-link to="/brand" class="nav-item">品牌热点</router-link>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧分类菜单 -->
      <div class="left-sidebar">
        <el-menu
          class="category-menu"
          :default-active="activeCategoryIndex"
        >
          <el-menu-item 
            v-for="item in categories" 
            :key="item.id"
            :index="String(item.id)"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.name }}</span>
            <el-icon class="arrow"><ArrowRight /></el-icon>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 中间内容区 -->
      <div class="center-content">
        <!-- 走马灯 -->
        <div class="banner-section">
          <el-carousel :interval="4000" type="card" height="420px">
            <el-carousel-item v-for="item in carouselItems" :key="item.id">
              <el-image 
                :src="item.image" 
                fit="cover"
                class="carousel-image"
              >
                <template #placeholder>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="carousel-info">
                <h2>{{ item.title }}</h2>
                <p>{{ item.description }}</p>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>

        <!-- 商品展示区 -->
        <div class="product-showcase">
          <el-row :gutter="20">
            <el-col :span="8" v-for="item in showcaseItems" :key="item.id">
              <div class="showcase-item">
                <el-image 
                  :src="item.image"
                  fit="cover"
                  class="showcase-image"
                >
                  <template #placeholder>
                    <div class="image-placeholder">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <div class="showcase-info">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 推荐商品区 -->
        <div class="recommend-section">
          <!-- ... 保持推荐商品区内容不变 ... -->
        </div>
      </div>

      <!-- 右侧边栏 -->
      <div class="right-sidebar">
        <!-- ... 保持右侧边栏内容不变 ... -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  HomeFilled, Search, User, ShoppingCart, Menu, 
  ArrowRight, Picture, Star, List,
  CaretBottom, House, Box, KnifeFork, Goods, SetUp
} from '@element-plus/icons-vue'

const searchText = ref('')
const activeIndex = ref('home')
const activeCategoryIndex = ref('1')
const cartCount = ref(3)

// 分类数据
const categories = [
  { id: 1, name: '家具类', icon: 'House' },
  { id: 2, name: '床上用品', icon: 'Box' },
  { id: 3, name: '厨房用具', icon: 'KnifeFork' },
  { id: 4, name: '室内装饰', icon: 'Picture' },
  { id: 5, name: '生活用品', icon: 'Goods' },
  { id: 6, name: '家居组合', icon: 'SetUp' },
]

// 轮播图数据
const carouselItems = [
  {
    id: 1,
    title: '简约北欧风',
    description: '打造温馨舒适的居家环境',
    image: 'https://example.com/carousel1.jpg'
  },
  {
    id: 2,
    title: '品质生活',
    description: '精选优质家居用品',
    image: 'https://example.com/carousel2.jpg'
  },
  {
    id: 3,
    title: '特惠专区',
    description: '限时优惠，心动不如行动',
    image: 'https://example.com/carousel3.jpg'
  }
]

// 推荐商品数据
const recommendItems = [
  {
    id: 1,
    title: '北欧简约沙发',
    description: '舒适典雅，品质生活',
    price: 2999,
    image: 'https://example.com/product1.jpg'
  },
  {
    id: 2,
    title: '实木餐桌椅组合',
    description: '原木质感，自然环保',
    price: 4999,
    image: 'https://example.com/product2.jpg'
  },
  {
    id: 3,
    title: '轻奢床品四件套',
    description: '高支纯棉，柔软亲肤',
    price: 599,
    image: 'https://example.com/product3.jpg'
  }
]

// 公告数据
const notices = [
  '618大促即将开始，敬请期待！',
  '新品上市：北欧风格家具系列',
  '限时特惠：床品套装低至5折',
  '签到有礼，最高领取100元优惠券'
]

// 热门商品数据
const hotItems = [
  {
    title: '简约布艺沙发',
    price: 1999,
    image: 'https://example.com/hot1.jpg'
  },
  {
    title: '全棉床品套装',
    price: 299,
    image: 'https://example.com/hot2.jpg'
  },
  {
    title: '实木茶几',
    price: 899,
    image: 'https://example.com/hot3.jpg'
  }
]

// 添加商品展示数据
const showcaseItems = [
  {
    id: 1,
    title: '北欧简约沙发',
    description: '舒适典雅，品质生活',
    image: 'https://example.com/showcase1.jpg'
  },
  {
    id: 2,
    title: '实木餐桌椅组合',
    description: '原木质感，自然环保',
    image: 'https://example.com/showcase2.jpg'
  },
  {
    id: 3,
    title: '轻奢床品四件套',
    description: '高支纯棉，柔软亲肤',
    image: 'https://example.com/showcase3.jpg'
  }
]
</script>

<style scoped lang="scss">
.mall-container {
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
}

.header {
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  .header-content {
    width: 1200px;
    height: 60px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    .logo {
      width: 180px;
      
      .logo-link {
        font-size: 22px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .search-box {
      flex: 1;
      max-width: 400px;
      margin: 0 40px;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 20px;

      .cart-badge {
        margin-left: 10px;
      }
    }
  }
}

.nav-menu {
  width: 100%;
  background-color: #333;

  .nav-content {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    height: 50px;

    .category-btn {
      width: 240px;
      background-color: #409EFF;
      color: #fff;
      font-weight: bold;
      display: flex;
      align-items: center;
      padding: 0 20px;
      cursor: pointer;

      .el-icon {
        margin-right: 8px;
      }
    }

    .nav-items {
      display: flex;
      align-items: center;

      .nav-item {
        padding: 0 40px;
        color: #fff;
        font-size: 16px;
        text-decoration: none;
        height: 50px;
        line-height: 50px;
        transition: all 0.3s;
        min-width: 120px;
        text-align: center;

        &:hover, &.active {
          background-color: rgba(255,255,255,0.1);
          color: #409EFF;
        }
      }
    }
  }
}

.main-content {
  width: 1200px;
  margin: 20px auto;
  display: flex;
  gap: 20px;

  .left-sidebar {
    width: 240px;

    .category-menu {
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      height: 420px;

      :deep(.el-menu-item) {
        height: 70px;
        line-height: 70px;
        font-size: 15px;
        padding: 0 20px;
        display: flex;
        align-items: center;

        .el-icon {
          margin-right: 12px;
          font-size: 18px;
        }

        span {
          flex: 1;
        }

        .arrow {
          font-size: 14px;
          color: #909399;
        }

        &:hover {
          background-color: #f5f7fa;
          color: var(--el-color-primary);
          
          .arrow {
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  .center-content {
    flex: 1;
    min-width: 0;

    .banner-section {
      margin-bottom: 30px;

      :deep(.el-carousel__item) {
        border-radius: 8px;
        overflow: hidden;

        &.is-active {
          transform: scale(1.1);
        }
      }

      .carousel-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .carousel-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 25px;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        color: #fff;
        text-align: center;

        h2 {
          margin: 0;
          font-size: 24px;
          margin-bottom: 10px;
        }

        p {
          margin: 0;
          font-size: 16px;
          opacity: 0.9;
        }
      }

      .image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f5f7fa;
        color: #909399;
      }
    }
  }
}

.recommend-section {
  margin: 30px 0;

  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 10px;

    .title-content {
      display: flex;
      align-items: center;
      gap: 10px;

      h2 {
        margin: 0;
        font-size: 22px;
        color: #333;
        font-weight: 600;
      }
    }

    .more-btn {
      font-size: 14px;
      color: #666;
      
      &:hover {
        color: var(--el-color-primary);
      }

      .el-icon {
        margin-left: 4px;
        transition: transform 0.3s;
      }

      &:hover .el-icon {
        transform: translateX(3px);
      }
    }
  }

  .recommend-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s;
    margin-bottom: 20px;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);

      .recommend-image {
        transform: scale(1.05);
      }
    }

    .recommend-image {
      height: 220px;
      width: 100%;
      transition: all 0.5s;
    }

    .recommend-info {
      padding: 15px;
      background: #fff;

      .title {
        margin: 0;
        font-size: 16px;
        color: #333;
        font-weight: 600;
        line-height: 1.4;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .desc {
        margin: 0;
        font-size: 13px;
        color: #666;
        line-height: 1.5;
        height: 40px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;

        .price-box {
          display: flex;
          align-items: baseline;

          .currency {
            font-size: 14px;
            color: #f56c6c;
            margin-right: 2px;
          }

          .price {
            font-size: 22px;
            font-weight: bold;
            color: #f56c6c;
          }

          .original-price {
            font-size: 12px;
            color: #999;
            text-decoration: line-through;
            margin-left: 8px;
          }
        }

        .cart-btn {
          padding: 8px 15px;
          
          .el-icon {
            margin-right: 4px;
          }
        }
      }
    }

    .recommend-tag {
      position: absolute;
      top: 10px;
      right: 10px;
      transform: rotate(5deg);
    }
  }
}

.search-input {
  width: 100%;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;

  .cart-badge {
    margin-left: 10px;
  }
}
</style> 