# GitHub Pages 部署说明

本工具为纯静态站点（HTML + CSS + 原生 JavaScript + JSON），无构建步骤、无后端依赖，可直接部署到 GitHub Pages。

---

## 一、部署前检查清单

| 检查项 | 说明 |
| --- | --- |
| 文件齐全 | `index.html`、`styles.css`、`app.js`、`holidays.json`、`marketing-strategies.json` |
| 资源路径 | 全部使用相对路径，无 `/assets/...` 之类绝对路径 |
| JSON 可解析 | 两个 JSON 文件均为合法 UTF-8 JSON |
| 本地可运行 | 通过本地静态服务器访问无控制台报错 |

---

## 二、部署步骤

### 1. 创建仓库

在 GitHub 新建空仓库，建议命名 `holiday-marketing-calendar`，不要勾选自动生成 README（避免与本地文件冲突）。

### 2. 推送文件到仓库根目录

```bash
git init
git add index.html styles.css app.js holidays.json marketing-strategies.json README.md DEPLOY.md
git commit -m "feat: 欧美全年节日营销日历"
git branch -M main
git remote add origin https://github.com/<你的账号>/<仓库名>.git
git push -u origin main
```

文件名与目录必须保持原样，`app.js` 通过文件名直接请求两个 JSON，重命名会导致加载失败。

### 3. 开启 GitHub Pages

1. 进入仓库 **Settings**。
2. 左侧选择 **Pages**。
3. **Source** 选择 `Deploy from a branch`。
4. **Branch** 选择 `main`，目录选择 `/ (root)`。
5. 点击 **Save**，等待 1–2 分钟构建完成。
6. 访问 `https://<你的账号>.github.io/<仓库名>/`。

### 4. 验证上线结果

- 页面正常显示 12 个月日历与 76 个节日节点。
- 打开开发者工具 Console，确认无 404、无红色报错。
- 在 Network 面板确认 `holidays.json` 与 `marketing-strategies.json` 返回 200。
- 尝试生成一次产品匹配并加入营销计划，刷新后数据仍在。

---

## 三、自定义域名（可选）

1. 仓库 **Settings → Pages → Custom domain** 填入域名。
2. 在域名服务商处添加 DNS 记录：
   - 推荐 CNAME 记录指向 `<你的账号>.github.io`。
   - 或在仓库根目录添加 `CNAME` 文件，内容为纯域名。
3. 保存后等待证书签发（通常几分钟），再通过 `https://` 访问。

---

## 四、常见问题

**页面空白 / 一直显示“正在读取数据库”**

按 F12 查看 Console 与 Network。多为 `holidays.json` 或 `marketing-strategies.json` 返回 404，通常是文件未推送或文件名大小写不一致。

**中文乱码**

确认 JSON 与 HTML 均以 UTF-8 编码保存，且 `index.html` 的 `<meta charset="UTF-8">` 未被改动。

**本地能打开，线上不能**

直接双击打开 `index.html` 属于 `file://` 协议，浏览器会拦截 `fetch` 读取本地 JSON。本地预览请改用静态服务器：

```bash
npx serve .
```

**本地数据与线上数据不一致**

`http://127.0.0.1` 与 `https://<账号>.github.io` 属于不同源，LocalStorage 互不相通。使用「导出完整个人数据」后，在目标环境「导入备份数据」即可迁移。

**更新节日数据后线上没变化**

Pages 有构建缓存，等待 1–2 分钟或强制刷新（Ctrl + F5）即可。修改 JSON 后请同步更新 `meta.last_verified` 与 `meta.version`。

---

## 五、后续维护

- 节日公共数据只在 `holidays.json` 维护，营销策略只在 `marketing-strategies.json` 维护，两者均不写入用户数据。
- 用户数据保存在浏览器 LocalStorage（`gcmc-plans`、`gcmc-plan-tasks`），导出 / 导入均在页面「个人数据管理」区完成。
- 更新公共数据不会覆盖学员的个人营销计划，学员无需重新录入。
