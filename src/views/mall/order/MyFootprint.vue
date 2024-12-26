<template>
  <div class="my-footprint">
    <div class="header">
      <h3>我的足迹</h3>
      <div class="actions">
        <button class="clear-btn" @click="handleClearAll">
          <i class="el-icon-delete"></i>
          清空足迹
        </button>
      </div>
    </div>

    <!-- 按日期分组显示 -->
    <div class="date-groups">
      <div v-for="group in groupedFootprints" 
           :key="group.date" 
           class="date-group">
        <div class="date-header">
          <h4>{{ group.date }}</h4>
          <span class="count">{{ group.items.length }}件商品</span>
        </div>
        
        <div class="product-grid">
          <div v-for="item in group.items" 
               :key="item.id" 
               class="product-card"
               :class="{ disabled: item.status === 'off' }">
            <div class="checkbox">
              <input 
                type="checkbox" 
                v-model="item.selected"
                :disabled="item.status === 'off'">
            </div>
            <div class="image" @click="handleProductClick(item)">
              <img :src="item.image" :alt="item.name">
              <span v-if="item.status === 'off'" class="status-tag">已下架</span>
              <span v-if="item.discount" class="discount-tag">{{ item.discount }}折</span>
            </div>
            <div class="info">
              <h4 class="name" @click="handleProductClick(item)">{{ item.name }}</h4>
              <div class="price-row">
                <span class="price">¥{{ item.price }}</span>
                <span v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
              </div>
              <div class="actions">
                <button 
                  class="add-favorite" 
                  :class="{ active: item.isFavorite }"
                  @click="handleToggleFavorite(item)">
                  <i :class="item.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
                  {{ item.isFavorite ? '已收藏' : '收藏' }}
                </button>
                <button 
                  class="add-cart" 
                  :disabled="item.status === 'off'"
                  @click="handleAddToCart(item)">
                  加入购物车
                </button>
                <button class="remove" @click="handleRemove(item.id)">
                  删除
                </button>
              </div>
            </div>
            <div class="view-time">
              <i class="el-icon-time"></i>
              {{ item.viewTime }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="footprints.length === 0" class="empty-state">
      <img src="@/assets/images/empty-order.svg" alt="暂无浏览记录">
      <p>暂无浏览记录</p>
      <button class="go-shopping" @click="$router.push('/mall')">去逛逛</button>
    </div>

    <!-- 批量操作工具栏 -->
    <div v-if="footprints.length > 0" class="batch-toolbar">
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
          @click="handleBatchFavorite">
          批量收藏
        </button>
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
  name: 'MyFootprint',
  data() {
    return {
      footprints: [
        {
          id: 1,
          name: '商品名称示例1',
          price: 299,
          originalPrice: 399,
          image: require('@/assets/images/product-placeholder.svg'),
          status: 'on',
          discount: 7.5,
          isFavorite: true,
          viewTime: '10:30',
          viewDate: '2024-03-15',
          selected: false
        },
        {
          id: 2,
          name: '商品名称示例2',
          price: 199,
          image: require('@/assets/images/product-placeholder.svg'),
          status: 'on',
          isFavorite: false,
          viewTime: '09:15',
          viewDate: '2024-03-15',
          selected: false
        },
        {
          id: 3,
          name: '商品名称示例3 - 已下架',
          price: 599,
          originalPrice: 699,
          image: require('@/assets/images/product-placeholder.svg'),
          status: 'off',
          isFavorite: false,
          viewTime: '15:20',
          viewDate: '2024-03-14',
          selected: false
        }
      ]
    }
  },
  computed: {
    // 按日期分组的足迹数据
    groupedFootprints() {
      const groups = {}
      this.footprints.forEach(item => {
        if (!groups[item.viewDate]) {
          groups[item.viewDate] = {
            date: item.viewDate,
            items: []
          }
        }
        groups[item.viewDate].items.push(item)
      })
      return Object.values(groups).sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      )
    },
    // 是否全选
    isAllSelected() {
      return this.footprints.length > 0 && 
             this.footprints.every(p => p.selected)
    },
    // 是否有选中项
    hasSelected() {
      return this.footprints.some(p => p.selected)
    }
  },
  methods: {
    // 添加日期格式化方法
    formatDate(date) {
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    // 点击商品
    handleProductClick(product) {
      if (product.status === 'off') {
        this.$message.warning('该商品已下架')
        return
      }
      console.log('跳转到商品详情:', product.id)
      // this.$router.push(`/product/${product.id}`)
    },

    // 切换收藏状态
    handleToggleFavorite(product) {
      product.isFavorite = !product.isFavorite
      this.$message.success(product.isFavorite ? '已收藏' : '已取消收藏')
      this.saveFootprints()
    },

    // 加入购物车
    handleAddToCart(product) {
      if (product.status === 'off') return
      console.log('加入购物车:', product.id)
      this.$message.success('已加入购物车')
    },

    // 删除单个足迹
    handleRemove(id) {
      this.$confirm('确定删除该浏览记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const index = this.footprints.findIndex(p => p.id === id)
        if (index > -1) {
          this.footprints.splice(index, 1)
          this.saveFootprints()
          this.$message.success('已删除')
        }
      }).catch(() => {})
    },

    // 清空所有足迹
    handleClearAll() {
      this.$confirm('确定清空全部浏览记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.footprints = []
        this.saveFootprints()
        this.$message.success('已清空全部浏览记录')
      }).catch(() => {})
    },

    // 全选/取消全选
    toggleSelectAll(e) {
      const checked = e.target.checked
      this.footprints.forEach(p => {
        if (p.status !== 'off') {
          p.selected = checked
        }
      })
    },

    // 批量收藏
    handleBatchFavorite() {
      const selectedProducts = this.footprints.filter(p => p.selected && !p.isFavorite)
      if (selectedProducts.length === 0) {
        this.$message.warning('请选择未收藏的商品')
        return
      }
      selectedProducts.forEach(p => {
        p.isFavorite = true
      })
      this.saveFootprints()
      this.$message.success(`已收藏 ${selectedProducts.length} 件商品`)
    },

    // 批量加入购物车
    handleBatchAddCart() {
      const selectedProducts = this.footprints.filter(p => p.selected && p.status === 'on')
      if (selectedProducts.length === 0) {
        this.$message.warning('请选择在售商品')
        return
      }
      console.log('批量加入购物车:', selectedProducts.map(p => p.id))
      this.$message.success(`已将 ${selectedProducts.length} 件商品加入购物车`)
    },

    // 批量删除
    handleBatchDelete() {
      const selectedCount = this.footprints.filter(p => p.selected).length
      if (selectedCount === 0) return

      this.$confirm(`确定删除这 ${selectedCount} 条浏览记录吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.footprints = this.footprints.filter(p => !p.selected)
        this.saveFootprints()
        this.$message.success('已删除选中的浏览记录')
      }).catch(() => {})
    },

    // 保存足迹数据
    saveFootprints() {
      localStorage.setItem('footprints', JSON.stringify(this.footprints))
    },

    // 加载足迹数据
    loadFootprints() {
      const saved = localStorage.getItem('footprints')
      if (saved) {
        this.footprints = JSON.parse(saved)
      }
    }
  },
  mounted() {
    this.loadFootprints()
  }
}
</script>

<style lang="scss" scoped>
.my-footprint {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;

    .clear-btn {
      padding: 8px 15px;
      background: #fff;
      color: #666;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;

      &:hover {
        color: #f56c6c;
        border-color: #f56c6c;
      }
    }
  }

  .date-groups {
    .date-group {
      margin-bottom: 30px;

      .date-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        h4 {
          margin: 0;
          font-size: 16px;
        }

        .count {
          margin-left: 10px;
          color: #999;
          font-size: 14px;
        }
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 20px;

        .product-card {
          border: 1px solid #eee;
          border-radius: 4px;
          overflow: hidden;
          transition: all 0.3s;
          position: relative;

          &:hover {
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          }

          &.disabled {
            opacity: 0.6;
          }

          .checkbox {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1;

            input {
              cursor: pointer;
            }
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
              left: 40px;
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
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;

                &:disabled {
                  cursor: not-allowed;
                  opacity: 0.6;
                }

                &.add-favorite {
                  background: #f4f4f4;
                  color: #666;

                  &.active {
                    color: #f56c6c;
                  }

                  &:hover:not(.active) {
                    color: #f56c6c;
                  }
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

          .view-time {
            padding: 8px 12px;
            background: #f8f8f8;
            color: #999;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
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
