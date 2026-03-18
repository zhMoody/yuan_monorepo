# Set encoding to UTF8 to avoid garbage characters
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   YuanBlog Smart Environment Starter   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$port = 27017
$projectRoot = Split-Path -Parent $PSScriptRoot
$dbPath = [System.IO.Path]::GetFullPath((Join-Path $projectRoot "../mongodb-data"))
$startedByScript = $false

# 1. Check if port 27017 is already active
$portActive = Test-NetConnection -ComputerName "127.0.0.1" -Port $port -InformationLevel Quiet

if ($portActive) {
    Write-Host "[√] MongoDB port 27017 is already active. Using existing service." -ForegroundColor Green
} else {
    Write-Host "[!] Port 27017 is not responding. Looking for solutions..." -ForegroundColor Yellow

    # 2. Try Local MongoDB
    $mongod = Get-Command "mongod" -ErrorAction SilentlyContinue
    if ($mongod) {
        Write-Host "[*] Local MongoDB found. Starting..." -ForegroundColor Cyan
        if (-not (Test-Path $dbPath)) { New-Item -ItemType Directory -Path $dbPath | Out-Null }
        $mongoProcess = Start-Process -FilePath "mongod" -ArgumentList "--dbpath `"$dbPath`" --port $port" -WindowStyle Hidden -PassThru
        $startedByScript = $true
        Start-Sleep -Seconds 3
    } else {
        # 3. Try Docker
        $docker = Get-Command "docker" -ErrorAction SilentlyContinue
        if ($docker) {
            Write-Host "[*] Local MongoDB not found, but Docker is available. Starting via Docker..." -ForegroundColor Cyan
            Set-Location -Path $projectRoot
            docker-compose up -d mongodb
            $startedByScript = $true
            Start-Sleep -Seconds 5
        } else {
            # 4. Auto-install via Scoop
            Write-Host "[!] No MongoDB or Docker found. Attempting auto-install via Scoop..." -ForegroundColor Yellow
            $scoop = Get-Command "scoop" -ErrorAction SilentlyContinue
            if (-not $scoop) {
                Write-Host "[*] Installing Scoop..." -ForegroundColor Cyan
                Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
                Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
                $env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
            }
            Write-Host "[*] Installing MongoDB via Scoop (this may take a while)..." -ForegroundColor Cyan
            scoop bucket add extras
            scoop install mongodb
            
            # Start after install
            if (-not (Test-Path $dbPath)) { New-Item -ItemType Directory -Path $dbPath | Out-Null }
            $mongoProcess = Start-Process -FilePath "mongod" -ArgumentList "--dbpath `"$dbPath`" --port $port" -WindowStyle Hidden -PassThru
            $startedByScript = $true
            Start-Sleep -Seconds 3
        }
    }
}

# 5. Start Node Service
Write-Host "[*] Starting Node.js backend service..." -ForegroundColor Cyan
Set-Location -Path $projectRoot
npm run start

# 6. Cleanup on exit
if ($startedByScript) {
    Write-Host "`n[*] Cleaning up background database process..." -ForegroundColor Cyan
    if ($docker) {
        docker-compose stop mongodb
    } elseif ($mongoProcess) {
        Stop-Process -Id $mongoProcess.Id -ErrorAction SilentlyContinue
    } else {
        Stop-Process -Name "mongod" -ErrorAction SilentlyContinue
    }
    Write-Host "[√] Done." -ForegroundColor Green
}
