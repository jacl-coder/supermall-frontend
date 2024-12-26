<template>
  <div class="address-list">
    <div class="header">
      <h3>收货地址</h3>
      <button class="add-btn" @click="handleAdd">新增地址</button>
    </div>

    <div class="address-grid">
      <div v-for="address in addresses" 
           :key="address.id" 
           class="address-item"
           :class="{ default: address.isDefault }">
        <div class="info">
          <p class="name-phone">
            <span class="name">{{ address.name }}</span>
            <span class="phone">{{ address.phone }}</span>
          </p>
          <p class="address-detail">
            {{ address.province }} {{ address.city }} {{ address.district }}
            {{ address.detail }}
          </p>
          <span v-if="address.isDefault" class="default-tag">默认地址</span>
        </div>
        <div class="actions">
          <a @click="handleEdit(address)">编辑</a>
          <a @click="handleDelete(address.id)">删除</a>
          <a v-if="!address.isDefault" 
             @click="handleSetDefault(address.id)">设为默认</a>
        </div>
      </div>
    </div>

    <!-- 新增/编辑地址表单弹窗 -->
    <div v-if="showAddressForm" class="address-form-modal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑地址' : '新增地址' }}</h3>
          <span class="close" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitAddress" class="address-form">
            <div class="form-group">
              <label>收货人</label>
              <input 
                type="text" 
                v-model="addressForm.name"
                placeholder="请输入收货人姓名"
                required>
            </div>
            <div class="form-group">
              <label>手机号码</label>
              <input 
                type="tel" 
                v-model="addressForm.phone"
                placeholder="请输入手机号码"
                pattern="^1[3-9]\d{9}$"
                required>
            </div>
            <div class="form-group address-select">
              <label>所在地区</label>
              <div class="select-group">
                <select v-model="addressForm.province" required>
                  <option value="">请选择省份</option>
                  <option v-for="province in provinces" 
                          :key="province" 
                          :value="province">
                    {{ province }}
                  </option>
                </select>
                <select v-model="addressForm.city" required>
                  <option value="">请选择城市</option>
                  <option v-for="city in cities" 
                          :key="city" 
                          :value="city">
                    {{ city }}
                  </option>
                </select>
                <select v-model="addressForm.district" required>
                  <option value="">请选择区县</option>
                  <option v-for="district in districts" 
                          :key="district" 
                          :value="district">
                    {{ district }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>详细地址</label>
              <textarea 
                v-model="addressForm.detail"
                placeholder="请输入详细地址"
                required>
              </textarea>
            </div>
            <div class="form-group checkbox">
              <label>
                <input 
                  type="checkbox" 
                  v-model="addressForm.isDefault">
                设为默认地址
              </label>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel" @click="closeModal">取消</button>
              <button type="submit" class="submit">确定</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserAddress',
  data() {
    return {
      showAddressForm: false,
      isEdit: false,
      addressForm: {
        id: '',
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: false
      },
      addresses: [
        {
          id: 1,
          name: '张三',
          phone: '13800138000',
          province: '甘肃',
          city: '深圳市',
          district: '南山区',
          detail: '科技园南路XX号',
          isDefault: true
        },
        {
          id: 2,
          name: '李四',
          phone: '13800138001',
          province: '广东省',
          city: '深圳市',
          district: '福田区',
          detail: '福田中心区XX号',
          isDefault: false
        }
      ],
      // 模拟省市区数据
      provinces: ['广东省', '北京市', '上海市'],
      cities: ['深圳市', '广州市', '东莞市'],
      districts: ['南山区', '福田区', '罗湖区']
    }
  },
  methods: {
    // 新增地址
    handleAdd() {
      this.isEdit = false
      this.resetForm()
      this.showAddressForm = true
    },

    // 编辑地址
    handleEdit(address) {
      this.isEdit = true
      this.addressForm = { ...address }
      this.showAddressForm = true
    },

    // 删除地址
    handleDelete(id) {
      if (confirm('确定要删除该地址吗？')) {
        const index = this.addresses.findIndex(addr => addr.id === id)
        if (index > -1) {
          this.addresses.splice(index, 1)
          this.saveAddresses()
        }
      }
    },

    // 设为默认地址
    handleSetDefault(id) {
      this.addresses.forEach(addr => {
        addr.isDefault = addr.id === id
      })
      this.saveAddresses()
    },

    // 提交地址表单
    submitAddress() {
      if (this.isEdit) {
        // 编辑现有地址
        const index = this.addresses.findIndex(addr => addr.id === this.addressForm.id)
        if (index > -1) {
          this.addresses[index] = { ...this.addressForm }
        }
      } else {
        // 新增地址
        const newAddress = {
          ...this.addressForm,
          id: Date.now()
        }
        // 如果是第一个地址或设置为默认地址
        if (this.addresses.length === 0 || newAddress.isDefault) {
          this.addresses.forEach(addr => addr.isDefault = false)
        }
        this.addresses.push(newAddress)
      }
      
      this.saveAddresses()
      this.closeModal()
    },

    // 关闭弹窗
    closeModal() {
      this.showAddressForm = false
      this.resetForm()
    },

    // 重置表单
    resetForm() {
      this.addressForm = {
        id: '',
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detail: '',
        isDefault: false
      }
    },

    // 保存地址到本地存储
    saveAddresses() {
      localStorage.setItem('addresses', JSON.stringify(this.addresses))
    },

    // 从本地存储加载地址
    loadAddresses() {
      const savedAddresses = localStorage.getItem('addresses')
      if (savedAddresses) {
        this.addresses = JSON.parse(savedAddresses)
      }
    }
  },
  mounted() {
    this.loadAddresses()
  }
}
</script>

