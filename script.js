// 調試信息
console.log('=== script.js 開始執行 ===');
console.log('當前時間:', new Date().toLocaleString());
console.log('DOM 狀態:', document.readyState);

// 追蹤條目收縮狀態
let collapsedEntries = new Set();

// 角色数据
let characterData = {
    name: '',
    description: '',
    personality: '',
    scenario: '',
    first_mes: '',
    mes_example: '',
    avatar: null,
    creator_notes: '',
    system_prompt: '',
    post_history_instructions: '',
    alternate_greetings: [],
    tags: [],
    creator: '',
    character_version: '',
    character_book: {
        entries: []
    },
    extensions: {
        regex_scripts: [],
        TavernHelper_scripts: [
            {
                "type": "script",
                "value": {
                    "id": "1f84fa2d-cd60-4015-be1b-cc801a8092be",
                    "name": "MVU Beta 脚本",
                    "content": "import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate@beta/artifact/bundle.js'",
                    "info": "",
                    "buttons": [
                        { "name": "重新处理变量", "visible": true },
                        { "name": "重新读取初始变量", "visible": false },
                        { "name": "清除旧楼层变量", "visible": false },
                        { "name": "快照楼层", "visible": false },
                        { "name": "重演楼层", "visible": false },
                        { "name": "重试额外模型解析", "visible": false }
                    ],
                    "data": {
                        "是否显示变量更新错误": "是",
                        "构建信息": "2025-10-26T17:02:43.500Z (generated)"
                    },
                    "enabled": true
                }
            }
        ]
    }
};

// 获取元素
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const personalityInput = document.getElementById('personality');
const scenarioInput = document.getElementById('scenario');
const firstMesInput = document.getElementById('first_mes');
const mesExampleInput = document.getElementById('mes_example');
const avatarInput = document.getElementById('avatar');
const avatarPreview = document.getElementById('avatar-preview');

const previewName = document.getElementById('previewName');
const previewDescription = document.getElementById('previewDescription');
const previewPersonality = document.getElementById('previewPersonality');
const previewScenario = document.getElementById('previewScenario');
const previewAvatar = document.getElementById('previewAvatar');

const exportBtn = document.getElementById('exportBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importBtn = document.getElementById('importBtn');
const clearBtn = document.getElementById('clearBtn');
const importFile = document.getElementById('importFile');
const worldBookBtn = document.getElementById('worldBookBtn');
const saveLocalBtn = document.getElementById('saveLocalBtn');
const loadLocalBtn = document.getElementById('loadLocalBtn');

// 調試：檢查主要按鈕元素
console.log('=== 主要按鈕元素檢查 ===');
console.log('exportBtn:', exportBtn ? '✓ 找到' : '✗ 未找到');
console.log('exportJsonBtn:', exportJsonBtn ? '✓ 找到' : '✗ 未找到');
console.log('importBtn:', importBtn ? '✓ 找到' : '✗ 未找到');
console.log('clearBtn:', clearBtn ? '✓ 找到' : '✗ 未找到');
console.log('worldBookBtn:', worldBookBtn ? '✓ 找到' : '✗ 未找到');
console.log('saveLocalBtn:', saveLocalBtn ? '✓ 找到' : '✗ 未找到');
console.log('loadLocalBtn:', loadLocalBtn ? '✓ 找到' : '✗ 未找到');

if (!exportBtn || !exportJsonBtn || !importBtn || !clearBtn) {
    console.error('⚠️ 警告：某些主要按鈕元素未找到！');
    console.error('這可能導致按鈕無法點擊。請檢查 HTML 中的元素 ID 是否正確。');
}

// 高级设置相关元素（已整合到进阶定义中）
const creatorInput = document.getElementById('creator');
const creatorNotesInput = document.getElementById('creator_notes');
const systemPromptInput = document.getElementById('system_prompt');
const postHistoryInput = document.getElementById('post_history_instructions');
const characterVersionInput = document.getElementById('character_version');
const tagsInput = document.getElementById('tags');

// 世界书相关元素
const worldBookModal = document.getElementById('worldBookModal');
const closeModalBtn = document.querySelector('.close');
const closeModalFooterBtn = document.getElementById('closeModalBtn');
const addEntryBtn = document.getElementById('addEntryBtn');
const entriesList = document.getElementById('entriesList');
const entryCount = document.getElementById('entryCount');

// 更新预览
function updatePreview() {
    previewName.textContent = characterData.name || '角色名称';
    previewDescription.textContent = characterData.description || '暂无描述';
    previewPersonality.textContent = characterData.personality || '暂无性格描述';
    previewScenario.textContent = characterData.scenario || '暂无场景设定';

    if (characterData.avatar) {
        previewAvatar.innerHTML = `<img src="${characterData.avatar}" alt="角色头像" style="width: 100%; height: 100%; object-fit: contain;">`;
    } else {
        previewAvatar.innerHTML = '<span class="placeholder-text">暂无头像</span>';
    }
}

// 输入事件监听
nameInput.addEventListener('input', (e) => {
    characterData.name = e.target.value;
    updatePreview();
});

descriptionInput.addEventListener('input', (e) => {
    characterData.description = e.target.value;
    updatePreview();
});

personalityInput.addEventListener('input', (e) => {
    characterData.personality = e.target.value;
    updatePreview();
});

scenarioInput.addEventListener('input', (e) => {
    characterData.scenario = e.target.value;
    updatePreview();
});

firstMesInput.addEventListener('input', (e) => {
    characterData.first_mes = e.target.value;
});

mesExampleInput.addEventListener('input', (e) => {
    characterData.mes_example = e.target.value;
});

// 备用开场白管理
function renderAlternateGreetings() {
    const container = document.getElementById('alternateGreetingsList');
    if (!container) {
        console.error('找不到 alternateGreetingsList 容器');
        return;
    }

    const greetings = characterData.alternate_greetings || [];
    console.log('渲染备用开场白，数量:', greetings.length);

    if (greetings.length === 0) {
        container.innerHTML = '<div class="empty-greeting">暂无备用开场白<br><span class="empty-greeting-hint">点击上方按钮添加</span></div>';
        return;
    }

    const html = greetings.map((greeting, index) => {
        const escapedGreeting = greeting.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `
        <div class="greeting-item">
            <div class="greeting-content">
                <div class="greeting-label">备用开场白 #${index + 1}</div>
                <textarea rows="3" 
                          class="greeting-textarea"
                          onchange="updateAlternateGreeting(${index}, this.value)">${escapedGreeting}</textarea>
            </div>
            <button type="button" class="btn-small btn-delete" onclick="removeAlternateGreeting(${index})" 
                    style="margin-top: 25px;">🗑️</button>
        </div>
    `;
    }).join('');

    container.innerHTML = html;
    console.log('✓ 已渲染', greetings.length, '个备用开场白');
}

window.addAlternateGreeting = function () {
    if (!characterData.alternate_greetings) {
        characterData.alternate_greetings = [];
    }
    characterData.alternate_greetings.push('');
    renderAlternateGreetings();
};

window.updateAlternateGreeting = function (index, value) {
    if (characterData.alternate_greetings) {
        characterData.alternate_greetings[index] = value;
    }
};

window.removeAlternateGreeting = function (index) {
    if (confirm('确定要删除这个备用开场白吗？')) {
        characterData.alternate_greetings.splice(index, 1);
        renderAlternateGreetings();
    }
};

// 头像上传
avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            characterData.avatar = event.target.result;
            avatarPreview.innerHTML = `<img src="${characterData.avatar}" alt="头像预览" style="max-width: 100%; height: auto; border-radius: 8px;">`;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
});

