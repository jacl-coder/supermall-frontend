<template>
  <div class="advertisements">
    <div class="page-header">
      <h2>广告管理</h2>
      <el-button type="primary" @click="handleAdd">新增广告</el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="广告标题">
          <el-input v-model="searchForm.title" placeholder="请输入广告标题"></el-input>
        </el-form-item>
        <el-form-item label="投放位置">
          <el-select v-model="searchForm.position" placeholder="请选择位置">
            <el-option label="全部" value=""></el-option>
            <el-option label="首页轮播" value="homeCarousel"></el-option>
            <el-option label="首页推荐" value="homeRecommend"></el-option>
            <el-option label="分类页广告" value="categoryBanner"></el-option>
            <el-option label="搜索页广告" value="searchBanner"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未开始" value="pending"></el-option>
            <el-option label="投放中" value="active"></el-option>
            <el-option label="已结束" value="ended"></el-option>
            <el-option label="已下架" value="offline"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放时间">
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

    <!-- 广告表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="广告ID" width="100"></el-table-column>
        <el-table-column label="广告图片" width="120">
          <template #default="scope">
            <el-image 
              :src="scope.row.image" 
              style="width: 80px; height: 80px"
              :preview-src-list="[scope.row.image]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="广告标题" min-width="150"></el-table-column>
        <el-table-column prop="position" label="投放位置" width="120">
          <template #default="scope">
            <el-tag :type="getPositionTag(scope.row.position)">
              {{ getPositionText(scope.row.position) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="投放时间" width="300">
          <template #default="scope">
            {{ scope.row.startTime }} 至 {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="clickCount" label="点击量" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              v-if="scope.row.status === 'pending'"
              size="small" 
              type="success"
              @click="handleStart(scope.row)"
            >开始投放</el-button>
            <el-button 
              v-if="scope.row.status === 'active'"
              size="small" 
              type="warning"
              @click="handleStop(scope.row)"
            >暂停投放</el-button>
            <el-button 
              size="small" 
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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
  name: 'Advertisements',
  data() {
    return {
      loading: false,
      searchForm: {
        title: '',
        position: '',
        status: '',
        dateRange: [],
        page: 1,
        pageSize: 10
      },
      tableData: [
        {
          id: 1,
          image: 'https://via.placeholder.com/80',
          title: '双十二大促',
          position: 'homeCarousel',
          startTime: '2023-12-12 00:00:00',
          endTime: '2023-12-12 23:59:59',
          clickCount: 1000,
          status: 'ended'
        },
        {
          id: 2,
          image: 'https://via.placeholder.com/80',
          title: '新年特惠',
          position: 'homeRecommend',
          startTime: '2024-01-01 00:00:00',
          endTime: '2024-01-07 23:59:59',
          clickCount: 0,
          status: 'pending'
        },
        {
          id: 3,
          image: 'https://via.placeholder.com/80',
          title: '数码产品促销',
          position: 'categoryBanner',
          startTime: '2023-12-25 00:00:00',
          endTime: '2023-12-31 23:59:59',
          clickCount: 500,
          status: 'active'
        }
      ],
      total: 100
    }
  },
  methods: {
    getPositionTag(position) {
      const positionMap = {
        homeCarousel: 'danger',
        homeRecommend: 'warning',
        categoryBanner: 'success',
        searchBanner: ''
      }
      return positionMap[position] || 'info'
    },
    getPositionText(position) {
      const positionMap = {
        homeCarousel: '首页轮播',
        homeRecommend: '首页推荐',
        categoryBanner: '分类页广告',
        searchBanner: '搜索页广告'
      }
      return positionMap[position] || position
    },
    getStatusType(status) {
      const statusMap = {
        pending: 'info',
        active: 'success',
        ended: 'warning',
        offline: 'danger'
      }
      return statusMap[status] || 'info'
    },
    getStatusText(status) {
      const statusMap = {
        pending: '未开始',
        active: '投放中',
        ended: '已结束',
        offline: '已下架'
      }
      return statusMap[status] || status
    },
    handleAdd() {
      console.log('新增广告')
    },
    handleSearch() {
      console.log('搜索条件：', this.searchForm)
    },
    resetSearch() {
      this.searchForm = {
        title: '',
        position: '',
        status: '',
        dateRange: [],
        page: 1,
        pageSize: 10
      }
    },
    handleEdit(row) {
      console.log('编辑广告：', row)
    },
    handleStart(row) {
      console.log('开始投放：', row)
    },
    handleStop(row) {
      console.log('暂停投放：', row)
    },
    handleDelete(row) {
      console.log('删除广告：', row)
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
.advertisements {
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