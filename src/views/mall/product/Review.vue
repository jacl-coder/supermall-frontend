<template>
  <div class="review-container">
    <!-- 提交评价表单 -->
    <el-card class="submit-review" v-if="canReview">
      <h3>发表评价</h3>
      <el-form :model="newReview" :rules="rules" ref="reviewForm">
        <el-form-item label="评分" prop="rating">
          <div class="rate-container">
            <el-rate v-model="newReview.rating" show-score />
          </div>
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input
            type="textarea"
            v-model="newReview.content"
            :rows="4"
            placeholder="请分享您的使用体验..."
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <div class="rate-container">
            <el-upload
              action="/api/upload"
              list-type="picture-card"
              :on-success="handleUploadSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReview">提交评价</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Review',
  data() {
    return {
      newReview: {
        rating: 5,
        content: '',
        images: []
      },
      rules: {
        rating: [{ required: true, message: '请选择评分', trigger: 'change' }],
        content: [
          { required: true, message: '请输入评价内容', trigger: 'blur' },
          { min: 10, message: '评价内容至少10个字符', trigger: 'blur' }
        ]
      },
      canReview: true,
      productId: null
    }
  },
  methods: {
    handleUploadSuccess(response, file) {
      this.newReview.images.push(response.url)
    },
    handleRemove(file) {
      const index = this.newReview.images.indexOf(file.url)
      if (index !== -1) {
        this.newReview.images.splice(index, 1)
      }
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    },
    async submitReview() {
      try {
        await this.$refs.reviewForm.validate()
        await this.$http.post(`/api/reviews/${this.productId}`, this.newReview)
        this.$message.success('评价提交成功')
        this.resetForm()
      } catch (error) {
        if (error.message) {
          this.$message.error(error.message)
        }
      }
    },
    resetForm() {
      this.newReview = {
        rating: 5,
        content: '',
        images: []
      }
      this.$refs.reviewForm.resetFields()
    }
  },
  created() {
    this.productId = this.$route.query.productId
    if (!this.productId) {
      this.$message.warning('未指定商品')
      this.$router.push('/product')
      return
    }
  }
}
</script>

<style scoped>
.review-container {
  padding: 20px;
}

.submit-review {
  margin-top: 30px;
}

.rate-container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
</style> 