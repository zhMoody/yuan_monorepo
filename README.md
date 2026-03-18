# Yuan Blog

Yuan 是一个基于 **Vue 3 (Vite + TS)** 和 **Koa 2 (Node.js)** 构建的全栈系统。项目采用前后端分离架构，通过容器化技术（Docker）实现安全、稳定、极速的部署。

---

## 🚀 快速开始

### 1. 本地开发环境
- **前端**: 进入 `yuan` 目录，执行 `pnpm install` -> `pnpm run dev`。
- **后端**: 进入 `yuan-server` 目录，执行 `npm install` -> `npm run dev`。
- **数据库**: 确保本地运行 MongoDB（27017 端口）。

### 2. 打包部署包 (生产环境分发)
在项目根目录运行以下命令，将自动完成前后端编译、代码混淆、运维脚本生成并打包：
```bash
node pack.js
```
执行完毕后，根目录会生成 `yuan_deploy.zip`。

---

## 🛠️ 部署与更新流程

### 首次部署
**Linux**: 进入解压后的目录执行 `bash start.sh`。
   - 脚本会自动检查 Docker 环境，若缺失则尝试自动安装。
   - 自动生成自签名 SSL 证书。
   - 动态生成 RSA 安全密钥对。

### 后续更新 (如何发布新功能)
当您修改了前端或后端代码需要更新到服务器时：
1. **本地**: 重新运行 `node pack.js` 生成新的 `yuan_deploy.zip`。
2. **上传**: 将新压缩包上传至服务器覆盖旧文件。
3. **解压**: `unzip -o yuan_deploy.zip` 强制覆盖原有代码,保留数据。
4. **执行**: 再次进入目录运行 `bash start.sh` (Linux)。
   - Docker 会检测镜像变化并自动执行增量构建。
   - **注意**: 重新部署不会丢失数据库数据（存放在 `mongodb-data/`）和安全密钥（存放在 `config/`）。

---

## 🐳 Docker 常用运维命令

部署成功后，您可以使用以下命令管理服务(在解压目录下)：

### 1. 查看运行状态
```bash
# 查看所有容器是否正常运行 (Up 状态)
docker ps

# 查看容器资源占用 (CPU/内存)
docker stats
```

### 2. 查看日志 (排查问题核心命令)
```bash
# 查看所有服务的实时合并日志
docker compose logs -f

# 仅查看后端接口日志
docker compose logs -f backend

# 仅查看前端 Nginx 日志
docker compose logs -f frontend
```

### 3. 重启与停止
```bash
# 重启所有服务
docker compose restart

# 停止并移除容器 (数据不会丢失，因为已挂载 Volumes)
docker compose down

# 启动已存在的容器
docker compose up -d
```

### 4. 进入容器内部 (高级运维)
```bash
# 进入后端容器查看文件或调试
docker exec -it yuan-backend sh

# 进入数据库命令行
docker exec -it yuan-mongodb mongo
```

---

## 🔒 安全说明
- **RSA 密钥**: 系统在首次启动时自动生成密钥。私钥存储在服务器本地 `config/private_key.pem`，**切勿泄露**。
- **SSL 证书**: 默认生成自签名证书。如需使用已购买证书，请将正式证书替换至 `ssl/server.crt` 和 `ssl/server.key` 并重启服务。

## 📝 更多文档
- **前端详细说明**: [yuan/README.md](./yuan_blog/README.md)
- **后端详细说明**: [yuan-server/README.md](./yuan_blog_server/README.md)
