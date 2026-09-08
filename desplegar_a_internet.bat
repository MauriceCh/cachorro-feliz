@echo off
title Cachorro Feliz - Publicar en Internet (Firebase)
echo ========================================================
echo     PUBLICAR TIENDA CACHORRO FELIZ EN INTERNET ??
echo ========================================================
echo.
set PATH=C:\Program Files\nodejs;%PATH%
cd /d C:\Users\snack\.gemini\antigravity\scratch\cachorro-feliz

echo 1. Compilando tu catalogo y tienda...
call npx.cmd vite build
echo.

echo 2. Desplegando en Google Firebase Hosting...
call npx.cmd -y firebase-tools@latest deploy --only hosting
echo.
pause
