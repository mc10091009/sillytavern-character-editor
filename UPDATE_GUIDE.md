# 📦 自動更新指南

本項目提供多種方式來保持工具集的最新版本。

## 🎯 方式一：使用更新腳本（推薦）

### Windows 用戶

1. **雙擊運行 `update.bat`**
   - 腳本會自動檢查是否有新版本
   - 如果有更新，會顯示更新內容
   - 確認後自動下載並更新

2. **首次使用前的設置**
   ```bash
   # 如果還沒有 Git 倉庫，先初始化
   git init
   git remote add origin https://github.com/你的用戶名/你的倉庫名.git
   git fetch
   git checkout main
   ```

### macOS / Linux 用戶

1. **給腳本添加執行權限**
   ```bash
   chmod +x update.sh
   ```

2. **運行更新腳本**
   ```bash
   ./update.sh
   ```

3. **首次使用前的設置**（同 Windows）

## 🌐 方式二：網頁自動檢查（已集成）

項目已經內置了自動更新檢查功能：

### 自動檢查
- 每次打開網頁時，會自動檢查更新（24小時檢查一次）
- 如果有新版本，右上角會彈出通知
- 點擊「查看更新」可以看到更新內容

### 手動檢查
在瀏覽器控制台（F12）中運行：
```javascript
manualCheckUpdate()
```

### 配置更新檢查

編輯 `check-update.js` 文件：

```javascript
// 修改你的 GitHub 倉庫信息
const GITHUB_API = 'https://api.github.com/repos/你的用戶名/你的倉庫名/commits/main';

// 修改當前版本日期（每次更新時修改）
const CURRENT_VERSION = '2024-01-01';

// 修改檢查間隔（默認24小時）
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000;
```

### 啟用網頁自動檢查

在每個 HTML 文件的 `</body>` 前添加：

```html
<script src="check-update.js"></script>
```

## 📱 方式三：手機更新（最簡單）

### iOS / Android 用戶

手機上最簡單的更新方式：

#### 方法 A：重新下載（推薦）

1. **訪問 GitHub 倉庫**
   - 在手機瀏覽器打開：`https://github.com/你的用戶名/你的倉庫名`

2. **下載最新版本**
   - 點擊綠色的 "Code" 按鈕
   - 選擇 "Download ZIP"
   - 下載完成後解壓

3. **替換舊文件**
   - 備份你的角色卡（如果有）
   - 刪除舊的項目文件夾
   - 將新文件夾放到原位置

4. **打開使用**
   - 用瀏覽器打開 `home.html`
   - 繼續使用

#### 方法 B：使用 Git 客戶端

**iOS 用戶：**

1. **安裝 Working Copy**（免費）
   - App Store 搜索 "Working Copy"
   - 安裝並打開

2. **克隆倉庫**（首次）
   - 點擊 "+" → "Clone repository"
   - 輸入倉庫地址
   - 選擇保存位置

3. **更新**
   - 打開 Working Copy
   - 選擇你的倉庫
   - 點擊右上角的 "Pull" 按鈕
   - 等待更新完成

4. **在瀏覽器中打開**
   - 點擊 `home.html`
   - 選擇 "Share" → "Open in Safari"

**Android 用戶：**

1. **安裝 MGit**（免費）
   - Google Play 或 F-Droid 下載 MGit
   - 打開 MGit

2. **克隆倉庫**（首次）
   - 點擊 "+" → "Clone repository"
   - 輸入倉庫地址
   - 選擇保存位置

3. **更新**
   - 打開 MGit
   - 選擇倉庫
   - 點擊 "Pull"

4. **在瀏覽器中打開**
   - 使用文件管理器找到 `home.html`
   - 用瀏覽器打開

#### 方法 C：網頁自動提醒（已內置）

如果你已經在使用本工具：

1. **自動檢查**
   - 每次打開網頁時自動檢查更新
   - 有新版本會彈出通知

2. **查看更新**
   - 點擊通知中的「查看更新」
   - 在 GitHub 查看更新內容

3. **下載更新**
   - 按照「方法 A」重新下載
   - 或使用「方法 B」的 Git 客戶端

### 📱 手機更新小技巧

**技巧 1：添加到主屏幕**
- iOS Safari：分享 → 添加到主屏幕
- Android Chrome：菜單 → 添加到主屏幕
- 像 App 一樣使用，更方便

