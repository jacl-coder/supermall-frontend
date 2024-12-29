<template>
  <div class="review-manage">
    <h2>评价管理</h2>
    
    <!-- 筛选区域 -->
    <el-card class="filter-section">
      <div style="text-align: left;">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="评分">
            <el-select v-model="filterForm.rating" placeholder="选择评分" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="5星" value="5"></el-option>
              <el-option label="4星" value="4"></el-option>
              <el-option label="3星" value="3"></el-option>
              <el-option label="2星" value="2"></el-option>
              <el-option label="1星" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="回复状态">
            <el-select v-model="filterForm.replyStatus" placeholder="选择状态" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="已回复" value="replied"></el-option>
              <el-option label="未回复" value="unreplied"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 评价列表 -->
    <el-card class="review-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-content">
          <div class="user-info">
            <el-avatar :size="40" :src="review.userAvatar">{{ review.userName?.charAt(0) }}</el-avatar>
            <span class="user-name">{{ review.userName }}</span>
            <el-rate v-model="review.rating" disabled></el-rate>
            <span class="review-time">{{ review.createTime }}</span>
          </div>
          <div class="review-text">{{ review.content }}</div>
          <div v-if="review.images && review.images.length" class="review-images">
            <el-image 
              v-for="(image, index) in review.images"
              :key="index"
              :src="image"
              :preview-src-list="review.images"
              class="review-image">
            </el-image>
          </div>
          
          <!-- 回复区域 -->
          <div class="reply-section">
            <div v-if="review.reply" class="reply-content">
              <div class="reply-header">
                <span class="reply-label">商家回复：</span>
                <span class="reply-time">{{ review.replyTime }}</span>
              </div>
              <div class="reply-text">{{ review.reply }}</div>
            </div>
            <div v-else class="reply-form">
              <el-input
                v-model="review.tempReply"
                type="textarea"
                :rows="3"
                placeholder="请输入回复内容...">
              </el-input>
              <div class="reply-actions">
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="handleReply(review)"
                  :loading="review.replying">
                  提交回复
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          background>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ReviewManage',
  data() {
    return {
      filterForm: {
        rating: '',
        replyStatus: ''
      },
      reviews: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async fetchReviews() {
      try {
        const response = await this.$http.get('/api/admin/reviews', {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            rating: this.filterForm.rating,
            replyStatus: this.filterForm.replyStatus
          }
        })
        this.reviews = response.data.records
        this.total = response.data.total
      } catch (error) {
        this.$message.error('获取评价列表失败')
      }
    },
    async handleReply(review) {
      if (!review.tempReply) {
        this.$message.warning('请输入回复内容')
        return
      }

      review.replying = true
      try {
        await this.$http.post(`/api/admin/reviews/${review.id}/reply`, {
          content: review.tempReply
        })
        this.$message.success('回复成功')
        this.fetchReviews()
      } catch (error) {
        this.$message.error('回复失败')
      } finally {
        review.replying = false
      }
    },
    handleFilter() {
      this.currentPage = 1
      this.fetchReviews()
    },
    resetFilter() {
      this.filterForm = {
        rating: '',
        replyStatus: ''
      }
      this.handleFilter()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchReviews()
    }
  },
  created() {
    this.fetchReviews()
  }
}
</script>

<style scoped>
.review-manage {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.review-list {
  margin-top: 20px;
}

.review-item {
  padding: 20px;
  border-bottom: 1px solid #EBEEF5;
}

.review-item:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-name {
  font-weight: bold;
}

.review-time {
  color: #909399;
  font-size: 14px;
}

.review-text {
  margin: 10px 0;
  line-height: 1.6;
}

.review-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
}

.review-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.reply-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #EBEEF5;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reply-label {
  font-weight: bold;
  color: #409EFF;
}

.reply-time {
  color: #909399;
  font-size: 14px;
}

.reply-text {
  color: #606266;
  line-height: 1.6;
}

.reply-form {
  margin-top: 10px;
}

.reply-actions {
  margin-top: 10px;
  text-align: right;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style> 