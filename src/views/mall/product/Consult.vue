<template>
  <div class="consult-container">
    <h2>商品咨询</h2>

    <!-- 提交咨询 -->
    <el-card class="submit-consult">
      <div class="consult-form">
        <el-form :model="newConsult" :rules="rules" ref="consultForm" label-width="80px">
          <el-form-item label="咨询类型" prop="type">
            <el-select v-model="newConsult.type" placeholder="请选择咨询类型">
              <el-option label="商品咨询" value="product"></el-option>
              <el-option label="库存及配送" value="stock"></el-option>
              <el-option label="售后服务" value="service"></el-option>
              <el-option label="其他" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="咨询内容" prop="content">
            <el-input
              type="textarea"
              v-model="newConsult.content"
              :rows="4"
              placeholder="请输入您的咨询内容..."
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitConsult">提交咨询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 咨询列表 -->
    <div class="consult-list">
      <!-- 筛选 -->
      <div class="filter-section">
        <el-select v-model="filterType" placeholder="咨询类型" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="商品咨询" value="product"></el-option>
          <el-option label="库存及配送" value="stock"></el-option>
          <el-option label="售后服务" value="service"></el-option>
          <el-option label="其他" value="other"></el-option>
        </el-select>
        <el-select v-model="filterStatus" placeholder="回复状态" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="已回复" value="replied"></el-option>
          <el-option label="待回复" value="pending"></el-option>
        </el-select>
      </div>

      <!-- 咨询内容 -->
      <el-timeline>
        <el-timeline-item
          v-for="item in filteredConsults"
          :key="item.id"
          :type="item.status === 'replied' ? 'success' : 'warning'"
          :timestamp="item.createTime"
        >
          <el-card class="consult-item">
            <div class="consult-header">
              <span class="consult-type">{{ getConsultTypeName(item.type) }}</span>
              <span class="consult-status" :class="item.status">
                {{ item.status === 'replied' ? '已回复' : '待回复' }}
              </span>
            </div>
            <div class="consult-content">
              <div class="user-info">
                <i class="el-icon-user"></i>
                <span>{{ item.userName }}</span>
              </div>
              <p class="question">{{ item.content }}</p>
            </div>

            <!-- 回复内容 -->
            <div v-if="item.reply" class="reply-content">
              <div class="admin-info">
                <i class="el-icon-s-custom"></i>
                <span>客服回复</span>
              </div>
              <p class="answer">{{ item.reply }}</p>
              <span class="reply-time">{{ item.replyTime }}</span>
            </div>

            <!-- 管理员回复框 -->
            <div v-if="isAdmin && !item.reply" class="admin-reply">
              <el-input
                v-model="item.tempReply"
                type="textarea"
                :rows="3"
                placeholder="请输入回复内容..."
              ></el-input>
              <el-button
                type="primary"
                size="small"
                @click="submitReply(item)"
                :loading="item.replying"
              >
                提交回复
              </el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          background>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Consult',
  data() {
    return {
      newConsult: {
        type: '',
        content: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择咨询类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入咨询内容', trigger: 'blur' },
          { min: 10, message: '咨询内容至少10个字符', trigger: 'blur' }
        ]
      },
      consults: [],
      filterType: '',
      filterStatus: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isAdmin: false, // 是否是管理员，实际应从用户权限中获取
      productId: null // 添加productId属性
    }
  },
  computed: {
    filteredConsults() {
      let result = [...this.consults]
      
      if (this.filterType) {
        result = result.filter(item => item.type === this.filterType)
      }
      
      if (this.filterStatus) {
        result = result.filter(item => item.status === this.filterStatus)
      }
      
      return result
    }
  },
  methods: {
    getConsultTypeName(type) {
      const types = {
        product: '商品咨询',
        stock: '库存及配送',
        service: '售后服务',
        other: '其他'
      }
      return types[type] || type
    },
    async fetchConsults() {
      try {
        // 使用productId获取咨询列表
        const response = await this.$http.get(`/api/consults/${this.productId}`, {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            type: this.filterType,
            status: this.filterStatus
          }
        })
        this.consults = response.data.records
        this.total = response.data.total
      } catch (error) {
        this.$message.error('获取咨询列表失败')
      }
    },
    async submitConsult() {
      try {
        await this.$refs.consultForm.validate()
        // 提交咨询时包含productId
        await this.$http.post(`/api/consults/${this.productId}`, this.newConsult)
        this.$message.success('咨询提交成功')
        this.resetForm()
        this.fetchConsults()
      } catch (error) {
        if (error.message) {
          this.$message.error(error.message)
        }
      }
    },
    async submitReply(item) {
      if (!item.tempReply) {
        this.$message.warning('请输入回复内容')
        return
      }

      item.replying = true
      try {
        // TODO: 调用API提交回复
        await this.$http.post(`/api/consults/${item.id}/reply`, {
          content: item.tempReply
        })
        this.$message.success('回复提交成功')
        this.fetchConsults()
      } catch (error) {
        this.$message.error('回复提交失败')
      } finally {
        item.replying = false
      }
    },
    resetForm() {
      this.newConsult = {
        type: '',
        content: ''
      }
      this.$refs.consultForm.resetFields()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchConsults()
    }
  },
  created() {
    // 从路由查询参数中获取productId
    this.productId = this.$route.query.productId
    if (!this.productId) {
      this.$message.warning('未指定商品')
      this.$router.push('/product')
      return
    }
    this.fetchConsults()
  }
}
</script>

<style scoped>
.consult-container {
  padding: 20px;
}

.submit-consult {
  margin-bottom: 30px;
}

.filter-section {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.consult-item {
  margin-bottom: 20px;
}

.consult-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.consult-type {
  background-color: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.consult-status {
  font-size: 12px;
}

.consult-status.replied {
  color: #67c23a;
}

.consult-status.pending {
  color: #e6a23c;
}

.user-info,
.admin-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #606266;
}

.question,
.answer {
  margin: 10px 0;
  line-height: 1.6;
}

.reply-content {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #dcdfe6;
}

.reply-time {
  color: #909399;
  font-size: 12px;
}

.admin-reply {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #dcdfe6;
}

.admin-reply .el-button {
  margin-top: 10px;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style> 