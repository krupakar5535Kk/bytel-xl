@echo off
title WILD FIRE - Frontend Launcher
set "PATH=C:\Users\Admin\AppData\Local\OpenAI\Codex\runtimes\cua_node\4004642ff3fabdc7\bin;%PATH%"
cd /d "%~dp0frontend"
start http://localhost:3000
node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 3000
