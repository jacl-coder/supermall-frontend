<template>
  <div class="categories">
    <div class="page-header">
      <h2>分类管理</h2>
      <el-button type="primary" @click="handleAdd">添加分类</el-button>
    </div>

    <el-card class="table-card">
      <el-table
        :data="tableData"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children'}"
      >
        <el-table-column prop="name" label="分类名称" min-width="200"></el-table-column>
        <el-table-column prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'info'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: '手机数码',
          sort: 1,
          status: true,
          children: [
            {
              id: 11,
              name: '手机',
              sort: 1,
              status: true
            },
            {
              id: 12,
              name: '平板',
              sort: 2,
              status: true
            }
          ]
        },
        {
          id: 2,
          name: '电脑办公',
          sort: 2,
          status: true,
          children: [
            {
              id: 21,
              name: '笔记本',
              sort: 1,
              status: true
            },
            {
              id: 22,
              name: '台式机',
              sort: 2,
              status: false
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleAdd() {
      console.log('添加分类')
    },
    handleEdit(row) {
      console.log('编辑分类：', row)
    },
    handleToggleStatus(row) {
      console.log('切换状态：', row)
    },
    handleDelete(row) {
      console.log('删除分类：', row)
    }
  }
}
</script>

<style scoped>
.categories {
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

.table-card {
  margin-bottom: 20px;
}
</style> 