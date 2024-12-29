<template>
    <div>
      <div class="container">
        <div class="header">
          <h1>Product List</h1>
        </div>
  
        <!-- 搜索区域 -->
        <div class="search-area">
          <el-input
            v-model="searchQuery"
            placeholder="输入商品名称或品牌搜索"
            @keyup.enter.native="handleSearch"
            clearable>
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
          <el-button type="primary" @click="showAddProductDialog">Add Product</el-button>
        </div>
  
        <!-- Add Product Dialog -->
        <el-dialog
          title="Add New Product"
          :visible.sync="showDialog"
          width="500px"
          center>
          <el-form :model="newProduct" label-width="100px">
            <el-form-item label="Name:">
              <el-input v-model="newProduct.productName"></el-input>
            </el-form-item>
            <el-form-item label="Brand:">
              <el-input v-model="newProduct.productBrand"></el-input>
            </el-form-item>
            <el-form-item label="Price:">
              <el-input-number v-model="newProduct.productPrice" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="Image:">
              <div class="upload-container">
                <input 
                  type="file" 
                  @change="handleImageUpload" 
                  accept="image/*"
                  ref="fileInput"
                  style="display: none"
                >
                <el-button type="primary" @click="$refs.fileInput.click()">
                  Choose Image
                </el-button>
                <span class="file-name">{{ imageName || 'No file chosen' }}</span>
              </div>
              <div v-if="imagePreview" class="image-preview">
                <el-image :src="imagePreview" fit="cover"></el-image>
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDialog = false">Cancel</el-button>
            <el-button type="primary" @click="addProduct">Save</el-button>
          </span>
        </el-dialog>
  
        <el-row :gutter="20">
          <el-col :span="4" v-for="product in products" :key="product.id">
            <el-card :body-style="{ padding: '0px' }" class="product-card">
              <el-image 
                :src="product.productImage" 
                fit="cover"
                class="product-image">
              </el-image>
              <div class="product-content">
                <router-link :to="'/product/' + product.id" class="product-name">
                  <span>{{ product.productName }}</span>
                </router-link>
                <div class="product-info">
                  <span>{{ product.productBrand }}</span>
                  <span class="product-price">Price: {{ product.productPrice }} $</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
  
        <div class="pagination-container">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            background>
          </el-pagination>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getProductList, addProduct, uploadFile, searchProducts } from '@/api/admin/product'
  
  export default {
    data() {
      return {
        searchQuery: '',
        products: [],
        showDialog: false,
        newProduct: {
          productName: '',
          productBrand: '',
          productPrice: 0,
          productImage: null
        },
        imagePreview: null,
        imageName: '',
        // 分页相关数据
        currentPage: 1,
        pageSize: 18,
        total: 0
      };
    },
    created() {
      this.fetchProducts();
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await getProductList(this.currentPage, this.pageSize);
          
          if (response) {
            this.products = response.records || [];
            this.total = response.total || 0;
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      },
      async handleSearch() {
        if (!this.searchQuery.trim()) {
          await this.fetchProducts();
          return;
        }
        
        try {
          const products = await searchProducts(this.searchQuery);
          this.products = products;
          this.total = products.length;
        } catch (error) {
          this.$message.error('搜索失败');
          console.error('Error searching products:', error);
        }
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fetchProducts();
      },
      showAddProductDialog() {
        this.showDialog = true;
      },
      async addProduct() {
        try {
          if (!this.newProduct.productImage) {
            alert('Please select a product image');
            return;
          }
  
          const formData = new FormData();
          formData.append('file', this.newProduct.productImage);
  
          const uploadResponse = await uploadFile(formData);
  
          if (uploadResponse.code === "0") {
            const imageUrl = this.getFileUrl(uploadResponse.data);
            
            const productData = {
              productName: this.newProduct.productName,
              productBrand: this.newProduct.productBrand,
              productPrice: this.newProduct.productPrice,
              productImage: imageUrl
            };
  
            await addProduct(productData);
            
            await this.fetchProducts();
            
            this.newProduct = {
              productName: '',
              productBrand: '',
              productPrice: 0,
              productImage: null
            };
            this.imagePreview = null;
            this.imageName = '';
            this.showDialog = false;
          } else {
            throw new Error(uploadResponse.msg || 'Failed to upload image');
          }
        } catch (error) {
          console.error('Error adding product:', error);
          alert(error.message || 'Failed to add product');
        }
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          // 检查文件大小（限制为10MB）
          const maxSize = 10 * 1024 * 1024;
          if (file.size > maxSize) {
            alert('File size should be less than 10MB');
            return;
          }
  
          this.newProduct.productImage = file;
          this.imageName = file.name;
          
          // 创建预览
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      getFileUrl(fileUrl) {
        if (!fileUrl) return '';
        const baseURL = 'http://localhost:8080';
        const cleanPath = fileUrl.startsWith('/uploads/') ? fileUrl : `/uploads/${fileUrl.replace(/^\//, '')}`;
        const encodedPath = cleanPath.replace(/\+/g, '%20');
        return `${baseURL}${encodedPath}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    width: 95%;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .product-card {
    margin-bottom: 20px;
    transition: transform 0.3s;
    height: 380px;
    display: flex;
    flex-direction: column;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
  }
  
  .product-content {
    padding: 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .product-name {
    color: #333;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .product-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: auto;
  }
  
  .product-price {
    color: #409EFF;
    font-weight: bold;
  }
  
  .upload-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .file-name {
    color: #666;
    font-size: 14px;
  }
  
  .image-preview {
    margin-top: 10px;
    max-width: 200px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  
  .search-area {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .search-area .el-input {
    width: 60%;
  }
  
  .search-area .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  
  .search-area .el-input-group__append {
    background-color: #409EFF;
    border-color: #409EFF;
    color: white;
  }
  
  .search-area .el-input-group__append:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
  </style>