// 导出为 PNG (SillyTavern 格式)
console.log('=== 添加 exportBtn 事件監聽器 ===');
exportBtn.addEventListener('click', async () => {
    console.log('✓ exportBtn 被點擊！');
    if (!characterData.name) {
        alert('请至少填写角色名称！');
        return;
    }

    // 准备世界书数据
    let characterBook = null;
    if (characterData.character_book.entries.length > 0) {
        characterBook = {
            name: characterData.name + ' Lorebook',
            description: '',
            scan_depth: 100,
            token_budget: 2048,
            recursive_scanning: false,
            extensions: {},
            entries: characterData.character_book.entries.map((entry, index) => ({
                keys: entry.keys,
                content: entry.content,
                extensions: {},
                enabled: entry.enabled,
                insertion_order: entry.insertion_order,
                case_sensitive: entry.case_sensitive || false,
                name: entry.comment || `Entry ${index + 1}`,
                priority: entry.priority || 10,
                id: entry.id,
                comment: entry.comment || '',
                selective: true,
                secondary_keys: [],
                constant: false,
                position: 'before_char'
            }))
        };
    }

    // 打印导出前的数据
    console.log('=== 准备导出角色卡 ===');
    console.log('角色名称:', characterData.name);
    console.log('第一条消息 (first_mes):', characterData.first_mes ? '已设置 (' + characterData.first_mes.length + ' 字符)' : '未设置 ⚠️');
    console.log('备用开场白数量:', characterData.alternate_greetings?.length || 0);
    console.log('世界书条目:', characterData.character_book?.entries?.length || 0);

    // 创建 SillyTavern V2 格式的角色卡数据
    const characterCard = {
        spec: 'chara_card_v2',
        spec_version: '2.0',
        data: {
            name: characterData.name,
            description: characterData.description,
            personality: characterData.personality,
            scenario: characterData.scenario,
            first_mes: characterData.first_mes || '',
            mes_example: characterData.mes_example,
            creator_notes: characterData.creator_notes || '',
            system_prompt: characterData.system_prompt || '',
            post_history_instructions: characterData.post_history_instructions || '',
            alternate_greetings: characterData.alternate_greetings || [],
            character_book: characterBook,
            tags: characterData.tags || [],
            creator: characterData.creator || '',
            character_version: characterData.character_version || '',
            extensions: {
                talkativeness: '0.5',
                fav: false,
                world: '',
                depth_prompt: {
                    prompt: '',
                    depth: 4
                },
                regex_scripts: characterData.extensions?.regex_scripts || [],
                TavernHelper_scripts: characterData.extensions?.TavernHelper_scripts || []
            }
        }
    };

    // 验证导出的数据
    console.log('导出的 first_mes:', characterCard.data.first_mes ? '✓ 已包含' : '✗ 缺失');
    console.log('导出的 alternate_greetings:', characterCard.data.alternate_greetings.length, '个');

    try {
        // 使用头像或创建默认图片
        let imageData;
        if (characterData.avatar) {
            imageData = characterData.avatar;
        } else {
            // 创建默认头像
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');

            // 渐变背景
            const gradient = ctx.createLinearGradient(0, 0, 400, 600);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 400, 600);

            // 文字
            ctx.fillStyle = 'white';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(characterData.name, 200, 300);

            imageData = canvas.toDataURL('image/png');
        }

        // 将 JSON 数据嵌入到 PNG 的 tEXt chunk
        const base64Data = imageData.split(',')[1];
        const binaryData = atob(base64Data);
        const uint8Array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
        }

        // 创建带有 chara 数据的 PNG
        const pngWithMetadata = await embedCharaData(uint8Array, characterCard);

        // 下载文件
        const blob = new Blob([pngWithMetadata], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${characterData.name}.png`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('✓ PNG 角色卡导出成功');
        alert('✓ PNG 角色卡导出成功！');
    } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败: ' + error.message);
    }
});

// 导出为 JSON
console.log('=== 添加 exportJsonBtn 事件監聽器 ===');
exportJsonBtn.addEventListener('click', () => {
    console.log('✓ exportJsonBtn 被點擊！');
    if (!characterData.name) {
        alert('请至少填写角色名称！');
        return;
    }

    console.log('=== 准备导出 JSON 角色卡 ===');
    console.log('first_mes:', characterData.first_mes);
    console.log('first_mes 长度:', characterData.first_mes?.length || 0);

    // 准备世界书数据
    let characterBook = null;
    if (characterData.character_book.entries.length > 0) {
        characterBook = {
            name: characterData.name + ' Lorebook',
            description: '',
            scan_depth: 100,
            token_budget: 2048,
            recursive_scanning: false,
            extensions: {},
            entries: characterData.character_book.entries.map((entry, index) => ({
                keys: entry.keys,
                content: entry.content,
                extensions: {},
                enabled: entry.enabled,
                insertion_order: entry.insertion_order,
                case_sensitive: entry.case_sensitive || false,
                name: entry.comment || `Entry ${index + 1}`,
                priority: entry.priority || 10,
                id: entry.id,
                comment: entry.comment || '',
                selective: true,
                secondary_keys: entry.secondary_keys || [],
                constant: false,
                position: 'before_char',
                use_regex: entry.use_regex || false
            }))
        };
    }

    // 创建角色卡数据
    const characterCard = {
        spec: 'chara_card_v2',
        spec_version: '2.0',
        data: {
            name: characterData.name,
            description: characterData.description,
            personality: characterData.personality,
            scenario: characterData.scenario,
            first_mes: characterData.first_mes || '',
            mes_example: characterData.mes_example,
            creator_notes: characterData.creator_notes || '',
            system_prompt: characterData.system_prompt || '',
            post_history_instructions: characterData.post_history_instructions || '',
            alternate_greetings: characterData.alternate_greetings || [],
            character_book: characterBook,
            tags: characterData.tags || [],
            creator: characterData.creator || '',
            character_version: characterData.character_version || '',
            extensions: {
                talkativeness: '0.5',
                fav: false,
                world: '',
                depth_prompt: {
                    prompt: '',
                    depth: 4
                },
                regex_scripts: characterData.extensions?.regex_scripts || [],
                TavernHelper_scripts: characterData.extensions?.TavernHelper_scripts || []
            }
        }
    };

    console.log('JSON 中的 first_mes:', characterCard.data.first_mes);
    console.log('JSON 中的 alternate_greetings:', characterCard.data.alternate_greetings);

    // 下载 JSON 文件
    const jsonString = JSON.stringify(characterCard, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${characterData.name}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('✓ JSON 角色卡导出成功');
    alert('✓ JSON 角色卡导出成功！\n\n可以用文本编辑器打开查看内容。');
});

// 将角色数据嵌入 PNG
async function embedCharaData(pngData, characterCard) {
    const jsonString = JSON.stringify(characterCard);
    console.log('=== PNG 嵌入调试 ===');
    console.log('JSON 数据长度:', jsonString.length);
    console.log('first_mes 在 JSON 中:', jsonString.includes('"first_mes"') ? '✓ 存在' : '✗ 缺失');
    console.log('first_mes 值预览:', jsonString.match(/"first_mes":"([^"]{0,50})/)?.[1] || '未找到');
    console.log('完整 JSON 前 500 字符:', jsonString.substring(0, 500));

    // Base64 编码 JSON 数据（SillyTavern 标准格式）
    // 使用正确的 UTF-8 编码方式
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binaryString = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
        binaryString += String.fromCharCode(utf8Bytes[i]);
    }
    const base64Data = btoa(binaryString);
    console.log('Base64 编码后长度:', base64Data.length);
    console.log('Base64 前 100 字符:', base64Data.substring(0, 100));

    const textEncoder = new TextEncoder();
    const base64Bytes = textEncoder.encode(base64Data);

    // 查找 IEND chunk 的位置
    let iendIndex = -1;
    for (let i = 0; i < pngData.length - 3; i++) {
        if (pngData[i] === 0x49 && pngData[i + 1] === 0x45 &&
            pngData[i + 2] === 0x4E && pngData[i + 3] === 0x44) {
            iendIndex = i - 4; // 回退到长度字段
            break;
        }
    }

    if (iendIndex === -1) {
        throw new Error('无效的 PNG 文件');
    }

    // 创建 tEXt chunk（使用 base64 编码的数据）
    const keyword = 'chara';
    const keywordBytes = textEncoder.encode(keyword);
    const chunkData = new Uint8Array(keywordBytes.length + 1 + base64Bytes.length);
    chunkData.set(keywordBytes, 0);
    chunkData[keywordBytes.length] = 0; // null separator
    chunkData.set(base64Bytes, keywordBytes.length + 1);

    // 计算 CRC
    const chunkType = textEncoder.encode('tEXt');
    const crc = calculateCRC(new Uint8Array([...chunkType, ...chunkData]));

    // 构建完整的 chunk
    const chunkLength = chunkData.length;
    const chunk = new Uint8Array(4 + 4 + chunkLength + 4);
    const view = new DataView(chunk.buffer);
    view.setUint32(0, chunkLength, false);
    chunk.set(chunkType, 4);
    chunk.set(chunkData, 8);
    view.setUint32(8 + chunkLength, crc, false);

    // 组合新的 PNG
    const result = new Uint8Array(iendIndex + chunk.length + (pngData.length - iendIndex));
    result.set(pngData.slice(0, iendIndex), 0);
    result.set(chunk, iendIndex);
    result.set(pngData.slice(iendIndex), iendIndex + chunk.length);

    return result;
}

// CRC32 计算
function calculateCRC(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
        crc = crc ^ data[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
        }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

// 导入角色卡
importBtn.addEventListener('click', () => {
    importFile.click();
});

importFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        console.log('开始导入文件:', file.name, '大小:', file.size);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            console.log('文件读取完成，开始提取数据...');

            // 提取 chara 数据
            const characterCard = await extractCharaData(uint8Array);

            if (characterCard) {
                console.log('成功提取角色卡数据:', characterCard);

                // 兼容 V1 和 V2 格式
                const data = characterCard.data || characterCard;

                characterData.name = data.name || '';
                characterData.description = data.description || '';
                characterData.personality = data.personality || '';
                characterData.scenario = data.scenario || '';
                characterData.first_mes = data.first_mes || '';
                characterData.mes_example = data.mes_example || '';

                // V2 高级字段
                characterData.creator_notes = data.creator_notes || '';
                characterData.system_prompt = data.system_prompt || '';
                characterData.post_history_instructions = data.post_history_instructions || '';
                characterData.tags = data.tags || [];
                characterData.creator = data.creator || '';
                characterData.character_version = data.character_version || '';

                // 处理 alternate_greetings（备用开场白）
                if (data.alternate_greetings && Array.isArray(data.alternate_greetings)) {
                    characterData.alternate_greetings = data.alternate_greetings.filter(g => g && g.trim());
                    console.log('✓ 导入了', characterData.alternate_greetings.length, '个备用开场白（已过滤空白）');
                    console.log('备用开场白内容:', characterData.alternate_greetings.map((g, i) => `#${i + 1}: ${g.substring(0, 30)}...`));
                } else {
                    characterData.alternate_greetings = [];
                    console.log('未找到备用开场白');
                }

                // 导入 TavernHelper_scripts
                if (data.extensions?.TavernHelper_scripts) {
                    if (!characterData.extensions) characterData.extensions = {};
                    characterData.extensions.TavernHelper_scripts = data.extensions.TavernHelper_scripts;
                    console.log('✓ 导入了 TavernHelper_scripts');
                    console.log('  TavernHelper 数据:', data.extensions.TavernHelper_scripts);
                } else {
                    console.log('未找到 TavernHelper_scripts');
                    // 确保不保留旧的 TavernHelper 数据
                    if (characterData.extensions?.TavernHelper_scripts) {
                        delete characterData.extensions.TavernHelper_scripts;
                    }
                }

                // 打印所有导入的数据
                console.log('导入的数据摘要:');
                console.log('- 角色名称:', characterData.name);
                console.log('- 第一条消息:', characterData.first_mes ? '已设置' : '未设置');
                console.log('- 备用开场白数量:', characterData.alternate_greetings.length);
                console.log('- 标签:', characterData.tags.join(', ') || '无');
                console.log('- TavernHelper_scripts:', data.extensions?.TavernHelper_scripts ? '已导入' : '无');

                // 确保 extensions 对象存在
                if (!characterData.extensions) {
                    characterData.extensions = { regex_scripts: [] };
                }

                // 导入正则表达式脚本
                if (data.extensions?.regex_scripts) {
                    characterData.extensions.regex_scripts = data.extensions.regex_scripts.map(script => ({
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
                    console.log('✓ 导入了', characterData.extensions.regex_scripts.length, '个正则表达式脚本');
                } else {
                    characterData.extensions.regex_scripts = [];
                    console.log('未找到正则表达式脚本');
                }

                // 导入世界书（兼容多种格式和版本）
                characterData.character_book.entries = [];

                // 打印完整的数据结构以便调试
                console.log('完整的角色数据结构:', Object.keys(data));
                console.log('data.character_book 类型:', typeof data.character_book);

                // 检查各种可能的世界书位置（V1/V2/V3 兼容）
                let lorebook = data.character_book ||
                    data.characterBook ||
                    data.lorebook ||
                    data.world_book ||
                    data.extensions?.depth_prompt?.lorebook;

                // V3 格式可能在 extensions 中
                if (!lorebook && data.extensions) {
                    console.log('检查 extensions 中的世界书...');
                    for (const key in data.extensions) {
                        if (data.extensions[key] &&
                            (data.extensions[key].entries ||
                                data.extensions[key].lorebook)) {
                            lorebook = data.extensions[key].entries || data.extensions[key].lorebook;
                            console.log('在 extensions.' + key + ' 中找到世界书');
                            break;
                        }
                    }
                }

                if (lorebook) {
                    console.log('找到世界书数据，类型:', typeof lorebook);
                    console.log('世界书结构:', Object.keys(lorebook));

                    // 获取条目数组
                    let entries = null;
                    if (Array.isArray(lorebook.entries)) {
                        entries = lorebook.entries;
                        console.log('从 lorebook.entries 获取条目');
                    } else if (Array.isArray(lorebook)) {
                        entries = lorebook;
                        console.log('lorebook 本身是数组');
                    } else if (lorebook.entries && typeof lorebook.entries === 'object') {
                        // 可能是对象格式，转换为数组
                        entries = Object.values(lorebook.entries);
                        console.log('从对象格式转换为数组');
                    }

                    if (entries && entries.length > 0) {
                        console.log('找到', entries.length, '个世界书条目');

                        characterData.character_book.entries = entries.map((entry, idx) => {
                            // 打印完整的原始条目数据以便调试
                            console.log(`\n=== 原始条目 #${idx + 1} 数据 ===`);
                            console.log('所有字段:', Object.keys(entry));
                            console.log('完整数据:', JSON.stringify(entry, null, 2));

                            // 检查所有可能的正则表达式字段名
                            const useRegex = !!(
                                entry.use_regex ||
                                entry.useRegex ||
                                entry.regex ||
                                entry.is_regex ||
                                entry.isRegex ||
                                entry.extensions?.use_regex ||
                                entry.extensions?.regex ||
                                false
                            );

                            const processedEntry = {
                                id: entry.id || entry.uid || Date.now() + Math.random(),
                                keys: Array.isArray(entry.keys) ? entry.keys : (entry.key ? [entry.key] : []),
                                secondary_keys: Array.isArray(entry.secondary_keys) ? entry.secondary_keys : (Array.isArray(entry.secondaryKeys) ? entry.secondaryKeys : []),
                                content: entry.content || entry.text || '',
                                enabled: entry.enabled !== false && entry.disable !== true,
                                insertion_order: entry.insertion_order || entry.insertionOrder || entry.order || 100,
                                case_sensitive: entry.case_sensitive || entry.caseSensitive || false,
                                priority: entry.priority || 10,
                                comment: entry.comment || entry.name || entry.title || '',
                                use_regex: useRegex,
                                constant: entry.constant || false,
                                selective: entry.selective !== false,
                                position: entry.position || 'before_char'
                            };

                            console.log(`✓ 处理后的条目 #${idx + 1}: ${processedEntry.comment || '未命名'}`);
                            console.log(`  - 关键词: ${processedEntry.keys.join(', ')}`);
                            console.log(`  - 使用正则: ${processedEntry.use_regex ? '是 ✓' : '否 ✗'}`);
                            console.log(`  - 检查的正则字段:`, {
                                'entry.use_regex': entry.use_regex,
                                'entry.useRegex': entry.useRegex,
                                'entry.regex': entry.regex,
                                'entry.is_regex': entry.is_regex,
                                'entry.isRegex': entry.isRegex,
                                'entry.extensions?.use_regex': entry.extensions?.use_regex,
                                'entry.extensions?.regex': entry.extensions?.regex
                            });

                            return processedEntry;
                        });

                        console.log('✓ 成功导入', characterData.character_book.entries.length, '个世界书条目');
                    } else {
                        console.log('世界书中没有条目或条目为空');
                    }
                } else {
                    console.log('未找到世界书数据');
                    console.log('可用的字段:', Object.keys(data));

                    // 尝试直接在 data 中查找 entries
                    if (data.entries && Array.isArray(data.entries)) {
                        console.log('在 data.entries 中找到条目');
                        characterData.character_book.entries = data.entries.map((entry, idx) => {
                            const useRegex = entry.use_regex ||
                                entry.useRegex ||
                                entry.regex ||
                                entry.is_regex ||
                                entry.isRegex ||
                                false;

                            return {
                                id: entry.id || Date.now() + Math.random(),
                                keys: Array.isArray(entry.keys) ? entry.keys : [],
                                secondary_keys: Array.isArray(entry.secondary_keys) ? entry.secondary_keys : [],
                                content: entry.content || '',
                                enabled: entry.enabled !== false,
                                insertion_order: entry.insertion_order || 100,
                                case_sensitive: entry.case_sensitive || false,
                                priority: entry.priority || 10,
                                comment: entry.comment || entry.name || '',
                                use_regex: useRegex,
                                constant: entry.constant || false,
                                selective: entry.selective !== false,
                                position: entry.position || 'before_char'
                            };
                        });
                        console.log('✓ 从 data.entries 导入', characterData.character_book.entries.length, '个条目');
                    }
                }

                // 打印最终导入的世界书条目详情
                if (characterData.character_book.entries.length > 0) {
                    console.log('=== 最终导入的世界书条目 ===');
                    characterData.character_book.entries.forEach((entry, idx) => {
                        console.log(`条目 ${idx + 1}:`, {
                            comment: entry.comment,
                            keys: entry.keys,
                            use_regex: entry.use_regex,
                            enabled: entry.enabled
                        });
                    });
                }

                // 设置基础表单值
                try {
                    if (nameInput) nameInput.value = characterData.name;
                    if (descriptionInput) descriptionInput.value = characterData.description;
                    if (personalityInput) personalityInput.value = characterData.personality;
                    if (scenarioInput) scenarioInput.value = characterData.scenario;
                    if (firstMesInput) firstMesInput.value = characterData.first_mes;
                    if (mesExampleInput) mesExampleInput.value = characterData.mes_example;

                    console.log('✓ 基础表单值已设置');
                } catch (e) {
                    console.error('设置基础表单值时出错:', e);
                }

                // 渲染备用开场白（确保在所有数据加载后执行）
                try {
                    const greetingsCount = characterData.alternate_greetings?.length || 0;
                    console.log('=== 准备渲染备用开场白 ===');
                    console.log('数量:', greetingsCount);
                    console.log('数据:', characterData.alternate_greetings);

                    // 立即渲染一次
                    renderAlternateGreetings();

                    // 再延迟渲染一次确保成功
                    setTimeout(() => {
                        console.log('延迟渲染备用开场白...');
                        renderAlternateGreetings();
                    }, 200);

                    console.log('✓ 基础表单值已设置');
                } catch (e) {
                    console.error('设置基础表单值时出错:', e);
                }

                // 设置高级表单值（可能不存在）
                try {
                    if (creatorInput) {
                        creatorInput.value = characterData.creator || '';
                        console.log('✓ 创建者:', characterData.creator || '未设置');
                    }
                    if (creatorNotesInput) {
                        creatorNotesInput.value = characterData.creator_notes || '';
                    }
                    if (systemPromptInput) {
                        systemPromptInput.value = characterData.system_prompt || '';
                    }
                    if (postHistoryInput) {
                        postHistoryInput.value = characterData.post_history_instructions || '';
                    }
                    if (characterVersionInput) {
                        characterVersionInput.value = characterData.character_version || '';
                    }
                    if (tagsInput) {
                        tagsInput.value = (characterData.tags || []).join(', ');
                        console.log('✓ 标签:', (characterData.tags || []).join(', ') || '无');
                    }
                    // 备用开场白通过 alternateGreetingsList 管理
                    const greetings = characterData.alternate_greetings || [];
                    if (greetings.length > 0) {
                        console.log('✓ 备用开场白已设置:', greetings.length, '个');
                        if (greetings.length > 0) {
                            console.log('  第一个备用开场白预览:', greetings[0].substring(0, 50) + '...');
                        }
                    }

                    console.log('✓ 高级表单值已设置');
                } catch (e) {
                    console.warn('设置高级表单值时出错（可能是元素不存在）:', e);
                }

                // 设置头像 - PNG 文件本身就是头像
                try {
                    // 将 PNG 文件转换为 Data URL 用作头像
                    const avatarReader = new FileReader();
                    avatarReader.onload = (event) => {
                        characterData.avatar = event.target.result;
                        if (avatarPreview) {
                            avatarPreview.innerHTML = `<img src="${characterData.avatar}" alt="头像预览" style="max-width: 100%; height: auto; border-radius: 8px;">`;
                        }
                        updatePreview();
                        console.log('✓ 头像已从 PNG 文件加载');
                    };
                    avatarReader.readAsDataURL(file);
                } catch (e) {
                    console.warn('设置头像时出错:', e);
                }

                // 更新预览
                try {
                    updatePreview();
                    console.log('✓ 预览已更新');
                } catch (e) {
                    console.error('更新预览时出错:', e);
                }

                console.log('=== 角色卡导入完成 ===');
                console.log('角色名称:', characterData.name);
                console.log('第一条消息:', characterData.first_mes ? '已设置' : '未设置');
                console.log('备用开场白:', characterData.alternate_greetings?.length || 0, '个');
                console.log('世界书条目:', characterData.character_book?.entries?.length || 0);
                console.log('正则脚本:', characterData.extensions?.regex_scripts?.length || 0);
                console.log('TavernHelper_scripts:', characterData.extensions?.TavernHelper_scripts ? '已导入 ✓' : '无 ✗');

                const greetingsCount = (characterData.alternate_greetings?.length || 0);
                const totalGreetings = (characterData.first_mes ? 1 : 0) + greetingsCount;
                const hasTavernHelper = characterData.extensions?.TavernHelper_scripts ? '✓ 有' : '✗ 无';

                alert('✓ 角色卡导入成功！\n\n' +
                    '角色名称: ' + characterData.name + '\n' +
                    '开场白: ' + totalGreetings + ' 个 (主要 + ' + greetingsCount + ' 个备用)\n' +
                    '世界书条目: ' + (characterData.character_book?.entries?.length || 0) + '\n' +
                    '正则脚本: ' + (characterData.extensions?.regex_scripts?.length || 0) + '\n' +
                    'TavernHelper: ' + hasTavernHelper);
            } else {
                console.error('无法从 PNG 中提取角色卡数据');
                alert('无法读取角色卡数据\n\n请确保这是有效的 SillyTavern 角色卡 PNG 文件。\n请查看浏览器控制台（F12）获取详细错误信息。');
            }
        } catch (error) {
            console.error('导入失败，详细错误:', error);
            alert('导入失败: ' + error.message + '\n\n请查看浏览器控制台（F12）获取详细错误信息。');
        }

        // 重置文件输入，允许重新选择同一文件
        e.target.value = '';
    }
});

