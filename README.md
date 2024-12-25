# supermall-frontend
企业云业务超市系统前端

## 项目介绍
`supermall-frontend`是一套完整的电商系统的前端部分，基于 Vue3 + Element Plus 实现。包含商城前台及管理后台两个子系统。

### 项目架构
前端项目采用 Vue3 + Element Plus + Pinia 技术栈

#### 前端技术栈
| 技术 | 说明 | 官网 |
| --- | --- | --- |
| Vue3 | 前端框架 | https://v3.vuejs.org/ |
| Vue Router | 路由框架 | https://router.vuejs.org/ |
| Element Plus | UI框架 | https://element-plus.org/ |
| Pinia | 全局状态管理 | https://pinia.vuejs.org/ |
| Axios | HTTP工具 | https://axios-http.com/ |
| ECharts | 图表框架 | https://echarts.apache.org/ |

### 项目结构
```bash
src/
  ├── components/     # 公共组件
      ├── common/     # 通用组件
          ├── Header/       # 头部组件
          ├── Sidebar/     # 侧边栏组件
          └── Table/       # 表格组件
      └── business/   # 业务组件
          ├── ProductCard/ # 商品卡片
          └── OrderItem/   # 订单项
  ├── views/          # 页面组件
      ├── admin/      # 后台管理
          ├── product/     # 商品管理
          ├── order/       # 订单管理
          └── user/        # 用户管理
      └── mall/       # 商城前台
          ├── home/        # 首页
          ├── product/     # 商品
          └── cart/        # 购物车
  ├── api/            # 接口请求
      ├── admin/      # 后台接口
      └── mall/       # 前台接口
  ├── utils/          # 工具函数
      ├── request.js       # axios封装
      ├── auth.js         # 权限相关
      └── validate.js     # 验证工具
  ├── router/         # 路由配置
      ├── admin.js        # 后台路由
      └── mall.js         # 前台路由
  ├── store/          # 状态管理
      ├── modules/        # 状态模块
      └── index.js        # 状态入口
  ├── assets/         # 静态资源
      ├── images/         # 图片资源
      ├── icons/          # 图标资源
      └── styles/         # 样式资源
  └── styles/         # 全局样式
      ├── variables.scss  # 全局变量
      ├── mixin.scss     # 混入
      └── common.scss    # 公共样式
```

### 功能模块

#### 后台管理系统
- 商品管理
  - [ ] 商品列表
  - [ ] 商品分类
  - [ ] 品牌管理
  - [ ] 商品规格
  - [ ] 商品参数
- 订单管理
  - [ ] 订单列表
  - [ ] 订单设置
  - [ ] 退货管理
  - [ ] 发货管理
  - [ ] 订单统计
- 用户管理
  - [ ] 用户列表
  - [ ] 用户等级
  - [ ] 积分管理
  - [ ] 会员统计
- 权限管理
  - [ ] 用户角色
  - [ ] 菜单管理
  - [ ] 资源管理
  - [ ] 权限分配
- 营销管理
  - [ ] 秒杀活动
  - [ ] 优惠券管理
  - [ ] 活动管理
  - [ ] 广告管理

#### 商城前台系统
- 首页
  - [ ] 商品搜索
  - [ ] 商品分类
  - [ ] 商品推荐
  - [ ] 广告轮播
  - [ ] 秒杀专区
- 商品
  - [ ] 商品详情
  - [ ] 商品评价
  - [ ] 商品收藏
  - [ ] 商品对比
  - [ ] 商品咨询
- 购物车
  - [ ] 购物车管理
  - [ ] 优惠券
  - [ ] 结算
  - [ ] 支付功能
- 订单中心
  - [ ] 我的订单
  - [ ] 退货申请
  - [ ] 收货地址
  - [ ] 我的收藏
  - [ ] 我的足迹

## 开发规范
1. 命名规范
   - 组件名：大驼峰（如：ProductList）
   - 文件名：小驼峰（如：productList）
   - 变量名：小驼峰（如：userInfo）
   - 常量：大写下划线（如：API_URL）
   - CSS类名：kebab-case（如：product-item）

2. Git提交规范
   - feat：新功能（feature）
   - fix：修复bug
   - docs：文档更新
   - style：代码格式（不影响代码运行的变动）
   - refactor：重构（既不是新增功能，也不是修改bug的代码变动）
   - test：增加测试
   - chore：构建过程或辅助工具的变动

## 环境搭建

### 开发工具

| 工具 | 说明 | 官网 |
| --- | --- | --- |
| VSCode | 开发IDE | https://code.visualstudio.com/ |
| Chrome | 浏览器 | https://www.google.com/chrome/ |
| Git | 版本管理 | https://git-scm.com/ |
| Postman | API测试 | https://www.postman.com/ |

### 开发环境

| 环境 | 版本 | 下载 |
| --- | --- | --- |
| Node.js | 16.x | https://nodejs.org/ |
| npm | 8.x | https://www.npmjs.com/ |

## 项目运行
```bash
# 克隆项目
git clone https://github.com/jacl-coder/supermall-frontend.git

# 进入项目目录
cd supermall-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产环境
npm run build

# 代码格式检查
npm run lint
```

## 注意事项
1. 遵循组件化开发原则
2. 保持代码规范统一
3. 及时进行代码审查
4. 做好版本控制
5. 编写必要的注释
6. 做好性能优化
7. 注意代码安全

## 相关链接
- [项目文档](docs/index.md)
- [开发规范](docs/standard.md)
- [常见问题](docs/faq.md)

## 许可证
[MIT](LICENSE)