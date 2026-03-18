# 使用 Node.js 16 官方镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package*.json ./
# 如果有 pnpm-lock.yaml 也可以复制
# COPY pnpm-lock.yaml ./

# 安装依赖 (生产环境)
RUN npm install --production

# 复制项目源代码
COPY . .

# 环境变量默认值 (可以通过 docker-compose 覆盖)
ENV DB_HOST=mongodb
ENV DB_PORT=27017
ENV DB_NAME=yuanblog
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "app.js"]
