const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const deployDir = path.join(rootDir, 'yuan_deploy_temp');
const targetName = 'yuan'; // 最终在服务器上的文件夹名
const targetDir = path.join(deployDir, targetName);

function runCommand(command, cwd) {
    console.log(`\n[执行] ${command}`);
    try {
        execSync(command, { cwd, stdio: 'inherit' });
    } catch (e) {
        console.error(`❌ 命令执行失败: ${command}`);
        process.exit(1);
    }
}

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isFile()) fs.copyFileSync(fromPath, toPath);
        else copyFolderSync(fromPath, toPath);
    });
}

console.log('=============================================');
console.log('      🚀 Yuan Blog 本地一键打包工具         ');
console.log('=============================================');

// 1. 清理旧数据
if (fs.existsSync(deployDir)) fs.rmSync(deployDir, { recursive: true, force: true });
if (fs.existsSync('yuan_deploy.zip')) fs.unlinkSync('yuan_deploy.zip');
fs.mkdirSync(targetDir, { recursive: true });

// 2. 前端打包 (Vue)
console.log('\n>> 正在本地编译前端...');
const frontendDir = path.join(rootDir, 'yuan_blog');
runCommand('pnpm install', frontendDir);
runCommand('pnpm run build', frontendDir);

// 3. 后端打包 (Koa)
console.log('\n>> 正在本地编译后端...');
const backendDir = path.join(rootDir, 'yuan_blog_server');
runCommand('npm install', backendDir);
runCommand('npm run build', backendDir);


// 4. 组装部署文件夹
console.log('\n>> 正在组装部署包内容...');
copyFolderSync(path.join(frontendDir, 'dist'), path.join(targetDir, 'frontend_dist'));

// 修正：完整拷贝后端编译产物 (包括混淆后的 app.js 和 config 文件夹)
if (fs.existsSync(path.join(backendDir, 'dist'))) {
    copyFolderSync(path.join(backendDir, 'dist'), path.join(targetDir, 'backend_dist'));
} else {
    console.error('❌ 错误: 未找到后端编译产物 dist 目录');
    process.exit(1);
}

// 创建必要的运行目录（用于存放运行时生成的私钥和配置文件）
const runConfigDir = path.join(targetDir, 'config');
if (!fs.existsSync(runConfigDir)) fs.mkdirSync(runConfigDir, { recursive: true });

// 拷贝默认配置文件到部署包的 config 目录
const defaultConfigSrc = path.join(backendDir, 'config', 'index.js');
if (fs.existsSync(defaultConfigSrc)) {
    fs.copyFileSync(defaultConfigSrc, path.join(runConfigDir, 'index.js'));
    console.log('✅ 已拷贝默认配置文件 index.js');
} else {
    // 尝试从 dist 目录找
    const distConfigSrc = path.join(backendDir, 'dist', 'config', 'index.js');
    if (fs.existsSync(distConfigSrc)) {
        fs.copyFileSync(distConfigSrc, path.join(runConfigDir, 'index.js'));
        console.log('✅ 已从编译产物中拷贝 index.js');
    }
}

// 仅拷贝证书等静态辅助文件（如果源码根目录有的话）
const certFiles = ['ca-cert.pem'];
certFiles.forEach(file => {
    const src = path.join(backendDir, file);
    if (fs.existsSync(src)) {
        // 拷贝到 backend_dist 下供程序读取，同时也备份一份
        fs.copyFileSync(src, path.join(targetDir, 'backend_dist', file));
    }
});

const lockFile = path.join(backendDir, 'package-lock.json');
if (fs.existsSync(lockFile)) {
    fs.copyFileSync(lockFile, path.join(targetDir, 'backend_dist', 'package-lock.json'));
}

// 5. 写入 Docker 和 Nginx 配置文件
const composeContent = `version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: yuan-mongodb
    ports: ["27017:27017"]
    volumes: ["./mongodb-data:/data/db"]
    restart: always
  backend:
    build: { context: ., dockerfile: backend.Dockerfile }
    container_name: yuan-backend
    environment: [DB_HOST=mongodb, DB_PORT=27017, DB_NAME=yuanblog, PORT=3000]
    depends_on: [mongodb]
    restart: always
    volumes: ["./config:/app/config"] # 挂载 config 目录，持久化生成的密钥
  frontend:
    build: { context: ., dockerfile: frontend.Dockerfile }
    container_name: yuan-frontend
    ports: ["80:80", "443:443"]
    volumes: ["./ssl:/etc/nginx/ssl"]
    depends_on: [backend]
    restart: always`;

const fDocker = `FROM nginx:stable-alpine\nCOPY frontend_dist /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/nginx.conf\nEXPOSE 80 443\nCMD ["nginx", "-g", "daemon off;"]`;
const bDocker = `FROM node:16-alpine\nWORKDIR /app\nCOPY backend_dist ./\nRUN npm install --production\nEXPOSE 3000\nCMD ["node", "app.js"]`;

const nginxConf = `user nginx;
worker_processes auto;
events { worker_connections 1024; }
http {
    include /etc/nginx/mime.types;
    gzip on;
    server {
        listen 80;
        return 301 https://$host$request_uri;
    }
    server {
        listen 443 ssl;
        ssl_certificate /etc/nginx/ssl/server.crt;
        ssl_certificate_key /etc/nginx/ssl/server.key;
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }
        location /api/ {
            # 末尾的斜杠很关键，用于剥离 /api/ 前缀
            proxy_pass http://backend:3000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}`;