// 从 PNG 提取角色数据（兼容 V1 和 V2）
async function extractCharaData(pngData) {
    console.log('开始解析 PNG，文件大小:', pngData.length);

    // 验证 PNG 签名
    const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
    for (let i = 0; i < 8; i++) {
        if (pngData[i] !== pngSignature[i]) {
            console.error('无效的 PNG 文件签名');
            return null;
        }
    }

    // 查找 tEXt chunks
    let i = 8; // 跳过 PNG 签名
    let chunkCount = 0;

    while (i < pngData.length - 12) {
        try {
            const view = new DataView(pngData.buffer, pngData.byteOffset + i);
            const chunkLength = view.getUint32(0, false);

            // 防止无限循环
            if (chunkLength > pngData.length || chunkLength < 0) {
                console.warn('无效的 chunk 长度:', chunkLength);
                break;
            }

            // 读取 chunk 类型（ASCII，不需要 UTF-8）
            const chunkTypeBytes = pngData.slice(i + 4, i + 8);
            const chunkType = String.fromCharCode(...chunkTypeBytes);
            chunkCount++;

            console.log(`Chunk #${chunkCount}: ${chunkType}, 长度: ${chunkLength}`);

            if (chunkType === 'tEXt') {
                const chunkData = pngData.slice(i + 8, i + 8 + chunkLength);
                const nullIndex = chunkData.indexOf(0);

                if (nullIndex === -1) {
                    console.warn('tEXt chunk 中未找到 null 分隔符');
                    i += 12 + chunkLength;
                    continue;
                }

                // keyword 是 Latin-1 编码
                const keywordBytes = chunkData.slice(0, nullIndex);
                const keyword = String.fromCharCode(...keywordBytes);
                console.log('找到 tEXt keyword:', keyword);

                if (keyword === 'chara') {
                    // 数据部分 - 直接作为 Latin-1/binary 读取（用于 base64）
                    const dataBytes = chunkData.slice(nullIndex + 1);

                    // 将字节转换为字符串（不进行 UTF-8 解码，保持原始字节）
                    let jsonString = '';
                    for (let i = 0; i < dataBytes.length; i++) {
                        jsonString += String.fromCharCode(dataBytes[i]);
                    }

                    console.log('找到 chara 数据，长度:', jsonString.length);
                    console.log('数据预览:', jsonString.substring(0, 100));

                    // 首先尝试 base64 解码（SillyTavern 通常使用 base64）
                    let finalData = null;

                    try {
                        console.log('尝试 base64 解码...');
                        const decoded = atob(jsonString.trim());

                        // 将解码后的字符串转换为 UTF-8
                        const utf8Bytes = new Uint8Array(decoded.length);
                        for (let i = 0; i < decoded.length; i++) {
                            utf8Bytes[i] = decoded.charCodeAt(i);
                        }

                        // 使用 TextDecoder 正确解码 UTF-8
                        const utf8Decoder = new TextDecoder('utf-8');
                        const utf8String = utf8Decoder.decode(utf8Bytes);

                        const parsed = JSON.parse(utf8String);
                        console.log('✓ base64 解码成功');
                        finalData = parsed;
                    } catch (e) {
                        console.log('base64 解码失败，尝试直接解析 JSON');

                        try {
                            // 尝试直接解析 JSON
                            const parsed = JSON.parse(jsonString);
                            console.log('✓ 直接 JSON 解析成功');
                            finalData = parsed;
                        } catch (e2) {
                            console.error('JSON 解析失败:', e2.message);
                            console.log('原始数据（前500字符）:', jsonString.substring(0, 500));
                            return null;
                        }
                    }

                    if (finalData) {
                        console.log('成功提取角色数据');
                        console.log('角色名称:', finalData.name || finalData.data?.name);
                        console.log('数据格式:', finalData.spec || 'V1');

                        // 检测格式：V1, V2, V3
                        if (finalData.spec === 'chara_card_v2' || finalData.spec === 'chara_card_v3') {
                            console.log('✓ 检测到', finalData.spec, '格式');
                            const bookEntries = finalData.data?.character_book?.entries?.length || 0;
                            console.log('世界书条目数:', bookEntries);

                            // V3 转换为 V2（兼容性）
                            if (finalData.spec === 'chara_card_v3') {
                                return {
                                    spec: 'chara_card_v2',
                                    spec_version: '2.0',
                                    data: finalData.data
                                };
                            }
                            return finalData;
                        } else if (finalData.name) {
                            console.log('✓ 检测到 V1 格式，转换为 V2');
                            return {
                                spec: 'chara_card_v2',
                                spec_version: '2.0',
                                data: finalData
                            };
                        }
                        return finalData;
                    }
                }
            }

            if (chunkType === 'IEND') {
                console.log('到达 IEND chunk');
                break;
            }

            i += 12 + chunkLength;
        } catch (e) {
            console.error('解析 chunk 时出错:', e);
            break;
        }
    }

    console.log(`总共解析了 ${chunkCount} 个 chunks，未找到 chara 数据`);
    return null;
}

