// 主题处理脚本 - 用于所有页面
(function() {
    // 从 localStorage 读取主题设置
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // 应用主题
    function applyTheme() {
        if (document.body) {
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
            }
        }
    }
    
    // 立即尝试应用，如果失败则等待 DOM 加载
    if (document.body) {
        applyTheme();
    } else {
        document.addEventListener('DOMContentLoaded', applyTheme);
    }

    // 监听来自父窗口的主题切换消息
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'theme-change') {
            if (!document.body) return;
            
            const isLight = event.data.theme === 'light';
            if (isLight) {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
            localStorage.setItem('theme', event.data.theme);
        }
    });

    // 如果不在 iframe 中，添加主题切换按钮
    if (window.self === window.top) {
        function createThemeToggle() {
            if (!document.body) return;
            
            // 创建主题切换按钮
            const themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.id = 'themeToggle';
            themeToggle.innerHTML = `
                <span id="themeIcon">${savedTheme === 'light' ? '☀️' : '🌙'}</span>
                <span id="themeText">${savedTheme === 'light' ? '亮色模式' : '夜間模式'}</span>
            `;
            
            document.body.appendChild(themeToggle);

            // 添加点击事件
            themeToggle.addEventListener('click', function() {
                if (!document.body) return;
                
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                
                const themeIcon = document.getElementById('themeIcon');
                const themeText = document.getElementById('themeText');
                
                if (themeIcon && themeText) {
                    if (isLight) {
                        themeIcon.textContent = '☀️';
                        themeText.textContent = '亮色模式';
                        localStorage.setItem('theme', 'light');
                    } else {
                        themeIcon.textContent = '🌙';
                        themeText.textContent = '夜間模式';
                        localStorage.setItem('theme', 'dark');
                    }
                }
            });
        }
        
        // 等待 DOM 加载完成后添加按钮
        if (document.body) {
            createThemeToggle();
        } else {
            document.addEventListener('DOMContentLoaded', createThemeToggle);
        }
    }
})();
