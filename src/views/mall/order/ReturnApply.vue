<template>
  <div class="return-apply">
    <div class="header">
      <h3>退货申请</h3>
      <button class="apply-btn" @click="showApplyForm = true">申请退货</button>
    </div>

    <div class="return-list">
      <div v-for="item in returnList" 
           :key="item.id" 
           class="return-item">
        <div class="order-info">
          <div class="left">
            <span class="order-no">订单号：{{ item.orderNo }}</span>
            <span class="apply-time">申请时间：{{ item.applyTime }}</span>
          </div>
          <span class="status" :class="item.statusClass">{{ item.status }}</span>
        </div>
        
        <div class="product-info">
          <img :src="item.productImage" :alt="item.productName">
          <div class="detail">
            <h4 class="name">{{ item.productName }}</h4>
            <p class="spec">{{ item.productSpec }}</p>
            <div class="price-qty">
              <span class="price">¥{{ item.price }}</span>
              <span class="quantity">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>

        <div class="return-info">
          <div class="info-item">
            <label>退货原因：</label>
            <span>{{ item.reason }}</span>
          </div>
          <div class="info-item">
            <label>退款金额：</label>
            <span class="amount">¥{{ item.refundAmount }}</span>
          </div>
          <div class="info-item">
            <label>申请说明：</label>
            <span>{{ item.description }}</span>
          </div>
          <div v-if="item.rejectReason" class="info-item reject-reason">
            <label>驳回原因：</label>
            <span>{{ item.rejectReason }}</span>
          </div>
        </div>

        <div class="footer">
          <div class="progress">
            <div class="step" :class="{ active: isStepActive(item, 1) }">
              <span class="dot"></span>
              <span class="text">提交申请</span>
              <span class="time">{{ item.applyTime }}</span>
            </div>
            <div class="line"></div>
            <div class="step" :class="{ active: isStepActive(item, 2) }">
              <span class="dot"></span>
              <span class="text">商家审核</span>
              <span class="time">{{ item.auditTime || '-' }}</span>
            </div>
            <div class="line"></div>
            <div class="step" :class="{ active: isStepActive(item, 3) }">
              <span class="dot"></span>
              <span class="text">退款完成</span>
              <span class="time">{{ item.refundTime || '-' }}</span>
            </div>
          </div>
          <div class="actions">
            <template v-if="item.status === '待审核'">
              <button class="cancel" @click="handleCancel(item.id)">取消申请</button>
              <button class="modify" @click="handleModify(item)">修改申请</button>
            </template>
            <template v-if="item.status === '已驳回'">
              <button class="reapply" @click="handleReapply(item)">重新申请</button>
            </template>
            <template v-if="item.status === '待退货'">
              <button class="primary" @click="handleDelivery(item.id)">填写物流</button>
            </template>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="returnList.length === 0" class="empty-state">
        <img src="@/assets/images/empty-order.svg" alt="暂无退货申请">
        <p>暂无退货申请记录</p>
      </div>
    </div>

    <!-- 申请表单弹窗 -->
    <el-dialog
      v-model="showApplyForm"
      title="退货申请"
      width="500px"
      :close-on-click-modal="false">
      <el-form ref="applyForm" :model="applyForm" :rules="rules" label-width="100px">
        <el-form-item label="订单选择" prop="orderId">
          <el-select v-model="applyForm.orderId" placeholder="请选择订单" @change="handleOrderSelect">
            <el-option
              v-for="order in availableOrders"
              :key="order.id"
              :label="order.orderNo"
              :value="order.id">
              <span>订单号：{{ order.orderNo }}</span>
              <span style="float: right; color: #999">
                {{ order.createTime }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货商品" prop="productId">
          <el-select v-model="applyForm.productId" placeholder="请选择商品">
            <el-option
              v-for="product in selectedOrderProducts"
              :key="product.id"
              :label="product.name"
              :value="product.id">
              <div style="display: flex; align-items: center">
                <img :src="product.image" style="width: 30px; height: 30px; margin-right: 10px">
                <span>{{ product.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货原因" prop="reason">
          <el-select v-model="applyForm.reason" placeholder="请选择退货原因">
            <el-option
              v-for="reason in returnReasons"
              :key="reason.value"
              :label="reason.label"
              :value="reason.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundAmount">
          <el-input-number 
            v-model="applyForm.refundAmount"
            :min="0"
            :max="maxRefundAmount"
            :precision="2"
            :step="0.01">
          </el-input-number>
          <span class="max-amount">最多{{ maxRefundAmount }}元</span>
        </el-form-item>
        <el-form-item label="申请说明" prop="description">
          <el-input
            v-model="applyForm.description"
            type="textarea"
            :rows="3"
            placeholder="请详细描述问题">
          </el-input>
        </el-form-item>
        <el-form-item label="上传凭证" prop="images">
          <el-upload
            action="/api/upload"
            list-type="picture-card"
            :limit="5"
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showApplyForm = false">取 消</el-button>
          <el-button type="primary" @click="submitApply">提 交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 物流信息弹窗 -->
    <el-dialog
      v-model="showLogisticsForm"
      title="填写物流信息"
      width="500px"
      :close-on-click-modal="false">
      <el-form ref="logisticsForm" :model="logisticsForm" :rules="logisticsRules" label-width="100px">
        <el-form-item label="物流公司" prop="company">
          <el-select v-model="logisticsForm.company" placeholder="请选择物流公司">
            <el-option
              v-for="company in logisticsCompanies"
              :key="company.value"
              :label="company.label"
              :value="company.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="trackingNo">
          <el-input v-model="logisticsForm.trackingNo" placeholder="请输入物流单号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="logisticsForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showLogisticsForm = false">取 消</el-button>
          <el-button type="primary" @click="submitLogistics">提 交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

export default {
  name: 'ReturnApply',
  data() {
    return {
      showApplyForm: false,
      showLogisticsForm: false,
      applyForm: {
        orderId: '',
        orderNo: '',
        productId: '',
        productName: '',
        productSpec: '',
        productImage: '',
        price: 0,
        quantity: 1,
        reason: '',
        refundAmount: 0,
        description: '',
        images: []
      },
      logisticsForm: {
        company: '',
        trackingNo: '',
        remark: ''
      },
      rules: {
        orderId: [{ required: true, message: '请选择订单', trigger: 'change' }],
        productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
        reason: [{ required: true, message: '请选择退货原因', trigger: 'change' }],
        refundAmount: [{ required: true, message: '请输入退款金额', trigger: 'blur' }],
        description: [{ required: true, message: '请填写申请说明', trigger: 'blur' }]
      },
      logisticsRules: {
        company: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
        trackingNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }]
      },
      returnReasons: [
        { label: '商品质量问题', value: 'quality' },
        { label: '七天无理由退货', value: 'noReason' },
        { label: '商品与描述不符', value: 'mismatch' },
        { label: '收到商品破损', value: 'damaged' },
        { label: '商品缺少件', value: 'incomplete' }
      ],
      logisticsCompanies: [
        { label: '顺丰速运', value: 'SF' },
        { label: '中通快递', value: 'ZTO' },
        { label: '圆通速递', value: 'YTO' },
        { label: '韵达快递', value: 'YD' },
        { label: '申通快递', value: 'STO' }
      ],
      availableOrders: [
        {
          id: 1,
          orderNo: '202403150001',
          createTime: '2024-03-15',
          products: [
            {
              id: 1,
              name: '商品1',
              spec: '规格：默认',
              image: require('@/assets/images/product-placeholder.svg'),
              price: 299
            }
          ]
        }
      ],
      selectedOrderProducts: [],
      maxRefundAmount: 0,
      currentReturnId: null
    }
  },
  computed: {
    ...mapState('return', ['returnList'])
  },
  methods: {
    // 处理订单选择
    handleOrderSelect(orderId) {
      const order = this.availableOrders.find(o => o.id === orderId)
      if (order) {
        this.selectedOrderProducts = order.products
        this.maxRefundAmount = order.products.reduce((sum, p) => sum + p.price, 0)
        this.applyForm.orderNo = order.orderNo
      }
    },

    // 处理商品选择
    handleProductSelect(productId) {
      const product = this.selectedOrderProducts.find(p => p.id === productId)
      if (product) {
        this.applyForm.productName = product.name
        this.applyForm.productSpec = product.spec
        this.applyForm.productImage = product.image
        this.applyForm.price = product.price
        this.applyForm.refundAmount = product.price
      }
    },

    // 提交申请
    async submitApply() {
      try {
        await this.$refs.applyForm.validate()
        const loading = ElLoading.service({ text: '提交中...' })
        await this.$store.dispatch('return/submitReturn', this.applyForm)
        loading.close()
        ElMessage.success('申请提交成功')
        this.showApplyForm = false
        this.resetForm()
      } catch (error) {
        console.error(error)
        ElMessage.error('提交失败，请重试')
      }
    },

    // 取消申请
    async handleCancel(id) {
      try {
        await ElMessageBox.confirm('确定要取消该退货申请吗？', '提示', {
          type: 'warning'
        })
        const loading = ElLoading.service({ text: '取消中...' })
        await this.$store.dispatch('return/cancelReturn', id)
        loading.close()
        ElMessage.success('申请已取消')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('取消失败，请重试')
        }
      }
    },

    // 修改申请
    handleModify(item) {
      this.applyForm = { ...item }
      this.showApplyForm = true
    },

    // 重新申请
    async handleReapply(item) {
      try {
        const loading = ElLoading.service({ text: '提交中...' })
        await this.$store.dispatch('return/reapplyReturn', item)
        loading.close()
        ElMessage.success('重新申请成功')
      } catch (error) {
        ElMessage.error('申请失败，请重试')
      }
    },

    // 填写物流
    handleDelivery(id) {
      this.currentReturnId = id
      this.showLogisticsForm = true
    },

    // 提交物流信息
    async submitLogistics() {
      try {
        await this.$refs.logisticsForm.validate()
        const loading = ElLoading.service({ text: '提交中...' })
        await this.$store.dispatch('return/submitLogistics', {
          id: this.currentReturnId,
          logistics: this.logisticsForm
        })
        loading.close()
        ElMessage.success('物流信息提交成功')
        this.showLogisticsForm = false
        this.resetLogisticsForm()
      } catch (error) {
        console.error(error)
        ElMessage.error('提交失败，请重试')
      }
    },

    // 重置表单
    resetForm() {
      this.$refs.applyForm.resetFields()
      this.applyForm = {
        orderId: '',
        orderNo: '',
        productId: '',
        productName: '',
        productSpec: '',
        productImage: '',
        price: 0,
        quantity: 1,
        reason: '',
        refundAmount: 0,
        description: '',
        images: []
      }
    },

    // 重置物流表单
    resetLogisticsForm() {
      this.$refs.logisticsForm.resetFields()
      this.logisticsForm = {
        company: '',
        trackingNo: '',
        remark: ''
      }
      this.currentReturnId = null
    },

    // 上传成功回调
    handleUploadSuccess(response) {
      this.applyForm.images.push(response.url)
    },

    // 移除上传图片
    handleUploadRemove(uploadFile) {
      const url = uploadFile.response?.url || uploadFile.url
      const index = this.applyForm.images.indexOf(url)
      if (index > -1) {
        this.applyForm.images.splice(index, 1)
      }
    },

    // 添加 isStepActive 方法
    isStepActive(item, step) {
      const statusMap = {
        '待审核': 1,
        '待退货': 2,
        '已驳回': 1,
        '已完成': 3
      }
      return statusMap[item.status] >= step
    }
  }
}
</script>

