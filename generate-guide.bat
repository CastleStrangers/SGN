@echo off
cd /d "%~dp0"
title SGN - Generate Control Panel Guide PDF
echo ===================================================
echo   Generating SGN Control Panel Guide PDF...
echo ===================================================
echo.

node scratch/generate_guide_pdf.js

echo.
echo [✓] Done! SGN_Control_Panel_Guide.pdf has been saved directly to your desktop.
echo.
pause
