@echo off
title SelectMyFlight Frontend (React + Vite)
echo ==========================================================
echo Starting SelectMyFlight Frontend...
echo URL: http://localhost:5173/
echo ==========================================================

set PATH=%USERPROFILE%\.tools\node;%PATH%
cd /d "%~dp0\frontend"
npm run dev -- --port 5173 --host
pause
