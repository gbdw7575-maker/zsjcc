# 掌上金铲铲 一键启动脚本
# 启动顺序：MongoDB → 后端(3000) → 前端(5174)

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$FRONTEND = Join-Path $ROOT "tft-assistant"
$BACKEND = Join-Path $FRONTEND "server"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  掌上金铲铲 - 一键启动" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# 1. 检查 Node.js
Write-Host "`n[1/4] 检查 Node.js..." -ForegroundColor Green
$nodeVer = node --version 2>$null
if (-not $nodeVer) {
    Write-Host "  ERROR: 未找到 Node.js，请先安装 https://nodejs.org/" -ForegroundColor Red
    pause; exit 1
}
Write-Host "  Node $nodeVer" -ForegroundColor Gray

# 2. 尝试启动 MongoDB
Write-Host "`n[2/4] 检查 MongoDB..." -ForegroundColor Green
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoRunning) {
    $mongoPath = "C:\Program Files\MongoDB\Server\*\bin\mongod.exe"
    $mongoExe = Get-ChildItem $mongoPath -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($mongoExe) {
        Write-Host "  启动 MongoDB..." -ForegroundColor Gray
        $mongoDataDir = Join-Path $ROOT "mongo_data"
        if (-not (Test-Path $mongoDataDir)) { New-Item -ItemType Directory $mongoDataDir | Out-Null }
        Start-Process $mongoExe.FullName -ArgumentList "--dbpath", $mongoDataDir -WindowStyle Hidden
        Start-Sleep 2
        Write-Host "  MongoDB 已启动" -ForegroundColor Gray
    } elseif (Get-Command mongosh -ErrorAction SilentlyContinue) {
        Write-Host "  使用已安装的 MongoDB Shell (需自行启动 mongod)" -ForegroundColor DarkYellow
    } else {
        Write-Host "  WARN: 未检测到 MongoDB，后端将无法连接数据库" -ForegroundColor DarkYellow
    }
} else {
    Write-Host "  MongoDB 已在运行" -ForegroundColor Gray
}

# 3. 安装依赖（如需要）
Write-Host "`n[3/4] 安装依赖..." -ForegroundColor Green
if (-not (Test-Path (Join-Path $FRONTEND "node_modules"))) {
    Write-Host "  安装前端依赖..." -ForegroundColor Gray
    Set-Location $FRONTEND
    npm install | Out-Null
    Write-Host "  前端依赖安装完成" -ForegroundColor Gray
} else {
    Write-Host "  前端依赖已存在，跳过" -ForegroundColor Gray
}
if (-not (Test-Path (Join-Path $BACKEND "node_modules"))) {
    Write-Host "  安装后端依赖..." -ForegroundColor Gray
    Set-Location $BACKEND
    npm install | Out-Null
    Write-Host "  后端依赖安装完成" -ForegroundColor Gray
} else {
    Write-Host "  后端依赖已存在，跳过" -ForegroundColor Gray
}

# 4. 启动后端
Write-Host "`n[4/4] 启动服务..." -ForegroundColor Green
Set-Location $BACKEND
$backendJob = Start-Job -Name "tft-backend" -ArgumentList $BACKEND -ScriptBlock {
    param($dir)
    Set-Location $dir
    node server.js 2>&1
}
Write-Host "  后端服务启动中 (端口 3000)..." -ForegroundColor Gray
Start-Sleep 3

# 检查后端是否正常启动
$backendSocket = netstat -ano | Select-String ":3000.*LISTENING"
if ($backendSocket) {
    Write-Host "  后端服务已就绪" -ForegroundColor Green
} else {
    Write-Host "  WARN: 后端可能启动失败，请检查 MongoDB 是否运行" -ForegroundColor DarkYellow
}

# 5. 启动前端
Set-Location $FRONTEND
Write-Host "  启动前端开发服务器 (端口 5174)..." -ForegroundColor Gray
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FRONTEND'; npx vite --port 5174 --strictPort" -PassThru
Start-Sleep 4

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  服务已启动！" -ForegroundColor Yellow
Write-Host "  前端: http://localhost:5174" -ForegroundColor White
Write-Host "  后端: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "  按任意键打开浏览器..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:5174"

Write-Host "`n关闭此窗口将停止后端服务" -ForegroundColor DarkYellow
Write-Host "前端窗口需手动关闭" -ForegroundColor DarkYellow
pause

# 清理
Write-Host "正在停止后端服务..." -ForegroundColor Gray
Stop-Job -Name "tft-backend" -ErrorAction SilentlyContinue
Remove-Job -Name "tft-backend" -ErrorAction SilentlyContinue -Force
Write-Host "已停止" -ForegroundColor Gray
