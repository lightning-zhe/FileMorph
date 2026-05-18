@echo off
chcp 65001 >nul
title FileMorph

echo ========================================
echo   FileMorph - 文件格式转换工具
echo ========================================
echo.

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

:: Check prerequisites
where python >/dev/null 2>&1 || (echo [错误] 未找到 Python & pause & exit /b 1)
where node >/dev/null 2>&1 || (echo [错误] 未找到 Node.js & pause & exit /b 1)

python -c "import uvicorn" >/dev/null 2>&1 || (
    echo [提示] 正在安装后端依赖...
    python -m pip install -r "%ROOT%ackendequirements.txt" -q
)

if not exist "%ROOT%rontend
ode_modules" (
    echo [提示] 正在安装前端依赖...
    cd /d "%ROOT%rontend"
    call npm install
)

echo [1/2] 启动后端...
start "Backend" cmd /k "cd /d "%ROOT%ackend" && echo 后端: http://localhost:8000/docs && echo. && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/2] 启动前端...
start "Frontend" cmd /k "cd /d "%ROOT%rontend" && echo 前端: http://localhost:5173 && echo. && npm run dev"

echo.
echo 稍等几秒，浏览器即将打开...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo 前后端已启动，关闭本窗口不影响运行。
pause
