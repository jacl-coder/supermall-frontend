# Git 使用指南

## 1. 首次使用配置

### 1.1 安装 Git
1. 下载 Git：https://git-scm.com/downloads
2. 安装时全部默认选项即可

### 1.2 配置 Git
```bash
# 设置用户名
git config --global user.name "你的名字"

# 设置邮箱
git config --global user.email "你的邮箱@example.com"
```

### 1.3 克隆项目
```bash
# 克隆项目到本地
git clone https://github.com/jacl-coder/supermall-frontend.git

# 进入项目目录
cd supermall-frontend
```

## 2. 日常开发流程

### 2.1 获取最新代码
```bash
# 切换到主分支
git checkout main

# 拉取最新代码
git pull
```

### 2.2 创建自己的分支
```bash
# 创建并切换到新分支（将 xxx 替换为你的功能名）
git checkout -b feature/xxx
```

### 2.3 提交代码
```bash
# 查看修改的文件
git status

# 添加修改的文件到暂存区
git add .

# 提交代码
git commit -m "feat: 添加xxx功能"
```

### 2.4 推送到远程
```bash
# 推送到远程仓库
git push origin feature/xxx
```

### 2.5 创建合并请求
1. 打开 GitHub 项目页面
2. 点击 "Pull requests" 标签
3. 点击 "New pull request" 按钮
4. 选择你的分支合并到 main 分支
5. 填写描述并创建合并请求

## 3. 常用命令说明

### 3.1 分支操作
```bash
# 查看所有分支
git branch

# 切换分支
git checkout 分支名

# 创建并切换分支
git checkout -b 新分支名

# 删除分支
git branch -d 分支名
```

### 3.2 代码提交
```bash
# 查看修改
git status

# 添加文件
git add 文件名
git add .  # 添加所有文件

# 提交代码
git commit -m "提交说明"
```

### 3.3 远程操作
```bash
# 拉取最新代码
git pull

# 推送代码
git push origin 分支名
```

## 4. 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构代码
- test: 测试相关
- chore: 构建/工具相关

## 5. 注意事项
1. 每天开始工作前先拉取最新代码
2. 经常提交代码，避免积累太多修改
3. 提交前先在本地测试
4. 遇到冲突及时沟通
5. 重要修改先讨论再动手

## 6. 常见问题

### 6.1 合并冲突
如果遇到冲突：
1. 先保存自己的修改
2. 拉取最新代码
3. 解决冲突
4. 重新提交

### 6.2 撤销修改
```bash
# 撤销未暂存的修改
git checkout -- 文件名

# 撤销已暂存的修改
git reset HEAD 文件名

# 撤销提交
git reset --soft HEAD^
```

### 6.3 查看历史
```bash
# 查看提交历史
git log

# 查看某个文件的修改历史
git log -p 文件名
```

## 7. 获取帮助
- 遇到问题先问组长
- 查看 Git 官方文档：https://git-scm.com/doc
- 使用 `git help 命令` 查看命令帮助 