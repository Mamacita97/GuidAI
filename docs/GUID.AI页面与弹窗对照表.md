# GUID.AI 主要页面 · 可点击功能与弹窗对照表

> 说明：`showPage('xxx')` 表示切换到页面 `#page-xxx`；未写弹窗的点击多为 **Toast 提示**、**页内切换** 或 **抽屉/全屏层**（非 `modal-overlay`）。  
> 演示站部分按钮仅前端交互，无真实后端。

---

## 一、全局（任意页面可见）

### 1.1 顶栏（未登录 `#nav-home`）

| 点击项 | 结果 |
|--------|------|
| Logo | `showPage('homepage')` |
| ✨灵感 / 🤖模型 / 💬文字 / 🖼️图片 / 🎬视频 / 🎵音频 / 3DGS / 🎮Apps / 💎我的产品 / 🔌Skills | 对应 `showPage`；**我的产品** 未登录 → `login-modal` |
| 登录 | `login-modal` |
| 🌐 语言 | 语言下拉（页内） |

### 1.2 顶栏（已登录 `#nav-app`）

| 点击项 | 结果 |
|--------|------|
| Logo | `showPage('homepage')` |
| 各导航项 | 对应 `showPage` |
| ⚡ 余额胶囊 | `showPage('wallet')` |
| 👤（宽屏） | `showPage('profile')` |

### 1.3 手机侧滑菜单 ☰

| 点击项 | 结果 |
|--------|------|
| 导航项 | 同顶栏 `showPage` |
| 未登录：登录/注册 | `login-modal` |
| 已登录：余额 | `showPage('wallet')` |
| 已登录：个人中心 | `showPage('profile')` |

### 1.4 手机底栏（≤768px）

| 点击项 | 结果 |
|--------|------|
| 图片 / Apps / 灵感 / 视频 | `showPage` |
| 我的产品 | `showPage('myassets-mobile')`（需登录，否则 `login-modal`） |

---

## 二、官网首页 `homepage`

| 点击项 | 结果 |
|--------|------|
| 公告条「查看详情 →」 | `announcement-modal` |
| 公告条 ✕ | 关闭公告条（无弹窗） |
| 立即开始免费创作 | `login-modal` |
| 探索灵感画廊 | `showPage('inspiration')` |
| 核心功能 / 模型卡片（多数） | `login-modal` 或跳转创作页 |
| 页脚「平台公告」等 | `announcement-modal` 或 `showPage` |
| 底部 CTA 注册 | `login-modal` |

---

## 三、模型广场 `model-hub`

| 点击项 | 结果 |
|--------|------|
| 搜索框 | 页内过滤 |
| 复制 | Toast / 复制到剪贴板 |
| 充值价格 / 倍率开关 | 页内切换展示 |
| 表格/卡片视图 | 页内切换 |
| 单价单位 M | 页内切换 |
| 筛选展开/收起 | 页内 |
| 重置 | 清空筛选 |
| 分页 ＜ / ＞ | 页内翻页 |
| **点击模型行/卡片** | `model-detail-modal` |

---

## 四、3DGS `3dgs`

| 点击项 | 结果 |
|--------|------|
| — | 占位页，无可点业务按钮 |

---

## 五、爆款 Apps `apps`（iframe `apps.html`）

| 点击项 | 结果 |
|--------|------|
| 搜索 | iframe 内过滤 |
| 应用卡片 /「立即使用」 | 父页打开工作区（见下表） |
| 查看全部 / 探索区 Tab | iframe 内筛选 |

### Apps 点击应用后可能打开的弹窗

| 应用类型 | 弹窗 ID |
|----------|---------|
| 图像类（人物替换、旧照时光机、360 全景、电商详情等） | `omni-image-workspace-modal`；运行后可能 `oiws-result-modal` |
| 部分旧版图像应用 | `app-image-workspace-modal` |
| 文案类 | `app-copy-workspace-modal` |
| 简单模板 | `app-template-modal` |

### `omni-image-workspace-modal` 内常见点击