// 手动 UTF-8 解码函数（备用方案）
function decodeUTF8(bytes) {
    let result = '';
    let i = 0;

    while (i < bytes.length) {
        const byte1 = bytes[i++];

        if (byte1 < 0x80) {
            // 单字节字符 (ASCII)
            result += String.fromCharCode(byte1);
        } else if (byte1 < 0xE0) {
            // 双字节字符
            const byte2 = bytes[i++];
            result += String.fromCharCode(((byte1 & 0x1F) << 6) | (byte2 & 0x3F));
        } else if (byte1 < 0xF0) {
            // 三字节字符（包括大部分中文）
            const byte2 = bytes[i++];
            const byte3 = bytes[i++];
            result += String.fromCharCode(((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F));
        } else {
            // 四字节字符（emoji 等）
            const byte2 = bytes[i++];
            const byte3 = bytes[i++];
            const byte4 = bytes[i++];
            let codePoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F);
            codePoint -= 0x10000;
            result += String.fromCharCode(0xD800 + (codePoint >> 10), 0xDC00 + (codePoint & 0x3FF));
        }
    }

    return result;
}

// 清空表单
clearBtn.addEventListener('click', () => {
    if (confirm('确定要清空所有内容吗？')) {
        characterData = {
            name: '',
            description: '',
            personality: '',
            scenario: '',
            first_mes: '',
            mes_example: '',
            avatar: null,
            creator_notes: '',
            system_prompt: '',
            post_history_instructions: '',
            alternate_greetings: [],
            tags: [],
            creator: '',
            character_version: '',
            character_book: {
                entries: []
            },
            extensions: {
                regex_scripts: []
            }
        };

        nameInput.value = '';
        descriptionInput.value = '';
        personalityInput.value = '';
        scenarioInput.value = '';
        firstMesInput.value = '';
        mesExampleInput.value = '';
        avatarInput.value = '';
        avatarPreview.innerHTML = '';

        // 清空备用开场白
        renderAlternateGreetings();

        if (creatorInput) creatorInput.value = '';
        if (creatorNotesInput) creatorNotesInput.value = '';
        if (systemPromptInput) systemPromptInput.value = '';
        if (postHistoryInput) postHistoryInput.value = '';
        if (characterVersionInput) characterVersionInput.value = '';
        if (tagsInput) tagsInput.value = '';

        updatePreview();
    }
});

