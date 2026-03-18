# 第一阶段：构建阶段 (Build Stage)
FROM node:18-alpine AS build-stage
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖定义
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制源代码并构建
COPY . .
RUN pnpm run build

# 第二阶段：生产阶段 (Production Stage)
FROM nginx:stable-alpine

# 将构建好的 dist 文件夹复制到 Nginx 默认静态文件目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制 Nginx 配置文件
COPY ./Docker/nginx/nginx.conf /etc/nginx/nginx.conf

# 暴露 80 和 443 端口
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
