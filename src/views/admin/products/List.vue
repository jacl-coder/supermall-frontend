<template>
  <div class="product-list">
    <div class="page-header">
      <h2>商品列表</h2>
      <el-button type="primary" @click="handleAdd">添加商品</el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类">
            <el-option label="全部" value=""></el-option>
            <el-option label="手机" value="phone"></el-option>
            <el-option label="电脑" value="computer"></el-option>
            <el-option label="配件" value="accessory"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="on"></el-option>
            <el-option label="下架" value="off"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 商品表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="商品ID" width="100"></el-table-column>
        <el-table-column label="商品图片" width="100">
          <template #default="scope">
            <el-image 
              style="width: 50px; height: 50px"
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200"></el-table-column>
        <el-table-column prop="category" label="分类" width="100"></el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'on' ? 'success' : 'info'">
              {{ scope.row.status === 'on' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="scope.row.status === 'on' ? 'warning' : 'success'"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 'on' ? '下架' : '上架' }}
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
  name: 'ProductList',
  data() {
    return {
      loading: false,
      searchForm: {
        name: '',
        category: '',
        status: '',
        page: 1,
        pageSize: 10
      },
      tableData: [
        {
          id: '1001',
          image: 'https://via.placeholder.com/50',
          name: 'iPhone 13 Pro',
          category: '手机',
          price: 8999,
          stock: 100,
          status: 'on'
        },
        {
          id: '1002',
          image: 'https://via.placeholder.com/50',
          name: 'MacBook Pro',
          category: '电脑',
          price: 12999,
          stock: 50,
          status: 'on'
        },
        {
          id: '1003',
          image: 'https://via.placeholder.com/50',
          name: 'AirPods Pro',
          category: '配件',
          price: 1999,
          stock: 200,
          status: 'off'
        }
      ],
      total: 100
    }
  },
  methods: {
    handleAdd() {
      // 添加商品
      console.log('添加商品')
    },
    handleSearch() {
      // 搜索商品
      console.log('搜索条件：', this.searchForm)
    },
    resetSearch() {
      // 重置搜索条件
      this.searchForm = {
        name: '',
        category: '',
        status: '',
        page: 1,
        pageSize: 10
      }
    },
    handleEdit(row) {
      // 编辑商品
      console.log('编辑商品：', row)
    },
    handleToggleStatus(row) {
      // 切换商品状态
      console.log('切换商品状态：', row)
    },
    handleDelete(row) {
      // 删除商品
      console.log('删除商品：', row)
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
.product-list {
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