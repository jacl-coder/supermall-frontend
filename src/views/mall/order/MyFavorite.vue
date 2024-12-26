<template>
  <div class="my-favorite">
    <div class="header">
      <h3>我的收藏</h3>
      <div class="filter">
        <span 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="{ active: currentTab === tab.value }"
          @click="currentTab = tab.value">
          {{ tab.label }}
          <em v-if="tab.count">({{ tab.count }})</em>
        </span>
      </div>
    </div>

    <div class="product-grid">
      <div v-for="product in filteredProducts" 
           :key="product.id" 
           class="product-card"
           :class="{ disabled: product.status === 'off' }">
        <div class="image" @click="handleProductClick(product)">
          <img :src="product.image" :alt="product.name">
          <span v-if="product.status === 'off'" class="status-tag">已下架</span>
          <span v-if="product.discount" class="discount-tag">{{ product.discount }}折</span>
        </div>
        <div class="info">
          <h4 class="name" @click="handleProductClick(product)">{{ product.name }}</h4>
          <div class="price-row">
            <span class="price">¥{{ product.price }}</span>
            <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
            <span v-if="product.priceReduced" class="price-tag">降价</span>
          </div>
          <div class="actions">
            <button 
              class="add-cart" 
              :disabled="product.status === 'off'"
              @click="handleAddToCart(product)">
              加入购物车
            </button>
            <button class="remove" @click="handleRemoveFavorite(product.id)">
              取消收藏
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredProducts.length === 0" class="empty-state">
      <img src="@/assets/images/empty-order.svg" alt="暂无收藏">
      <p>暂无收藏商品</p>
      <button class="go-shopping" @click="$router.push('/mall')">去逛逛</button>
    </div>

    <!-- 批量操作工具栏 -->
    <div v-if="filteredProducts.length > 0" class="batch-toolbar">
      <label class="checkbox">
        <input 
          type="checkbox" 
          :checked="isAllSelected"
          @change="toggleSelectAll">
        全选
      </label>
      <div class="batch-actions">
        <button 
          class="batch-btn" 
          :disabled="!hasSelected"
          @click="handleBatchAddCart">
          加入购物车
        </button>
        <button 
          class="batch-btn" 
          :disabled="!hasSelected"
          @click="handleBatchDelete">
          批量删除
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyFavorite',
  data() {
    return {
      currentTab: 'all',
      tabs: [
        { label: '全部商品', value: 'all', count: 5 },
        { label: '降价商品', value: 'reduced', count: 2 },
        { label: '已下架', value: 'off', count: 1 }
      ],
      products: [
        {
          id: 1,
          name: '商品名称示例1',
          price: 299,
          originalPrice: 399,
          image: require('@/assets/images/product-placeholder.svg'),
          status: 'on',
          priceReduced: true,
          discount: 7.5,
          selected: false
        },
        {
          id: 2,
          name: '商品名称示例2',
          price: 199,
          image: require('@/assets/images/product-placeholder.svg'),
          status: 'on',
          priceReduced: false,
          selected: false
        },
        {
          id: 3,
          name: '商品名称示例3 - 已下架',
          price: 599,
          originalPrice: 699,
          image: require('@/assets/images/product-placeholder.svg'),
          status: 'off',
          priceReduced: false,
          selected: false
        }
      ]
    }
  },
  computed: {
    // 过滤后的商品列表
    filteredProducts() {
      switch (this.currentTab) {
        case 'reduced':
          return this.products.filter(p => p.priceReduced)
        case 'off':
          return this.products.filter(p => p.status === 'off')
        default:
          return this.products
      }
    },
    // 是否全选
    isAllSelected() {
      return this.filteredProducts.length > 0 && 
             this.filteredProducts.every(p => p.selected)
    },
    // 是否有选中项
    hasSelected() {
      return this.filteredProducts.some(p => p.selected)
    }
  },
  methods: {
    // 点击商品
    handleProductClick(product) {
      if (product.status === 'off') {
        this.$message.warning('该商品已下架')
        return
      }
      console.log('跳转到商品详情:', product.id)
      // this.$router.push(`/product/${product.id}`)
    },

    // 加入购物车
    handleAddToCart(product) {
      if (product.status === 'off') return
      console.log('加入购物车:', product.id)
      this.$message.success('已加入购物车')
    },

    // 取消收藏
    handleRemoveFavorite(id) {
      this.$confirm('确定取消收藏该商品吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const index = this.products.findIndex(p => p.id === id)
        if (index > -1) {
          this.products.splice(index, 1)
          this.saveFavorites()
          this.$message.success('已取消收藏')
        }
      }).catch(() => {})
    },

    // 全选/取消全选
    toggleSelectAll(e) {
      const checked = e.target.checked
      this.filteredProducts.forEach(p => {
        p.selected = checked
      })
    },

    // 批量加入购物车
    handleBatchAddCart() {
      const selectedProducts = this.filteredProducts.filter(p => p.selected && p.status === 'on')
      if (selectedProducts.length === 0) {
        this.$message.warning('请选择在售商品')
        return
      }
      console.log('批量加入购物车:', selectedProducts.map(p => p.id))
      this.$message.success(`已将 ${selectedProducts.length} 件商品加入购物车`)
    },

    // 批量删除
    handleBatchDelete() {
      const selectedCount = this.filteredProducts.filter(p => p.selected).length
      if (selectedCount === 0) return

      this.$confirm(`确定取消收藏这 ${selectedCount} 件商品吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.products = this.products.filter(p => !p.selected)
        this.saveFavorites()
        this.$message.success('已取消收藏')
      }).catch(() => {})
    },

    // 保存收藏数据
    saveFavorites() {
      localStorage.setItem('favorites', JSON.stringify(this.products))
    },

    // 加载收藏数据
    loadFavorites() {
      const saved = localStorage.getItem('favorites')
      if (saved) {
        this.products = JSON.parse(saved)
      }
    }
  },
  mounted() {
    this.loadFavorites()
  }
}
</script>

<style lang="scss" scoped>
.my-favorite {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;

    .filter {
      span {
        margin-left: 20px;
        color: #666;
        cursor: pointer;

        em {
          font-style: normal;
          color: #999;
        }

        &.active {
          color: #409EFF;
          em { color: #409EFF; }
        }

        &:hover {
          color: #409EFF;
        }
      }
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 60px;

    .product-card {
      border: 1px solid #eee;
      border-radius: 4px;
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      }

      &.disabled {
        opacity: 0.6;
      }

      .image {
        width: 100%;
        height: 220px;
        overflow: hidden;
        position: relative;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        &:hover img {
          transform: scale(1.05);
        }

        .status-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.5);
          color: #fff;
          padding: 2px 6px;
          border-radius: 2px;
          font-size: 12px;
        }

        .discount-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #f56c6c;
          color: #fff;
          padding: 2px 6px;
          border-radius: 2px;
          font-size: 12px;
        }
      }

      .info {
        padding: 12px;

        .name {
          margin: 0 0 10px;
          font-size: 14px;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          cursor: pointer;

          &:hover {
            color: #409EFF;
          }
        }

        .price-row {
          margin-bottom: 10px;
          height: 24px;
          display: flex;
          align-items: center;

          .price {
            color: #f56c6c;
            font-size: 16px;
            font-weight: bold;
            margin-right: 8px;
          }

          .original-price {
            color: #999;
            text-decoration: line-through;
            font-size: 12px;
          }

          .price-tag {
            margin-left: auto;
            background: #fff1f0;
            color: #f56c6c;
            padding: 2px 6px;
            border-radius: 2px;
            font-size: 12px;
          }
        }

        .actions {
          display: flex;
          gap: 8px;

          button {
            flex: 1;
            padding: 6px 0;
            border-radius: 4px;
            cursor: pointer;
            border: none;
            font-size: 12px;

            &:disabled {
              cursor: not-allowed;
              opacity: 0.6;
            }

            &.add-cart {
              background: #409EFF;
              color: #fff;

              &:hover:not(:disabled) {
                background: #66b1ff;
              }
            }

            &.remove {
              background: #f4f4f4;
              color: #666;

              &:hover {
                background: #e4e4e4;
              }
            }
          }
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px 0;
    color: #999;

    img {
      width: 200px;
      margin-bottom: 20px;
    }

    .go-shopping {
      margin-top: 20px;
      padding: 8px 20px;
      background: #409EFF;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #66b1ff;
      }
    }
  }

  .batch-toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);

    .checkbox {
      display: flex;
      align-items: center;
      cursor: pointer;

      input {
        margin-right: 5px;
      }
    }

    .batch-actions {
      .batch-btn {
        margin-left: 10px;
        padding: 6px 15px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #666;

        &:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        &:hover:not(:disabled) {
          color: #409EFF;
          border-color: #409EFF;
        }
      }
    }
  }
}
</style>
