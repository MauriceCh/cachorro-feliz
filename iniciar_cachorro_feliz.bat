@echo off
title Cachorro Feliz - Servidor y Tienda
echo ========================================================
echo        INICIANDO ECOSISTEMA CACHORRO FELIZ ??
echo ========================================================
echo Abriendo tu panel de gestion y catalogo...
set PATH=C:\Program Files\nodejs;%PATH%
cd /d C:\Users\snack\.gemini\antigravity\scratch\cachorro-feliz
start http://localhost:3000
npm.cmd run dev
pause
