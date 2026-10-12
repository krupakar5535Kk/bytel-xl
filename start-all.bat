@echo off
title WILD FIRE - Platform Launcher
echo ========================================================
echo  WILD FIRE - AI-Powered Student Analytics Platform
echo ========================================================
echo.

set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
set "PATH=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot\bin;C:\Users\Admin\AppData\Local\Programs\maven\apache-maven-3.9.9\bin;C:\Users\Admin\AppData\Local\OpenAI\Codex\runtimes\cua_node\4004642ff3fabdc7\bin;%PATH%"

echo [1/3] Starting Spring Boot Backend (Port 8080)...
start "Wildfire Backend API" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

echo [2/3] Waiting for backend initialization...
timeout /t 6 /nobreak >nul

echo [3/3] Starting Frontend Dev Server (Port 3000)...
start "Wildfire Frontend" cmd /k "cd /d %~dp0frontend && node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 3000"

timeout /t 2 /nobreak >nul
echo Opening WILD FIRE in your browser...
start http://localhost:3000

echo.
echo ========================================================
echo WILD FIRE is now running!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8080/api/v1
echo ========================================================
pause
