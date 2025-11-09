@echo off
chcp 65001 >nul
echo ========================================
echo   SillyTavern 工具集 - 自動更新
echo ========================================
echo.

REM 檢查是否在 Git 倉庫中
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤：當前目錄不是 Git 倉庫
    echo.
    echo 請先初始化 Git 倉庫：
    echo   git init
    echo   git remote add origin https://github.com/你的用戶名/你的倉庫名.git
    echo   git fetch
    echo   git checkout main
    echo.
    pause
    exit /b 1
)

echo 📥 正在檢查更新...
echo.

REM 獲取遠程更新
git fetch origin

REM 檢查是否有更新
git diff --quiet HEAD origin/main
if errorlevel 1 (
    echo ✨ 發現新版本！
    echo.
    echo 📋 更新內容：
    git log HEAD..origin/main --oneline --decorate --color
    echo.
    
    set /p confirm="是否更新到最新版本？(Y/N): "
    if /i "%confirm%"=="Y" (
        echo.
        echo 🔄 正在更新...
        git pull origin main
        
        if errorlevel 1 (
            echo.
            echo ❌ 更新失敗！可能有衝突需要手動解決。
            echo.
            echo 解決方法：
            echo   1. 備份你修改的文件
            echo   2. 運行: git reset --hard origin/main
            echo   3. 重新應用你的修改
            echo.
        ) else (
            echo.
            echo ✅ 更新成功！
            echo.
            echo 📝 更新日誌：
            git log -1 --pretty=format:"%%s%%n%%b"
            echo.
        )
    ) else (
        echo.
        echo ⏭️  已取消更新
    )
) else (
    echo ✅ 已是最新版本！
    echo.
    echo 當前版本：
    git log -1 --oneline --decorate --color
)

echo.
echo ========================================
pause
