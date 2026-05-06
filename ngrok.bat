@echo off
cd /d "%~dp0"

where ngrok >nul 2>&1
if errorlevel 1 (
  echo ngrok.exe was not found. Add it to PATH or put ngrok.exe in this folder.
  pause
  exit /b 1
)

echo Starting tunnels: frontend ^(3000^) and backend ^(3001^)
echo Leave this window open. Close it to stop ngrok.
echo.

ngrok start --config "%~dp0ngrok.yml" frontend backend

echo.
echo ngrok stopped. Exit code: %ERRORLEVEL%
pause