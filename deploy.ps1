# =====================================================================
# Yuan 一键部署脚本 (Windows)
# =====================================================================

$ErrorActionPreference = "Stop"

function Write-Color($Text, $Color) {
    Write-Host $Text -ForegroundColor $Color
}

Write-Color "=== 开始部署 Yuan 项目 ===" "Cyan"

# 1. 环境预检：检查 Docker 和 Docker Compose
Write-Color "`n[1/3] 环境预检..." "Yellow"

if (!(Get-Command "docker" -ErrorAction SilentlyContinue)) {
    Write-Color "❌ 错误: 未检测到 Docker。" "Red"
    Write-Color "请先安装 Docker Desktop: https://www.docker.com/products/docker-desktop/" "Red"
    exit 1
}

if (!(Get-Command "docker-compose" -ErrorAction SilentlyContinue)) {
    Write-Color "❌ 错误: 未检测到 docker-compose。" "Red"
    exit 1
}

Write-Color "✅ Docker 环境正常。" "Green"

# 2. SSL 证书准备
Write-Color "`n[2/3] 准备 SSL 证书..." "Yellow"
if (!(Test-Path "ssl")) {
    New-Item -ItemType Directory -Path "ssl" | Out-Null
}

$CERT_PATH = "ssl/server.crt"
$KEY_PATH = "ssl/server.key"

if (!(Test-Path $CERT_PATH)) {
    Write-Color "未检测到 SSL 证书，正在尝试生成自签名证书..." "Cyan"
    if (Get-Command "openssl" -ErrorAction SilentlyContinue) {
        try {
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
                -keyout $KEY_PATH -out $CERT_PATH `
                -subj "/C=CN/ST=GD/L=SZ/O=Yuan/OU=Dev/CN=localhost" 2>$null
            Write-Color "✅ 自签名证书生成成功！" "Green"
        } catch {
            Write-Color "❌ 生成证书失败。" "Red"
        }
    } else {
        Write-Color "⚠️ 未检测到 openssl，无法自动生成证书。" "Red"
        exit 1
    }
} else {
    Write-Color "✅ 已检测到 SSL 证书。" "Green"
}

# 3. 启动容器
Write-Color "`n[3/3] 开始构建并启动容器服务..." "Yellow"
try {
    docker-compose up -d --build
    Write-Color "`n=========================================" "Green"
    Write-Color "🎉 部署完成！" "Green"
    Write-Color "访问地址: https://localhost" "Cyan"
    Write-Color "=========================================" "Green"
} catch {
    Write-Color "❌ 容器启动失败。" "Red"
    exit 1
}
