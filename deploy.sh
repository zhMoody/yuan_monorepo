#!/bin/bash

# =====================================================================
# Yuan 一键部署脚本 (Linux/macOS)
# =====================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}=== 开始部署 Yuan 项目 ===${NC}"

# 1. 环境预检
echo -e "\n${YELLOW}[1/3] 环境预检...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到 docker。${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到 docker-compose。${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker 环境正常。${NC}"

# 2. SSL 证书准备
echo -e "\n${YELLOW}[2/3] 准备 SSL 证书...${NC}"
mkdir -p ssl
CERT_PATH="./ssl/server.crt"
KEY_PATH="./ssl/server.key"

if [ ! -f "$CERT_PATH" ]; then
    echo -e "${CYAN}正在生成自签名证书...${NC}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$KEY_PATH" -out "$CERT_PATH" \
        -subj "/C=CN/ST=GD/L=SZ/O=Yuan/OU=Dev/CN=localhost" &> /dev/null
    echo -e "${GREEN}✅ 自签名证书生成成功！${NC}"
fi

# 3. 启动容器
echo -e "\n${YELLOW}[3/3] 开始构建并启动容器服务...${NC}"
if docker-compose up -d --build; then
    echo -e "\n${GREEN}🎉 部署完成！访问地址: https://服务器IP${NC}"
else
    echo -e "${RED}❌ 容器启动失败。${NC}"
    exit 1
fi