| 点击项 | 结果 |
|--------|------|
| ✕ 关闭 | 关闭工作区 |
| 关注 | 页内状态切换 |
| 参数区上传 / 资产库 | `asset-modal`（保留工作区） |
| 运行 | Toast / `oiws-result-modal` |
| 作品 Tab 下卡片 | `insp-detail-modal`（叠加，stacked） |
| Banner 左右箭头 | 页内切换样例 |

---

## 六、应用详情 `app-detail`

| 点击项 | 结果 |
|--------|------|
| 返回 | `closeAppDetail()` → 上一页 |
| ☆ 收藏 | 页内切换 |
| 上传素材槽 | Toast / 本地上传（演示） |
| 从资产库选择 | Toast（可接 `asset-modal`） |
| ✨ 立即生成 | Toast / 生成演示 |

---

## 七、我的产品（桌面）`myassets`

| 点击项 | 结果 |
|--------|------|
| Tab：我的作品 / 我的发布 / 我的收藏 | 页内切换 |
| 管理 | `toggleMyWorksManage()` 批量模式 |
| 类型筛选（全部/图/视/音/文件） | 页内过滤 |
| **作品卡片主体** | `myworks-preview-modal`（全屏预览层） |
| 分享 | `myworks-share-modal` |
| 发布 | `myworks-publish-modal` |
| 再次生成 | Toast |
| 下载 | Toast |
| 删除 | Toast / 确认 |
| 加载更多 | Toast |
| 发布 Tab 搜索 | 页内过滤 |
| **收藏 · Apps 类卡片** | `omni-image-workspace-modal` 或 `fav-apps-preview-modal` |
| **收藏 · 灵感类** | `fav-inspr-preview-modal` |
| 底部快捷：钱包 / 交易记录等 | `showPage` |

---

## 八、我的产品（移动）`myassets-mobile`

| 点击项 | 结果 |
|--------|------|
| Tab / 类型筛选 | 页内 |
| 列表项 | `mobOpenPreview` → 移动预览层（类 `myworks-preview-modal`） |
| 管理 | `mobToggleManage()` |
| 收藏 Apps | 同桌面，进工作区弹窗 |

---

## 九、我的作品 `my-works` / 我的收藏 `my-favs`

| 点击项 | 结果 |
|--------|------|
| 返回 | `showPage('myassets')` |
| 筛选 / 加载更多 | 页内 / Toast |
| 收藏卡片 | `showPage('design-detail'/'comic-detail'/'music-detail')` 等 |

---

## 十、钱包 `wallet`

| 点击项 | 结果 |
|--------|------|
| 充值 | `recharge-modal` |
| 账单 Tab（全部/充值/消费/收入） | 页内过滤 |
| 时间 Tab | 页内过滤 |
| 账单单条 | `tx-detail-modal` |
| 导出账单 | `export-modal` → 成功时 `export-success-modal` |
| 加载更多 | 页内 |

---

## 十一、交易记录 `transactions`

| 点击项 | 结果 |
|--------|------|
| 返回 | `showPage('myassets')` |
| 类型/时间筛选、重置 | 页内 |
| 导出账单 | `export-modal` |

---

## 十二、个人中心 `profile`

| 点击项 | 结果 |
|--------|------|
| 编辑头像 ✎ | Toast |
| 复制 ID | 剪贴板 |
| 更换手机/邮箱 | 抽屉 `openProfileChangePhone/Email`（非 modal-overlay） |
| 算力余额 | `showPage('wallet')` |
| 作品数 | `showPage('myassets')` |
| 累计收益 | Toast |
| API 密钥管理 | `showPage('api')` |
| 密码管理 | `profile-password-drawer` |
| 语言 / 主题 / 通知开关 | 页内 |
| 保存设置 | Toast |
| 立即邀请 | `invite-modal` |
| 帮助中心 | `showPage('help')` |
| 联系客服 | `service-modal` |
| 意见反馈 | `feedback-modal` |
| 关于我们 | `showPage('about')` |
| 退出登录 | 确认 → 回 `homepage` |
| 注销账户 | Toast |

### 邀请相关（从 `invite-modal`）

