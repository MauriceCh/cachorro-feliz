@echo off
title Cachorro Feliz - Iniciar Sesion en Google Firebase
echo ========================================================
echo       CONECTAR CON TU CUENTA DE GOOGLE FIREBASE ??
echo ========================================================
echo Abriendo inicio de sesion en tu navegador...
echo (Solo debes seleccionar tu cuenta de Google y darle Permitir)
echo.
set PATH=C:\Program Files\nodejs;%PATH%
cd /d C:\Users\snack\.gemini\antigravity\scratch\cachorro-feliz
call npx.cmd -y firebase-tools@latest login
echo.
echo ========================================================
echo Sesion iniciada con exito!
echo Ahora puedes hacer doble clic en Publicar Tienda en Internet.bat
echo ========================================================
pause
