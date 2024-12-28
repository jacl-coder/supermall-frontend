<template>
  <div class="brands">
    <div class="page-header">
      <h2>品牌管理</h2>
      <el-button type="primary" @click="handleAdd">添加品牌</el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="品牌名称">
          <el-input v-model="searchForm.name" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 品牌列表 -->
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="品牌ID" width="100"></el-table-column>
        <el-table-column label="品牌Logo" width="120">
          <template #default="scope">
            <el-image 
              style="width: 80px; height: 40px"
              :src="scope.row.logo"
              fit="contain"
              :preview-src-list="[scope.row.logo]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="品牌名称" min-width="150"></el-table-column>
        <el-table-column prop="description" label="品牌描述" min-width="200"></el-table-column>
        <el-table-column prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'info'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="scope.row.status ? 'warning' : 'success'"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status ? '禁用' : '启用' }}
            </el-button>
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
  name: 'Brands',
  data() {
    return {
      loading: false,
      searchForm: {
        name: '',
        status: '',
        page: 1,
        pageSize: 10
      },
      tableData: [
        {
          id: 1,
          logo: 'https://via.placeholder.com/160x80',
          name: 'Apple',
          description: '美国科技公司',
          sort: 1,
          status: true
        },
        {
          id: 2,
          logo: 'https://via.placeholder.com/160x80',
          name: 'Samsung',
          description: '韩国电子公司',
          sort: 2,
          status: true
        },
        {
          id: 3,
          logo: 'https://via.placeholder.com/160x80',
          name: 'Huawei',
          description: '中国通信技术公司',
          sort: 3,
          status: false
        }
      ],
      total: 100
    }
  },
  methods: {
    handleAdd() {
      console.log('添加品牌')
    },
    handleSearch() {
      console.log('搜索条件：', this.searchForm)
    },
    resetSearch() {
      this.searchForm = {
        name: '',
        status: '',
        page: 1,
        pageSize: 10
      }
    },
    handleEdit(row) {
      console.log('编辑品牌：', row)
    },
    handleToggleStatus(row) {
      console.log('切换状态：', row)
    },
    handleDelete(row) {
      console.log('删除品牌：', row)
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
.brands {
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