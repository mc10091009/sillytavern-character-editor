# 🎭 SillyTavern 角色卡编辑器

[![License: Co-op NCL](https://img.shields.io/badge/License-Cooperative%20NCL-blue.svg)](LICENSE)

一个功能完整的可视化角色卡创建和编辑工具，专为 SillyTavern 设计。

[English](README_EN.md) | 简体中文

---

## ⚡ 超簡單使用

> **下載 → 解壓 → 雙擊 `home.html` → 開始使用！**
> 
> ✅ 無需安裝任何軟件  
> ✅ 完全離線可用  
> ✅ 支持電腦和手機  
> 
> 📖 [3 分鐘快速開始指南](QUICK_START.md)

---

## ✨ 特点

一个纯前端、开箱即用的 SillyTavern 角色卡编辑器，无需安装任何依赖。

## 功能特点

- 📝 直观的表单界面，轻松创建角色卡
- 👁️ 实时预览角色信息
- 🖼️ 支持上传自定义头像
- 📚 完整的世界书（Lorebook）编辑器
- ⚙️ 高级设置（系统提示词、备用开场白、标签等）
- 💾 完全兼容 SillyTavern V1 和 V2 规范
- 📤 导入现有的角色卡进行编辑（自动识别版本）
- 🎨 美观的渐变设计

## 🚀 快速开始

### 💻 電腦用戶（Windows / Mac / Linux）

1. **下載項目**
   - 點擊綠色的 "Code" 按鈕
   - 選擇 "Download ZIP"
   - 解壓到任意位置

2. **開始使用**
   - 雙擊打開 `home.html`
   - 選擇需要的工具
   - 完全離線可用！

### 📱 手機用戶（iOS / Android）

1. **下載項目**
   - 在手機瀏覽器下載 ZIP
   - 解壓文件

2. **開始使用**
   - 找到 `home.html`
   - 用瀏覽器打開
   - 完全離線可用！

3. **添加到主屏幕**（可選）
   - iOS：分享 → 添加到主屏幕
   - Android：菜單 → 添加到主屏幕
   - 像 App 一樣使用

### 🔄 更新方法

**最簡單（推薦）：**
1. 導出你的角色卡（備份）
2. 刪除舊文件夾
3. 下載新的 ZIP
4. 解壓並打開 `home.html`

**進階用戶：**
- 電腦：雙擊 `update.bat`（Windows）或 `update.sh`（Mac/Linux）
- 手機：查看 [更新指南](MOBILE_UPDATE.md)

### 🌐 在線使用（可選）

如果你想在線訪問，可以啟用 GitHub Pages：

1. Fork 這個項目
2. 進入 Settings → Pages
3. Source 選擇 `main` 分支
4. 訪問 `https://yourusername.github.io/倉庫名/home.html`

## 📖 使用指南

### 基础设置

1. **填写角色信息**
   - 角色名称（必填）
   - 角色描述
   - 性格特点
   - 场景设定
   - 第一条消息
   - 对话示例
   - 上传头像图片

2. **编辑世界书**
   - 点击"📚 编辑世界书"按钮
   - 添加条目，设置触发关键词
   - 支持正则表达式匹配
   - 填写条目内容（背景知识、人物关系等）
   - 调整插入顺序和优先级

3. **正则脚本管理**
   - 点击"📜 正则脚本管理"按钮
   - 添加文本查找和替换规则
   - 支持复杂的正则表达式
   - 控制脚本的触发条件

4. **高级设置**
   - 点击"⚙️ 高级设置"按钮
   - 创建者信息和版本号
   - 标签分类
   - 系统提示词
   - 历史后指令
   - 备用开场白

5. **导出和导入**
   - 点击"📥 导出角色卡"生成 PNG 文件
   - 点击"📤 导入角色卡"加载现有角色卡
   - 点击"💾 保存到浏览器"保存草稿
   - 点击"📂 从浏览器加载"恢复草稿

## 角色卡格式

本工具生成的角色卡符合 SillyTavern V2 规范，包含以下字段：

- `name`: 角色名称
- `description`: 角色描述
- `personality`: 性格特点
- `scenario`: 场景设定
- `first_mes`: 第一条消息
- `mes_example`: 对话示例

角色数据以 JSON 格式嵌入到 PNG 图片的 tEXt chunk 中，关键字为 "chara"。

## 技术说明

- 纯前端实现，无需服务器
- 使用 PNG tEXt chunk 存储角色数据
- 支持 SillyTavern Character Card V2 规范
- 响应式设计，支持移动端

## 角色卡格式兼容性

本工具完全兼容 SillyTavern 的所有角色卡规范：

### Character Card V2 规范（推荐）

导出的角色卡符合 SillyTavern V2 规范，包含以下完整字段：

**基础字段：**
- `name`: 角色名称
- `description`: 角色描述
- `personality`: 性格特点
- `scenario`: 场景设定
- `first_mes`: 第一条消息
- `mes_example`: 对话示例

**V2 高级字段：**
- `creator`: 创建者名称
- `character_version`: 角色版本号
- `tags`: 标签数组
- `creator_notes`: 创建者备注
- `system_prompt`: 系统提示词
- `post_history_instructions`: 历史后指令
- `alternate_greetings`: 备用开场白数组
- `character_book`: 世界书（Lorebook）对象
- `extensions`: 扩展字段

**世界书（Lorebook）字段：**
- `name`: 世界书名称
- `entries`: 条目数组
  - `keys`: 触发关键词数组
  - `content`: 条目内容
  - `enabled`: 是否启用
  - `insertion_order`: 插入顺序
  - `case_sensitive`: 是否区分大小写
  - `priority`: 优先级
  - `comment`: 备注说明
  - 其他 SillyTavern 标准字段

### Character Card V1 兼容

- ✅ 可以导入 V1 格式的角色卡
- ✅ 自动转换为 V2 格式
- ✅ 保留所有原始数据

### 数据存储方式

角色数据以 JSON 格式嵌入到 PNG 图片的 tEXt chunk 中，关键字为 "chara"，这是 SillyTavern 的标准格式。

## 浏览器兼容性

### 桌面端
- ✅ Chrome / Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### 移动端
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+
- ✅ 支持触摸操作
- ✅ 响应式设计，自动适配屏幕

### 技术要求
- 支持 ES6+ 和 Canvas API
- 支持 localStorage（用于保存草稿）

## 移动端使用说明

📱 **手机上使用本工具：**

1. 在手机浏览器中打开 `index.html`
2. 界面会自动适配手机屏幕
3. 所有功能都可以正常使用
4. 支持触摸操作和手势
5. 可以从相册选择头像图片
6. 导出的 PNG 文件会保存到手机

**建议：**
- 使用横屏模式获得更好的编辑体验
- 在 Safari 或 Chrome 中添加到主屏幕，像 App 一样使用
- 定期导出备份，避免数据丢失

## SillyTavern 兼容性

- ✅ SillyTavern 1.10.0+
- ✅ SillyTavern 1.11.x
- ✅ SillyTavern 1.12.x 及更高版本
- ✅ 完全兼容官方规范

## 📜 许可证

本项目采用 **Cooperative Non-Commercial License (Co-op NCL) v1.0**（合作非商业许可证）

### ✅ 允许的使用：

**合作社组织**（工人合作社、消费合作社等）可以：
- 用于任何目的，包括商业用途
- 修改和分发软件
- 在合作社结构内商业使用

**个人用户**可以：
- 个人非商业使用
- 修改供个人使用
- 与他人分享

**非营利组织和教育机构**可以：
- 用于组织目的
- 修改和分发
- 用于教育

### ❌ 禁止的使用：

**商业公司**（非合作社）不得：
- 商业使用本软件
- 销售或授权本软件
- 将本软件作为付费服务的一部分
- 使用本软件产生收益
- 将本软件整合到商业产品中

### 📋 要求：

- 保留版权声明
- 包含本许可证副本
- 标明所做的修改
- 注明原作者

### 🤝 合作社例外条款

工人合作社和其他民主的、成员所有的组织可以商业使用本软件，前提是：
- 组织结构为真正的合作社
- 工人/成员拥有民主控制权
- 利润在成员之间公平分配
- 按照合作社原则运作

完整许可协议请查看 [LICENSE](LICENSE) 文件。

---

**版权所有 © 2024 保留所有权利**

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

在提交 PR 之前，请确保：
- 代码风格一致
- 测试所有功能正常
- 更新相关文档

## 📮 联系方式

- 提交 Issue：[GitHub Issues](https://github.com/yourusername/sillytavern-character-editor/issues)
- 讨论：[GitHub Discussions](https://github.com/yourusername/sillytavern-character-editor/discussions)

## 🙏 致谢

- [SillyTavern](https://github.com/SillyTavern/SillyTavern) - 灵感来源
- 所有贡献者和用户

## ⭐ Star History

如果这个项目对你有帮助，请给它一个 Star！

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/sillytavern-character-editor&type=Date)](https://star-history.com/#yourusername/sillytavern-character-editor&Date)
#   s i l l y t a v e r n - c h a r a c t e r - e d i t o r  
 #   s i l l y t a v e r n - c h a r a c t e r - e d i t o r  
 