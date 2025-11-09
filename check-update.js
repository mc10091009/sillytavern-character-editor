// 自動檢查更新功能
// 在頁面加載時檢查是否有新版本

const UPDATE_CHECK_KEY = 'last_update_check';
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24小時
const GITHUB_API = 'https://api.github.com/repos/你的用戶名/你的倉庫名/commits/main';
const CURRENT_VERSION = '2024-01-01'; // 當前版本日期，每次更新時修改

// 檢查是否需要檢查更新
function shouldCheckUpdate() {
    const lastCheck = localStorage.getItem(UPDATE_CHECK_KEY);
    if (!lastCheck) return true;
    
    const timeSinceLastCheck = Date.now() - parseInt(lastCheck);
    return timeSinceLastCheck > UPDATE_INTERVAL;
}

// 檢查更新
async function checkForUpdates() {
    if (!shouldCheckUpdate()) {
        console.log('✓ 最近已檢查過更新');
        return;
    }

    try {
        console.log('🔍 正在檢查更新...');
        
        const response = await fetch(GITHUB_API);
        if (!response.ok) {
            console.log('⚠️ 無法檢查更新');
            return;
        }

        const data = await response.json();
        const latestCommitDate = new Date(data.commit.committer.date);
        const currentDate = new Date(CURRENT_VERSION);

        // 更新最後檢查時間
        localStorage.setItem(UPDATE_CHECK_KEY, Date.now().toString());

        if (latestCommitDate > currentDate) {
            showUpdateNotification(data);
        } else {
            console.log('✓ 已是最新版本');
        }
    } catch (error) {
        console.error('檢查更新時出錯:', error);
    }
}

// 顯示更新通知
function showUpdateNotification(commitData) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;

    const commitMessage = commitData.commit.message.split('\n')[0];
    const commitDate = new Date(commitData.commit.committer.date).toLocaleDateString('zh-CN');

    notification.innerHTML = `
        <style>
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        </style>
        <div style="display: flex; align-items: start; gap: 15px;">
            <div style="font-size: 32px;">🎉</div>
            <div style="flex: 1;">
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">
                    發現新版本！
                </div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">
                    ${commitMessage}
                </div>
                <div style="font-size: 12px; opacity: 0.7; margin-bottom: 15px;">
                    更新日期：${commitDate}
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="window.open('https://github.com/你的用戶名/你的倉庫名/commits/main', '_blank')" 
                            style="flex: 1; padding: 8px 16px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; color: white; cursor: pointer; font-size: 14px; transition: all 0.2s;">
                        查看更新
                    </button>
                    <button onclick="this.closest('div').parentElement.parentElement.parentElement.remove()" 
                            style="flex: 1; padding: 8px 16px; background: rgba(255,255,255,0.9); border: none; border-radius: 6px; color: #667eea; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s;">
                        知道了
                    </button>
                </div>
            </div>
            <button onclick="this.closest('div').parentElement.remove()" 
                    style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.7; padding: 0; line-height: 1; transition: opacity 0.2s;"
                    onmouseover="this.style.opacity='1'" 
                    onmouseout="this.style.opacity='0.7'">
                ×
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // 10秒後自動關閉
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 10000);
}

// 手動檢查更新
window.manualCheckUpdate = async function() {
    // 清除最後檢查時間，強制檢查
    localStorage.removeItem(UPDATE_CHECK_KEY);
    await checkForUpdates();
};

// 頁面加載時自動檢查
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkForUpdates);
} else {
    checkForUpdates();
}

// 導出函數供其他腳本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkForUpdates, manualCheckUpdate };
}
