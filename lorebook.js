// 世界書數據
let lorebookData = {
    name: '',
    description: '',
    scan_depth: 100,
    token_budget: 2048,
    recursive_scanning: false,
    extensions: {},
    entries: []
};

// 獲取元素
const lorebookNameInput = document.getElementById('lorebookName');
const lorebookDescriptionInput = document.getElementById('lorebookDescription');
const scanDepthInput = document.getElementById('scanDepth');
const tokenBudgetInput = document.getElementById('tokenBudget');
const entriesList = document.getElementById('entriesList');
const addEntryBtn = document.getElementById('addEntryBtn');
const importJsonBtn = document.getElementById('importJsonBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importPngBtn = document.getElementById('importPngBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const importJsonFile = document.getElementById('importJsonFile');
const importPngFile = document.getElementById('importPngFile');
const searchInput = document.getElementById('searchInput');

// 統計元素
const totalEntriesEl = document.getElementById('totalEntries');
const enabledEntriesEl = document.getElementById('enabledEntries');
const regexEntriesEl = document.getElementById('regexEntries');
const totalKeywordsEl = document.getElementById('totalKeywords');

// 監聽元數據輸入
if (lorebookNameInput) {
    lorebookNameInput.addEventListener('input', (e) => {
        lorebookData.name = e.target.value;
    });
}

if (lorebookDescriptionInput) {
    lorebookDescriptionInput.addEventListener('input', (e) => {
        lorebookData.description = e.target.value;
    });
}

if (scanDepthInput) {
    scanDepthInput.addEventListener('input', (e) => {
        lorebookData.scan_depth = parseInt(e.target.value) || 100;
    });
}

if (tokenBudgetInput) {
    tokenBudgetInput.addEventListener('input', (e) => {
        lorebookData.token_budget = parseInt(e.target.value) || 2048;
    });
}

// 搜索功能
let searchTerm = '';
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderEntries();
    });
}

// 新增條目
if (addEntryBtn) {
    addEntryBtn.addEventListener('click', () => {
    const newEntry = {
        id: Date.now(),
        keys: [],
        secondary_keys: [],
        content: '',
        enabled: true,
        insertion_order: 100,
        case_sensitive: false,
        priority: 10,
        comment: '',
        use_regex: false,
        constant: false,
        selective: true,
        position: 'before_char',
        depth: 4,
        scan_depth: null,
        match_whole_words: false,
        use_group_scoring: false,
        automation_id: '',
        role: 0,
        vectorized: false,
        sticky: 0,
        cooldown: 0,
        delay: 0
    };
        lorebookData.entries.unshift(newEntry);
        renderEntries();
        updateStats();
    });
}

