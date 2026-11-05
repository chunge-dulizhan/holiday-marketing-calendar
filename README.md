# 欧美全年节日营销日历

面向独立站运营者的欧美全年节日营销工具：覆盖 12 个月营销节点、动态日期计算、产品智能匹配、完整营销策略、个人营销计划与任务管理。

© 2026 独立站春哥（亿级操盘手）｜带教咨询微信：ch022427

---

## 一、功能概览

| 模块 | 说明 |
| --- | --- |
| 全年营销日历 | 12 个月卡片 + 全年时间轴，切换年份自动重算浮动节日 |
| 节日数据库 | 76 个营销节点，含中英文名称、国家、类型、优先级、产品标签、来源链接 |
| 筛选与搜索 | 国家 / 产品类别 / 营销优先级 / 营销类型四组多选，支持中英文关键词搜索 |
| 节日详情 | 抽屉展示背景、购买动机、营销机会、日期核实状态与信息来源 |
| 产品营销匹配 | 输入产品类别、名称、国家、价格、特点，推荐最多 12 个高相关节点 |
| 完整营销策略 | 购买动机、≥3 个切入方向、四平台社媒创意、六项广告建议、≥5 个英文 SEO 关键词 |
| 节日倒计时 | 6 阶段提示（提前规划 / 准备阶段 / 内容预热 / 营销冲刺 / 最后转化 / 已结束） |
| 我的营销计划 | 新增、编辑、删除、状态切换、状态筛选 |
| 任务清单 | 加入计划自动生成 6 阶段 25 条模板任务，支持勾选、编辑、删除、自定义新增 |
| 进度统计 | 任务完成数、总数、百分比、计划数、执行中、已完成 |
| 数据管理 | 导出计划 / 任务 / 完整数据，导入备份 JSON（含格式校验），清空数据（二次确认） |

---

## 二、文件结构

```
├── index.html                  # 页面结构（唯一页面入口）
├── styles.css                  # 全部样式与响应式规则
├── app.js                      # 全部交互逻辑（日期引擎、筛选、匹配、计划、数据管理）
├── holidays.json               # 节日公共数据库（76 个节点）
├── marketing-strategies.json   # 营销策略公共数据库（20 组策略 + 12 产品画像）
├── README.md                   # 本说明文档
└── DEPLOY.md                   # GitHub Pages 部署说明
```

### 数据分层原则

- **节日公共数据库**：`holidays.json`、`marketing-strategies.json`。只读，随项目更新，任何用户操作都不会修改。
- **个人数据**：营销计划、任务记录、用户自定义内容。保存在浏览器 LocalStorage，与公共数据库完全分离。

| LocalStorage 键 | 内容 |
| --- | --- |
| `gcmc-plans` | 用户营销计划数组 |
| `gcmc-plan-tasks` | 用户任务记录数组 |

> 导入备份只写入上述两个键，不会触碰任何 JSON 公共数据库文件。

---

## 三、本地运行

无需构建工具，也无需后端。任选一种方式：

**方式 A：直接打开**

双击 `index.html`。部分浏览器会因安全策略拦截本地 `fetch`，建议使用方式 B。

**方式 B：本地静态服务器（推荐）**

```bash
npx serve .
# 或
node -e "require('http').createServer((q,s)=>require('fs').createReadStream(require('path').join(process.cwd(),q.url==='/'?'index.html':q.url)).on('error',()=>{s.statusCode=404;s.end()}).pipe(s)).listen(4173)"
```

浏览器访问 `http://127.0.0.1:4173`。

---

## 四、GitHub Pages 部署说明

本项目为纯静态站点，无构建步骤，推送到仓库根目录后即可发布：

```bash
git init
git add index.html styles.css app.js holidays.json marketing-strategies.json README.md DEPLOY.md
git commit -m "feat: 欧美全年节日营销日历"
git branch -M main
git remote add origin https://github.com/<你的账号>/<仓库名>.git
git push -u origin main
```

随后在仓库 **Settings → Pages** 选择 `Deploy from a branch`，分支 `main`、目录 `/ (root)`，保存后访问 `https://<你的账号>.github.io/<仓库名>/`。

完整步骤、自定义域名与常见问题排查见 [DEPLOY.md](DEPLOY.md)。

---

## 五、数据结构

### holidays.json

```jsonc
{
  "meta": {
    "version": 1,
    "last_verified": "2026-xx-xx",
    "total": 76
  },
  "holidays": [
    {
      "id": "valentines-day",          // 唯一标识，策略库通过它关联
      "name_cn": "情人节",
      "name_en": "Valentine's Day",
      "month": 2,
      "date_rule": "fixed",            // fixed | fixed_range | nth_weekday | last_weekday | easter_offset | relative_to | unconfirmed
      "fixed_date": "02-14",
      "country": ["美国", "英国", "德国", "法国", "全球"],
      "category": "送礼营销",
      "holiday_type": "public",        // public | religious | cultural | commercial | seasonal | industry | awareness
      "is_public_holiday": false,
      "priority": "high",              // high | medium | low
      "product_tags": ["珠宝", "礼品", ...],
      "description": "...",
      "source_url": "https://...",
      "last_verified": "2026-xx-xx",
      "date_status": "official_confirmed"  // official_confirmed | rule_calculated | official_unconfirmed | manual_verification
    }
  ]
}
```

