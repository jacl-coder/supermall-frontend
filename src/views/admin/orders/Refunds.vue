<template>
  <div class="refunds">
    <div class="page-header">
      <h2>退款管理</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="退款状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="待处理" value="pending"></el-option>
            <el-option label="已同意" value="approved"></el-option>
            <el-option label="已拒绝" value="rejected"></el-option>
            <el-option label="已完成" value="completed"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申��时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 退款列表 -->
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column label="商品信息" min-width="300">
          <template #default="scope">
            <div class="refund-item">
              <el-image 
                :src="scope.row.productImage" 
                style="width: 50px; height: 50px"
                :preview-src-list="[scope.row.productImage]"
              ></el-image>
              <div class="item-info">
                <div class="item-name">{{ scope.row.productName }}</div>
                <div class="item-spec">{{ scope.row.productSpec }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="refundAmount" label="退款金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.refundAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="退款原因" min-width="150"></el-table-column>
        <el-table-column prop="status" label="退款状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleDetail(scope.row)">详情</el-button>
            <el-button 
              v-if="scope.row.status === 'pending'"
              size="small" 
              type="success"
              @click="handleApprove(scope.row)"
            >同意</el-button>
            <el-button 
              v-if="scope.row.status === 'pending'"
              size="small" 
              type="danger"
              @click="handleReject(scope.row)"
            >拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="searchForm.pageSize"
          :current-page="searchForm.page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Refunds',
  data() {
    return {
      loading: false,
      searchForm: {
        orderNo: '',
        username: '',
        status: '',
        dateRange: [],
        page: 1,
        pageSize: 10
      },
      tableData: [
        {
          orderNo: 'DD20231228001',
          username: '张三',
          productImage: 'https://via.placeholder.com/50',
          productName: 'iPhone 13 Pro',
          productSpec: '256GB 深空灰色',
          refundAmount: 8999,
          reason: '商品有划痕',
          status: 'pending',
          createTime: '2023-12-28 10:00:00'
        },
        {
          orderNo: 'DD20231228002',
          username: '李四',
          productImage: 'https://via.placeholder.com/50',
          productName: 'MacBook Pro',
          productSpec: 'M2 16GB 512GB',
          refundAmount: 12999,
          reason: '7天无理由退货',
          status: 'approved',
          createTime: '2023-12-28 11:00:00'
        }
      ],
      total: 100
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger',
        completed: 'info'
      }
      return statusMap[status] || 'info'
    },
    getStatusText(status) {
      const statusMap = {
        pending: '待处理',
        approved: '已同意',
        rejected: '已拒绝',
        completed: '已完成'
      }
      return statusMap[status] || status
    },
    handleSearch() {
      console.log('搜索条件：', this.searchForm)
    },
    resetSearch() {
      this.searchForm = {
        orderNo: '',
        username: '',
        status: '',
        dateRange: [],
        page: 1,
        pageSize: 10
      }
    },
    handleDetail(row) {
      console.log('查看退款详情：', row)
    },
    handleApprove(row) {
      console.log('同意退款：', row)
    },
    handleReject(row) {
      console.log('拒绝退款：', row)
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      // 重新加载数据
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      // 重新加载数据
    }
  }
}
</script>

<style scoped>
.refunds {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.refund-item {
  display: flex;
  align-items: center;
}

.item-info {
  flex: 1;
  margin-left: 15px;
}

.item-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 5px;
}

.item-spec {
  font-size: 12px;
  color: #909399;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 