@echo off
set "ROOT=%~dp0"

echo Starting NEXUS Backend...
start "NEXUS Backend" cmd /k "cd /d ""%ROOT%backend"" && call nexus\Scripts\activate.bat && python -m uvicorn app.main:app --reload"

timeout /t 3 /nobreak >nul

echo Starting NEXUS Frontend...
start "NEXUS Frontend" cmd /k "cd /d ""%ROOT%apps\desktop"" && pnpm tauri dev"

exit