// 渲染條目列表
function renderEntries() {
    const filteredEntries = lorebookData.entries.filter(entry => {
        if (!searchTerm) return true;
        
        const searchableText = [
            entry.comment || '',
            entry.content || '',
            ...(entry.keys || []),
            ...(entry.secondary_keys || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm);
    });

    if (filteredEntries.length === 0) {
        if (searchTerm) {
            entriesList.innerHTML = `
                <div class="empty-state">
                    <p style="font-size: 48px; margin-bottom: 15px;">🔍</p>
                    <p style="font-size: 18px; font-weight: 600;">找不到匹配的條目</p>
                    <p class="hint">嘗試其他搜索關鍵詞</p>
                </div>
            `;
        } else {
            entriesList.innerHTML = `
                <div class="empty-state">
                    <p style="font-size: 48px; margin-bottom: 15px;">📚</p>
                    <p style="font-size: 18px; font-weight: 600;">暫無世界書條目</p>
                    <p class="hint">點擊「新增條目」開始創建你的世界設定</p>
                </div>
            `;
        }
        return;
    }

    const html = filteredEntries.map(entry => {
        const keywordsHtml = (entry.keys || []).map((key, index) => 
            `<span class="keyword-tag ${entry.use_regex ? 'regex-tag' : ''}">${escapeHtml(key)} <span class="remove-keyword" onclick="removeKeyword(${entry.id}, ${index})">×</span></span>`
        ).join('');

        return `
            <div class="entry-item" data-id="${entry.id}">
                <div class="entry-header">
                    <div class="entry-title">${escapeHtml(entry.comment || '未命名條目')}</div>
                    <div class="entry-actions">
                        <button class="btn-small btn-toggle ${entry.enabled ? '' : 'disabled'}" 
                                onclick="toggleEntry(${entry.id})">
                            ${entry.enabled ? '✓ 啟用' : '✗ 禁用'}
                        </button>
                        <button class="btn-small" onclick="moveEntry(${entry.id}, 'up')">↑</button>
                        <button class="btn-small" onclick="moveEntry(${entry.id}, 'down')">↓</button>
                        <button class="btn-small btn-delete" onclick="deleteEntry(${entry.id})">🗑️</button>
                    </div>
                </div>
                
                <div class="entry-form">
                    <div class="form-group">
                        <label>條目名稱</label>
                        <input type="text" value="${escapeHtml(entry.comment || '')}" 
                               onchange="updateEntryField(${entry.id}, 'comment', this.value)">
                    </div>

                    <div class="form-group">
                        <label>關鍵詞 ${entry.use_regex ? '(正則表達式)' : ''}</label>
                        <div class="keywords-input" onclick="focusKeywordInput(${entry.id})">
                            ${keywordsHtml}
                            <input type="text" 
                                   class="keyword-input-field" 
                                   id="keyword-input-${entry.id}"
                                   placeholder="輸入關鍵詞後按 Enter"
                                   onkeydown="handleKeywordInput(event, ${entry.id})">
                        </div>
                        <div class="help-text">按 Enter 添加關鍵詞，點擊 × 刪除</div>
                    </div>

                    <div class="form-group">
                        <label>內容</label>
                        <textarea rows="4" 
                                  onchange="updateEntryField(${entry.id}, 'content', this.value)"
                                  placeholder="當關鍵詞被觸發時插入的內容">${escapeHtml(entry.content || '')}</textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>插入順序</label>
                            <input type="number" value="${entry.insertion_order || 100}" 
                                   onchange="updateEntryField(${entry.id}, 'insertion_order', parseInt(this.value))">
                        </div>
                        <div class="form-group">
                            <label>優先級</label>
                            <input type="number" value="${entry.priority || 10}" 
                                   onchange="updateEntryField(${entry.id}, 'priority', parseInt(this.value))">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" ${entry.use_regex ? 'checked' : ''} 
                                       onchange="updateEntryField(${entry.id}, 'use_regex', this.checked)">
                                使用正則表達式
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" ${entry.case_sensitive ? 'checked' : ''} 
                                       onchange="updateEntryField(${entry.id}, 'case_sensitive', this.checked)">
                                區分大小寫
                            </label>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" ${entry.constant ? 'checked' : ''} 
                                       onchange="updateEntryField(${entry.id}, 'constant', this.checked)">
                                常駐（總是插入）
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" ${entry.match_whole_words ? 'checked' : ''} 
                                       onchange="updateEntryField(${entry.id}, 'match_whole_words', this.checked)">
                                匹配完整單詞
                            </label>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>插入位置</label>
                            <select onchange="updateEntryField(${entry.id}, 'position', this.value)">
                                <option value="before_char" ${entry.position === 'before_char' ? 'selected' : ''}>角色定義之前</option>
                                <option value="after_char" ${entry.position === 'after_char' ? 'selected' : ''}>角色定義之後</option>
                                <option value="before_example" ${entry.position === 'before_example' ? 'selected' : ''}>範例訊息之前</option>
                                <option value="after_example" ${entry.position === 'after_example' ? 'selected' : ''}>範例訊息之後</option>
                                <option value="before_author" ${entry.position === 'before_author' ? 'selected' : ''}>作者備註之前</option>
                                <option value="after_author" ${entry.position === 'after_author' ? 'selected' : ''}>作者備註之後</option>
                                <option value="top" ${entry.position === 'top' ? 'selected' : ''}>@D 🔧 在系統深度</option>
                                <option value="depth" ${entry.position === 'depth' ? 'selected' : ''}>@D 👤 在使用者深度</option>
                                <option value="ai_depth" ${entry.position === 'ai_depth' ? 'selected' : ''}>@D 🤖 在 AI 深度</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>深度 (Depth)</label>
                            <input type="number" value="${entry.depth || 4}" min="0" max="999"
                                   onchange="updateEntryField(${entry.id}, 'depth', parseInt(this.value))">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>角色過濾 (Role)</label>
                            <select onchange="updateEntryField(${entry.id}, 'role', parseInt(this.value))">
                                <option value="0" ${entry.role === 0 ? 'selected' : ''}>All types (default)</option>
                                <option value="1" ${entry.role === 1 ? 'selected' : ''}>System</option>
                                <option value="2" ${entry.role === 2 ? 'selected' : ''}>User</option>
                                <option value="3" ${entry.role === 3 ? 'selected' : ''}>Assistant</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>掃描深度 (Scan Depth)</label>
                            <input type="number" value="${entry.scan_depth || ''}" placeholder="留空使用全局設置"
                                   onchange="updateEntryField(${entry.id}, 'scan_depth', this.value ? parseInt(this.value) : null)">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>黏性 (Sticky)</label>
                            <input type="number" value="${entry.sticky || 0}" min="0"
                                   onchange="updateEntryField(${entry.id}, 'sticky', parseInt(this.value))">
                            <div class="help-text">觸發後保持激活的輪數</div>
                        </div>
                        <div class="form-group">
                            <label>冷卻 (Cooldown)</label>
                            <input type="number" value="${entry.cooldown || 0}" min="0"
                                   onchange="updateEntryField(${entry.id}, 'cooldown', parseInt(this.value))">
                            <div class="help-text">停用後的冷卻輪數</div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>延遲 (Delay)</label>
                            <input type="number" value="${entry.delay || 0}" min="0"
                                   onchange="updateEntryField(${entry.id}, 'delay', parseInt(this.value))">
                            <div class="help-text">觸發前的延遲輪數</div>
                        </div>
                        <div class="form-group">
                            <label>自動化 ID</label>
                            <input type="text" value="${escapeHtml(entry.automation_id || '')}" 
                                   onchange="updateEntryField(${entry.id}, 'automation_id', this.value)"
                                   placeholder="用於自動化觸發">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    entriesList.innerHTML = html;
}

// 更新統計
function updateStats() {
    totalEntriesEl.textContent = lorebookData.entries.length;
    enabledEntriesEl.textContent = lorebookData.entries.filter(e => e.enabled).length;
    regexEntriesEl.textContent = lorebookData.entries.filter(e => e.use_regex).length;
    
    const totalKeywords = lorebookData.entries.reduce((sum, e) => {
        return sum + (e.keys?.length || 0) + (e.secondary_keys?.length || 0);
    }, 0);
    totalKeywordsEl.textContent = totalKeywords;
}

// 更新條目字段
window.updateEntryField = function(entryId, field, value) {
    const entry = lorebookData.entries.find(e => e.id === entryId);
    if (entry) {
        entry[field] = value;
        if (field === 'use_regex') {
            renderEntries();
        }
        updateStats();
    }
};

// 切換啟用狀態
window.toggleEntry = function(entryId) {
    const entry = lorebookData.entries.find(e => e.id === entryId);
    if (entry) {
        entry.enabled = !entry.enabled;
        renderEntries();
        updateStats();
    }
};

// 移動條目
window.moveEntry = function(entryId, direction) {
    const index = lorebookData.entries.findIndex(e => e.id === entryId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
        [lorebookData.entries[index], lorebookData.entries[index - 1]] = 
        [lorebookData.entries[index - 1], lorebookData.entries[index]];
        renderEntries();
    } else if (direction === 'down' && index < lorebookData.entries.length - 1) {
        [lorebookData.entries[index], lorebookData.entries[index + 1]] = 
        [lorebookData.entries[index + 1], lorebookData.entries[index]];
        renderEntries();
    }
};

// 刪除條目
window.deleteEntry = function(entryId) {
    if (confirm('確定要刪除這個條目嗎？')) {
        lorebookData.entries = lorebookData.entries.filter(e => e.id !== entryId);
        renderEntries();
        updateStats();
    }
};

// 關鍵詞輸入處理
window.handleKeywordInput = function(event, entryId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const keyword = input.value.trim();
        
        if (keyword) {
            const entry = lorebookData.entries.find(e => e.id === entryId);
            if (entry) {
                if (!entry.keys) entry.keys = [];
                entry.keys.push(keyword);
                input.value = '';
                renderEntries();
                updateStats();
                
                // 重新聚焦輸入框
                setTimeout(() => {
                    document.getElementById(`keyword-input-${entryId}`)?.focus();
                }, 50);
            }
        }
    }
};

// 聚焦關鍵詞輸入
window.focusKeywordInput = function(entryId) {
    document.getElementById(`keyword-input-${entryId}`)?.focus();
};

// 刪除關鍵詞
window.removeKeyword = function(entryId, index) {
    const entry = lorebookData.entries.find(e => e.id === entryId);
    if (entry && entry.keys) {
        entry.keys.splice(index, 1);
        renderEntries();
        updateStats();
    }
};

// 導出 JSON
if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
    if (lorebookData.entries.length === 0) {
        alert('沒有條目可以導出！');
        return;
    }

    const exportData = {
        name: lorebookData.name || '未命名世界書',
        description: lorebookData.description || '',
        scan_depth: lorebookData.scan_depth,
        token_budget: lorebookData.token_budget,
        recursive_scanning: lorebookData.recursive_scanning,
        extensions: lorebookData.extensions,
        entries: lorebookData.entries.map((entry, index) => ({
            keys: entry.keys || [],
            content: entry.content || '',
            extensions: {},
            enabled: entry.enabled !== false,
            insertion_order: entry.insertion_order || 100,
            case_sensitive: entry.case_sensitive || false,
            name: entry.comment || `Entry ${index + 1}`,
            priority: entry.priority || 10,
            id: entry.id,
            comment: entry.comment || '',
            selective: entry.selective !== false,
            secondary_keys: entry.secondary_keys || [],
            constant: entry.constant || false,
            position: entry.position || 'before_char',
            use_regex: entry.use_regex || false,
            depth: entry.depth || 4,
            scan_depth: entry.scan_depth || null,
            match_whole_words: entry.match_whole_words || false,
            use_group_scoring: entry.use_group_scoring || false,
            automation_id: entry.automation_id || '',
            role: entry.role || 0,
            vectorized: entry.vectorized || false,
            sticky: entry.sticky || 0,
            cooldown: entry.cooldown || 0,
            delay: entry.delay || 0
        }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lorebookData.name || 'lorebook'}.json`;
    a.click();
    URL.revokeObjectURL(url);

        console.log('✓ 世界書導出成功');
        alert(`✓ 成功導出 ${lorebookData.entries.length} 個條目！`);
    });
}

// 導入 JSON
if (importJsonBtn && importJsonFile) {
    importJsonBtn.addEventListener('click', () => {
        importJsonFile.click();
    });
}

if (importJsonFile) {
    importJsonFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        // 檢查是否是世界書格式
        if (data.entries && Array.isArray(data.entries)) {
            lorebookData.name = data.name || '';
            lorebookData.description = data.description || '';
            lorebookData.scan_depth = data.scan_depth || 100;
            lorebookData.token_budget = data.token_budget || 2048;
            lorebookData.recursive_scanning = data.recursive_scanning || false;
            lorebookData.extensions = data.extensions || {};
            
            lorebookData.entries = data.entries.map(entry => ({
                id: entry.id || Date.now() + Math.random(),
                keys: entry.keys || [],
                secondary_keys: entry.secondary_keys || [],
                content: entry.content || '',
                enabled: entry.enabled !== false,
                insertion_order: entry.insertion_order || 100,
                case_sensitive: entry.case_sensitive || false,
                priority: entry.priority || 10,
                comment: entry.comment || entry.name || '',
                use_regex: entry.use_regex || false,
                constant: entry.constant || false,
                selective: entry.selective !== false,
                position: entry.position || 'before_char',
                depth: entry.depth || 4,
                scan_depth: entry.scan_depth || null,
                match_whole_words: entry.match_whole_words || false,
                use_group_scoring: entry.use_group_scoring || false,
                automation_id: entry.automation_id || '',
                role: entry.role || 0,
                vectorized: entry.vectorized || false,
                sticky: entry.sticky || 0,
                cooldown: entry.cooldown || 0,
                delay: entry.delay || 0
            }));

            // 更新界面
            if (lorebookNameInput) lorebookNameInput.value = lorebookData.name;
            if (lorebookDescriptionInput) lorebookDescriptionInput.value = lorebookData.description;
            if (scanDepthInput) scanDepthInput.value = lorebookData.scan_depth;
            if (tokenBudgetInput) tokenBudgetInput.value = lorebookData.token_budget;

            renderEntries();
            updateStats();

            alert(`✓ 成功導入 ${lorebookData.entries.length} 個條目！`);
        } else {
            alert('❌ 無效的世界書格式！');
        }
    } catch (error) {
        console.error('導入失敗:', error);
        alert('❌ 導入失敗: ' + error.message);
    }

        e.target.value = '';
    });
}

