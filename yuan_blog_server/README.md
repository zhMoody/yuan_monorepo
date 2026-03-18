用户管理
    注册 登录 获取用户信息
分类管理
    分类的CRUD
文章管理
    1个分类下面有N个文章   1个文章属于某个分类
    文章的CRUD
评论管理
    评论的CRUD  评论是针对某一个文章
回复管理
    回复的CRUD  回复是针对某一个评论
广告管理
    广告的CRUD

技术栈：
    node.js
    koa
    mongodb
    mongoose
    postman

依赖：
    bcrypt  对数据进行加密码的  加盐
        下载bcrypt时，下载容易失败，npm i node-gyp -g 全局安装  下载比较慢
    jsonwebtoken JSON WEB令牌实现

## 常用指令

- `npm run dev`：使用 nodemon 在开发模式下启动。
- `npm run build`：生产环境打包，自动清理旧目录并对源码进行混淆处理，输出到 `dist` 目录。
- `npm run start`：生产环境下直接运行入口文件。

### Linux 生产环境推荐指令 (PM2)
若已安装 PM2，可以使用以下指令实现后台持久运行：
- `npm run pm2:start`：以后台服务模式启动。
- `npm run pm2:stop`：停止后台服务。
- `npm run pm2:log`：查看实时运行日志。

## 快速启动 (一键部署方案)

本项目提供了两种一键启动和自动部署后端环境（包含数据库）的方案，数据库数据默认会存储在项目同级的 `../mongodb-data` 目录中。

### 方案: 使用原生脚本启动 (推荐无 Docker 用户)

这些脚本会自动检查环境：如果没有安装 MongoDB，它会尝试自动安装；如果已安装，则直接启动服务并连接数据库。

#### Windows 用户
```bash
npm run dev:win
```

#### macOS / Linux 用户
```bash
npm run dev:unix
```
*(注意：运行结束后按 `Ctrl+C` 退出，脚本会自动将后台数据库服务一起关闭)*

### 方案 B: 使用 Docker Compose (跨平台推荐)

项目已集成 Docker Compose，可以一键启动数据库和后端服务。

#### 前提条件
- 已安装 [Docker](https://www.docker.com/products/docker-desktop/) 和 [Docker Compose](https://docs.docker.com/compose/install/)。

#### 启动步骤
1. 在项目根目录下打开终端。
2. 执行以下命令：
   ```bash
   docker-compose up -d
   ```
3. 启动完成后：
   - 后端服务运行在：`http://localhost:3000`
   - MongoDB 运行在：`localhost:27017`

#### 停止服务
```bash
docker-compose down
```

## 默认管理员账号
系统启动后，若检测到管理员表为空，会自动创建默认管理员：
- **账号**: `admin`
- **密码**: `admin`

----------------------------

exception:
    异常  处理异常




----------------------------
