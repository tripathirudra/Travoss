@echo off
echo ========================================
echo Travoss Frontend - Clean Restart
echo ========================================
echo.

echo Step 1: Clearing caches...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo   - Cleared node_modules cache
) else (
    echo   - No cache to clear
)

if exist build (
    rmdir /s /q build
    echo   - Cleared build folder
) else (
    echo   - No build folder to clear
)

echo.
echo Step 2: Starting development server...
echo.
echo Please wait while the server starts...
echo Once you see "webpack compiled", open your browser to:
echo http://localhost:3000
echo.
echo Then press Ctrl+Shift+R to hard refresh the page.
echo.

npm run dev

