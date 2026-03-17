#!/bin/bash

# Color definitions
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   YuanBlog Smart Environment Starter   ${NC}"
echo -e "${CYAN}========================================${NC}"

PORT=27017
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_PATH="$(cd "$PROJECT_ROOT/.." && pwd)/mongodb-data"
STARTED_BY_SCRIPT=false

# 0. 检查并安装 Node 依赖
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo -e "${YELLOW}[!] node_modules not found. Running npm install...${NC}"
    cd "$PROJECT_ROOT" && npm install
fi

# 1. 检查 27017 端口
if nc -z 127.0.0.1 $PORT 2>&1 >/dev/null; then
    echo -e "${GREEN}[√] MongoDB port $PORT is already active.${NC}"
else
    echo -e "${YELLOW}[!] Port $PORT is not responding. Looking for solutions...${NC}"

    # 2. 尝试本地启动
    if command -v mongod &> /dev/null; then
        echo -e "${CYAN}[*] Starting local MongoDB...${NC}"
        mkdir -p "$DB_PATH"
        mongod --dbpath "$DB_PATH" --port $PORT --fork --logpath "$DB_PATH/mongodb.log"
        STARTED_BY_SCRIPT=true
        sleep 3
    # 3. 自动安装 (适配 Debian 12 / Ubuntu)
    else
        echo -e "${YELLOW}[!] No MongoDB found. Attempting auto-install...${NC}"
        # 获取系统 ID 和代号
        ID=$(grep -E '^ID=' /etc/os-release | cut -d'=' -f2 | tr -d '"')
        CODENAME=$(grep -E '^VERSION_CODENAME=' /etc/os-release | cut -d'=' -f2 | tr -d '"')

        echo -e "${CYAN}[*] Detected: $ID ($CODENAME)${NC}"
        sudo apt-get install -y gnupg curl

        # 导入密钥
        curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
           sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor --yes

        # 根据系统 ID 选择正确的源
        if [ "$ID" == "debian" ]; then
            echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian $CODENAME/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        else
            echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $CODENAME/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        fi

        sudo apt-get update && sudo apt-get install -y mongodb-org
        mkdir -p "$DB_PATH"
        mongod --dbpath "$DB_PATH" --port $PORT --fork --logpath "$DB_PATH/mongodb.log"
        STARTED_BY_SCRIPT=true
        sleep 3
    fi
fi

# 4. 设置退出清理
cleanup() {
    if [ "$STARTED_BY_SCRIPT" = true ]; then
        echo -e "\n${CYAN}[*] Cleaning up...${NC}"
        pkill -x mongod
    fi
    exit
}
trap cleanup SIGINT SIGTERM

# 5. 启动 Node 服务
echo -e "${CYAN}[*] Starting Node.js service...${NC}"
cd "$PROJECT_ROOT"
npm run start
