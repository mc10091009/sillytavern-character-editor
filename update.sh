#!/bin/bash

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "  SillyTavern 工具集 - 自動更新"
echo "========================================"
echo ""

# 檢查是否在 Git 倉庫中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ 錯誤：當前目錄不是 Git 倉庫${NC}"
    echo ""
    echo "請先初始化 Git 倉庫："
    echo "  git init"
    echo "  git remote add origin https://github.com/你的用戶名/你的倉庫名.git"
    echo "  git fetch"
    echo "  git checkout main"
    echo ""
    exit 1
fi

echo -e "${BLUE}📥 正在檢查更新...${NC}"
echo ""

# 獲取遠程更新
git fetch origin

# 檢查是否有更新
if ! git diff --quiet HEAD origin/main; then
    echo -e "${YELLOW}✨ 發現新版本！${NC}"
    echo ""
    echo -e "${BLUE}📋 更新內容：${NC}"
    git log HEAD..origin/main --oneline --decorate --color
    echo ""
    
    read -p "是否更新到最新版本？(Y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        echo ""
        echo -e "${BLUE}🔄 正在更新...${NC}"
        
        if git pull origin main; then
            echo ""
            echo -e "${GREEN}✅ 更新成功！${NC}"
            echo ""
            echo -e "${BLUE}📝 更新日誌：${NC}"
            git log -1 --pretty=format:"%s%n%b"
            echo ""
        else
            echo ""
            echo -e "${RED}❌ 更新失敗！可能有衝突需要手動解決。${NC}"
            echo ""
            echo "解決方法："
            echo "  1. 備份你修改的文件"
            echo "  2. 運行: git reset --hard origin/main"
            echo "  3. 重新應用你的修改"
            echo ""
        fi
    else
        echo ""
        echo -e "${YELLOW}⏭️  已取消更新${NC}"
    fi
else
    echo -e "${GREEN}✅ 已是最新版本！${NC}"
    echo ""
    echo "當前版本："
    git log -1 --oneline --decorate --color
fi

echo ""
echo "========================================"
