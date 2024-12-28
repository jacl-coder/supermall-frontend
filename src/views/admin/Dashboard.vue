<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 数据概览卡片 -->
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <div class="data-title">总销售额</div>
            <el-tag size="small" type="success">日</el-tag>
          </div>
          <div class="data-content">
            <div class="data-value">¥ 12,423</div>
            <div class="data-chart">
              <i class="el-icon-top" style="color: #67C23A"></i>
              <span>12%</span>
            </div>
          </div>
          <div class="data-footer">
            昨日：¥ 11,234
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <div class="data-title">订单数</div>
            <el-tag size="small" type="warning">周</el-tag>
          </div>
          <div class="data-content">
            <div class="data-value">1,234</div>
            <div class="data-chart">
              <i class="el-icon-top" style="color: #67C23A"></i>
              <span>8%</span>
            </div>
          </div>
          <div class="data-footer">
            上周：1,142
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <div class="data-title">新增用户</div>
            <el-tag size="small" type="info">月</el-tag>
          </div>
          <div class="data-content">
            <div class="data-value">328</div>
            <div class="data-chart">
              <i class="el-icon-bottom" style="color: #F56C6C"></i>
              <span>5%</span>
            </div>
          </div>
          <div class="data-footer">
            上月：345
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <div class="data-title">退款率</div>
            <el-tag size="small" type="danger">年</el-tag>
          </div>
          <div class="data-content">
            <div class="data-value">2.5%</div>
            <div class="data-chart">
              <i class="el-icon-bottom" style="color: #F56C6C"></i>
              <span>0.5%</span>
            </div>
          </div>
          <div class="data-footer">
            去年：2%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待处理事项 -->
    <el-card class="todo-card">
      <div slot="header">
        <span>待处理事项</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="todo-item">
            <div class="todo-number warning">12</div>
            <div class="todo-text">待发货订单</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="todo-item">
            <div class="todo-number danger">3</div>
            <div class="todo-text">退款申请</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="todo-item">
            <div class="todo-number primary">25</div>
            <div class="todo-text">商品库存预警</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="todo-item">
            <div class="todo-number info">8</div>
            <div class="todo-text">待处理评价</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 最近订单 -->
    <el-card class="recent-orders">
      <div slot="header">
        <span>最近订单</span>
      </div>
      <el-table :data="recentOrders" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="180"></el-table-column>
        <el-table-column prop="customer" label="客户" width="120"></el-table-column>
        <el-table-column prop="amount" label="金额" width="120"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.statusType">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="下单时间" width="180"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      recentOrders: [
        {
          id: 'DD20230601001',
          customer: '张三',
          amount: '￥299.00',
          status: '待发货',
          statusType: 'warning',
          time: '2023-06-01 10:23:45'
        },
        {
          id: 'DD20230601002',
          customer: '李四',
          amount: '￥599.00',
          status: '已完成',
          statusType: 'success',
          time: '2023-06-01 09:12:34'
        },
        {
          id: 'DD20230601003',
          customer: '王五',
          amount: '￥199.00',
          status: '退款中',
          statusType: 'danger',
          time: '2023-06-01 08:45:12'
        }
      ]
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.data-card {
  height: 180px;
  margin-bottom: 20px;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.data-title {
  font-size: 16px;
  color: #606266;
}

.data-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.data-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.data-chart {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #909399;
}

.data-footer {
  color: #909399;
  font-size: 14px;
}

.todo-card {
  margin-bottom: 20px;
}

.todo-item {
  text-align: center;
  padding: 20px;
}

.todo-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.todo-number.warning { color: #E6A23C; }
.todo-number.danger { color: #F56C6C; }
.todo-number.primary { color: #409EFF; }
.todo-number.info { color: #909399; }

.todo-text {
  color: #606266;
}

.recent-orders {
  margin-bottom: 20px;
}
</style> 