@echo off
title Subir Cachorro Feliz a GitHub
cd /d "C:\Users\snack\.gemini\antigravity\scratch\cachorro-feliz"
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;C:\Program Files\Git\cmd;C:\Program Files\nodejs;%PATH%"

echo ========================================================
echo   SUBIENDO PROYECTO CACHORRO FELIZ A GITHUB
echo ========================================================
echo.
echo Repositorio destino: https://github.com/MauriceCh/cachorro-feliz.git
echo Rama: main
echo.
echo Conectando con GitHub...
echo (Si aparece una ventana, elige "Sign in with your browser")
echo.

git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo   FELICITACIONES: Proyecto subido con exito a GitHub!
    echo   Puedes verlo en: https://github.com/MauriceCh/cachorro-feliz
    echo ========================================================
) else (
    echo ========================================================
    echo Hubo un inconveniente al conectar con GitHub.
    echo Si el repositorio no esta vacio o pide clave,
    echo revisa tu conexion e intenta de nuevo.
    echo ========================================================
)
echo.
pause
