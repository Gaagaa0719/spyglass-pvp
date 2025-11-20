@echo off

cd %~dp0

call ./scripts/copy_bp.bat
call ./scripts/copy_rp.bat

pause