**技巧 2：使用雲端同步**
- 將項目文件夾放在 iCloud Drive / Google Drive
- 電腦更新後，手機自動同步
- 無需手動操作

**技巧 3：書籤 GitHub**
- 在手機瀏覽器收藏倉庫頁面
- 定期訪問查看是否有更新
- 有更新時重新下載

**技巧 4：使用 GitHub Mobile App**
- 安裝 GitHub 官方 App
- Watch 倉庫，接收更新通知
- 直接在 App 中下載最新版本

## 🔧 方式四：手動更新（電腦）

### 使用 Git 命令

```bash
# 1. 檢查當前狀態
git status

# 2. 保存你的修改（如果有）
git stash

# 3. 獲取最新版本
git pull origin main

# 4. 恢復你的修改（如果有）
git stash pop
```

### 直接下載

1. 訪問 GitHub 倉庫
2. 點擊綠色的 "Code" 按鈕
3. 選擇 "Download ZIP"
4. 解壓並替換舊文件

## 📋 更新前的注意事項

### 備份重要數據

更新前建議備份：
- 你自己創建的角色卡
- 自定義的世界書
- 修改過的配置文件

### 檢查衝突

如果你修改了項目文件，更新時可能會有衝突：

```bash
# 查看哪些文件被修改了
git status

# 查看具體修改內容
git diff

# 如果想保留修改，先提交
git add .
git commit -m "我的自定義修改"

# 然後更新
git pull origin main
```

### 解決衝突

如果更新時出現衝突：

```bash
# 方法1：放棄本地修改，使用最新版本
git reset --hard origin/main

# 方法2：保留本地修改，手動合併
# Git 會標記衝突的文件，手動編輯解決後：
git add .
git commit -m "解決衝突"
```

## 🔄 更新頻率建議

- **穩定版本**：每月檢查一次
- **開發版本**：每週檢查一次
- **重要更新**：關注 GitHub Releases

## 📢 獲取更新通知

### 方式一：Watch GitHub 倉庫

1. 訪問 GitHub 倉庫頁面
2. 點擊右上角的 "Watch"
3. 選擇 "Custom" → "Releases"
4. 有新版本時會收到郵件通知

### 方式二：RSS 訂閱

訂閱倉庫的 Commits RSS：
```
https://github.com/你的用戶名/你的倉庫名/commits/main.atom
```

## 🐛 更新問題排查

### 問題1：更新腳本無法運行

**Windows:**
```bash
# 確保已安裝 Git
git --version

# 如果沒有，下載安裝：https://git-scm.com/
```

**macOS/Linux:**
```bash
# 檢查腳本權限
ls -l update.sh

# 添加執行權限
chmod +x update.sh
```

### 問題2：網頁更新檢查不工作

1. 檢查瀏覽器控制台是否有錯誤
2. 確認 `check-update.js` 中的倉庫地址正確
3. 檢查網絡連接
4. 清除瀏覽器緩存

### 問題3：Git 衝突

```bash
# 查看衝突文件
git status

# 查看衝突內容
git diff

# 選擇解決方案：
# A. 使用遠程版本
git checkout --theirs 文件名

# B. 使用本地版本
git checkout --ours 文件名

# C. 手動編輯解決
# 編輯文件，刪除衝突標記 <<<<<<<, =======, >>>>>>>

# 完成後標記為已解決
git add 文件名
git commit
```

## 📝 版本記錄

查看更新歷史：

```bash
# 查看最近10次更新
git log -10 --oneline

# 查看詳細更新內容
git log -10 --pretty=format:"%h - %an, %ar : %s"

# 查看某個文件的更新歷史
git log --follow 文件名
```

## 💡 最佳實踐

1. **定期更新**：建議每月至少檢查一次更新
2. **備份數據**：更新前備份重要的角色卡和設置
3. **測試功能**：更新後測試主要功能是否正常
4. **關注變更**：閱讀更新日誌，了解新功能和變化
5. **報告問題**：發現問題及時在 GitHub 提 Issue

## 🆘 需要幫助？

- 📖 查看 [README.md](README.md)
- 🐛 提交 [Issue](https://github.com/你的用戶名/你的倉庫名/issues)
- 💬 參與 [Discussions](https://github.com/你的用戶名/你的倉庫名/discussions)