// 世界书功能
worldBookBtn.addEventListener('click', () => {
    worldBookModal.style.display = 'block';
    renderEntries();
});

closeModalBtn.addEventListener('click', () => {
    worldBookModal.style.display = 'none';
});

closeModalFooterBtn.addEventListener('click', () => {
    worldBookModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === worldBookModal) {
        worldBookModal.style.display = 'none';
    }
});

// 添加新条目
addEntryBtn.addEventListener('click', () => {
    const newEntry = {
        id: Date.now(),
        keys: [],
        content: '',
        enabled: true,
        insertion_order: 100,
        case_sensitive: false,
        priority: 10,
        comment: '',
        // 高级字段
        use_regex: false,
        constant: false,
        match_whole_words: false,
        position: 'before_char',
        depth: 4,
        role: 0,
        scan_depth: null,
        sticky: 0,
        cooldown: 0,
        delay: 0,
        automation_id: ''
    };

    characterData.character_book.entries.push(newEntry);
    renderEntries();
    
    // 滚动到新条目
    setTimeout(() => {
        const newEntryEl = document.querySelector(`[data-id="${newEntry.id}"]`);
        if (newEntryEl) {
            newEntryEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
});

// 世界书名称
const lorebookNameInput = document.getElementById('lorebookName');

if (lorebookNameInput) {
    lorebookNameInput.addEventListener('input', (e) => {
        if (!characterData.character_book) characterData.character_book = { entries: [] };
        characterData.character_book.name = e.target.value;
    });
}

// 搜索功能
let searchTerm = '';
const searchInput = document.getElementById('searchEntry');
const enabledCountEl = document.getElementById('enabledCount');

const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

function escapeHtmlValue(value = '') {
    return String(value).replace(/[&<>"']/g, (char) => htmlEscapeMap[char] || char);
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderEntries();
    });
}

// 渲染条目列表
function renderEntries() {
    const entries = characterData.character_book.entries;
    
    // 过滤搜索
    const filteredEntries = entries.filter(entry => {
        if (!searchTerm) return true;
        const searchableText = [
            entry.comment || '',
            entry.content || '',
            ...(entry.keys || [])
        ].join(' ').toLowerCase();
        return searchableText.includes(searchTerm);
    });

    entryCount.textContent = entries.length;
    if (enabledCountEl) {
        enabledCountEl.textContent = entries.filter(e => e.enabled).length;
    }

    // 更新世界书名称输入框
    if (lorebookNameInput && characterData.character_book.name !== undefined) {
        lorebookNameInput.value = characterData.character_book.name || '';
    }



    if (filteredEntries.length === 0) {

        const icon = searchTerm ? '🔍' : '🗂️';

        const title = searchTerm ? '找不到匹配的条目' : '还没有世界书条目';

        const hint = searchTerm ? '尝试其他搜索关键词' : '点击「新增条目」开始记录世界观、提示词与背景细节';

        entriesList.innerHTML = `

            <div class="worldbook-empty-state">

                <div class="empty-icon">${icon}</div>

                <p class="empty-title">${title}</p>

                <p class="hint">${hint}</p>

            </div>

        `;

        return;

    }

    entriesList.innerHTML = '';

    const fragment = document.createDocumentFragment();

    filteredEntries.forEach((entry, index) => {

        const displayName = entry.comment?.trim()

            ? escapeHtmlValue(entry.comment)

            : `条目 #${index + 1}`;

        const commentValue = escapeHtmlValue(entry.comment || '');

        const contentValue = escapeHtmlValue(entry.content || '');

        const automationValue = escapeHtmlValue(entry.automation_id || '');

        const keywords = entry.keys || [];

        const keywordsHtml = keywords.length

            ? keywords.map(key => `

                <span class="keyword-chip ${entry.use_regex ? 'regex-tag' : ''}">

                    ${escapeHtmlValue(key)}

                    <button type="button" onclick="removeKeyword(${entry.id}, '${key.replace(/'/g, "\\'")}')">×</button>
                </span>

            `).join('')

            : '<span class="keyword-chip chip-empty">暂无关键词</span>';

        const entryElement = document.createElement('article');

        entryElement.className = 'worldbook-entry';

        entryElement.setAttribute('data-id', entry.id);

        entryElement.innerHTML = `

            <div class="entry-header-modern" onclick="toggleEntryCollapse(${entry.id})" style="cursor: pointer;">

                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">

                    <button class="btn-collapse" onclick="event.stopPropagation(); toggleEntryCollapse(${entry.id})" title="展開/收縮">
                        <span class="collapse-icon">▼</span>
                    </button>

                    <div>

                        <p class="entry-label">条目 #${index + 1}</p>

                        <h3 class="entry-title">${displayName}</h3>

                        <p class="entry-meta">插入顺序 ${entry.insertion_order || 100} · 优先级 ${entry.priority || 10}</p>

                    </div>

                </div>

                <div class="entry-actions" onclick="event.stopPropagation()">

                    <button class="btn-small btn-toggle ${entry.enabled ? '' : 'disabled'}" onclick="toggleEntry(${entry.id})">

                        ${entry.enabled ? '✓ 启用' : '✗ 禁用'}

                    </button>

                    <button class="btn-icon" title="上移" onclick="moveEntry(${entry.id}, 'up')">↑</button>

                    <button class="btn-icon" title="下移" onclick="moveEntry(${entry.id}, 'down')">↓</button>

                    <button class="btn-small btn-delete" onclick="deleteEntry(${entry.id})">🗑️ 删除</button>

                </div>

            </div>

            <div class="entry-form" id="entry-form-${entry.id}">

                <div class="form-group">

                    <label>条目名称</label>

                    <input type="text" value="${commentValue}" placeholder="为此条目命名"

                           onchange="updateEntryField(${entry.id}, 'comment', this.value)">

                </div>

                <div class="form-group">

                    <label>关键词 ${entry.use_regex ? '(正则表达式)' : ''}</label>

                    <div class="keywords-input keyword-tray" id="keywords-${entry.id}" onclick="focusKeywordInput(${entry.id})">

                        ${keywordsHtml}

                        <input type="text" class="keyword-input-field" id="keyword-input-${entry.id}"

                               placeholder="输入关键词后按 Enter"

                               onkeydown="handleKeywordInput(event, ${entry.id})">

                    </div>

                    <div class="help-text">按 Enter 添加关键词，点击 × 删除</div>

                </div>

                <div class="form-group">

                    <label>内容</label>

                    <textarea rows="4" placeholder="当关键词被触发时插入的内容"

                              onchange="updateEntryContent(${entry.id}, this.value)">${contentValue}</textarea>

                </div>

                <div class="form-row">

                    <div class="form-group">

                        <label>插入顺序</label>

                        <input type="number" value="${entry.insertion_order || 100}"

                               onchange="updateEntryField(${entry.id}, 'insertion_order', parseInt(this.value))">

                    </div>

                    <div class="form-group">

                        <label>优先级</label>

                        <input type="number" value="${entry.priority || 10}"

                               onchange="updateEntryField(${entry.id}, 'priority', parseInt(this.value))">

                    </div>

                </div>

                <div class="form-row">

                    <div class="form-group">

                        <label>

                            <input type="checkbox" ${entry.use_regex ? 'checked' : ''} 

                                   onchange="updateEntryField(${entry.id}, 'use_regex', this.checked)">

                            使用正则表达式

                        </label>

                    </div>

                    <div class="form-group">

                        <label>

                            <input type="checkbox" ${entry.case_sensitive ? 'checked' : ''} 

                                   onchange="updateEntryField(${entry.id}, 'case_sensitive', this.checked)">

                            区分大小写

                        </label>

                    </div>

                </div>

                <div class="form-row">

                    <div class="form-group">

                        <label>

                            <input type="checkbox" ${entry.constant ? 'checked' : ''} 

                                   onchange="updateEntryField(${entry.id}, 'constant', this.checked)">

                            常驻（总是插入）

                        </label>

                    </div>

                    <div class="form-group">

                        <label>

                            <input type="checkbox" ${entry.match_whole_words ? 'checked' : ''} 

                                   onchange="updateEntryField(${entry.id}, 'match_whole_words', this.checked)">

                            匹配完整单词

                        </label>

                    </div>

                </div>

                <div class="form-row">

                    <div class="form-group">

                        <label>插入位置</label>

                        <select onchange="updateEntryField(${entry.id}, 'position', this.value)">

                            <option value="before_char" ${entry.position === 'before_char' ? 'selected' : ''}>角色定义之前</option>

                            <option value="after_char" ${entry.position === 'after_char' ? 'selected' : ''}>角色定义之后</option>

                            <option value="before_example" ${entry.position === 'before_example' ? 'selected' : ''}>范例消息之前</option>

                            <option value="after_example" ${entry.position === 'after_example' ? 'selected' : ''}>范例消息之后</option>

                            <option value="top" ${entry.position === 'top' ? 'selected' : ''}>@D 🔧 在系统深度</option>

                            <option value="depth" ${entry.position === 'depth' ? 'selected' : ''}>@D 👤 在用户深度</option>

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

                        <label>角色过滤 (Role)</label>

                        <select onchange="updateEntryField(${entry.id}, 'role', parseInt(this.value))">

                            <option value="0" ${(entry.role === 0 || !entry.role) ? 'selected' : ''}>All types (default)</option>

                            <option value="1" ${entry.role === 1 ? 'selected' : ''}>System</option>

                            <option value="2" ${entry.role === 2 ? 'selected' : ''}>User</option>

                            <option value="3" ${entry.role === 3 ? 'selected' : ''}>Assistant</option>

                        </select>

                    </div>

                    <div class="form-group">

                        <label>扫描深度 (Scan Depth)</label>

                        <input type="number" value="${entry.scan_depth || ''}" placeholder="留空使用全局设置"

                               onchange="updateEntryField(${entry.id}, 'scan_depth', this.value ? parseInt(this.value) : null)">

                    </div>

                </div>

                <div class="form-row">

                    <div class="form-group">

                        <label>黏性 (Sticky)</label>

                        <input type="number" value="${entry.sticky || 0}" min="0"

                               onchange="updateEntryField(${entry.id}, 'sticky', parseInt(this.value))">

                        <div class="help-text">触发后保持激活的轮数</div>

                    </div>

                    <div class="form-group">

                        <label>冷却 (Cooldown)</label>

                        <input type="number" value="${entry.cooldown || 0}" min="0"

                               onchange="updateEntryField(${entry.id}, 'cooldown', parseInt(this.value))">

                        <div class="help-text">停用后的冷却轮数</div>

                    </div>

                </div>

                <div class="form-row">

                    <div class="form-group">

                        <label>延迟 (Delay)</label>

                        <input type="number" value="${entry.delay || 0}" min="0"

                               onchange="updateEntryField(${entry.id}, 'delay', parseInt(this.value))">

                        <div class="help-text">触发前的延迟轮数</div>

                    </div>

                    <div class="form-group">

                        <label>自动化 ID</label>

                        <input type="text" value="${automationValue}"

                               onchange="updateEntryField(${entry.id}, 'automation_id', this.value)"

                               placeholder="用于自动化触发">

                    </div>

                </div>

            </div>

        `;

        fragment.appendChild(entryElement);

    });

    entriesList.appendChild(fragment);

    // 恢復收縮狀態
    filteredEntries.forEach(entry => {
        if (collapsedEntries.has(entry.id)) {
            const entryElement = document.querySelector(`.worldbook-entry[data-id="${entry.id}"]`);
            if (entryElement) {
                const formElement = entryElement.querySelector('.entry-form');
                const collapseIcon = entryElement.querySelector('.collapse-icon');
                if (formElement && collapseIcon) {
                    formElement.style.display = 'none';
                    collapseIcon.textContent = '▶';
                    entryElement.classList.add('collapsed');
                }
            }
        }
    });


// 聚焦关键词输入框
window.focusKeywordInput = function(entryId) {
    const input = document.getElementById(`keyword-input-${entryId}`);
    if (input) input.focus();
};

// 处理关键词输入
window.handleKeywordInput = function(event, entryId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const keyword = input.value.trim();

        if (keyword) {
            const entry = characterData.character_book.entries.find(e => e.id === entryId);
            if (entry && !entry.keys.includes(keyword)) {
                entry.keys.push(keyword);
                input.value = '';
                renderEntries();
                // 重新聚焦输入框
                setTimeout(() => focusKeywordInput(entryId), 50);
            }
        }
    }
};

// 添加关键词（保留旧函数以兼容）
window.addKeyword = function (event, entryId) {
    handleKeywordInput(event, entryId);
};

// 移除关键词
window.removeKeyword = function (entryId, keyword) {
    const entry = characterData.character_book.entries.find(e => e.id === entryId);
    if (entry) {
        entry.keys = entry.keys.filter(k => k !== keyword);
        renderEntries();
    }
};

// 更新条目内容
window.updateEntryContent = function (entryId, content) {
    const entry = characterData.character_book.entries.find(e => e.id === entryId);
    if (entry) {
        entry.content = content;
    }
};

// 更新条目字段
window.updateEntryField = function (entryId, field, value) {
    const entry = characterData.character_book.entries.find(e => e.id === entryId);
    if (entry) {
        entry[field] = value;
    }
};

// 收縮/展開條目
window.toggleEntryCollapse = function (entryId) {
    const entryElement = document.querySelector(`.worldbook-entry[data-id="${entryId}"]`);
    if (!entryElement) return;
    
    const formElement = entryElement.querySelector('.entry-form');
    const collapseIcon = entryElement.querySelector('.collapse-icon');
    
    if (!formElement || !collapseIcon) return;
    
    const isCollapsed = collapsedEntries.has(entryId);
    
    if (isCollapsed) {
        // 展開
        formElement.style.display = 'block';
        collapseIcon.textContent = '▼';
        entryElement.classList.remove('collapsed');
        collapsedEntries.delete(entryId);
    } else {
        // 收縮
        formElement.style.display = 'none';
        collapseIcon.textContent = '▶';
        entryElement.classList.add('collapsed');
        collapsedEntries.add(entryId);
    }
};

// 切换条目启用状态
window.toggleEntry = function (entryId) {
    const entry = characterData.character_book.entries.find(e => e.id === entryId);
    if (entry) {
        entry.enabled = !entry.enabled;
        renderEntries();
    }
};

// 删除条目
window.deleteEntry = function (entryId) {
    if (confirm('确定要删除这个条目吗？')) {
        characterData.character_book.entries = characterData.character_book.entries.filter(e => e.id !== entryId);
        renderEntries();
    }
};

// 移动条目
window.moveEntry = function(entryId, direction) {
    const entries = characterData.character_book.entries;
    const index = entries.findIndex(e => e.id === entryId);
    
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
        [entries[index], entries[index - 1]] = [entries[index - 1], entries[index]];
        renderEntries();
    } else if (direction === 'down' && index < entries.length - 1) {
        [entries[index], entries[index + 1]] = [entries[index + 1], entries[index]];
        renderEntries();
    }
};

// 高级设置输入监听（已整合到进阶定义中，不再需要模态框）
if (creatorInput) {
    creatorInput.addEventListener('input', (e) => {
        characterData.creator = e.target.value;
    });
}

if (creatorNotesInput) {
    creatorNotesInput.addEventListener('input', (e) => {
        characterData.creator_notes = e.target.value;
    });
}

if (systemPromptInput) {
    systemPromptInput.addEventListener('input', (e) => {
        characterData.system_prompt = e.target.value;
    });
}

if (postHistoryInput) {
    postHistoryInput.addEventListener('input', (e) => {
        characterData.post_history_instructions = e.target.value;
    });
}

if (characterVersionInput) {
    characterVersionInput.addEventListener('input', (e) => {
        characterData.character_version = e.target.value;
    });
}

if (tagsInput) {
    tagsInput.addEventListener('input', (e) => {
        characterData.tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    });
}

// 备用开场白通过 addAlternateGreeting 等函数管理，不需要单独的 input 监听器

// 浏览器本地存储功能
const STORAGE_KEY = 'sillytavern_character_drafts';
const AUTOSAVE_KEY = 'sillytavern_autosave';

// 自动保存功能（每30秒）
let autoSaveTimer = null;
function startAutoSave() {
    if (autoSaveTimer) clearInterval(autoSaveTimer);

    autoSaveTimer = setInterval(() => {
        if (characterData.name) {
            saveToLocalStorage(AUTOSAVE_KEY, characterData);
            console.log('自动保存完成');
        }
    }, 30000); // 30秒
}

// 保存到浏览器
function saveToLocalStorage(key, data) {
    try {
        const saveData = {
            ...data,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(saveData));
        return true;
    } catch (e) {
        console.error('保存失败:', e);
        if (e.name === 'QuotaExceededError') {
            alert('浏览器存储空间不足！请清理一些旧的保存数据。');
        }
        return false;
    }
}

// 从浏览器加载
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('加载失败:', e);
    }
    return null;
}

