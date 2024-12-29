<template>
    <div class="product-detail">
      <el-card v-if="product" class="product-container">
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="product-image">
              <el-image 
                :src="product.productImage" 
                :alt="product.productName"
                fit="cover"
                :preview-src-list="[product.productImage]">
              </el-image>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="product-info">
              <h1>商品详情</h1>
              <el-table :data="[product]" style="width: 100%" :show-header="false">
                <el-table-column prop="productName" label="商品名称">
                  <template slot-scope="scope">
                    <div class="table-cell">
                      <span class="label">商品名称：</span>
                      <span class="value">{{ scope.row.productName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="productBrand" label="品牌">
                  <template slot-scope="scope">
                    <div class="table-cell">
                      <span class="label">品牌：</span>
                      <span class="value">{{ scope.row.productBrand }}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-table :data="[product]" style="width: 100%; margin-top: 10px" :show-header="false">
                <el-table-column prop="productPrice" label="价格">
                  <template slot-scope="scope">
                    <div class="table-cell">
                      <span class="label">价格：</span>
                      <span class="value price-value">${{ scope.row.productPrice }}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="actions">
                <el-button type="primary" @click="editProduct" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" @click="confirmDelete" icon="el-icon-delete">删除</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-empty v-else description="加载中..."></el-empty>
  
      <!-- 编辑商品弹窗 -->
      <el-dialog
        title="编辑商品"
        :visible.sync="showEditDialog"
        width="500px"
        :close-on-click-modal="false">
        <el-form :model="editingProduct" label-width="80px" size="small">
          <el-form-item label="商品名称">
            <el-input v-model="editingProduct.productName"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="editingProduct.productBrand"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input 
              v-model="editingProduct.productPrice"
              type="text"
              placeholder="请输入价格">
            </el-input>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleImageUpload">
              <el-button size="small" type="primary">选择图片</el-button>
              <div slot="tip" class="el-upload__tip">{{ imageName || '未选择文件' }}</div>
            </el-upload>
            <div v-if="imagePreview" class="image-preview">
              <el-image 
                :src="imagePreview"
                fit="cover"
                style="width: 200px">
              </el-image>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showEditDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveProduct">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { getProductDetail, updateProduct, deleteProduct, uploadFile } from '@/api/admin/product'
  
  export default {
    name: 'ProductDetail',
    data() {
      return {
        product: null,
        showEditDialog: false,
        editingProduct: {
          productName: '',
          productBrand: '',
          productPrice: 0,
          productImage: ''
        },
        imagePreview: null,
        imageName: ''
      }
    },
    created() {
      this.fetchProductDetail()
    },
    methods: {
      async fetchProductDetail() {
        try {
          const productId = this.$route.params.id
          const response = await getProductDetail(productId)
          this.product = response
        } catch (error) {
          this.$message.error('获取商品详情失败')
          console.error('Error fetching product details:', error)
        }
      },
      confirmDelete() {
        this.$confirm('确定要删除这个商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteProduct()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      async deleteProduct() {
        try {
          await deleteProduct(this.product.id)
          this.$message.success('删除成功')
          this.$router.push('/product')
        } catch (error) {
          this.$message.error('删除失败')
          console.error('Error deleting product:', error)
        }
      },
      editProduct() {
        this.editingProduct = { ...this.product }
        this.imagePreview = this.product.productImage
        this.showEditDialog = true
      },
      async saveProduct() {
        try {
          if (this.editingProduct.newImageFile) {
            const formData = new FormData()
            formData.append('file', this.editingProduct.newImageFile)
  
            const uploadResponse = await uploadFile(formData)
  
            if (uploadResponse.code === "0") {
              this.editingProduct.productImage = this.getFileUrl(uploadResponse.data)
            } else {
              throw new Error(uploadResponse.msg || '图片上传失败')
            }
          }
  
          await updateProduct(this.product.id, this.editingProduct)
          this.$message.success('更新成功')
          this.product = { ...this.editingProduct }
          this.showEditDialog = false
          this.imagePreview = null
          this.imageName = ''
        } catch (error) {
          this.$message.error('更新失败')
          console.error('Error updating product:', error)
        }
      },
      handleImageUpload(file) {
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
          this.$message.warning('文件大小应小于10MB')
          return
        }
  
        this.editingProduct.newImageFile = file.raw
        this.imageName = file.name
        
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file.raw)
      },
      getFileUrl(fileUrl) {
        if (!fileUrl) return ''
        const baseURL = 'http://localhost:8080'
        const cleanPath = fileUrl.startsWith('/uploads/') ? fileUrl : `/uploads/${fileUrl.replace(/^\//, '')}`
        const encodedPath = cleanPath.replace(/\+/g, '%20')
        return `${baseURL}${encodedPath}`
      }
    }
  }
  </script>
  
  <style scoped>
  .product-detail {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .product-container {
    margin-bottom: 20px;
  }
  
  .product-image {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .product-info {
    padding: 20px 0;
  }
  
  .product-info h1 {
    margin: 0 0 20px 0;
    font-size: 24px;
    color: #333;
  }
  
  .table-cell {
    display: flex;
    align-items: center;
  }
  
  .label {
    font-weight: bold;
    color: #606266;
    margin-right: 10px;
    min-width: 80px;
  }
  
  .value {
    color: #333;
  }
  
  .price-value {
    color: #67C23A;
    font-size: 20px;
    font-weight: bold;
  }
  
  .el-table {
    border: 1px solid #EBEEF5;
    border-radius: 4px;
  }
  
  .actions {
    margin-top: 20px;
    display: flex;
    gap: 50px;
  }
  
  .image-preview {
    margin-top: 10px;
  }
  
  .el-upload__tip {
    color: #666;
    font-size: 14px;
    margin-top: 5px;
  }
  </style>
  