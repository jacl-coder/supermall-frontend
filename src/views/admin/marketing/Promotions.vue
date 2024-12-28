<template>
  <div class="promotions">
    <div class="page-header">
      <h2>促销活动</h2>
      <el-button type="primary" @click="handleAdd">创建活动</el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="活动名称">
          <el-input v-model="searchForm.name" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="满减" value="fullReduction"></el-option>
            <el-option label="折扣" value="discount"></el-option>
            <el-option label="秒杀" value="seckill"></el-option>
            <el-option label="限时特价" value="specialPrice"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="searchForm.status" placeholder="请��择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未开始" value="pending"></el-option>
            <el-option label="进行中" value="active"></el-option>
            <el-option label="已结束" value="ended"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
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

    <!-- 活动表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="活动ID" width="100"></el-table-column>
        <el-table-column prop="name" label="活动名称" min-width="150"></el-table-column>
        <el-table-column prop="type" label="活动类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rule" label="活动规则" min-width="200"></el-table-column>
        <el-table-column label="活动时间" width="300">
          <template #default="scope">
            {{ scope.row.startTime }} 至 {{ scope.row.endTime }}
          </template>
        </el-table-column>
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
              v-if="scope.row.status === 'pending'"
              size="small" 
              type="success"
              @click="handleStart(scope.row)"
            >开始</el-button>
            <el-button 
              v-if="scope.row.status === 'active'"
              size="small" 
              type="warning"
              @click="handleEnd(scope.row)"
            >结束</el-button>
            <el-button 
              v-if="scope.row.status === 'pending'"
              size="small" 
              type="danger"
              @click="handleCancel(scope.row)"
            >取消</el-button>
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
  name: 'Promotions',
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
          name: '双十二全场优惠',
          type: 'fullReduction',
          rule: '满1000减100，满2000减300',
          startTime: '2023-12-12 00:00:00',
          endTime: '2023-12-12 23:59:59',
          status: 'ended'
        },
        {
          id: 2,
          name: '新年特惠活动',
          type: 'discount',
          rule: '全场8折',
          startTime: '2024-01-01 00:00:00',
          endTime: '2024-01-07 23:59:59',
          status: 'pending'
        },
        {
          id: 3,
          name: 'iPhone限时秒杀',
          type: 'seckill',
          rule: '限量100台，秒杀价5999',
          startTime: '2023-12-30 10:00:00',
          endTime: '2023-12-30 10:30:00',
          status: 'active'
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
        seckill: 'danger',
        specialPrice: 'warning'
      }
      return typeMap[type] || 'info'
    },
    getTypeText(type) {
      const typeMap = {
        fullReduction: '满减',
        discount: '折扣',
        seckill: '秒杀',
        specialPrice: '特价'
      }
      return typeMap[type] || type
    },
    getStatusType(status) {
      const statusMap = {
        pending: 'info',
        active: 'success',
        ended: 'warning',
        cancelled: 'danger'
      }
      return statusMap[status] || 'info'
    },
    getStatusText(status) {
      const statusMap = {
        pending: '未开始',
        active: '进行中',
        ended: '已结束',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    },
    handleAdd() {
      console.log('创建活动')
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
      console.log('编辑活动：', row)
    },
    handleStart(row) {
      console.log('开始活动：', row)
    },
    handleEnd(row) {
      console.log('结束活动：', row)
    },
    handleCancel(row) {
      console.log('取消活动：', row)
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
.promotions {
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