// 获取所有保存的草稿
function getAllDrafts() {
    const drafts = [];
    try {
        const draftsData = localStorage.getItem(STORAGE_KEY);
        if (draftsData) {
            return JSON.parse(draftsData);
        }
    } catch (e) {
        console.error('读取草稿列表失败:', e);
    }
    return drafts;
}

// 保存草稿到列表
function saveDraftToList(draft) {
    const drafts = getAllDrafts();
    const existingIndex = drafts.findIndex(d => d.name === draft.name);

    if (existingIndex >= 0) {
        drafts[existingIndex] = draft;
    } else {
        drafts.push(draft);
    }

    // 限制最多保存20个草稿
    if (drafts.length > 20) {
        drafts.shift();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

// 保存按钮
saveLocalBtn.addEventListener('click', () => {
    if (!characterData.name) {
        alert('请至少填写角色名称！');
        return;
    }

    const confirmed = confirm(`确定要保存角色 "${characterData.name}" 到浏览器吗？\n\n这将覆盖同名的旧保存。`);
    if (confirmed) {
        saveDraftToList(characterData);
        alert(`✓ 角色 "${characterData.name}" 已保存到浏览器！\n\n数据会一直保存，直到你清除浏览器数据。`);
    }
});

// 加载按钮
loadLocalBtn.addEventListener('click', () => {
    const drafts = getAllDrafts();

    if (drafts.length === 0) {
        alert('浏览器中没有保存的角色卡。\n\n你可以先创建角色卡，然后点击"保存到浏览器"按钮。');
        return;
    }

    // 创建选择对话框
    showLoadDialog(drafts);
});

// 显示加载对话框
function showLoadDialog(drafts) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';

    const sortedDrafts = drafts.sort((a, b) =>
        new Date(b.savedAt) - new Date(a.savedAt)
    );

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>📂 加载保存的角色卡</h2>
                <span class="close-load-dialog">&times;</span>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px; color: #666;">
                    共有 ${drafts.length} 个保存的角色卡
                </div>
                <div class="drafts-list">
                    ${sortedDrafts.map((draft, index) => `
                        <div class="draft-item" style="padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s;" 
                             onmouseover="this.style.borderColor='#667eea'; this.style.backgroundColor='#f8f9ff';"
                             onmouseout="this.style.borderColor='#e0e0e0'; this.style.backgroundColor='white';"
                             onclick="loadDraft(${index})">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 5px;">
                                        ${draft.name || '未命名角色'}
                                    </div>
                                    <div style="font-size: 14px; color: #666;">
                                        保存时间: ${new Date(draft.savedAt).toLocaleString('zh-CN')}
                                    </div>
                                    ${draft.description ? `<div style="font-size: 13px; color: #999; margin-top: 5px; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${draft.description}</div>` : ''}
                                </div>
                                <button class="btn-small btn-delete" onclick="event.stopPropagation(); deleteDraft(${index});" style="padding: 8px 15px;">删除</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" onclick="clearAllDrafts()" style="margin-right: auto;">清空所有</button>
                <button class="btn btn-secondary close-load-dialog">取消</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 关闭对话框
    const closeButtons = modal.querySelectorAll('.close-load-dialog');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// 加载草稿
window.loadDraft = function (index) {
    const drafts = getAllDrafts();
    const draft = drafts[index];

    if (draft) {
        // 加载数据
        characterData.name = draft.name || '';
        characterData.description = draft.description || '';
        characterData.personality = draft.personality || '';
        characterData.scenario = draft.scenario || '';
        characterData.first_mes = draft.first_mes || '';
        characterData.mes_example = draft.mes_example || '';
        characterData.avatar = draft.avatar || null;
        characterData.creator_notes = draft.creator_notes || '';
        characterData.system_prompt = draft.system_prompt || '';
        characterData.post_history_instructions = draft.post_history_instructions || '';
        characterData.alternate_greetings = draft.alternate_greetings || [];
        characterData.tags = draft.tags || [];
        characterData.creator = draft.creator || '';
        characterData.character_version = draft.character_version || '';
        characterData.character_book.entries = draft.character_book?.entries || [];

        // 更新表单
        nameInput.value = characterData.name;
        descriptionInput.value = characterData.description;
        personalityInput.value = characterData.personality;
        scenarioInput.value = characterData.scenario;
        firstMesInput.value = characterData.first_mes;
        mesExampleInput.value = characterData.mes_example;

        if (creatorInput) creatorInput.value = characterData.creator;
        if (creatorNotesInput) creatorNotesInput.value = characterData.creator_notes;
        if (systemPromptInput) systemPromptInput.value = characterData.system_prompt;
        if (postHistoryInput) postHistoryInput.value = characterData.post_history_instructions;
        if (characterVersionInput) characterVersionInput.value = characterData.character_version;
        if (tagsInput) tagsInput.value = characterData.tags.join(', ');

        if (characterData.avatar) {
            avatarPreview.innerHTML = `<img src="${characterData.avatar}" alt="头像预览">`;
        } else {
            avatarPreview.innerHTML = '';
        }

        updatePreview();

        // 关闭对话框
        const modal = document.querySelector('.modal');
        if (modal) {
            document.body.removeChild(modal);
        }

        alert(`✓ 已加载角色 "${characterData.name}"`);
    }
};

// 删除草稿
window.deleteDraft = function (index) {
    const drafts = getAllDrafts();
    const draft = drafts[index];

    if (confirm(`确定要删除角色 "${draft.name}" 吗？`)) {
        drafts.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));

        // 刷新对话框
        const modal = document.querySelector('.modal');
        if (modal) {
            document.body.removeChild(modal);
        }
        showLoadDialog(drafts);
    }
};

// 清空所有草稿
window.clearAllDrafts = function () {
    if (confirm('确定要清空所有保存的角色卡吗？\n\n此操作不可恢复！')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(AUTOSAVE_KEY);

        const modal = document.querySelector('.modal');
        if (modal) {
            document.body.removeChild(modal);
        }

        alert('✓ 已清空所有保存的角色卡');
    }
};

// 页面加载时检查自动保存
window.addEventListener('load', () => {
    const autosave = loadFromLocalStorage(AUTOSAVE_KEY);
    if (autosave && autosave.name) {
        const loadAutosave = confirm(`检测到自动保存的角色卡 "${autosave.name}"\n\n是否加载？`);
        if (loadAutosave) {
            window.loadDraft = function () {
                characterData = autosave;
                // 更新表单...（同上）
            };
            // 触发加载
            Object.assign(characterData, autosave);
            nameInput.value = characterData.name;
            descriptionInput.value = characterData.description;
            personalityInput.value = characterData.personality;
            scenarioInput.value = characterData.scenario;
            firstMesInput.value = characterData.first_mes;
            mesExampleInput.value = characterData.mes_example;
            if (characterData.avatar) {
                avatarPreview.innerHTML = `<img src="${characterData.avatar}" alt="头像预览">`;
            }
            updatePreview();
        }
    }
});

// 正则表达式编辑器功能
console.log('=== 初始化正則表達式編輯器 ===');
const regexEditorModal = document.getElementById('regexEditorModal');
console.log('regexEditorModal 元素:', regexEditorModal);
const closeRegexBtns = document.querySelectorAll('.close-regex');
console.log('找到', closeRegexBtns.length, '個關閉按鈕');

if (regexEditorModal) {
    console.log('✓ regexEditorModal 存在，正在初始化...');
    
    closeRegexBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            regexEditorModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === regexEditorModal) {
            regexEditorModal.style.display = 'none';
        }
    });

    // 打开正则表达式编辑器
    window.openRegexEditor = function () {
        console.log('openRegexEditor 被調用');
        regexEditorModal.style.display = 'block';
    };
    
    console.log('✓ openRegexEditor 函數已定義');
} else {
    console.error('✗ regexEditorModal 元素未找到！');
    console.log('DOM 狀態:', document.readyState);
    console.log('所有 modal 元素:', document.querySelectorAll('.modal').length);
    
    // 提供一個空函數避免錯誤
    window.openRegexEditor = function () {
        console.error('正則表達式編輯器未初始化');
        alert('正則表達式編輯器未找到，請檢查頁面是否正確加載。\n\nDOM 狀態: ' + document.readyState);
    };
    
    console.log('✓ 已定義備用 openRegexEditor 函數');
}

