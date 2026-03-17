# 使用 Node.js 官方轻量级镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制项目源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "app.js"]