| 点击项 | 结果 |
|--------|------|
| 生成海报 | `invite-poster-modal` |
| 查看邀请记录 | `invite-records-modal` |

### 绑定申诉

| 点击项 | 结果 |
|--------|------|
| 申诉入口 | `profile-bind-appeal-modal` → 可跳 `service-modal` |

---

## 十三、API 密钥 `api`

| 点击项 | 结果 |
|--------|------|
| + 新建密钥 | `create-key-modal` |
| 创建成功 | `create-key-success-modal` |
| 复制 / 编辑 / 删除 | Toast 或页内 |
| 统计卡片 | 只读（可点击样式） |

---

## 十四、Skills `skills`

| 点击项 | 结果 |
|--------|------|
| 开始连接 | Toast（演示） |
| 查看文档 | `showPage('mcp-docs')` |
| 前往密钥管理 | `showPage('api')` |
| 复制配置 | 剪贴板 |
| FAQ 折叠 | 页内 |

---

## 十五、MCP 文档 `mcp-docs`

| 点击项 | 结果 |
|--------|------|
| 返回 | `showPage('skills')` |
| 左侧目录 / 搜索 | 页内锚点滚动 |

---

## 十六、帮助中心 `help`

| 点击项 | 结果 |
|--------|------|
| 返回 | `showPage('profile')` |
| 热门问题 / FAQ 项 | `showPage('article-detail')` |
| 分类卡片 | `showPage('article-list')` |
| 联系客服 | `service-modal` |
| 没有帮助 / 反馈 | `feedback-modal` |

---

## 十七、文章列表 `article-list` / 详情 `article-detail`

| 点击项 | 结果 |
|--------|------|
| 返回 | `showPage('help')` |
| 文章条目 / 阅读 | `showPage('article-detail')` |
| 👎 没有帮助 | `feedback-modal` |

---

## 十八、关于我们 `about`

| 点击项 | 结果 |
|--------|------|
| 返回 | `showPage('profile')` |
| 用户协议 / 隐私 / 服务条款 / 版权 | `legal-modal` |

---

## 十九、平台公告 `announcements` / 详情 `announcement-detail`

| 点击项 | 结果 |
|--------|------|
| 列表项 | `showPage('announcement-detail')` |
| 搜索 / 分类 Tab / 加载更多 | 页内 |
| 详情页返回 | `showPage('announcements')` |

---

## 二十、内容详情（二级页）

### 灵感作品详情 `work-detail`

| 点击项 | 结果 |
|--------|------|
| 返回 | `showPage('inspiration')` |
| 收藏 / 分享 | 页内 / Toast |
| 使用提示词 | `showPage('image')` + Toast |
| 发布 | `publish-modal` |
| 付费使用 | `purchase-modal` |

### 系列详情 `series-detail`

| 点击项 | 结果 |
|--------|------|
| 返回灵感 | `showPage('inspiration')` |
| 作品格 | `showPage('work-detail')` 等 |
| 更多系列 | `series-detail-modal` |

### 设计详情 `design-detail`

| 点击项 | 结果 |
|--------|------|
| 返回 | `showPage('inspiration')` |
| 放大 | `image-preview-modal` |

### 漫剧 `comic-detail` / 视界 `vision-detail` / 音乐 `music-detail`

| 点击项 | 结果 |
|--------|------|
| 返回 | 灵感或系列页 |
| 播放/生成等 | Toast / 页内 |

---

## 二十一、创作类目页（附录：含弹窗）

> 若只需运营/测试「非创作」流程，可跳过本节；以下为完整站点对照。

### 灵感 `inspiration`

| 点击项 | 结果 |
|--------|------|
| 公告「详情」 | `announcement-modal` |
| 公告 ✕ | 关闭条 |
| 作品卡片 | `insp-detail-modal` |
| 付费作品 CTA | `purchase-modal` |
| 分享 | `guid-share-modal` |
| 系列更多 | `series-detail-modal` |

### 文字 `chat`