console.log('window.openRegexEditor 類型:', typeof window.openRegexEditor);

// 為按鈕添加事件監聽器
const openRegexEditorBtn = document.getElementById('openRegexEditorBtn');
if (openRegexEditorBtn) {
    console.log('✓ 找到 openRegexEditorBtn，添加事件監聽器');
    openRegexEditorBtn.addEventListener('click', function() {
        console.log('按鈕被點擊');
        const modal = document.getElementById('regexEditorModal');
        if (modal) {
            console.log('打開模態框');
            modal.style.display = 'block';
        } else {
            console.error('找不到 regexEditorModal 元素');
            alert('正則表達式編輯器未找到');
        }
    });
} else {
    console.warn('✗ openRegexEditorBtn 按鈕未找到');
}

console.log('=== 正則表達式編輯器初始化完成 ===');

// 测试正则表达式
window.testRegex = function () {
    const pattern = document.getElementById('regexPattern').value;
    const testText = document.getElementById('regexTestText').value;
    const caseSensitive = document.getElementById('regexCaseSensitive').checked;
    const resultDiv = document.getElementById('regexResult');
    const resultText = document.getElementById('regexResultText');

    if (!pattern) {
        alert('请输入正则表达式！');
        return;
    }

    if (!testText) {
        alert('请输入测试文本！');
        return;
    }

    try {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(pattern, flags);
        const matches = testText.match(regex);

        resultDiv.style.display = 'block';

        if (matches && matches.length > 0) {
            resultText.innerHTML = `
                <div class="regex-success">
                    ✓ 匹配成功！找到 ${matches.length} 个匹配项
                </div>
                <div class="regex-result-box">
                    <strong>匹配的内容：</strong>
                    <ul class="regex-match-list">
                        ${matches.map(m => `<li><code class="regex-match-code">${m}</code></li>`).join('')}
                    </ul>
                </div>
                <div class="regex-result-box">
                    <strong>高亮显示：</strong>
                    <div class="regex-highlight-text">
                        ${testText.replace(regex, match => `<span class="regex-highlight">${match}</span>`)}
                    </div>
                </div>
            `;
        } else {
            resultText.innerHTML = `
                <div class="regex-error">
                    ✗ 没有找到匹配项
                </div>
                <div class="regex-error-text">
                    正则表达式 <code class="regex-pattern-code">${pattern}</code> 
                    在测试文本中没有找到匹配的内容。
                </div>
            `;
        }
    } catch (e) {
        resultDiv.style.display = 'block';
        resultText.innerHTML = `
            <div class="regex-error">
                ✗ 正则表达式错误
            </div>
            <div class="regex-error-text">
                ${e.message}
            </div>
            <div class="regex-hint">
                <strong>提示：</strong>请检查正则表达式语法是否正确。
            </div>
        `;
    }
};

// 插入正则表达式示例
window.insertRegexExample = function (example) {
    document.getElementById('regexPattern').value = example;
};