const startSh = `#!/bin/bash
set -e

# 颜色定义
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m'

echo -e "\${CYAN}>> [1/4] 检查并安装环境...\${NC}"

# 1. 自动检测并安装 Docker
if ! command -v docker &> /dev/null; then
    echo -e "\${YELLOW}未检测到 Docker，正在尝试自动安装...\${NC}"
    curl -fsSL https://get.docker.com | bash -s docker
    systemctl start docker
    systemctl enable docker
fi

# 确保 docker compose 命令可用
DOCKER_COMPOSE="docker compose"
if ! docker compose version &> /dev/null; then
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    else
        echo -e "\${RED}❌ 错误: 未检测到 docker compose 插件，请手动安装。\${NC}"
        exit 1
    fi
fi

# 2. 准备目录与 SSL 证书
echo -e "\\n\${CYAN}>> [2/4] 准备部署环境...\${NC}"
mkdir -p mongodb-data ssl config

# 自动恢复 index.js 配置文件（如果缺失）
if [ ! -f "config/index.js" ]; then
    if [ -f "backend_dist/config/index.js" ]; then
        cp backend_dist/config/index.js config/index.js
        echo -e "\${GREEN}✅ 配置文件已从备份恢复。\${NC}"
    fi
fi

# 如果没有 RSA 密钥，生成密钥 (确保后端启动不崩溃)
if [ ! -f "config/private_key.pem" ]; then
    echo -e "\${YELLOW}正在生成 RSA 密钥对...\${NC}"
    openssl genrsa -out config/private_key.pem 2048 &> /dev/null
    openssl rsa -in config/private_key.pem -pubout -out config/public_key.pem &> /dev/null
    echo -e "\${GREEN}✅ RSA 密钥已生成。\${NC}"
fi

# 如果没有 SSL 证书，生成临时自签名证书 (前端 RSA 加密需要 HTTPS 安全上下文)
CERT_PATH="ssl/server.crt"
KEY_PATH="ssl/server.key"
if [ ! -f "\$CERT_PATH" ]; then
    echo -e "\${YELLOW}未检测到 SSL 证书，正在生成临时自签名证书...\${NC}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
        -keyout "\$KEY_PATH" -out "\$CERT_PATH" \\
        -subj "/C=CN/ST=GD/L=SZ/O=Yuan/OU=Dev/CN=localhost" &> /dev/null
    echo -e "\${GREEN}✅ 证书已生成。\${NC}"
fi

# 3. 启动容器服务
echo -e "\\n\${CYAN}>> [3/4] 启动 Docker 容器服务...\${NC}"
\$DOCKER_COMPOSE up -d --build

# 4. 获取公网 IP 并在最后展示
echo -e "\\n\${CYAN}>> [4/4] 部署完成！\${NC}"
PUBLIC_IP=\$(curl -s ifconfig.me || curl -s icanhazip.com || echo "您的服务器IP")

echo -e "\${GREEN}=========================================\${NC}"
echo -e "\${GREEN}🎉 Yuan 项目已成功部署并运行！\${NC}"
echo -e "\${GREEN}=========================================\${NC}"
echo -e "\${CYAN}访问地址:\${NC}"
echo -e "HTTPS: https://\$PUBLIC_IP"
echo -e "HTTP (自动跳转): http://\$PUBLIC_IP"
echo -e "\\n\${YELLOW}重要提示:\${NC}"
echo -e "1. 为了保障 RSA 加密正常运行，系统强制使用 HTTPS。\${NC}"
echo -e "2. 首次访问请在浏览器点击 '高级' -> '继续前往'（接受自签名证书）。\${NC}"
echo -e "3. 密码解密失败通常是由于密钥不一致或非 HTTPS 环境导致，请优先确认地址栏为 HTTPS。\${NC}"
echo -e "4. 如需查看运行日志，请使用命令: \$DOCKER_COMPOSE logs -f\${NC}"
echo -e "\${GREEN}=========================================\${NC}"`;

fs.writeFileSync(path.join(targetDir, 'docker-compose.yml'), composeContent);
fs.writeFileSync(path.join(targetDir, 'frontend.Dockerfile'), fDocker);
fs.writeFileSync(path.join(targetDir, 'backend.Dockerfile'), bDocker);
fs.writeFileSync(path.join(targetDir, 'nginx.conf'), nginxConf);
fs.writeFileSync(path.join(targetDir, 'start.sh'), startSh);

// 6. 自动压缩
console.log('\n>> 正在生成压缩包 yuan_deploy.zip ...');
if (process.platform === 'win32') {
    runCommand(`powershell Compress-Archive -Path ${targetDir} -DestinationPath yuan_deploy.zip -Force`, rootDir);
} else {
    runCommand(`zip -r yuan_deploy.zip ${targetName}`, deployDir);
    fs.renameSync(path.join(deployDir, 'yuan_deploy.zip'), path.join(rootDir, 'yuan_deploy.zip'));
}

// 7. 清理临时文件夹
console.log('\n>> 正在清理临时文件...');
if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
}

console.log('\n=============================================');
console.log('✅ 打包完成！');
console.log('---------------------------------------------');
console.log('1. 请将本地生成的 "yuan_deploy.zip" 上传到服务器。');
console.log('2. 服务器上运行: unzip -o yuan_deploy.zip');
console.log('3. 进入目录运行: cd yuan && bash start.sh');
console.log('=============================================');