| 点击项 | 结果 |
|--------|------|
| 新建对话 | Toast |
| 历史 | 下拉 `#history-dropdown`（页内） |
| 角色选择 | `role-modal` |
| 创建角色成功 | `role-success-modal`（动态） |
| 模板 | `template-modal` |
| 资产库 / 导入 | `asset-modal` |
| 发布按钮 | `publish-modal` |

### 图片 `image`

| 点击项 | 结果 |
|--------|------|
| 参考图 + | `asset-modal` / `openImageAssetModal` |
| 提示词优化 | `image-prompt-optimize-modal` |
| 手机工具图标 | 底部 Sheet（页内） |
| 生成按钮 | 页内进度条（非弹窗） |
| 结果卡片操作 | `publish-modal` / `edit-work-modal` / `delete-work-modal` 等 |

### 视频 `video`

| 点击项 | 结果 |
|--------|------|
| 参考图/资产 | `asset-modal` |
| 提示词优化 | `video-prompt-optimize-modal` |
| 预览 | `video-preview-modal` |
| 音色 | `voice-picker-modal` / `voice-clone-modal` |

### 音频 `audio`

| 点击项 | 结果 |
|--------|------|
| 资产库 | `asset-modal` |
| 音色克隆 | `voice-clone-modal` |

---

## 二十二、独立分享页 `share.html`

| 点击项 | 结果 |
|--------|------|
| 复制链接 | 剪贴板 |
| 打开 GUID.AI | 跳转 `index.html` |

---

## 二十三、全站弹窗 ID 速查

| 弹窗 ID | 用途 |
|---------|------|
| `login-modal` | 登录/注册 |
| `password-login-modal` | 密码登录 |
| `announcement-modal` | 公告摘要 |
| `invite-modal` | 邀请有礼 |
| `invite-poster-modal` | 邀请海报 |
| `invite-records-modal` | 邀请记录 |
| `recharge-modal` | 充值 |
| `withdraw-modal` | 提现 |
| `tx-detail-modal` | 账单详情 |
| `export-modal` | 导出账单 |
| `export-success-modal` | 导出成功 |
| `profile-bind-appeal-modal` | 绑定申诉 |
| `legal-modal` | 法律协议 |
| `service-modal` | 在线客服 |
| `feedback-modal` | 帮助/意见反馈 |
| `complaint-modal` | 客服投诉 |
| `create-key-modal` | 新建 API 密钥 |
| `create-key-success-modal` | 密钥创建成功 |
| `model-detail-modal` | 模型详情 |
| `role-modal` | 聊天角色 |
| `template-modal` | 聊天模板 |
| `app-template-modal` | Apps 简单模板 |
| `app-image-workspace-modal` | Apps 图像工作区（旧） |
| `omni-image-workspace-modal` | Apps 全能图像工作区 |
| `oiws-result-modal` | 工作区生成结果 |
| `app-copy-workspace-modal` | Apps 文案工作区 |
| `asset-modal` | 资产库 |
| `asset-text-view-modal` | 文本资产预览 |
| `publish-modal` | 发布作品 |
| `purchase-modal` | 付费使用灵感 |
| `edit-work-modal` | 编辑作品 |
| `delete-work-modal` | 删除确认 |
| `detail-modal` | 通用详情 |
| `insp-detail-modal` | 灵感详情 |
| `myworks-publish-modal` | 我的产品-发布 |
| `myworks-share-modal` | 我的产品-分享 |
| `myworks-preview-modal` | 作品全屏预览（固定层） |
| `fav-apps-preview-modal` | 收藏 Apps 预览 |
| `fav-inspr-preview-modal` | 收藏灵感预览 |
| `image-prompt-optimize-modal` | 图片提示词优化 |
| `video-prompt-optimize-modal` | 视频提示词优化 |
| `video-preview-modal` | 视频预览 |
| `image-preview-modal` | 图片放大 |
| `voice-clone-modal` | 音色克隆 |
| `voice-picker-modal` | 音色选择 |
| `series-detail-modal` | 系列说明 |
| `guid-share-modal` | 分享 |

---

*文档路径：`docs/GUID.AI页面与弹窗对照表.md`*
