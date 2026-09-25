@echo off
title Push SelectMyFlight to GitHub
echo ==========================================================
echo Pushing SelectMyFlight to GitHub: https://github.com/thiru-1511/selectmyflight.git
echo ==========================================================

cd /d "%~dp0"
set PATH=%USERPROFILE%\.tools\git\cmd;%PATH%

echo Staging all files...
git add .

echo Committing any recent updates...
git commit -m "Production release for SelectMyFlight" 2>nul

echo Pushing to main branch...
git push -u origin main

echo.
echo ==========================================================
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Code pushed to GitHub successfully!
    echo Check your repository: https://github.com/thiru-1511/selectmyflight
) else (
    echo [NOTE] If you saw an authentication error, please sign in when prompted.
)
echo ==========================================================
pause