`date_rule` 说明：

| 规则 | 用途 | 关键字段 |
| --- | --- | --- |
| `fixed` | 固定日期 | `fixed_date`: `MM-DD` |
| `fixed_range` | 固定日期区间 | `start_date` / `end_date` |
| `nth_weekday` | 第 N 个星期几 | `month`, `weekday`, `nth` |
| `last_weekday` | 当月最后一个星期几 | `month`, `weekday` |
| `easter_offset` | 复活节偏移 | `offset`（相对复活节的天数） |
| `relative_to` | 相对其他节点 | `base_id`, `offset` |
| `unconfirmed` | 官方未公布 | 不展示推测日期 |
| `overrides` | 指定年份例外 | `overrides[年份]` |

### marketing-strategies.json

```jsonc
{
  "meta": { ... },
  "product_profiles": {
    "jewelry": {
      "reason": "珠宝首饰具有礼品属性",
      "audience": "18–45 岁注重设计与情感表达的女性消费者",
      "product_angle": "...",
      "landing_page": "...",
      "seo_product": "...",
      "gift_affinity": 0.9,
      "preferred_events": ["valentines-day", "mothers-day-us", ...],
      "type_boosts": { "commercial": 0.8 },
      "feature_terms": { "flower": { "tags": ["鲜花"] } }
    }
    // ... 其余 11 个产品类别
  },
  "price_profiles": {
    "under25": { "label": "25 美元以下", "promotion": "..." },
    "25to50": { ... }, "50to100": { ... }, "100to250": { ... }, "over250": { ... }
  },
  "event_strategy_map": { "valentines-day": "valentine", ... },
  "type_strategy_map": { "public": "public", "religious": "cultural", ... },
  "strategies": {
    "mothers-day": {
      "scene": "母亲节的情感表达和送礼消费场景",
      "motivation": "...",
      "directions": [{ "title": "...", "description": "..." }],   // ≥3
      "social": {
        "tiktok": ["...", "..."],       // ≥2
        "instagram": ["...", "..."],
        "facebook": ["...", "..."],
        "pinterest": ["...", "..."]
      },
      "ads": {
        "theme": "...", "creative": "...", "copy": "...",
        "audience": "...", "promotion": "...", "landing_page": "..."
      },
      "seo": ["Mother's Day Gifts", "Best Gifts for Mom", ...]      // ≥5
    }
    // ... 共 20 组
  }
}
```

支持占位符（渲染时自动替换）：`{product}`、`{holiday}`、`{holiday_en}`、`{country}`、`{category}`。

---

## 六、如何更新内容（长期维护）

### 更新节日数据

直接编辑 `holidays.json` 并推送：

1. 新增节点：在 `holidays` 数组追加对象，`id` 必须唯一。
2. 修改日期：更新 `date_rule` 与对应字段，或为该年份添加 `overrides`。
3. 核实信息：更新 `last_verified`、`date_status`、`source_url`。
4. 新增节点后，策略库需要能关联：在 `marketing-strategies.json` 的 `event_strategy_map` 中添加 `"新节点id": "已有策略组名"`，或依赖 `type_strategy_map` 的按类型回退。
5. `app.js` 会在启动时校验结构，缺失字段或无效映射会明确报错，不会静默显示错误内容。

### 更新营销策略

直接编辑 `marketing-strategies.json`：

- 修改某个节日的文案 → 改对应 `strategies` 组。
- 调整某类产品的推荐倾向 → 改 `product_profiles` 的 `preferred_events` / `type_boosts` / `gift_affinity`。
- 新增策略组 → 在 `strategies` 添加，并在 `event_strategy_map` 或 `type_strategy_map` 引用。
- 校验规则：策略组必须有 `scene`、`motivation`、≥3 `directions`、四平台各 ≥2 条 `social`、六项 `ads`、≥5 条 `seo`。

> 管理员更新结构预留：保持上述字段名不变即可平滑升级。页面不需要任何代码改动。

---

## 七、常见问题

**Q：切换年份会不会删除我的营销计划？**
不会。营销计划与任务独立存储，切换年份只重算公共节日日期和倒计时。

**Q：官方尚未公布的活动日期会显示推测值吗？**
不会。`date_status = official_unconfirmed` 的节点（如 Amazon Prime Day）不展示推测日期，倒计时显示“待官方公布后计算”。

**Q：导入备份会把别的节日数据写进我的库吗？**
不会。导入只接受用户计划与任务，且写入 LocalStorage；`holidays.json` 与 `marketing-strategies.json` 完全只读。

**Q：换电脑后数据还在吗？**
不在。LocalStorage 绑定浏览器。请先在“个人数据管理”导出完整数据，再在新设备导入。

**Q：数据太大导致浏览器报错？**
清空数据后重试，或导出备份后清理。工具已对 LocalStorage 读写加 try/catch，异常时不会中断页面。

---

## 八、浏览器兼容

Chrome / Edge / Safari / Firefox 最新版本。需要支持 ES2020、`fetch`、`LocalStorage`、`Intl`。移动端已验证 411px 宽度无横向溢出。
