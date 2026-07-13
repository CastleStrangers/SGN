@echo off
cd /d "%~dp0"
title SGN Project Specifications Generator
node "%~dp0scratch\generate_specs_pdf.js"
pause
