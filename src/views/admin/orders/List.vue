<template>
  <div class="order-list">
    <div class="page-header">
      <h2>订单列表</h2>
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
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="待付款" value="unpaid"></el-option>
            <el-option label="待发货" value="paid"></el-option>
            <el-option label="已发货" value="shipped"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
            <el-option label="退款中" value="refunding"></el-option>
            <el-option label="已退款" value="refunded"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
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

    <!-- 订单表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column label="商品信息" min-width="300">
          <template #default="scope">
            <div v-for="item in scope.row.items" :key="item.id" class="order-item">
              <el-image 
                :src="item.image" 
                style="width: 50px; height: 50px"
                :preview-src-list="[item.image]"
              ></el-image>
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-spec">{{ item.spec }}</div>
              </div>
              <div class="item-price">
                <div>¥{{ item.price }}</div>
                <div>x{{ item.quantity }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleDetail(scope.row)">详情</el-button>
            <el-button 
              v-if="scope.row.status === 'paid'"
              size="small" 
              type="primary"
              @click="handleShip(scope.row)"
            >发货</el-button>
            <el-button 
              v-if="scope.row.status === 'refunding'"
              size="small" 
              type="warning"
              @click="handleRefund(scope.row)"
            >退款</el-button>
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
  name: 'OrderList',
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
          items: [
            {
              id: 1,
              image: 'https://via.placeholder.com/50',
              name: 'iPhone 13 Pro',
              spec: '256GB 深空灰色',
              price: 8999,
              quantity: 1
            },
            {
              id: 2,
              image: 'https://via.placeholder.com/50',
              name: 'AirPods Pro',
              spec: '标配',
              price: 1999,
              quantity: 1
            }
          ],
          totalAmount: 10998,
          status: 'paid',
          createTime: '2023-12-28 10:00:00'
        },
        {
          orderNo: 'DD20231228002',
          username: '李四',
          items: [
            {
              id: 3,
              image: 'https://via.placeholder.com/50',
              name: 'MacBook Pro',
              spec: 'M2 16GB 512GB',
              price: 12999,
              quantity: 1
            }
          ],
          totalAmount: 12999,
          status: 'shipped',
          createTime: '2023-12-28 11:00:00'
        }
      ],
      total: 100
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        unpaid: 'info',
        paid: 'warning',
        shipped: 'primary',
        completed: 'success',
        cancelled: 'info',
        refunding: 'danger',
        refunded: 'info'
      }
      return statusMap[status] || 'info'
    },
    getStatusText(status) {
      const statusMap = {
        unpaid: '待付款',
        paid: '待发货',
        shipped: '已发货',
        completed: '已完成',
        cancelled: '已取消',
        refunding: '退款中',
        refunded: '已退款'
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
      console.log('查看订单详情：', row)
    },
    handleShip(row) {
      console.log('发货操作：', row)
    },
    handleRefund(row) {
      console.log('退款操作：', row)
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
.order-list {
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

.order-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  flex: 1;
  margin: 0 15px;
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

.item-price {
  text-align: right;
  font-size: 14px;
  color: #606266;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 