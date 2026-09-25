@echo off
title SelectMyFlight Backend (Java Spring Boot)
echo ==========================================================
echo Starting SelectMyFlight Java Backend...
echo Port: 8080
echo Database: In-Memory / MySQL Ready
echo ==========================================================

cd /d "%~dp0"
set JAVA_HOME=%USERPROFILE%\.tools\jdk
set PATH=%JAVA_HOME%\bin;%USERPROFILE%\.tools\maven\bin;%PATH%

where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [NOTE] Java is not detected in your PATH or .tools\jdk folder.
    echo To run the optional Java backend, install JDK 21 and set JAVA_HOME.
    echo.
    echo NOTE: The Frontend application has a complete built-in simulated backend
    echo with instant search, seat booking, payment, AI chatbot and refund tracking
    echo that runs directly in the browser!
    echo.
    echo To start the website right now, run:
    echo   .\smf\run_frontend.bat
    echo.
    pause
    exit /b 1
)

if exist "backend\target\selectmyflight-backend-1.0.0.jar" (
    echo Running packaged Spring Boot JAR...
    java -jar backend\target\selectmyflight-backend-1.0.0.jar
) else (
    echo Building and running with Maven...
    cd backend
    mvn spring-boot:run
)
pause