// 显示正则表达式帮助
window.showRegexHelp = function () {
    alert(`正则表达式常用语法：

基础匹配：
• . - 匹配任意单个字符
• * - 匹配前面的字符 0 次或多次
• + - 匹配前面的字符 1 次或多次
• ? - 匹配前面的字符 0 次或 1 次

边界：
• ^ - 匹配字符串开头
• $ - 匹配字符串结尾
• \\b - 匹配单词边界

字符类：
• [abc] - 匹配 a、b 或 c
• [^abc] - 匹配除了 a、b、c 之外的字符
• [a-z] - 匹配 a 到 z 的任意字符
• \\d - 匹配数字 [0-9]
• \\w - 匹配字母、数字、下划线
• \\s - 匹配空白字符

分组：
• (abc) - 分组
• (a|b) - 匹配 a 或 b

示例：
• \\b魔法\\b - 精确匹配"魔法"这个词
• ^你好 - 匹配以"你好"开头
• (龙|dragon) - 匹配"龙"或"dragon"
• \\d+ - 匹配一个或多个数字`);
};

// 正则脚本管理功能
const regexScriptsModal = document.getElementById('regexScriptsModal');
const regexScriptsBtn = document.getElementById('regexScriptsBtn');
const closeRegexScriptsBtns = document.querySelectorAll('.close-regex-scripts');
const addRegexScriptBtn = document.getElementById('addRegexScriptBtn');
const regexScriptsList = document.getElementById('regexScriptsList');
const regexScriptCount = document.getElementById('regexScriptCount');

if (regexScriptsBtn && regexScriptsModal) {
    regexScriptsBtn.addEventListener('click', () => {
        regexScriptsModal.style.display = 'block';
        renderRegexScripts();
    });

    closeRegexScriptsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            regexScriptsModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === regexScriptsModal) {
            regexScriptsModal.style.display = 'none';
        }
    });
}

// 添加新脚本
if (addRegexScriptBtn) {
    addRegexScriptBtn.addEventListener('click', () => {
    const newScript = {
        id: crypto.randomUUID(),
        scriptName: '新脚本',
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

    if (!characterData.extensions) characterData.extensions = {};
    if (!characterData.extensions.regex_scripts) characterData.extensions.regex_scripts = [];

    characterData.extensions.regex_scripts.push(newScript);
    renderRegexScripts();
    });
}

// 渲染正则脚本列表
function renderRegexScripts() {
    if (!characterData.extensions) characterData.extensions = {};
    if (!characterData.extensions.regex_scripts) characterData.extensions.regex_scripts = [];

    const scripts = characterData.extensions.regex_scripts;
    regexScriptCount.textContent = scripts.length;

    if (scripts.length === 0) {
        regexScriptsList.innerHTML = `
            <div class="empty-state">
                <p>暂无正则脚本</p>
                <p class="hint">正则脚本用于在发送给 AI 之前对文本进行查找和替换</p>
            </div>
        `;
        return;
    }

    regexScriptsList.innerHTML = scripts.map((script, index) => `
        <div class="entry-item" data-id="${script.id}">
            <div class="entry-header">
                <div class="entry-title">${script.scriptName || '未命名脚本'}</div>
                <div class="entry-actions">
                    <button class="btn-small btn-toggle ${script.disabled ? 'disabled' : ''}" onclick="toggleRegexScript('${script.id}')">
                        ${script.disabled ? '✗ 禁用' : '✓ 启用'}
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteRegexScript('${script.id}')">🗑️ 删除</button>
                </div>
            </div>
            
            <div class="entry-form">
                <div class="form-group">
                    <label>脚本名称</label>
                    <input type="text" value="${script.scriptName || ''}" 
                           onchange="updateRegexScriptField('${script.id}', 'scriptName', this.value)">
                </div>
                
                <div class="form-group">
                    <label>查找正则表达式</label>
                    <input type="text" value="${script.findRegex || ''}" 
                           placeholder="例如：<StatusPlaceHolderImpl/>"
                           style="font-family: 'Courier New', monospace;"
                           onchange="updateRegexScriptField('${script.id}', 'findRegex', this.value)">
                    <div class="help-text">要查找的正则表达式模式</div>
                </div>
                
                <div class="form-group">
                    <label>替换为</label>
                    <textarea rows="3" 
                              placeholder="留空表示删除匹配的内容"
                              onchange="updateRegexScriptField('${script.id}', 'replaceString', this.value)">${script.replaceString || ''}</textarea>
                    <div class="help-text">替换成的文本（留空表示删除）</div>
                </div>
                
                <div class="form-group">
                    <label>修剪字符串（可选）</label>
                    <input type="text" value="${(script.trimStrings || []).join(', ')}" 
                           placeholder="用逗号分隔多个字符串"
                           onchange="updateRegexScriptTrimStrings('${script.id}', this.value)">
                    <div class="help-text">在替换之前，全局修剪正则表达式匹配中的任何不需要的部分</div>
                </div>
                
                <div class="checkbox-group">
                    <strong class="checkbox-group-title">影响模组</strong>
                    <div class="checkbox-grid">
                        <label class="checkbox-label">
                            <input type="checkbox" ${(script.placement || []).includes(0) ? 'checked' : ''} 
                                   onchange="togglePlacement('${script.id}', 0, this.checked)">
                            <span>使用者输入</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" ${(script.placement || []).includes(1) ? 'checked' : ''} 
                                   onchange="togglePlacement('${script.id}', 1, this.checked)">
                            <span>AI 输出</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" ${(script.placement || []).includes(2) ? 'checked' : ''} 
                                   onchange="togglePlacement('${script.id}', 2, this.checked)">
                            <span>封锁命令</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" ${(script.placement || []).includes(3) ? 'checked' : ''} 
                                   onchange="togglePlacement('${script.id}', 3, this.checked)">
                            <span>世界资讯</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" ${(script.placement || []).includes(4) ? 'checked' : ''} 
                                   onchange="togglePlacement('${script.id}', 4, this.checked)">
                            <span>推理</span>
                        </label>
                    </div>
                </div>
                
                <div class="checkbox-group">
                    <strong class="checkbox-group-title">其他选项</strong>
                    <div class="checkbox-grid">
                        <label class="checkbox-label">
                            <input type="checkbox" ${script.runOnEdit ? 'checked' : ''} 
                                   onchange="updateRegexScriptField('${script.id}', 'runOnEdit', this.checked)">
                            <span>编辑时执行</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" ${script.promptOnly ? 'checked' : ''} 
                                   onchange="updateRegexScriptField('${script.id}', 'promptOnly', this.checked)">
                            <span>仅修改最终提示</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" ${script.markdownOnly ? 'checked' : ''} 
                                   onchange="updateRegexScriptField('${script.id}', 'markdownOnly', this.checked)">
                            <span>仅修改系统提示词</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>已替换模式（纯文字匹配）</label>
                    <select onchange="updateRegexScriptField('${script.id}', 'substituteRegex', parseInt(this.value))"
                            style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        <option value="0" ${script.substituteRegex === 0 ? 'selected' : ''}>不替换（纯文字匹配）</option>
                        <option value="1" ${script.substituteRegex === 1 ? 'selected' : ''}>替换 {{macros}}</option>
                        <option value="2" ${script.substituteRegex === 2 ? 'selected' : ''}>替换 {{macros}} 和 {{getvar::}}</option>
                    </select>
                    <div class="help-text">是否在正则表达式中替换宏</div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>最小深度</label>
                        <input type="number" value="${script.minDepth || ''}" 
                               placeholder="无限制"
                               onchange="updateRegexScriptField('${script.id}', 'minDepth', this.value ? parseInt(this.value) : null)">
                        <div class="help-text">最小聊天深度</div>
                    </div>
                    
                    <div class="form-group">
                        <label>最大深度</label>
                        <input type="number" value="${script.maxDepth || ''}" 
                               placeholder="无限制"
                               onchange="updateRegexScriptField('${script.id}', 'maxDepth', this.value ? parseInt(this.value) : null)">
                        <div class="help-text">最大聊天深度</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 更新脚本字段
window.updateRegexScriptField = function (scriptId, field, value) {
    const script = characterData.extensions.regex_scripts.find(s => s.id === scriptId);
    if (script) {
        script[field] = value;
    }
};

// 更新修剪字符串
window.updateRegexScriptTrimStrings = function (scriptId, value) {
    const script = characterData.extensions.regex_scripts.find(s => s.id === scriptId);
    if (script) {
        script.trimStrings = value.split(',').map(s => s.trim()).filter(s => s);
    }
};

// 切换影响模组
window.togglePlacement = function (scriptId, placementValue, checked) {
    const script = characterData.extensions.regex_scripts.find(s => s.id === scriptId);
    if (script) {
        if (!script.placement) script.placement = [];

        if (checked) {
            if (!script.placement.includes(placementValue)) {
                script.placement.push(placementValue);
            }
        } else {
            script.placement = script.placement.filter(p => p !== placementValue);
        }
    }
};

// 切换脚本启用状态
window.toggleRegexScript = function (scriptId) {
    const script = characterData.extensions.regex_scripts.find(s => s.id === scriptId);
    if (script) {
        script.disabled = !script.disabled;
        renderRegexScripts();
    }
};

// 删除脚本
window.deleteRegexScript = function (scriptId) {
    if (confirm('确定要删除这个脚本吗？')) {
        characterData.extensions.regex_scripts = characterData.extensions.regex_scripts.filter(s => s.id !== scriptId);
        renderRegexScripts();
    }
};

// 启动自动保存
startAutoSave();

// 初始化预览和备用开场白
updatePreview();
renderAlternateGreetings();

console.log('=== script.js 執行完成 ===');
console.log('如果按鈕沒有反應，請檢查上面的錯誤信息');
console.log('你可以在控制台輸入以下命令測試：');
console.log('  characterData - 查看角色數據');
console.log('  exportBtn - 查看導出按鈕元素');
console.log('  exportBtn.click() - 手動觸發點擊');

// 折叠/展开功能已移至 character-editor.html 的内联 script 中
}
