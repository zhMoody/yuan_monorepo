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

# 1. Check if port 27017 is already active
if nc -z 127.0.0.1 $PORT 2>&1 >/dev/null; then
    echo -e "${GREEN}[√] MongoDB port $PORT is already active. Using existing service.${NC}"
else
    echo -e "${YELLOW}[!] Port $PORT is not responding. Looking for solutions...${NC}"

    # 2. Try Local MongoDB
    if command -v mongod &> /dev/null; then
        echo -e "${CYAN}[*] Local MongoDB found. Starting...${NC}"
        mkdir -p "$DB_PATH"
        mongod --dbpath "$DB_PATH" --port $PORT --fork --logpath "$DB_PATH/mongodb.log"
        STARTED_BY_SCRIPT=true
        sleep 3
    # 3. Try Docker
    elif command -v docker-compose &> /dev/null; then
        echo -e "${CYAN}[*] Local MongoDB not found, but Docker is available. Starting via Docker...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose up -d mongodb
        STARTED_BY_SCRIPT=true
        sleep 5
    # 4. Auto-install
    else
        echo -e "${YELLOW}[!] No MongoDB or Docker found. Attempting auto-install...${NC}"
        OS_TYPE="$(uname)"
        if [ "$OS_TYPE" == "Darwin" ]; then
            if ! command -v brew &> /dev/null; then
                echo -e "${RED}[X] Cannot auto-install. Please install Homebrew or Docker first.${NC}"
                exit 1
            fi
            echo -e "${CYAN}[*] Installing MongoDB via Homebrew...${NC}"
            brew tap mongodb/brew && brew install mongodb-community
            mkdir -p "$DB_PATH"
            mongod --dbpath "$DB_PATH" --port $PORT --fork --logpath "$DB_PATH/mongodb.log"
            STARTED_BY_SCRIPT=true
        elif [ "$OS_TYPE" == "Linux" ] && command -v apt-get &> /dev/null; then
            echo -e "${CYAN}[*] Installing MongoDB via apt-get...${NC}"
            sudo apt-get update && sudo apt-get install -y mongodb
            mkdir -p "$DB_PATH"
            mongod --dbpath "$DB_PATH" --port $PORT --fork --logpath "$DB_PATH/mongodb.log"
            STARTED_BY_SCRIPT=true
        else
            echo -e "${RED}[X] Auto-install failed. Please manually install MongoDB or Docker.${NC}"
            exit 1
        fi
    fi
fi

# 5. Cleanup on exit
cleanup() {
    if [ "$STARTED_BY_SCRIPT" = true ]; then
        echo -e "\n${CYAN}[*] Cleaning up background database process...${NC}"
        if command -v docker-compose &> /dev/null && [ "$(docker ps -q -f name=yuan-mongodb)" ]; then
            cd "$PROJECT_ROOT" && docker-compose stop mongodb
        else
            pkill -x mongod
        fi
    fi
    echo -e "${GREEN}[√] Done.${NC}"
    exit
}
trap cleanup SIGINT SIGTERM

# 6. Start Node Service
echo -e "${CYAN}[*] Starting Node.js backend service...${NC}"
cd "$PROJECT_ROOT"
npm run start
