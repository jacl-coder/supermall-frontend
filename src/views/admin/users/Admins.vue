<template>
  <div class="admin-list">
    <div class="page-header">
      <h2>管理员列表</h2>
      <el-button type="primary" @click="handleAdd">添加管理员</el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择角色">
            <el-option label="全部" value=""></el-option>
            <el-option label="超级管理员" value="super"></el-option>
            <el-option label="普通管理员" value="admin"></el-option>
            <el-option label="运营" value="operator"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="normal"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 管理员表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-avatar :size="40" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">
              {{ getRoleText(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permissions" label="权限" min-width="200">
          <template #default="scope">
            <el-tag 
              v-for="perm in scope.row.permissions" 
              :key="perm"
              size="small"
              class="permission-tag"
            >
              {{ perm }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'normal' ? 'success' : 'info'">
              {{ scope.row.status === 'normal' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录" width="180"></el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="scope.row.status === 'normal' ? 'warning' : 'success'"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 'normal' ? '禁用' : '启用' }}
            </el-button>
            <el-button 
              size="small" 
              type="primary"
              @click="handleResetPassword(scope.row)"
            >重置密码</el-button>
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
  name: 'AdminList',
  data() {
    return {
      loading: false,
      searchForm: {
        username: '',
        role: '',
        status: '',
        page: 1,
        pageSize: 10
      },
      tableData: [
        {
          id: 1,
          avatar: 'https://via.placeholder.com/40',
          username: 'admin',
          role: 'super',
          permissions: ['系统管理', '用户管理', '订单管理', '商品管理'],
          status: 'normal',
          lastLoginTime: '2023-12-28 15:30:00'
        },
        {
          id: 2,
          avatar: 'https://via.placeholder.com/40',
          username: 'operator',
          role: 'operator',
          permissions: ['订单管理', '商品管理'],
          status: 'normal',
          lastLoginTime: '2023-12-27 14:20:00'
        }
      ],
      total: 100
    }
  },
  methods: {
    getRoleType(role) {
      const roleMap = {
        super: 'danger',
        admin: 'warning',
        operator: 'success'
      }
      return roleMap[role] || 'info'
    },
    getRoleText(role) {
      const roleMap = {
        super: '超级管理员',
        admin: '普通管理员',
        operator: '运营'
      }
      return roleMap[role] || role
    },
    handleAdd() {
      console.log('添加管理员')
    },
    handleSearch() {
      console.log('搜索条件：', this.searchForm)
    },
    resetSearch() {
      this.searchForm = {
        username: '',
        role: '',
        status: '',
        page: 1,
        pageSize: 10
      }
    },
    handleEdit(row) {
      console.log('编辑管理员：', row)
    },
    handleToggleStatus(row) {
      console.log('切换管理员状态：', row)
    },
    handleResetPassword(row) {
      console.log('重置管理员密码：', row)
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
.admin-list {
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

.permission-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 