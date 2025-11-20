@echo off

pwsh -NoProfile -ExecutionPolicy Bypass -Command "&{ . ./scripts/pwsh/copy.ps1; copy_rp }"
