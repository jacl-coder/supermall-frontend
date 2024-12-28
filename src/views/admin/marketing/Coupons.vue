<template>
  <div class="coupons">
    <div class="page-header">
      <h2>优惠券管理</h2>
      <el-button type="primary" @click="handleAdd">创建优惠券</el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="优惠券名称">
          <el-input v-model="searchForm.name" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="满减券" value="fullReduction"></el-option>
            <el-option label="折扣券" value="discount"></el-option>
            <el-option label="无门槛券" value="noThreshold"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未发放" value="created"></el-option>
            <el-option label="已发放" value="distributed"></el-option>
            <el-option label="已使用" value="used"></el-option>
            <el-option label="已过期" value="expired"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期">
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

    <!-- 优惠券表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="优惠券ID" width="100"></el-table-column>
        <el-table-column prop="name" label="优惠券名称" min-width="150"></el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="优惠金额/折扣" width="120">
          <template #default="scope">
            {{ formatValue(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="threshold" label="使用门槛" width="120">
          <template #default="scope">
            {{ scope.row.threshold ? `满${scope.row.threshold}可用` : '无门槛' }}
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="300">
          <template #default="scope">
            {{ scope.row.startTime }} 至 {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="发放总量" width="100"></el-table-column>
        <el-table-column prop="usedCount" label="已使用" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              v-if="scope.row.status === 'created'"
              size="small" 
              type="success"
              @click="handleDistribute(scope.row)"
            >发放</el-button>
            <el-button 
              v-if="scope.row.status === 'distributed'"
              size="small" 
              type="warning"
              @click="handleStop(scope.row)"
            >停止</el-button>
            <el-button 
              size="small" 
              type="primary"
              @click="handleView(scope.row)"
            >查看</el-button>
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
  name: 'Coupons',
  data() {
    return {
      loading: false,
      searchForm: {
        name: '',
        type: '',
        status: '',
        dateRange: [],
        page: 1,
        pageSize: 10
      },
      tableData: [
        {
          id: 1,
          name: '新人专享券',
          type: 'fullReduction',
          value: 50,
          threshold: 200,
          startTime: '2023-12-01 00:00:00',
          endTime: '2023-12-31 23:59:59',
          totalCount: 1000,
          usedCount: 500,
          status: 'distributed'
        },
        {
          id: 2,
          name: '会员折扣券',
          type: 'discount',
          value: 0.8,
          threshold: 0,
          startTime: '2024-01-01 00:00:00',
          endTime: '2024-01-31 23:59:59',
          totalCount: 500,
          usedCount: 0,
          status: 'created'
        },
        {
          id: 3,
          name: '无门槛立减券',
          type: 'noThreshold',
          value: 10,
          threshold: 0,
          startTime: '2023-12-15 00:00:00',
          endTime: '2023-12-20 23:59:59',
          totalCount: 200,
          usedCount: 200,
          status: 'used'
        }
      ],
      total: 100
    }
  },
  methods: {
    getTypeTag(type) {
      const typeMap = {
        fullReduction: '',
        discount: 'success',
        noThreshold: 'warning'
      }
      return typeMap[type] || 'info'
    },
    getTypeText(type) {
      const typeMap = {
        fullReduction: '满减券',
        discount: '折扣券',
        noThreshold: '无门槛券'
      }
      return typeMap[type] || type
    },
    getStatusType(status) {
      const statusMap = {
        created: 'info',
        distributed: 'success',
        used: 'warning',
        expired: 'danger'
      }
      return statusMap[status] || 'info'
    },
    getStatusText(status) {
      const statusMap = {
        created: '未发放',
        distributed: '已发放',
        used: '已使用',
        expired: '已过期'
      }
      return statusMap[status] || status
    },
    formatValue(row) {
      if (row.type === 'discount') {
        return `${row.value * 10}折`
      }
      return `¥${row.value}`
    },
    handleAdd() {
      console.log('创建优惠券')
    },
    handleSearch() {
      console.log('搜索条件：', this.searchForm)
    },
    resetSearch() {
      this.searchForm = {
        name: '',
        type: '',
        status: '',
        dateRange: [],
        page: 1,
        pageSize: 10
      }
    },
    handleEdit(row) {
      console.log('编辑优惠券：', row)
    },
    handleDistribute(row) {
      console.log('发放优惠券：', row)
    },
    handleStop(row) {
      console.log('停止发放：', row)
    },
    handleView(row) {
      console.log('查看优惠券详情：', row)
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
.coupons {
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 