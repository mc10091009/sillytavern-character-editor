// 調試版本 - 在頁面頂部添加調試信息
console.log('=== script.js 開始加載 ===');
console.log('當前時間:', new Date().toLocaleString());

// 檢查 DOM 是否已準備好
console.log('document.readyState:', document.readyState);

// 等待 DOM 完全加載
if (document.readyState === 'loading') {
    console.warn('⚠️ DOM 尚未加載完成，等待 DOMContentLoaded 事件...');
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    console.log('✓ DOM 已加載，立即初始化');
    initializeApp();
}

function initializeApp() {
    console.log('=== 開始初始化應用 ===');
    
    // 檢查所有必需的元素
    const requiredElements = {
        'name': document.getElementById('name'),
        'description': document.getElementById('description'),
        'personality': document.getElementById('personality'),
        'scenario': document.getElementById('scenario'),
        'first_mes': document.getElementById('first_mes'),
        'mes_example': document.getElementById('mes_example'),
        'avatar': document.getElementById('avatar'),
        'exportBtn': document.getElementById('exportBtn'),
        'exportJsonBtn': document.getElementById('exportJsonBtn'),
        'importBtn': document.getElementById('importBtn'),
        'clearBtn': document.getElementById('clearBtn'),
        'worldBookBtn': document.getElementById('worldBookBtn'),
        'advancedBtn': document.getElementById('advancedBtn'),
        'saveLocalBtn': document.getElementById('saveLocalBtn'),
        'loadLocalBtn': document.getElementById('loadLocalBtn'),
        'regexScriptsBtn': document.getElementById('regexScriptsBtn')
    };
    
    console.log('=== 元素檢查結果 ===');
    let missingElements = [];
    for (const [id, element] of Object.entries(requiredElements)) {
        if (element) {
            console.log(`✓ ${id}: 找到`);
        } else {
            console.error(`✗ ${id}: 未找到`);
            missingElements.push(id);
        }
    }
    
    if (missingElements.length > 0) {
        console.error('=== 錯誤：缺少以下元素 ===');
        console.error(missingElements.join(', '));
        alert('⚠️ 頁面初始化失敗\n\n缺少以下元素:\n' + missingElements.join('\n') + '\n\n請檢查 HTML 文件是否完整。');
        return;
    }
    
    console.log('✓ 所有必需元素都已找到');
    
    // 測試按鈕點擊
    const testBtn = document.getElementById('exportBtn');
    if (testBtn) {
        console.log('=== 測試按鈕事件 ===');
        testBtn.addEventListener('click', function() {
            console.log('✓ exportBtn 點擊事件觸發！');
            alert('✓ 按鈕點擊正常工作！\n\n如果你看到這個消息，說明 JavaScript 正常運行。');
        });
        console.log('✓ exportBtn 事件監聽器已添加');
    }
    
    console.log('=== 初始化完成 ===');
}

// 添加全局錯誤處理
window.addEventListener('error', function(e) {
    console.error('=== 全局錯誤 ===');
    console.error('錯誤信息:', e.message);
    console.error('文件:', e.filename);
    console.error('行號:', e.lineno);
    console.error('列號:', e.colno);
});

console.log('=== script-debug.js 加載完成 ===');
