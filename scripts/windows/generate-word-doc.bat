@echo off
chcp 65001 > nul
title توليد دليل اختصارات SGN
echo جاري تشغيل سكريبت بايثون لتوليد دليل الاختصارات على سطح المكتب...
echo.
python "%~dp0..\..\scratch\generate_doc.py"
echo.
echo تم توليد الملف بنجاح على سطح المكتب باسم "دليل_اختصارات_SGN.docx".
pause
