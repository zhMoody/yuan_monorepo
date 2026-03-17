#!/bin/bash

# Color definitions
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}   YuanBlog Universal Unix Starter      ${NC}"
echo -e "${CYAN}========================================${NC}"

PORT=27017
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DB_PATH="$(cd "$PROJECT_ROOT/.." && pwd)/mongodb-data"
STARTED_BY_SCRIPT=false

# 0. Detect OS
OS_TYPE="$(uname)"
echo -e "[*] System Detected: ${OS_TYPE}"

# 1. Ensure Node dependencies are installed
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo -e "${YELLOW}[!] node_modules not found. Installing dependencies...${NC}"
    cd "$PROJECT_ROOT" && npm install
fi

# 2. Check if port 27017 is already active
if nc -z 127.0.0.1 $PORT 2>&1 >/dev/null; then
    echo -e "${GREEN}[√] MongoDB port $PORT is already active.${NC}"
else
    echo -e "${YELLOW}[!] Port $PORT is not responding. Looking for solutions...${NC}"

    # 3. Try Local MongoDB Command
    if command -v mongod &> /dev/null; then
        echo -e "${CYAN}[*] Local MongoDB found. Starting...${NC}"
        mkdir -p "$DB_PATH"
        mongod --dbpath "$DB_PATH" --port $PORT --fork --logpath "$DB_PATH/mongodb.log"
        STARTED_BY_SCRIPT=true
        sleep 3
    # 4. Try Docker
    elif command -v docker-compose &> /dev/null; then
        echo -e "${CYAN}[*] Local MongoDB not found, but Docker is available. Starting via Docker...${NC}"
        cd "$PROJECT_ROOT"
        docker-compose up -d mongodb
        STARTED_BY_SCRIPT=true
        sleep 5
    # 5. OS-Specific Auto-install
    else
        echo -e "${YELLOW}[!] No MongoDB or Docker found. Attempting auto-install for ${OS_TYPE}...${NC}"
        
        if [ "$OS_TYPE" == "Darwin" ]; then
            # macOS Logic
            if ! command -v brew &> /dev/null; then
                echo -e "${RED}[X] Homebrew not found. Please install Homebrew or Docker first.${NC}"
                exit 1
            fi
            echo -e "${CYAN}[*] Installing MongoDB via Homebrew...${NC}"
            brew tap mongodb/brew && brew install mongodb-community
            mongod --dbpath "$DB_PATH" --port $PORT --fork --logpath "$DB_PATH/mongodb.log"
            STARTED_BY_SCRIPT=true
        elif [ "$OS_TYPE" == "Linux" ]; then
            # Linux Logic (Detect Distro)
            if [ -f /etc/os-release ]; then
                . /etc/os-release
                OS_ID=$ID
                OS_CODENAME=$VERSION_CODENAME
                
                if [ "$OS_ID" == "debian" ] || [ "$OS_ID" == "ubuntu" ]; then
                    echo -e "${CYAN}[*] Configuring MongoDB Official Repository for $OS_ID $OS_CODENAME...${NC}"
                    sudo apt-get install -y gnupg curl
                    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
                       sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
                       --dearmor --yes
                    
                    if [ "$OS_ID" == "debian" ]; then
                        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian $OS_CODENAME/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
                    else
                        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $OS_CODENAME/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
                    fi
                    sudo apt-get update && sudo apt-get install -y mongodb-org
                    mkdir -p "$DB_PATH"
                    mongod --dbpath "$DB_PATH" --port $PORT --fork --logpath "$DB_PATH/mongodb.log"
                    STARTED_BY_SCRIPT=true
                else
                    echo -e "${RED}[X] Unsupported Linux Distro: $OS_ID. Please install MongoDB manually.${NC}"
                    exit 1
                fi
            else
                echo -e "${RED}[X] Cannot detect Linux distribution. Please install MongoDB manually.${NC}"
                exit 1
            fi
        fi
        sleep 3
    fi
fi

# 6. Cleanup on exit
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

# 7. Start Node Service
echo -e "${CYAN}[*] Starting Node.js backend service...${NC}"
cd "$PROJECT_ROOT"
npm run start
