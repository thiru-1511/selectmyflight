@echo off
title SelectMyFlight Backend - MySQL Production Mode
echo ==========================================================
echo Starting SelectMyFlight Backend connected to MySQL...
echo Profile: MySQL (selectmyflight_db on localhost:3306)
echo ==========================================================

cd /d "%~dp0"
set JAVA_HOME=%USERPROFILE%\.tools\jdk
set PATH=%JAVA_HOME%\bin;%USERPROFILE%\.tools\maven\bin;%PATH%

where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Java is not detected in your PATH or .tools\jdk folder.
    echo Please install JDK 21 or set JAVA_HOME.
    pause
    exit /b 1
)

cd backend
echo Starting Spring Boot with MySQL profile...
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
pause