// 從 PNG 導入
if (importPngBtn && importPngFile) {
    importPngBtn.addEventListener('click', () => {
        importPngFile.click();
    });
}

if (importPngFile) {
    importPngFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const characterCard = await extractCharaData(uint8Array);

        if (characterCard) {
            const data = characterCard.data || characterCard;
            const characterBook = data.character_book || data.characterBook || data.lorebook;

            if (characterBook && characterBook.entries && characterBook.entries.length > 0) {
                if (confirm(`找到 ${characterBook.entries.length} 個世界書條目。是否導入？\n\n注意：這將覆蓋當前的世界書數據。`)) {
                    lorebookData.name = characterBook.name || data.name + ' Lorebook' || '';
                    lorebookData.description = characterBook.description || '';
                    lorebookData.scan_depth = characterBook.scan_depth || 100;
                    lorebookData.token_budget = characterBook.token_budget || 2048;
                    lorebookData.recursive_scanning = characterBook.recursive_scanning || false;
                    lorebookData.extensions = characterBook.extensions || {};
                    
                    lorebookData.entries = characterBook.entries.map(entry => ({
                        id: entry.id || Date.now() + Math.random(),
                        keys: entry.keys || [],
                        secondary_keys: entry.secondary_keys || [],
                        content: entry.content || '',
                        enabled: entry.enabled !== false,
                        insertion_order: entry.insertion_order || 100,
                        case_sensitive: entry.case_sensitive || false,
                        priority: entry.priority || 10,
                        comment: entry.comment || entry.name || '',
                        use_regex: entry.use_regex || false,
                        constant: entry.constant || false,
                        selective: entry.selective !== false,
                        position: entry.position || 'before_char',
                        depth: entry.depth || 4,
                        scan_depth: entry.scan_depth || null,
                        match_whole_words: entry.match_whole_words || false,
                        use_group_scoring: entry.use_group_scoring || false,
                        automation_id: entry.automation_id || '',
                        role: entry.role || 0,
                        vectorized: entry.vectorized || false,
                        sticky: entry.sticky || 0,
                        cooldown: entry.cooldown || 0,
                        delay: entry.delay || 0
                    }));

                    if (lorebookNameInput) lorebookNameInput.value = lorebookData.name;
                    if (lorebookDescriptionInput) lorebookDescriptionInput.value = lorebookData.description;
                    if (scanDepthInput) scanDepthInput.value = lorebookData.scan_depth;
                    if (tokenBudgetInput) tokenBudgetInput.value = lorebookData.token_budget;

                    renderEntries();
                    updateStats();

                    alert(`✓ 成功從 PNG 導入 ${lorebookData.entries.length} 個條目！`);
                }
            } else {
                alert('❌ 這個角色卡中沒有世界書數據！');
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
}

// 從 PNG 提取數據（複用主程序的函數）
async function extractCharaData(pngData) {
    // 驗證 PNG 簽名
    const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
    for (let i = 0; i < 8; i++) {
        if (pngData[i] !== pngSignature[i]) {
            return null;
        }
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
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
        if (confirm('確定要清空所有條目嗎？此操作無法撤銷！')) {
            lorebookData.entries = [];
            renderEntries();
            updateStats();
        }
    });
}

// 工具函數
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 初始化
updateStats();
