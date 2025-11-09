// 正則腳本數據
let regexScripts = [];

// 獲取元素
const scriptsList = document.getElementById('scriptsList');
const addScriptBtn = document.getElementById('addScriptBtn');
const importJsonBtn = document.getElementById('importJsonBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importPngBtn = document.getElementById('importPngBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const importJsonFile = document.getElementById('importJsonFile');
const importPngFile = document.getElementById('importPngFile');

// 測試面板
const testInput = document.getElementById('testInput');
const testFindRegex = document.getElementById('testFindRegex');
const testReplaceString = document.getElementById('testReplaceString');
const testRegexBtn = document.getElementById('testRegexBtn');
const testOutput = document.getElementById('testOutput');

// 統計元素
const totalScriptsEl = document.getElementById('totalScripts');
const enabledScriptsEl = document.getElementById('enabledScripts');
const runOnEditScriptsEl = document.getElementById('runOnEditScripts');

// 測試正則
testRegexBtn.addEventListener('click', () => {
    const input = testInput.value;
    const findRegex = testFindRegex.value;
    const replaceString = testReplaceString.value;

    if (!findRegex) {
        testOutput.textContent = '❌ 請輸入查找正則表達式';
        return;
    }

    try {
        // 解析正則表達式
        const regexMatch = findRegex.match(/^\/(.+)\/([gimuy]*)$/);
        let regex;
        
        if (regexMatch) {
            regex = new RegExp(regexMatch[1], regexMatch[2]);
        } else {
            regex = new RegExp(findRegex, 'g');
        }

        const result = input.replace(regex, replaceString);
        testOutput.textContent = result;
    } catch (error) {
        testOutput.textContent = `❌ 錯誤: ${error.message}`;
    }
});

// 新增腳本
addScriptBtn.addEventListener('click', () => {
    const newScript = {
        id: crypto.randomUUID(),
        scriptName: '',
        disabled: false,
        runOnEdit: true,
        findRegex: '',
        replaceString: '',
        trimStrings: [],
        placement: [2],
        substituteRegex: 0,
        minDepth: null,
        maxDepth: null,
        markdownOnly: false,
        promptOnly: false
    };
    regexScripts.unshift(newScript);
    renderScripts();
    updateStats();
});

// 渲染腳本列表
function renderScripts() {
    if (regexScripts.length === 0) {
        scriptsList.innerHTML = `
            <div class="empty-state">
                <p style="font-size: 48px; margin-bottom: 15px;">🔧</p>
                <p style="font-size: 18px; font-weight: 600;">暫無正則腳本</p>
                <p class="hint">點擊「新增腳本」開始創建文本替換規則</p>
            </div>
        `;
        return;
    }

    const html = regexScripts.map(script => {
        const placementOptions = [
            { value: 0, label: '輸入前 (Before Input)' },
            { value: 1, label: '輸入後 (After Input)' },
            { value: 2, label: '輸出前 (Before Output)' },
            { value: 3, label: '輸出後 (After Output)' }
        ];

        const placementHtml = placementOptions.map(opt => 
            `<option value="${opt.value}" ${script.placement?.includes(opt.value) ? 'selected' : ''}>${opt.label}</option>`
        ).join('');

        return `
            <div class="entry-item" data-id="${script.id}">
                <div class="entry-header">
                    <div class="entry-title">${escapeHtml(script.scriptName || '未命名腳本')}</div>
                    <div class="entry-actions">
                        <button class="btn-small btn-toggle ${script.disabled ? 'disabled' : ''}" 
                                onclick="toggleScript('${script.id}')">
                            ${script.disabled ? '✗ 禁用' : '✓ 啟用'}
                        </button>
                        <button class="btn-small" onclick="moveScript('${script.id}', 'up')">↑</button>
                        <button class="btn-small" onclick="moveScript('${script.id}', 'down')">↓</button>
                        <button class="btn-small btn-delete" onclick="deleteScript('${script.id}')">🗑️</button>
                    </div>
                </div>
                
                <div class="entry-form">
                    <div class="form-group">
                        <label>腳本名稱</label>
                        <input type="text" value="${escapeHtml(script.scriptName || '')}" 
                               onchange="updateScriptField('${script.id}', 'scriptName', this.value)">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>查找正則 (Find Regex)</label>
                            <input type="text" value="${escapeHtml(script.findRegex || '')}" 
                                   onchange="updateScriptField('${script.id}', 'findRegex', this.value)"
                                   placeholder="/pattern/flags 或 pattern"
                                   style="font-family: 'Courier New', monospace;">
                            <div class="help-text">例如: /hello/gi 或 hello</div>
                        </div>
                        <div class="form-group">
                            <label>替換字符串 (Replace String)</label>
                            <input type="text" value="${escapeHtml(script.replaceString || '')}" 
                                   onchange="updateScriptField('${script.id}', 'replaceString', this.value)"
                                   placeholder="替換的文本">
                            <div class="help-text">支持 $1, $2 等捕獲組</div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>執行位置 (Placement)</label>
                            <select onchange="updateScriptField('${script.id}', 'placement', [parseInt(this.value)])">
                                ${placementHtml}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>替換模式 (Substitute Regex)</label>
                            <select onchange="updateScriptField('${script.id}', 'substituteRegex', parseInt(this.value))">
                                <option value="0" ${script.substituteRegex === 0 ? 'selected' : ''}>全部替換</option>
                                <option value="1" ${script.substituteRegex === 1 ? 'selected' : ''}>僅第一個</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>最小深度 (Min Depth)</label>
                            <input type="number" value="${script.minDepth || ''}" 
                                   onchange="updateScriptField('${script.id}', 'minDepth', this.value ? parseInt(this.value) : null)"
                                   placeholder="留空表示無限制">
                        </div>
                        <div class="form-group">
                            <label>最大深度 (Max Depth)</label>
                            <input type="number" value="${script.maxDepth || ''}" 
                                   onchange="updateScriptField('${script.id}', 'maxDepth', this.value ? parseInt(this.value) : null)"
                                   placeholder="留空表示無限制">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" ${script.runOnEdit ? 'checked' : ''} 
                                       onchange="updateScriptField('${script.id}', 'runOnEdit', this.checked)">
                                編輯時運行 (Run On Edit)
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" ${script.markdownOnly ? 'checked' : ''} 
                                       onchange="updateScriptField('${script.id}', 'markdownOnly', this.checked)">
                                僅 Markdown (Markdown Only)
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" ${script.promptOnly ? 'checked' : ''} 
                                   onchange="updateScriptField('${script.id}', 'promptOnly', this.checked)">
                            僅提示詞 (Prompt Only)
                        </label>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    scriptsList.innerHTML = html;
}

// 更新統計
function updateStats() {
    totalScriptsEl.textContent = regexScripts.length;
    enabledScriptsEl.textContent = regexScripts.filter(s => !s.disabled).length;
    runOnEditScriptsEl.textContent = regexScripts.filter(s => s.runOnEdit).length;
}

// 更新腳本字段
window.updateScriptField = function(scriptId, field, value) {
    const script = regexScripts.find(s => s.id === scriptId);
    if (script) {
        script[field] = value;
        updateStats();
    }
};

// 切換啟用狀態
window.toggleScript = function(scriptId) {
    const script = regexScripts.find(s => s.id === scriptId);
    if (script) {
        script.disabled = !script.disabled;
        renderScripts();
        updateStats();
    }
};

// 移動腳本
window.moveScript = function(scriptId, direction) {
    const index = regexScripts.findIndex(s => s.id === scriptId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
        [regexScripts[index], regexScripts[index - 1]] = 
        [regexScripts[index - 1], regexScripts[index]];
        renderScripts();
    } else if (direction === 'down' && index < regexScripts.length - 1) {
        [regexScripts[index], regexScripts[index + 1]] = 
        [regexScripts[index + 1], regexScripts[index]];
        renderScripts();
    }
};

// 刪除腳本
window.deleteScript = function(scriptId) {
    if (confirm('確定要刪除這個腳本嗎？')) {
        regexScripts = regexScripts.filter(s => s.id !== scriptId);
        renderScripts();
        updateStats();
    }
};

// 導出 JSON
exportJsonBtn.addEventListener('click', () => {
    if (regexScripts.length === 0) {
        alert('沒有腳本可以導出！');
        return;
    }

    const exportData = regexScripts.map(script => ({
        id: script.id,
        scriptName: script.scriptName || '',
        disabled: script.disabled || false,
        runOnEdit: script.runOnEdit !== false,
        findRegex: script.findRegex || '',
        replaceString: script.replaceString || '',
        trimStrings: script.trimStrings || [],
        placement: script.placement || [2],
        substituteRegex: script.substituteRegex || 0,
        minDepth: script.minDepth || null,
        maxDepth: script.maxDepth || null,
        markdownOnly: script.markdownOnly || false,
        promptOnly: script.promptOnly || false
    }));

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex_scripts.json';
    a.click();
    URL.revokeObjectURL(url);

    alert(`✓ 成功導出 ${regexScripts.length} 個腳本！`);
});

// 導入 JSON
importJsonBtn.addEventListener('click', () => {
    importJsonFile.click();
});

importJsonFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (Array.isArray(data)) {
            regexScripts = data.map(script => ({
                id: script.id || crypto.randomUUID(),
                scriptName: script.scriptName || script.name || '',
                disabled: script.disabled || false,
                runOnEdit: script.runOnEdit !== false,
                findRegex: script.findRegex || '',
                replaceString: script.replaceString || '',
                trimStrings: script.trimStrings || [],
                placement: script.placement || [2],
                substituteRegex: script.substituteRegex || 0,
                minDepth: script.minDepth || null,
                maxDepth: script.maxDepth || null,
                markdownOnly: script.markdownOnly || false,
                promptOnly: script.promptOnly || false
            }));

            renderScripts();
            updateStats();
            alert(`✓ 成功導入 ${regexScripts.length} 個腳本！`);
        } else {
            alert('❌ 無效的腳本格式！');
        }
    } catch (error) {
        console.error('導入失敗:', error);
        alert('❌ 導入失敗: ' + error.message);
    }

    e.target.value = '';
});

// 從 PNG 導入
importPngBtn.addEventListener('click', () => {
    importPngFile.click();
});

importPngFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const characterCard = await extractCharaData(uint8Array);

        if (characterCard) {
            const data = characterCard.data || characterCard;
            const scripts = data.extensions?.regex_scripts;

            if (scripts && Array.isArray(scripts) && scripts.length > 0) {
                if (confirm(`找到 ${scripts.length} 個正則腳本。是否導入？\n\n注意：這將覆蓋當前的腳本數據。`)) {
                    regexScripts = scripts.map(script => ({
                        id: script.id || crypto.randomUUID(),
                        scriptName: script.scriptName || script.name || '',
                        disabled: script.disabled || false,
                        runOnEdit: script.runOnEdit !== false,
                        findRegex: script.findRegex || '',
                        replaceString: script.replaceString || '',
                        trimStrings: script.trimStrings || [],
                        placement: script.placement || [2],
                        substituteRegex: script.substituteRegex || 0,
                        minDepth: script.minDepth || null,
                        maxDepth: script.maxDepth || null,
                        markdownOnly: script.markdownOnly || false,
                        promptOnly: script.promptOnly || false
                    }));

                    renderScripts();
                    updateStats();
                    alert(`✓ 成功從 PNG 導入 ${regexScripts.length} 個腳本！`);
                }
            } else {
                alert('❌ 這個角色卡中沒有正則腳本數據！');
            }
        } else {
            alert('❌ 無法讀取 PNG 文件中的角色卡數據！');
        }
    } catch (error) {
        console.error('導入失敗:', error);
        alert('❌ 導入失敗: ' + error.message);
    }

    e.target.value = '';
});

// 從 PNG 提取數據
async function extractCharaData(pngData) {
    const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
    for (let i = 0; i < 8; i++) {
        if (pngData[i] !== pngSignature[i]) return null;
    }

    let i = 8;
    while (i < pngData.length - 12) {
        const view = new DataView(pngData.buffer, pngData.byteOffset + i);
        const chunkLength = view.getUint32(0, false);
        const chunkTypeBytes = pngData.slice(i + 4, i + 8);
        const chunkType = String.fromCharCode(...chunkTypeBytes);

        if (chunkType === 'tEXt') {
            const chunkData = pngData.slice(i + 8, i + 8 + chunkLength);
            const nullIndex = chunkData.indexOf(0);

            if (nullIndex !== -1) {
                const keywordBytes = chunkData.slice(0, nullIndex);
                const keyword = String.fromCharCode(...keywordBytes);

                if (keyword === 'chara') {
                    const dataBytes = chunkData.slice(nullIndex + 1);
                    let jsonString = '';
                    for (let j = 0; j < dataBytes.length; j++) {
                        jsonString += String.fromCharCode(dataBytes[j]);
                    }

                    try {
                        const decoded = atob(jsonString.trim());
                        const utf8Bytes = new Uint8Array(decoded.length);
                        for (let j = 0; j < decoded.length; j++) {
                            utf8Bytes[j] = decoded.charCodeAt(j);
                        }
                        const utf8String = new TextDecoder('utf-8').decode(utf8Bytes);
                        return JSON.parse(utf8String);
                    } catch (e) {
                        try {
                            return JSON.parse(jsonString);
                        } catch (e2) {
                            return null;
                        }
                    }
                }
            }
        }

        i += 12 + chunkLength;
        if (chunkType === 'IEND') break;
    }

    return null;
}

// 清空全部
clearAllBtn.addEventListener('click', () => {
    if (confirm('確定要清空所有腳本嗎？此操作無法撤銷！')) {
        regexScripts = [];
        renderScripts();
        updateStats();
    }
});

// 工具函數
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 初始化
updateStats();
