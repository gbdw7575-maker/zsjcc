# 掌上金铲铲 一键启动脚本
# 启动顺序：MongoDB → 后端(3000) → 前端(5174)
# Node 运行时发现顺序：PATH 中的 node → 注册表 Node.js 安装路径 → Trae 内置 Electron

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$FRONTEND = Join-Path $ROOT "tft-assistant"
$BACKEND = Join-Path $FRONTEND "server"

function Resolve-NodeRuntime {
    # 1. PATH 中的 node
    $cmd = Get-Command node -ErrorAction SilentlyContinue
    if ($cmd) { return @{ File = $cmd.Source; AsNode = $false } }

    # 2. 注册表 Node.js InstallPath
    $reg = Get-ItemProperty "HKLM:\SOFTWARE\Node.js" -ErrorAction SilentlyContinue
    if ($reg -and $reg.InstallPath) {
        $candidate = Join-Path $reg.InstallPath "node.exe"
        if (Test-Path $candidate) { return @{ File = $candidate; AsNode = $false } }
    }

    # 3. Trae / Trae CN 的 Electron（设置 ELECTRON_RUN_AS_NODE=1 即为 Node 运行时）
    $electronCandidates = @(
        "D:\Trae CN\Trae CN.exe",
        "D:\Trae\Trae.exe",
        (Join-Path $env:LOCALAPPDATA "Programs\Trae CN\Trae CN.exe"),
        (Join-Path $env:LOCALAPPDATA "Programs\Trae\Trae.exe")
    )
    foreach ($c in $electronCandidates) {
        if (Test-Path $c) { return @{ File = $c; AsNode = $true } }
    }
    return $null
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  掌上金铲铲 - 一键启动" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# 1. 发现 Node 运行时
Write-Host "`n[1/4] 检查 Node.js 运行时..." -ForegroundColor Green
$runtime = Resolve-NodeRuntime
if (-not $runtime) {
    Write-Host "  ERROR: 未找到 Node.js，请安装 https://nodejs.org/" -ForegroundColor Red
    Read-Host "按回车退出"; exit 1
}
if ($runtime.AsNode) {
    Write-Host "  使用 Trae Electron 内置 Node: $($runtime.File)" -ForegroundColor Gray
} else {
    Write-Host "  Node: $($runtime.File)" -ForegroundColor Gray
}

# 在独立窗口中启动服务（窗口关闭才停止对应服务）
function Start-ServiceWindow {
    param($Title, $WorkDir, $Arguments)
    if ($runtime.AsNode) {
        $inner = "set ELECTRON_RUN_AS_NODE=1 && `"$($runtime.File)`" $Arguments"
    } else {
        $inner = "`"$($runtime.File)`" $Arguments"
    }
    Start-Process cmd -ArgumentList "/k", $inner -WorkingDirectory $WorkDir | Out-Null
}

# 2. 检查 / 启动 MongoDB
Write-Host "`n[2/4] 检查 MongoDB..." -ForegroundColor Green
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "  MongoDB 已在运行" -ForegroundColor Gray
} else {
    $mongoExe = Get-ChildItem "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($mongoExe) {
        Write-Host "  启动 MongoDB..." -ForegroundColor Gray
        $mongoDataDir = Join-Path $ROOT "mongo_data"
        if (-not (Test-Path $mongoDataDir)) { New-Item -ItemType Directory $mongoDataDir | Out-Null }
        Start-Process $mongoExe.FullName -ArgumentList "--dbpath", $mongoDataDir -WindowStyle Hidden
        Start-Sleep 2
        Write-Host "  MongoDB 已启动" -ForegroundColor Gray
    } else {
        Write-Host "  WARN: 未检测到 MongoDB，后端将无法连接数据库" -ForegroundColor DarkYellow
    }
}

# 3. 检查依赖
Write-Host "`n[3/4] 检查依赖..." -ForegroundColor Green
if ((Test-Path (Join-Path $FRONTEND "node_modules")) -and (Test-Path (Join-Path $BACKEND "node_modules"))) {
    Write-Host "  前后端依赖均已安装，跳过" -ForegroundColor Gray
} else {
    Write-Host "  WARN: 存在未安装的依赖，请先在对应目录执行 npm install" -ForegroundColor DarkYellow
    Write-Host "        (当前环境未发现 npm 时无法自动安装)" -ForegroundColor DarkYellow
}

# 4. 启动后端与前端（均为独立窗口，互不影响）
Write-Host "`n[4/4] 启动服务..." -ForegroundColor Green

$backendPort = netstat -ano | Select-String ":3000 .*LISTENING"
if ($backendPort) {
    Write-Host "  端口 3000 已被占用，后端可能已在运行，跳过" -ForegroundColor DarkYellow
} else {
    Write-Host "  启动后端 (端口 3000)..." -ForegroundColor Gray
    Start-ServiceWindow -Title "Backend" -WorkDir $BACKEND -Arguments "server.js"
    Start-Sleep 5
    if (netstat -ano | Select-String ":3000 .*LISTENING") {
        Write-Host "  后端已就绪" -ForegroundColor Green
    } else {
        Write-Host "  WARN: 后端未监听 3000，请查看 Backend 窗口日志" -ForegroundColor DarkYellow
    }
}

$frontendPort = netstat -ano | Select-String ":5174 .*LISTENING"
if ($frontendPort) {
    Write-Host "  端口 5174 已被占用，前端可能已在运行，跳过" -ForegroundColor DarkYellow
} else {
    Write-Host "  启动前端 (端口 5174)..." -ForegroundColor Gray
    Start-ServiceWindow -Title "Frontend" -WorkDir $FRONTEND -Arguments "node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5174 --strictPort"
    Start-Sleep 6
    if (netstat -ano | Select-String ":5174 .*LISTENING") {
        Write-Host "  前端已就绪" -ForegroundColor Green
    } else {
        Write-Host "  WARN: 前端未监听 5174，请查看 Frontend 窗口日志" -ForegroundColor DarkYellow
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  服务已启动！" -ForegroundColor Yellow
Write-Host "  前端: http://localhost:5174" -ForegroundColor White
Write-Host "  后端: http://localhost:3000" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  关闭 Backend / Frontend 窗口即可停止对应服务" -ForegroundColor DarkYellow

Start-Process "http://localhost:5174"
Read-Host "`n按回车关闭本启动器（不影响已启动的服务）"
