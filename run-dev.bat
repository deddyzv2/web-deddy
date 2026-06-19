@echo off
cd /d "D:\WebApp\Illustration Studio"
if not exist node_modules (
  echo Installing dependencies...
  npm install
  if errorlevel 1 pause && exit /b 1
)
echo Starting Illustration Tone Slider...
npm run dev
pause

