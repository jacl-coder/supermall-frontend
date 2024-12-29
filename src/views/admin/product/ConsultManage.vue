<template>
    <div class="consult-manage">
      <h2>咨询管理</h2>
      
      <!-- 筛选区域 -->
      <el-card class="filter-section">
        <div style="text-align: left;">
          <el-form :inline="true" :model="filterForm">
            <el-form-item label="咨询类型">
              <el-select v-model="filterForm.type" placeholder="选择类型" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="商品咨询" value="product"></el-option>
                <el-option label="库存及配送" value="stock"></el-option>
                <el-option label="售后服务" value="service"></el-option>
                <el-option label="其他" value="other"></el-option>
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
  
      <!-- 咨询列表 -->
      <el-card class="consult-list">
        <div v-for="consult in consults" :key="consult.id" class="consult-item">
          <div class="consult-content">
            <div class="user-info">
              <el-avatar :size="40" :src="consult.userAvatar">{{ consult.userName?.charAt(0) }}</el-avatar>
              <span class="user-name">{{ consult.userName }}</span>
              <span class="consult-type">{{ getConsultTypeName(consult.type) }}</span>
              <span class="consult-time">{{ consult.createTime }}</span>
            </div>
            <div class="consult-text">{{ consult.content }}</div>
            
            <!-- 回复区域 -->
            <div class="reply-section">
              <div v-if="consult.reply" class="reply-content">
                <div class="reply-header">
                  <span class="reply-label">商家回复：</span>
                  <span class="reply-time">{{ consult.replyTime }}</span>
                </div>
                <div class="reply-text">{{ consult.reply }}</div>
              </div>
              <div v-else class="reply-form">
                <el-input
                  v-model="consult.tempReply"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入回复内容...">
                </el-input>
                <div class="reply-actions">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="handleReply(consult)"
                    :loading="consult.replying">
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
    name: 'ConsultManage',
    data() {
      return {
        filterForm: {
          type: '',
          replyStatus: ''
        },
        consults: [],
        currentPage: 1,
        pageSize: 10,
        total: 0
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
          const response = await this.$http.get('/api/admin/consults', {
            params: {
              page: this.currentPage,
              pageSize: this.pageSize,
              type: this.filterForm.type,
              replyStatus: this.filterForm.replyStatus
            }
          })
          this.consults = response.data.records
          this.total = response.data.total
        } catch (error) {
          this.$message.error('获取咨询列表失败')
        }
      },
      async handleReply(consult) {
        if (!consult.tempReply) {
          this.$message.warning('请输入回复内容')
          return
        }
  
        consult.replying = true
        try {
          await this.$http.post(`/api/admin/consults/${consult.id}/reply`, {
            content: consult.tempReply
          })
          this.$message.success('回复成功')
          this.fetchConsults()
        } catch (error) {
          this.$message.error('回复失败')
        } finally {
          consult.replying = false
        }
      },
      handleFilter() {
        this.currentPage = 1
        this.fetchConsults()
      },
      resetFilter() {
        this.filterForm = {
          type: '',
          replyStatus: ''
        }
        this.handleFilter()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.fetchConsults()
      }
    },
    created() {
      this.fetchConsults()
    }
  }
  </script>
  
  <style scoped>
  .consult-manage {
    padding: 20px;
  }
  
  .filter-section {
    margin-bottom: 20px;
  }
  
  .filter-section :deep(.el-form) {
    text-align: left;
  }
  
  .consult-list {
    margin-top: 20px;
  }
  
  .consult-item {
    padding: 20px;
    border-bottom: 1px solid #EBEEF5;
  }
  
  .consult-item:last-child {
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
  
  .consult-type {
    background-color: #f0f2f5;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
  
  .consult-time {
    color: #909399;
    font-size: 14px;
    margin-left: auto;
  }
  
  .consult-text {
    margin: 10px 0;
    line-height: 1.6;
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