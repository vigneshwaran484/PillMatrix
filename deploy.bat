@echo off
echo Building PillMatrix Healthcare Platform...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo Build successful! Opening dist folder for manual Netlify deployment...
    echo.
    echo MANUAL DEPLOYMENT INSTRUCTIONS:
    echo 1. Go to https://app.netlify.com/drop
    echo 2. Drag and drop the entire 'dist' folder into the drop zone
    echo 3. Your site will be deployed instantly with a random URL
    echo 4. You can then configure a custom domain if desired
    echo.
    echo Opening dist folder...
    explorer dist
) else (
    echo Build failed. Please check the errors above.
)