<style lang="scss" scoped>
.return-apply {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;

    h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .apply-btn {
      padding: 10px 20px;
      background: #409EFF;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        font-size: 16px;
      }

      &:hover {
        background: #66b1ff;
      }

      &:active {
        background: #3a8ee6;
      }
    }
  }

  .return-list {
    .return-item {
      margin-bottom: 24px;
      border: 1px solid #ebeef5;
      border-radius: 8px;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .order-info {
        padding: 16px 20px;
        background: #fafafa;
        border-radius: 8px 8px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .left {
          display: flex;
          align-items: center;
          gap: 24px;

          .order-no {
            color: #333;
            font-weight: 500;
          }
          .apply-time {
            color: #909399;
          }
        }

        .status {
          font-weight: 500;
          font-size: 15px;
          padding: 4px 12px;
          border-radius: 4px;

          &.pending { 
            color: #E6A23C;
            background: #fdf6ec;
          }
          &.success { 
            color: #67C23A;
            background: #f0f9eb;
          }
          &.rejected { 
            color: #F56C6C;
            background: #fef0f0;
          }
        }
      }

      .product-info {
        padding: 20px;
        display: flex;
        border-bottom: 1px solid #ebeef5;

        img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          margin-right: 16px;
          border-radius: 6px;
        }

        .detail {
          flex: 1;

          .name {
            margin: 0 0 8px;
            font-size: 15px;
            color: #333;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.5;
          }

          .spec {
            color: #909399;
            font-size: 13px;
            margin-bottom: 8px;
          }

          .price-qty {
            display: flex;
            align-items: center;
            gap: 12px;

            .price {
              color: #f56c6c;
              font-size: 16px;
              font-weight: 500;

              &::before {
                content: '¥';
                font-size: 13px;
                margin-right: 2px;
              }
            }
            .quantity {
              color: #909399;
              font-size: 13px;
            }
          }
        }
      }

      .return-info {
        padding: 20px;
        border-bottom: 1px solid #ebeef5;
        background: #fafafa;

        .info-item {
          margin: 12px 0;
          display: flex;
          align-items: flex-start;
          
          label {
            color: #606266;
            margin-right: 16px;
            min-width: 100px;
            text-align: right;
          }

          .content {
            flex: 1;
            color: #333;
          }

          .amount {
            color: #f56c6c;
            font-weight: 500;
            font-size: 15px;

            &::before {
              content: '¥';
              font-size: 13px;
              margin-right: 2px;
            }
          }

          &.reject-reason {
            color: #F56C6C;
            background: #fef0f0;
            padding: 12px;
            border-radius: 4px;
            margin: 16px 0;
          }
        }
      }

      .footer {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border-radius: 0 0 8px 8px;

        .progress {
          display: flex;
          align-items: center;

          .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #909399;
            position: relative;
            min-width: 120px;

            &.active {
              color: #409EFF;

              .dot {
                background: #409EFF;
                border-color: #a0cfff;
              }

              .line {
                background: #409EFF;
              }
            }

            .dot {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #dcdfe6;
              border: 2px solid #ebeef5;
              margin-bottom: 8px;
              transition: all 0.3s;
            }

            .text {
              font-size: 14px;
              margin-bottom: 4px;
              white-space: nowrap;
            }

            .time {
              font-size: 12px;
              color: #909399;
            }

            .line {
              position: absolute;
              top: 5px;
              left: 50%;
              width: 100%;
              height: 2px;
              background: #dcdfe6;
              z-index: -1;
            }

            &:last-child .line {
              display: none;
            }
          }
        }

        .actions {
          display: flex;
          gap: 12px;

          button {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;

            &.primary {
              background: #409EFF;
              color: #fff;
              border: none;

              &:hover {
                background: #66b1ff;
              }

              &:active {
                background: #3a8ee6;
              }
            }

            &.cancel, &.modify, &.reapply {
              background: #fff;
              color: #606266;
              border: 1px solid #dcdfe6;

              &:hover {
                color: #409EFF;
                border-color: #c6e2ff;
                background: #ecf5ff;
              }

              &:active {
                color: #3a8ee6;
                border-color: #3a8ee6;
              }
            }
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 60px 0;
      color: #909399;

      img {
        width: 180px;
        margin-bottom: 24px;
        opacity: 0.8;
      }

      p {
        font-size: 15px;
        margin-bottom: 24px;
      }
    }
  }
}

:deep(.el-dialog) {
  border-radius: 8px;
  
  .el-dialog__header {
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
    
    .el-dialog__title {
      font-size: 18px;
      color: #333;
    }
  }
  
  .el-dialog__body {
    padding: 24px 20px;
  }

  .el-form {
    .el-form-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-form-item__label {
      font-weight: 500;
      color: #333;
    }

    .el-input__inner,
    .el-textarea__inner {
      border-radius: 4px;
    }

    .el-select {
      width: 100%;
    }

    .upload-area {
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      padding: 20px;
      text-align: center;
      color: #909399;
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        border-color: #409EFF;
        color: #409EFF;
      }

      i {
        font-size: 24px;
        margin-bottom: 8px;
      }

      .text {
        font-size: 14px;
      }
    }

    .image-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 16px;

      .image-item {
        width: 100px;
        height: 100px;
        border-radius: 4px;
        overflow: hidden;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .delete {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,0.5);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 12px;
          opacity: 0;
          transition: all 0.3s;
        }

        &:hover .delete {
          opacity: 1;
        }
      }
    }
  }

  .el-dialog__footer {
    padding: 16px 20px;
    border-top: 1px solid #ebeef5;
    
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  }
}
</style>
