<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <el-button type="primary" @click="$router.push('/mall')">返回首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.content {
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 120px;
  color: #409EFF;
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 30px;
  color: #303133;
  margin: 20px 0;
}

p {
  color: #606266;
  margin-bottom: 30px;
}
</style> 