<style lang="scss" scoped>
.address-list {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;

    .add-btn {
      padding: 8px 15px;
      background: #409EFF;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #66b1ff;
      }
    }
  }

  .address-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;

    .address-item {
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 4px;
      position: relative;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      }

      &.default {
        border-color: #409EFF;
      }

      .info {
        .name-phone {
          margin-bottom: 10px;
          
          .name {
            font-weight: bold;
            margin-right: 10px;
          }

          .phone {
            color: #666;
          }
        }

        .address-detail {
          color: #666;
          line-height: 1.5;
        }

        .default-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #409EFF;
          color: #fff;
          padding: 2px 6px;
          border-radius: 2px;
          font-size: 12px;
        }
      }

      .actions {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;

        a {
          color: #409EFF;
          margin-right: 15px;
          cursor: pointer;
          font-size: 14px;

          &:hover {
            color: #66b1ff;
          }
        }
      }
    }
  }
}

.address-form-modal {
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
  }

  .modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: 500px;
    border-radius: 4px;
    z-index: 1001;

    .modal-header {
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 16px;
      }

      .close {
        font-size: 20px;
        color: #999;
        cursor: pointer;

        &:hover {
          color: #666;
        }
      }
    }

    .modal-body {
      padding: 20px;

      .address-form {
        .form-group {
          margin-bottom: 15px;

          label {
            display: block;
            margin-bottom: 5px;
            color: #333;
          }

          input, textarea, select {
            width: 100%;
            padding: 8px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            font-size: 14px;

            &:focus {
              border-color: #409EFF;
              outline: none;
            }
          }

          textarea {
            height: 80px;
            resize: vertical;
          }

          &.address-select {
            .select-group {
              display: flex;
              gap: 10px;

              select {
                flex: 1;
              }
            }
          }

          &.checkbox {
            display: flex;
            align-items: center;

            input {
              width: auto;
              margin-right: 5px;
            }

            label {
              margin: 0;
              cursor: pointer;
            }
          }
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;

          button {
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;

            &.submit {
              background: #409EFF;
              color: #fff;
              border: none;

              &:hover {
                background: #66b1ff;
              }
            }

            &.cancel {
              background: #fff;
              color: #666;
              border: 1px solid #dcdfe6;

              &:hover {
                color: #409EFF;
                border-color: #409EFF;
              }
            }
          }
        }
      }
    }
  }
}
</style>
