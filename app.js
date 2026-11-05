"use strict";

const MONTHS = [
  { cn: "一月", en: "January", short: "JAN", color: "#71928a" },
  { cn: "二月", en: "February", short: "FEB", color: "#b67f83" },
  { cn: "三月", en: "March", short: "MAR", color: "#7a9c72" },
  { cn: "四月", en: "April", short: "APR", color: "#c09468" },
  { cn: "五月", en: "May", short: "MAY", color: "#8d9a65" },
  { cn: "六月", en: "June", short: "JUN", color: "#c28b64" },
  { cn: "七月", en: "July", short: "JUL", color: "#658f9d" },
  { cn: "八月", en: "August", short: "AUG", color: "#bb8d55" },
  { cn: "九月", en: "September", short: "SEP", color: "#9b785d" },
  { cn: "十月", en: "October", short: "OCT", color: "#ad6f53" },
  { cn: "十一月", en: "November", short: "NOV", color: "#79776f" },
  { cn: "十二月", en: "December", short: "DEC", color: "#5f8277" }
];

const DATE_STATUS = {
  official_confirmed: "官方已确认",
  rule_calculated: "按规则计算",
  official_unconfirmed: "官方尚未公布",
  manual_verification: "待人工核实"
};
const PRIORITY = { high: "高优先级", medium: "中优先级", low: "低优先级" };
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const ORDINALS = ["", "一", "二", "三", "四", "五"];
const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 };
const TODAY = new Date();

const FILTER_OPTIONS = {
  countries: {
    defaultLabel: "全部市场",
    options: [
      { value: "usa", label: "美国 USA", aliases: ["美国"] },
      { value: "canada", label: "加拿大 Canada", aliases: ["加拿大"] },
      { value: "uk", label: "英国 UK", aliases: ["英国"] },
      { value: "germany", label: "德国 Germany", aliases: ["德国", "德国部分州"] },
      { value: "france", label: "法国 France", aliases: ["法国", "法国部分地区"] },
      { value: "italy", label: "意大利 Italy", aliases: ["意大利"] },
      { value: "spain", label: "西班牙 Spain", aliases: ["西班牙"] },
      { value: "australia", label: "澳大利亚 Australia", aliases: ["澳大利亚"] },
      { value: "ireland", label: "爱尔兰 Ireland", aliases: ["爱尔兰"] },
      { value: "global", label: "全球 Global", aliases: ["全球"] }
    ]
  },
  products: {
    defaultLabel: "全部产品",
    options: [
      { value: "jewelry", label: "Jewelry 珠宝首饰", terms: ["珠宝", "首饰", "饰品"] },
      { value: "beauty", label: "Beauty 美妆护肤", terms: ["美妆", "香氛", "香水", "个护", "防晒"] },
      { value: "fashion", label: "Fashion 服饰", terms: ["服饰", "冬装", "春装", "夏装", "秋装", "泳装", "童装", "正装", "鞋包", "袜子"] },
      { value: "pet", label: "Pet Supplies 宠物用品", terms: ["宠物", "猫粮", "猫玩具", "狗粮", "狗玩具", "动物公益"] },
      { value: "home", label: "Home & Living 家居生活", terms: ["家居", "家具", "园艺", "厨房", "家电", "收纳", "相框", "装饰", "睡眠", "烧烤", "工具", "宿舍", "保暖"] },
      { value: "electronics", label: "Electronics 电子产品", terms: ["电子", "电视影音", "笔记本", "家电"] },
      { value: "outdoor", label: "Outdoor & Sports 户外运动", terms: ["户外", "运动", "烧烤", "园艺", "泳装", "防晒"] },
      { value: "toys", label: "Toys & Kids 儿童玩具", terms: ["玩具", "儿童", "童装", "亲子", "教育用品", "文具", "学习用品"] },
      { value: "gifts", label: "Gifts 礼品定制", terms: ["礼品", "礼赠", "礼盒", "贺卡", "鲜花", "创意周边", "手工艺品"] },
      { value: "travel", label: "Travel 旅行用品", terms: ["旅行"] },
      { value: "automotive", label: "Automotive 汽车用品", terms: ["汽车"] },
      { value: "other", label: "Other 其他", terms: [] }
    ]
  },
  priorities: {
    defaultLabel: "全部优先级",
    options: [
      { value: "high", label: "高优先级" },
      { value: "medium", label: "中优先级" },
      { value: "low", label: "低优先级" }
    ]
  },
  types: {
    defaultLabel: "全部类型",
    options: [
      { value: "public", label: "法定公共假日" },
      { value: "religious", label: "宗教文化节日" },
      { value: "commercial", label: "商业购物活动" },
      { value: "seasonal", label: "季节性营销" },
      { value: "industry", label: "行业主题活动" },
      { value: "gifting", label: "送礼营销" }
    ]
  }
};

const HOLIDAY_TYPE_MAP = {
  public: "public",
  religious: "religious",
  cultural: "religious",
  commercial: "commercial",
  seasonal: "seasonal",
  industry: "industry",
  awareness: "industry"
};

const SOCIAL_PLATFORMS = [
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "pinterest", label: "Pinterest" }
];
const AD_FIELDS = [
  { key: "theme", label: "广告主题", aliases: ["theme", "ad_theme", "topic"] },
  { key: "creative", label: "广告素材方向", aliases: ["creative", "creative_direction", "material", "visual"] },
  { key: "copy", label: "文案切入点", aliases: ["copy", "copy_angle", "copywriting"] },
  { key: "audience", label: "目标受众建议", aliases: ["audience", "target_audience"] },
  { key: "promotion", label: "促销方式", aliases: ["promotion", "offer"] },
  { key: "landing_page", label: "商品落地页优化建议", aliases: ["landing_page", "landing", "landing_page_optimization"] }
];
const PRICE_KEYS = ["under25", "25to50", "50to100", "100to250", "over250"];

const PLAN_PHASES = [
  { days: 60, label: "提前规划", className: "phase-long" },
  { days: 30, label: "准备阶段", className: "phase-30" },
  { days: 14, label: "内容预热", className: "phase-30" },
  { days: 7, label: "营销冲刺", className: "phase-14" },
  { days: 0, label: "最后转化", className: "phase-7" }
];
const PLAN_STATUSES = [
  { value: "not_started", label: "未开始" },
  { value: "preparing", label: "准备中" },
  { value: "ongoing", label: "进行中" },
  { value: "review", label: "待复盘" },
  { value: "done", label: "已完成" },
  { value: "abandoned", label: "已放弃" }
];
const PLAN_LS_KEY = "gcmc-plans";
const PLAN_TASKS_LS_KEY = "gcmc-plan-tasks";
const DEFAULT_PLATFORMS = ["TikTok", "Instagram", "Facebook", "Pinterest"];
const DEFAULT_PROMOTIONS = ["限时折扣", "满减", "买赠", "包邮", "礼盒套装", "会员专享"];
const TASK_TEMPLATES = [
  { phase: -60, phaseLabel: "提前 60 天", items: ["确认主推产品", "确认供应链", "核算产品利润", "确认物流时效"] },
  { phase: -45, phaseLabel: "提前 45 天", items: ["拍摄产品素材", "制作展示视频", "优化商品详情页", "准备节日落地页"] },
  { phase: -30, phaseLabel: "提前 30 天", items: ["发布社媒预热内容", "准备广告素材", "制作 SEO 文章", "设置优惠活动"] },
  { phase: -14, phaseLabel: "提前 14 天", items: ["开始广告测试", "发布节日内容", "邮件营销预热", "检查转化追踪"] },
  { phase: -7, phaseLabel: "提前 7 天", items: ["发布最后购买提醒", "检查物流截止日期", "检查促销活动", "监控广告表现"] },
  { phase: 1, phaseLabel: "活动结束后", items: ["统计销售额", "统计广告花费", "计算实际利润", "分析素材表现", "记录优化方向"] }
];

const state = {
  year: TODAY.getFullYear(),
  holidays: [],
  events: [],
  meta: {},
  strategyData: null,
  matchInput: null,
  recommendations: [],
  activeStrategyId: null,
  selectedMonth: null,
  view: "months",
  search: "",
  filters: {
    countries: new Set(),
    products: new Set(),
    priorities: new Set(),
    types: new Set()
  },
  plans: [],
  tasks: [],
  editingPlanId: null,
  editingPlanTaskInput: null,
  planStatusFilter: "all",
  lastConfirm: null,
  confirmTimer: null
};

const dom = {};
let lastFocusedElement = null;
let lastStrategyFocusedElement = null;
let lastPlanFocusedElement = null;
let originalHandleGlobalKeydown = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheDom();
  populateYears();
  populateMatcherForm();
  renderTodayDate();
  bindEvents();
  loadPlansFromStorage();
  await Promise.all([loadDatabase(), loadStrategyData()]);
  renderPlanList();
  updateDataStatus();
  document.addEventListener("marketing-plan:add", handlePlanAddFromMatch);
  document.addEventListener("keydown", handlePlanKeydownBound);
}

function handlePlanKeydownBound(event) {
  if (dom.confirmDialog && !dom.confirmDialog.hidden && event.key === "Escape") {
    event.preventDefault();
    hideConfirm();
  }
}

function cacheDom() {
  [
    "year-select", "panel-year", "upcoming-list", "data-freshness", "today-date", "stat-total",
    "data-note-toggle", "data-note-panel",
    "stat-current", "stat-current-label", "stat-upcoming", "stat-upcoming-note",
    "stat-priority", "month-grid", "month-view", "timeline-view", "timeline",
    "holiday-search", "reset-filters", "active-filter", "active-filter-label",
    "clear-month", "result-count", "holiday-list", "empty-state", "empty-reset",
    "database-count", "toast", "drawer-backdrop", "detail-drawer", "drawer-close",
    "drawer-title", "drawer-name-en", "drawer-body", "match-form", "match-category",
    "match-product-name", "match-price", "match-features", "match-country-options",
    "match-form-error", "generate-matches", "strategy-load-status", "match-results",
    "match-results-title", "match-summary", "match-year", "match-list", "match-empty",
    "match-empty-detail", "strategy-backdrop", "strategy-drawer", "strategy-close",
    "strategy-title", "strategy-subtitle", "strategy-body",
    "plan-new-button", "stat-plan-count", "stat-plan-active", "stat-plan-review", "stat-plan-done",
    "task-progress-fill", "stat-task-percent", "stat-task-detail",
    "plan-filter-bar", "plan-filter-options", "plan-list", "plan-empty", "plan-empty-new",
    "plan-backdrop", "plan-drawer", "plan-drawer-close", "plan-drawer-eyebrow",
    "plan-drawer-title", "plan-drawer-subtitle", "plan-drawer-body",
    "confirm-dialog", "confirm-title", "confirm-message", "confirm-cancel", "confirm-ok",
    "export-plans", "export-tasks", "export-all", "import-open", "import-file", "clear-data", "data-status"
  ].forEach(id => { dom[toCamel(id)] = document.getElementById(id); });
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function populateYears() {
  const start = TODAY.getFullYear() - 2;
  const end = TODAY.getFullYear() + 3;
  dom.yearSelect.innerHTML = Array.from({ length: end - start + 1 }, (_, index) => {
    const year = start + index;
    return `<option value="${year}"${year === state.year ? " selected" : ""}>${year} 年</option>`;
  }).join("");
  dom.panelYear.textContent = state.year;
}

function formatIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// 系统当前日期仅用于展示，不参与数据库核验字段的计算或写入
function renderTodayDate() {
  if (dom.todayDate) dom.todayDate.textContent = formatIsoDate(TODAY);
}

function bindEvents() {
  dom.yearSelect.addEventListener("change", event => {
    state.year = Number(event.target.value);
    dom.panelYear.textContent = state.year;
    calculateAndRender();
    renderPlanList();
    updateDataStatus();
    showToast(`已切换至 ${state.year} 年，日期与倒计时已重新计算`);
  });

  dom.dataNoteToggle?.addEventListener("click", () => {
    const expanded = dom.dataNoteToggle.getAttribute("aria-expanded") === "true";
    dom.dataNoteToggle.setAttribute("aria-expanded", String(!expanded));
    dom.dataNotePanel.hidden = expanded;
  });

  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => setView(button.dataset.view));
    button.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const nextView = state.view === "months" ? "timeline" : "months";
        setView(nextView);
        document.querySelector(`[data-view="${nextView}"]`).focus();
      }
    });
  });

  dom.monthGrid.addEventListener("click", event => {
    const card = event.target.closest("[data-month]");
    if (card) selectMonth(Number(card.dataset.month));
  });

  dom.timeline.addEventListener("click", event => {
    const item = event.target.closest("[data-event-id]");
    if (item) locateEvent(item.dataset.eventId, item);
  });

  dom.holidayList.addEventListener("click", event => {
    const card = event.target.closest("button[data-event-id]");
    if (card) openDetails(card.dataset.eventId, card);
  });

  dom.holidaySearch.addEventListener("input", event => {
    state.search = event.target.value.trim().toLowerCase();
    renderDetails();
  });

  document.querySelectorAll("[data-filter-trigger]").forEach(button => {
    button.addEventListener("click", () => toggleFilterMenu(button.dataset.filterTrigger));
  });
  document.querySelectorAll("[data-filter-menu]").forEach(menu => {
    menu.addEventListener("change", event => {
      const input = event.target.closest("input[data-filter-option]");
      if (!input) return;
      const group = input.dataset.filterOption;
      if (input.checked) state.filters[group].add(input.value);
      else state.filters[group].delete(input.value);
      syncFilterUI();
      renderDetails();
    });
  });
  document.addEventListener("click", event => {
    if (!event.target.closest("[data-filter-dropdown]")) closeFilterMenus();
  });
  document.addEventListener("keydown", handleGlobalKeydown);

  dom.resetFilters.addEventListener("click", resetFilters);
  dom.emptyReset.addEventListener("click", resetFilters);
  dom.clearMonth.addEventListener("click", () => {
    state.selectedMonth = null;
    renderMonths();
    renderDetails();
  });
  dom.drawerClose.addEventListener("click", closeDetails);
  dom.drawerBackdrop.addEventListener("click", closeDetails);
  dom.matchForm.addEventListener("submit", handleMatchSubmit);
  dom.matchForm.addEventListener("input", hideMatchError);
  dom.matchForm.addEventListener("change", hideMatchError);
  dom.matchList.addEventListener("click", event => {
    const strategyButton = event.target.closest("[data-strategy-event]");
    if (strategyButton) openStrategy(strategyButton.dataset.strategyEvent, strategyButton);
    const planButton = event.target.closest("[data-plan-event]");
    if (planButton) addToMarketingPlan(planButton.dataset.planEvent);
  });
  dom.strategyBody.addEventListener("click", event => {
    const planButton = event.target.closest("[data-plan-event]");
    if (planButton) addToMarketingPlan(planButton.dataset.planEvent);
  });
  dom.strategyClose.addEventListener("click", closeStrategy);
  dom.strategyBackdrop.addEventListener("click", closeStrategy);
  dom.planNewButton.addEventListener("click", () => openPlanDrawer(null));
  dom.planEmptyNew.addEventListener("click", () => openPlanDrawer(null));
  dom.planDrawerClose.addEventListener("click", closePlanDrawer);
  dom.planBackdrop.addEventListener("click", closePlanDrawer);
  dom.confirmCancel.addEventListener("click", hideConfirm);
  dom.confirmOk.addEventListener("click", () => { if (state.lastConfirm) state.lastConfirm.resolve(true); hideConfirm(); });
  document.querySelectorAll("[data-plan-status]").forEach(btn => {
    btn.addEventListener("click", () => { setPlanStatusFilter(btn.dataset.planStatus); });
  });

  // 第五轮：数据管理
  if (dom.exportPlans) {
    dom.exportPlans.addEventListener("click", () => exportJson("plans"));
    dom.exportTasks.addEventListener("click", () => exportJson("tasks"));
    dom.exportAll.addEventListener("click", () => exportJson("all"));
    dom.importOpen.addEventListener("click", () => dom.importFile.click());
    dom.importFile.addEventListener("change", handleImportFile);
    dom.clearData.addEventListener("click", handleClearAllData);
  }
}

async function loadDatabase() {
  try {
    const response = await fetch("holidays.json");
    if (!response.ok) throw new Error(`数据库请求失败（${response.status}）`);
    const data = await response.json();
    validateDatabase(data);
    state.meta = data.meta;
    state.holidays = data.holidays;
    populateFilterOptions();
    calculateAndRender();
    if (state.strategyData) dom.generateMatches.disabled = false;
    dom.dataFreshness.textContent = data.meta.database_last_verified || data.meta.last_verified;
    dom.databaseCount.textContent = `${data.holidays.length} 个节点 · 独立 JSON`;
  } catch (error) {
    showLoadError(error);
  }
}

function validateDatabase(data) {
  if (!data || !Array.isArray(data.holidays) || !data.meta) {
    throw new Error("数据库结构不完整");
  }
  const required = [
    "id", "name_cn", "name_en", "date_rule", "fixed_date", "country", "category",
    "holiday_type", "is_public_holiday", "priority", "product_tags", "description",
    "source_url", "last_verified", "date_status", "month"
  ];
  const ids = new Set();
  data.holidays.forEach(holiday => {
    if (ids.has(holiday.id)) throw new Error(`重复的节日 ID：${holiday.id}`);
    ids.add(holiday.id);
    required.forEach(field => {
      if (!Object.prototype.hasOwnProperty.call(holiday, field)) {
        throw new Error(`${holiday.id || "未知节点"} 缺少字段：${field}`);
      }
    });
    if (!DATE_STATUS[holiday.date_status]) throw new Error(`${holiday.id} 的日期状态无效`);
    if (!Array.isArray(holiday.country) || !Array.isArray(holiday.product_tags)) {
      throw new Error(`${holiday.id} 的国家或产品标签格式无效`);
    }
  });
}

async function loadStrategyData() {
  try {
    const response = await fetch("marketing-strategies.json");
    if (!response.ok) throw new Error(`策略库请求失败（${response.status}）`);
    const data = await response.json();
    validateStrategyDatabase(data);
    state.strategyData = data;
    populateMatcherPriceOptions();
    dom.generateMatches.disabled = state.events.length === 0;
    dom.strategyLoadStatus.textContent = `已加载 ${Object.keys(data.strategies).length} 组节日策略 · 内容可通过 JSON 更新`;
  } catch (error) {
    dom.generateMatches.disabled = true;
    dom.strategyLoadStatus.textContent = `营销策略库加载失败：${error.message}`;
    console.error(error);
  }
}

function validateStrategyDatabase(data) {
  if (!data || !data.product_profiles || !data.price_profiles || !data.event_strategy_map || !data.type_strategy_map || !data.strategies) {
    throw new Error("策略库结构不完整");
  }
  const profileFields = ["reason", "audience", "product_angle", "landing_page", "seo_product", "gift_affinity", "preferred_events", "type_boosts", "feature_terms"];
  FILTER_OPTIONS.products.options.forEach(option => {
    const profile = data.product_profiles[option.value];
    if (!profile) throw new Error(`策略库缺少产品画像：${option.value}`);
    profileFields.forEach(field => {
      if (!Object.prototype.hasOwnProperty.call(profile, field)) throw new Error(`${option.value} 产品画像缺少字段：${field}`);
    });
  });
  PRICE_KEYS.forEach(key => {
    const profile = data.price_profiles[key];
    if (!profile || !profile.label || !profile.promotion) throw new Error(`价格画像不完整：${key}`);
  });

  const requiredGroups = [
    "new-year", "valentine", "womens-day", "mothers-day", "easter", "fathers-day",
    "prime-day", "back-to-school", "halloween", "thanksgiving", "black-friday",
    "cyber-monday", "christmas", "public", "cultural", "commercial", "seasonal",
    "industry", "awareness"
  ];
  requiredGroups.forEach(key => {
    if (!data.strategies[key]) throw new Error(`策略库缺少节日策略组：${key}`);
  });
  Object.entries(data.strategies).forEach(([key, strategy]) => {
    if (!strategy.scene || !strategy.motivation) throw new Error(`${key} 缺少消费场景或购买动机`);
    if (!Array.isArray(strategy.directions) || strategy.directions.length < 3) throw new Error(`${key} 至少需要 3 个营销切入方向`);
    SOCIAL_PLATFORMS.forEach(platform => {
      if (getSocialIdeas(strategy, platform.key).length < 2) throw new Error(`${key} 的 ${platform.label} 创意不足 2 条`);
    });
    AD_FIELDS.forEach(field => {
      if (!getAdValue(strategy.ads, field)) throw new Error(`${key} 缺少广告字段：${field.label}`);
    });
    if (!Array.isArray(strategy.seo) || strategy.seo.length < 5) throw new Error(`${key} 至少需要 5 个英文 SEO 关键词`);
  });

  const holidayTypes = new Set([...Object.keys(HOLIDAY_TYPE_MAP), ...state.holidays.map(holiday => holiday.holiday_type)]);
  holidayTypes.forEach(type => {
    const key = resolveMappedStrategyKey(data.type_strategy_map[type]);
    if (!key || !data.strategies[key]) throw new Error(`节日类型 ${type} 未关联有效策略`);
  });
  Object.entries(data.event_strategy_map).forEach(([eventId, mapped]) => {
    const key = resolveMappedStrategyKey(mapped);
    if (!key || !data.strategies[key]) throw new Error(`${eventId} 关联了不存在的策略：${key || "空值"}`);
  });
}

function resolveMappedStrategyKey(mapped) {
  if (typeof mapped === "string") return mapped;
  if (mapped && typeof mapped === "object") return mapped.strategy || mapped.strategy_key || mapped.key || "";
  return "";
}

function populateMatcherForm() {
  dom.matchCategory.insertAdjacentHTML("beforeend", FILTER_OPTIONS.products.options.map(option =>
    `<option value="${option.value}">${escapeHTML(option.label)}</option>`
  ).join(""));
  dom.matchCountryOptions.innerHTML = FILTER_OPTIONS.countries.options.map(option => `
    <label class="match-country" for="match-country-${option.value}">
      <input id="match-country-${option.value}" type="checkbox" name="countries" value="${option.value}">
      <span>${escapeHTML(option.label)}</span>
    </label>`).join("");
}

function populateMatcherPriceOptions() {
  const profiles = state.strategyData.price_profiles;
  dom.matchPrice.innerHTML = `<option value="">请选择价格区间</option>${PRICE_KEYS.filter(key => profiles[key]).map(key =>
    `<option value="${key}">${escapeHTML(profiles[key].label)}</option>`
  ).join("")}`;
}

function hideMatchError() {
  dom.matchFormError.hidden = true;
  dom.matchFormError.textContent = "";
}

function showMatchError(message, focusTarget) {
  dom.matchFormError.textContent = message;
  dom.matchFormError.hidden = false;
  if (focusTarget) focusTarget.focus();
}

function populateFilterOptions() {
  Object.entries(FILTER_OPTIONS).forEach(([group, definition]) => {
    const menu = document.querySelector(`[data-filter-menu="${group}"]`);
    menu.innerHTML = `
      <div class="filter-options-heading"><span>支持多选</span><span>${definition.options.length} 项</span></div>
      <div class="filter-option-list">
        ${definition.options.map(option => `
          <label class="filter-option" for="filter-${group}-${option.value}">
            <input id="filter-${group}-${option.value}" type="checkbox" value="${option.value}" data-filter-option="${group}">
            <span class="filter-check" aria-hidden="true"></span>
            <span>${escapeHTML(option.label)}</span>
          </label>`).join("")}
      </div>`;
  });
  syncFilterUI();
}

function toggleFilterMenu(group) {
  const menu = document.querySelector(`[data-filter-menu="${group}"]`);
  const shouldOpen = menu.hidden;
  closeFilterMenus();
  if (shouldOpen) {
    menu.hidden = false;
    const trigger = document.querySelector(`[data-filter-trigger="${group}"]`);
    trigger.setAttribute("aria-expanded", "true");
    trigger.closest("[data-filter-dropdown]").classList.add("open");
  }
}

function closeFilterMenus(restoreFocus = false) {
  let openTrigger = null;
  document.querySelectorAll("[data-filter-dropdown]").forEach(dropdown => {
    const trigger = dropdown.querySelector("[data-filter-trigger]");
    if (trigger.getAttribute("aria-expanded") === "true") openTrigger = trigger;
    dropdown.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
    dropdown.querySelector("[data-filter-menu]").hidden = true;
  });
  if (restoreFocus && openTrigger) openTrigger.focus();
}

function syncFilterUI() {
  Object.entries(FILTER_OPTIONS).forEach(([group, definition]) => {
    const selected = state.filters[group];
    document.querySelectorAll(`input[data-filter-option="${group}"]`).forEach(input => {
      input.checked = selected.has(input.value);
    });
    const selectedOptions = definition.options.filter(option => selected.has(option.value));
    const value = document.querySelector(`[data-filter-value="${group}"]`);
    value.textContent = selectedOptions.length === 0
      ? definition.defaultLabel
      : selectedOptions.length === 1 ? selectedOptions[0].label : `已选 ${selectedOptions.length} 项`;
    value.title = selectedOptions.map(option => option.label).join("、");
    document.querySelector(`[data-filter-trigger="${group}"]`).classList.toggle("has-selection", selected.size > 0);
  });
}

function handleGlobalKeydown(event) {
  if (!dom.strategyDrawer.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeStrategy();
    } else if (event.key === "Tab") {
      trapDrawerFocus(event, dom.strategyDrawer);
    }
    return;
  }
  if (!dom.detailDrawer.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetails();
    } else if (event.key === "Tab") {
      trapDrawerFocus(event, dom.detailDrawer);
    }
    return;
  }
  if (event.key === "Escape") closeFilterMenus(true);
}

function trapDrawerFocus(event, container) {
  const focusable = [...container.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])")];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function calculateAndRender() {
  const cache = new Map();
  state.events = state.holidays.map(holiday => resolveHoliday(holiday, state.year, cache));
  renderStats();
  renderUpcoming();
  renderMonths();
  renderTimeline();
  renderDetails();
  if (state.matchInput && state.strategyData) {
    state.recommendations = generateRecommendations(state.matchInput);
    renderMatchResults();
  }
}

function resolveHoliday(holiday, year, cache = new Map()) {
  const cacheKey = `${holiday.id}-${year}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const rule = holiday.date_rule;
  const override = rule.overrides && rule.overrides[String(year)];
  let start = null;
  let end = null;
  let status = holiday.date_status;

  if (override) {
    start = parseISODate(override.start);
    end = parseISODate(override.end || override.start);
    status = override.date_status || status;
  } else {
    switch (rule.type) {
      case "fixed":
        start = makeDate(year, rule.month, rule.day);
        end = new Date(start);
        break;
      case "fixed_range": {
        start = makeDate(year, rule.start_month, rule.start_day);
        const endYear = rule.end_month < rule.start_month ? year + 1 : year;
        const endDay = rule.end_day === "last" ? daysInMonth(endYear, rule.end_month) : rule.end_day;
        end = makeDate(endYear, rule.end_month, endDay);
        break;
      }
      case "nth_weekday":
        start = nthWeekday(year, rule.month, rule.nth, rule.weekday);
        end = new Date(start);
        break;
      case "last_weekday":
        start = lastWeekday(year, rule.month, rule.weekday);
        if (rule.avoid_easter_offset !== undefined) {
          const conflictDate = addDays(computeEaster(year), rule.avoid_easter_offset);
          if (isSameDate(start, conflictDate)) start = addDays(start, rule.shift_days || 7);
        }
        end = new Date(start);
        break;
      case "easter_offset":
        start = addDays(computeEaster(year), rule.offset_days);
        end = new Date(start);
        break;
      case "relative_to": {
        const reference = state.holidays.find(item => item.id === rule.holiday_id);
        if (!reference) throw new Error(`${holiday.id} 找不到关联节点 ${rule.holiday_id}`);
        const resolvedReference = resolveHoliday(reference, year, cache);
        if (resolvedReference.start) {
          start = addDays(resolvedReference.start, rule.offset_days);
          end = new Date(start);
        }
        break;
      }
      case "unconfirmed":
        break;
      default:
        throw new Error(`${holiday.id} 使用了未知日期规则：${rule.type}`);
    }
  }

  const resolved = { ...holiday, start, end, status };
  cache.set(cacheKey, resolved);
  return resolved;
}

function makeDate(year, month, day) {
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return makeDate(year, month, day);
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function nthWeekday(year, month, nth, weekday) {
  const first = makeDate(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return makeDate(year, month, 1 + offset + (nth - 1) * 7);
}

function lastWeekday(year, month, weekday) {
  const last = makeDate(year, month, daysInMonth(year, month));
  const offset = (last.getDay() - weekday + 7) % 7;
  return makeDate(year, month, last.getDate() - offset);
}

function computeEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return makeDate(year, month, day);
}

function getReferenceDate() {
  return makeDate(state.year, TODAY.getMonth() + 1, TODAY.getDate());
}

function getEventMonth(event) {
  return event.start ? event.start.getMonth() + 1 : event.month;
}

function eventsForMonth(month) {
  return state.events.filter(event => getEventMonth(event) === month).sort(compareByDate);
}

function compareByDate(a, b) {
  if (!a.start && !b.start) return a.name_cn.localeCompare(b.name_cn, "zh-CN");
  if (!a.start) return 1;
  if (!b.start) return -1;
  return a.start - b.start || a.name_cn.localeCompare(b.name_cn, "zh-CN");
}

function compareByPriority(a, b) {
  return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority] || compareByDate(a, b);
}

function renderStats() {
  const currentMonth = TODAY.getMonth() + 1;
  const reference = getReferenceDate();
  const horizon = addDays(reference, 30);
  const upcoming = state.events.filter(event =>
    event.start && event.end && event.end >= reference && event.start <= horizon
  );

  dom.statTotal.textContent = state.events.length;
  dom.statCurrent.textContent = eventsForMonth(currentMonth).length;
  dom.statCurrentLabel.textContent = `当前月份 · ${MONTHS[currentMonth - 1].cn}`;
  dom.statUpcoming.textContent = upcoming.length;
  dom.statUpcomingNote.textContent = `含进行中 · ${reference.getMonth() + 1}月${reference.getDate()}日起`;
  dom.statPriority.textContent = state.events.filter(event => event.priority === "high").length;
}

function renderUpcoming() {
  const reference = getReferenceDate();
  const upcoming = state.events
    .filter(event => event.start && event.start >= reference)
    .sort(compareByDate)
    .slice(0, 3);

  if (!upcoming.length) {
    dom.upcomingList.innerHTML = `<p class="panel-note">本年度暂无后续已知日期节点，请切换年份查看。</p>`;
    return;
  }

  dom.upcomingList.innerHTML = upcoming.map(event => `
    <div class="upcoming-item">
      <div class="upcoming-date">
        <strong>${String(event.start.getDate()).padStart(2, "0")}</strong>
        <span>${MONTHS[event.start.getMonth()].short}</span>
      </div>
      <div class="upcoming-name">
        <strong>${escapeHTML(event.name_cn)}</strong>
        <span>${escapeHTML(event.name_en)} · ${escapeHTML(event.country.slice(0, 2).join(" / "))}</span>
      </div>
    </div>`).join("");
}

function renderMonths() {
  dom.monthGrid.innerHTML = MONTHS.map((month, index) => {
    const monthNumber = index + 1;
    const events = eventsForMonth(monthNumber);
    const festivals = events
      .filter(event => !["commercial", "seasonal"].includes(event.holiday_type))
      .sort(compareByPriority)
      .slice(0, 2);
    const marketing = events.filter(event => ["commercial", "seasonal"].includes(event.holiday_type));
    const marketingFallback = events.filter(event => event.priority === "high" && !marketing.includes(event));
    const campaigns = [...marketing, ...marketingFallback].sort(compareByPriority).slice(0, 2);
    const active = state.selectedMonth === monthNumber ? " active" : "";
    const festivalItems = festivals.length
      ? festivals.map(event => `<span class="month-event"><span class="month-event-name">${escapeHTML(event.name_cn)}</span><span class="status-chip status-${event.status}">${DATE_STATUS[event.status]}</span></span>`).join("")
      : `<span class="month-event is-empty">以季节营销为主</span>`;
    const campaignItems = campaigns.length
      ? campaigns.map(event => `<span class="month-event"><span class="month-event-name">${escapeHTML(event.name_cn)}</span><span class="status-chip status-${event.status}">${DATE_STATUS[event.status]}</span></span>`).join("")
      : `<span class="month-event is-empty">见本月完整节点</span>`;

    return `
      <button class="month-card${active}" type="button" data-month="${monthNumber}" style="--month-color:${month.color}" aria-label="查看${month.cn}${events.length}个营销节点">
        <span class="month-card-header">
          <span class="month-title"><strong>${month.cn}</strong><span>${month.en}</span></span>
          <span class="month-count">${events.length} 个节点</span>
        </span>
        <span class="month-block">
          <span class="month-block-label">主要节日</span>
          <span class="month-block-list">${festivalItems}</span>
        </span>
        <span class="month-block">
          <span class="month-block-label">重点营销活动</span>
          <span class="month-block-list">${campaignItems}</span>
        </span>
        <span class="month-card-footer"><span>查看本月全部节点</span><span aria-hidden="true">→</span></span>
      </button>`;
  }).join("");
}

function renderTimeline() {
  dom.timeline.innerHTML = MONTHS.map((month, index) => {
    const monthNumber = index + 1;
    const events = eventsForMonth(monthNumber);
    return `
      <section class="timeline-month" style="--month-color:${month.color}" aria-label="${month.cn}营销节点">
        <div class="timeline-month-label"><strong>${month.cn}</strong><span>${month.en}</span></div>
        <div class="timeline-events">
          ${events.length ? events.map(event => `
            <button class="timeline-event" type="button" data-event-id="${escapeHTML(event.id)}" aria-label="查看${escapeHTML(event.name_cn)}详情">
              <span class="timeline-date">${formatTimelineDate(event)}</span>
              <span class="timeline-name"><strong>${escapeHTML(event.name_cn)}</strong><span>${escapeHTML(event.name_en)}</span></span>
              <span class="status-chip status-${event.status}">${DATE_STATUS[event.status]}</span>
              <span class="timeline-arrow" aria-hidden="true">→</span>
            </button>`).join("") : `<p class="section-description">本月暂无节点</p>`}
        </div>
      </section>`;
  }).join("");
}

function setView(view) {
  state.view = view;
  const isMonths = view === "months";
  dom.monthView.hidden = !isMonths;
  dom.timelineView.hidden = isMonths;
  document.querySelectorAll("[data-view]").forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
}

function selectMonth(month) {
  state.selectedMonth = month;
  renderMonths();
  renderDetails();
  document.getElementById("holiday-details").scrollIntoView({ behavior: "smooth", block: "start" });
}

function locateEvent(id, trigger) {
  const event = state.events.find(item => item.id === id);
  if (!event) return;
  clearFilterSelections();
  state.selectedMonth = getEventMonth(event);
  renderMonths();
  renderDetails();
  document.getElementById("holiday-details").scrollIntoView({ behavior: "smooth", block: "start" });
  openDetails(id, trigger);
}

function renderDetails() {
  const filtered = state.events.filter(event => {
    if (state.selectedMonth && getEventMonth(event) !== state.selectedMonth) return false;
    if (!matchesGroup(state.filters.countries, [...state.filters.countries].some(country => eventMatchesCountry(event, country)))) return false;
    const productKeys = getEventProductKeys(event);
    if (!matchesGroup(state.filters.products, productKeys.some(key => state.filters.products.has(key)))) return false;
    if (!matchesGroup(state.filters.priorities, state.filters.priorities.has(event.priority))) return false;
    const typeKeys = getEventTypeKeys(event);
    if (!matchesGroup(state.filters.types, typeKeys.some(key => state.filters.types.has(key)))) return false;
    if (state.search && !getSearchableText(event).includes(state.search)) return false;
    return true;
  }).sort(compareByDate);

  if (state.selectedMonth) {
    const month = MONTHS[state.selectedMonth - 1];
    dom.activeFilter.hidden = false;
    dom.activeFilterLabel.textContent = `${state.year} 年 · ${month.cn} ${month.en}`;
  } else {
    dom.activeFilter.hidden = true;
  }

  dom.resultCount.textContent = `显示 ${filtered.length} 个节点${filtered.length !== state.events.length ? ` / 全年共 ${state.events.length} 个` : " · 全年完整数据库"}`;
  dom.holidayList.innerHTML = filtered.map(renderHolidayItem).join("");
  dom.holidayList.hidden = filtered.length === 0;
  dom.emptyState.hidden = filtered.length !== 0;
}

function matchesGroup(selected, matches) {
  return selected.size === 0 || matches;
}

function eventMatchesCountry(event, value) {
  const option = FILTER_OPTIONS.countries.options.find(item => item.value === value);
  if (!option) return false;
  if (value === "global") return event.country.some(country => country.startsWith("全球"));
  if (option.aliases.some(alias => event.country.includes(alias))) return true;
  return event.country.includes("全球") || event.country.includes("全球电商市场");
}

function getEventProductKeys(event) {
  const definitions = FILTER_OPTIONS.products.options;
  if (event.product_tags.some(tag => tag.includes("全品类"))) {
    return definitions.map(option => option.value);
  }
  const keys = new Set();
  event.product_tags.forEach(tag => {
    let matched = false;
    definitions.forEach(option => {
      if (option.value === "other") return;
      if (option.value === "toys" && /[猫狗宠物]/.test(tag)) return;
      if (option.terms.some(term => tag.toLowerCase().includes(term.toLowerCase()))) {
        keys.add(option.value);
        matched = true;
      }
    });
    if (!matched) keys.add("other");
  });
  if (!keys.size) keys.add("other");
  return [...keys];
}

function getEventTypeKeys(event) {
  const keys = new Set([HOLIDAY_TYPE_MAP[event.holiday_type] || "industry"]);
  const giftingText = `${event.name_cn} ${event.name_en} ${event.description}`;
  if (getEventProductKeys(event).includes("gifts") || /礼赠|送礼|礼品/.test(giftingText)) keys.add("gifting");
  return [...keys];
}

function getSearchableText(event) {
  const profile = getMarketingProfile(event);
  const countryLabels = FILTER_OPTIONS.countries.options
    .filter(option => option.aliases.some(alias => event.country.includes(alias)) ||
      (option.value === "global" && event.country.some(country => country.startsWith("全球"))))
    .map(option => option.label);
  const productLabels = getEventProductKeys(event).map(getProductLabel);
  const typeLabels = getEventTypeKeys(event).map(getTypeLabel);
  return [
    event.name_cn, event.name_en, event.description, event.category,
    PRIORITY[event.priority], profile.motivation, profile.opportunity,
    ...event.country, ...countryLabels, ...event.product_tags, ...productLabels, ...typeLabels
  ].join(" ").toLowerCase();
}

function getProductLabel(value) {
  const option = FILTER_OPTIONS.products.options.find(item => item.value === value);
  return option ? option.label : value;
}

function getTypeLabel(value) {
  const option = FILTER_OPTIONS.types.options.find(item => item.value === value);
  return option ? option.label : value;
}

function getMarketingProfile(event) {
  const motivations = {
    public: "公共假日带来休息、聚会与家庭活动时间，消费者更关注节日筹备、居家焕新和假期体验。",
    religious: "消费者围绕传统习俗、家庭团聚与纪念仪式进行准备，重视文化认同、情感表达和节日仪式感。",
    commercial: "消费者集中等待促销、比较价格并完成计划性购买，优惠力度、配送时效和库存确定性是主要决策因素。",
    seasonal: "换季、开学或假期安排带动服饰、家居和出行需求，消费者倾向于提前采购并更新当季用品。",
    industry: "主题内容与圈层兴趣激发参与感，消费者更容易为兴趣表达、体验活动和主题相关产品买单。",
    awareness: "消费者希望表达个人价值与社会关怀，更易关注具有真实理念、公益行动和健康生活主张的品牌。"
  };
  const opportunities = {
    public: "围绕假期场景组织商品与内容，提前规划库存和配送；公共假日属性与地区安排应以当地官方信息为准。",
    religious: "以文化背景和传统习俗为内容核心，采用尊重、准确的表达，避免将纪念性或宗教性节点过度娱乐化。",
    commercial: "突出清晰的优惠机制、热销商品和履约承诺，配合倒计时、购物车召回及分阶段促销承接集中流量。",
    seasonal: "按换季与使用场景组织商品组合，通过当季指南、清单内容和套装推荐提前承接需求。",
    industry: "围绕主题兴趣制作内容与互动活动，用相关商品、联名周边或圈层合作提升参与度和分享意愿。",
    awareness: "以真实行动和有价值的内容建立认同，谨慎使用公益表达，并清楚说明合作或捐赠机制。"
  };
  const baseType = event.holiday_type;
  const gifting = getEventTypeKeys(event).includes("gifting");
  let motivation = motivations[baseType] || motivations.industry;
  let opportunity = opportunities[baseType] || opportunities.industry;
  if (gifting) {
    motivation = "消费者为伴侣、家人、朋友或自己挑选礼物，重视心意表达、收礼对象偏好、包装质感和送达时间。";
    opportunity = `可设置按对象、预算和场景划分的礼赠指南，突出礼盒、定制、贺卡与配送承诺。${opportunity}`;
  }
  if (event.status === "official_unconfirmed") {
    opportunity += " 官方日期公布后再锁定投放与履约安排，不提前承诺活动日期。";
  } else if (event.planning_window) {
    opportunity += " 当前区间为建议营销窗口，应结合目标市场与实际业务节奏调整。";
  }
  return { motivation, opportunity };
}

function renderHolidayItem(event) {
  const planningBadge = event.planning_window ? `<span class="badge badge-planning">建议窗口</span>` : "";
  return `
    <button class="holiday-item holiday-card" type="button" data-event-id="${escapeHTML(event.id)}" aria-haspopup="dialog" aria-label="查看${escapeHTML(event.name_cn)}完整详情">
      <span class="holiday-summary">
        <span class="holiday-date">${escapeHTML(formatTimelineDate(event))}<small>${event.start ? `${event.start.getFullYear()} 年` : `${state.year} 年 · 待定`}</small></span>
        <span class="holiday-title"><strong>${escapeHTML(event.name_cn)}</strong><span>${escapeHTML(event.name_en)}</span></span>
        <span class="holiday-country">${escapeHTML(event.country.join(" · "))}</span>
        <span class="holiday-badges">
          <span class="badge badge-priority badge-priority-${event.priority}">${PRIORITY[event.priority]}</span>
          <span class="badge badge-status-${event.status}">${DATE_STATUS[event.status]}</span>
          ${planningBadge}
        </span>
        <span class="holiday-card-arrow" aria-hidden="true">→</span>
      </span>
    </button>`;
}

function openDetails(id, trigger) {
  const event = state.events.find(item => item.id === id);
  if (!event) return;
  lastFocusedElement = trigger || document.activeElement;
  const profile = getMarketingProfile(event);
  const dateText = event.start ? `${event.start.getFullYear()}年${formatEventDate(event, true)}` : formatEventDate(event, true);
  const typeText = getEventTypeKeys(event).map(getTypeLabel).join("、");
  const productLabels = getEventProductKeys(event).map(getProductLabel);
  const dateNote = event.date_note ? `<div class="drawer-source-note"><strong>核实提示</strong><p>${escapeHTML(event.date_note)}</p></div>` : "";

  dom.drawerTitle.textContent = event.name_cn;
  dom.drawerNameEn.textContent = event.name_en;
  dom.drawerBody.innerHTML = `
    ${buildDetailCountdown(event)}
    <section class="drawer-section drawer-overview" aria-labelledby="drawer-basic-title">
      <h3 id="drawer-basic-title">基础信息</h3>
      <dl class="drawer-facts">
        <div class="drawer-fact drawer-fact-wide"><dt>具体日期</dt><dd>${escapeHTML(dateText)}</dd></div>
        <div class="drawer-fact drawer-fact-wide"><dt>适用国家</dt><dd>${escapeHTML(event.country.join("、"))}</dd></div>
        <div class="drawer-fact"><dt>节日类型</dt><dd>${escapeHTML(typeText)}<small>${escapeHTML(event.category)}</small></dd></div>
        <div class="drawer-fact"><dt>是否为公共假日</dt><dd>${event.is_public_holiday ? "是" : "否"}<small>${event.is_public_holiday ? "具体地区以官方规定为准" : "非统一公共假日"}</small></dd></div>
        <div class="drawer-fact drawer-fact-wide"><dt>营销优先级</dt><dd><span class="badge badge-priority badge-priority-${event.priority}">${PRIORITY[event.priority]}</span></dd></div>
      </dl>
    </section>

    <section class="drawer-section" aria-labelledby="drawer-background-title">
      <h3 id="drawer-background-title">节日背景介绍</h3>
      <p class="drawer-copy">${escapeHTML(event.description)}</p>
    </section>

    <section class="drawer-section" aria-labelledby="drawer-marketing-title">
      <h3 id="drawer-marketing-title">营销洞察</h3>
      <p class="drawer-section-note">以下为基于节日属性的基础营销建议，执行前请结合目标市场与产品验证。</p>
      <div class="drawer-insight">
        <h4>适合产品类别</h4>
        <div class="product-tags">${productLabels.map(label => `<span class="product-tag product-tag-category">${escapeHTML(label)}</span>`).join("")}</div>
        <p class="drawer-tag-note">原始产品标签：${escapeHTML(event.product_tags.join("、"))}</p>
      </div>
      <div class="drawer-insight"><h4>消费者购买动机</h4><p class="drawer-copy">${escapeHTML(profile.motivation)}</p></div>
      <div class="drawer-insight"><h4>营销机会说明</h4><p class="drawer-copy">${escapeHTML(profile.opportunity)}</p></div>
    </section>

    <section class="drawer-section" aria-labelledby="drawer-source-title">
      <h3 id="drawer-source-title">日期核实与信息来源</h3>
      <dl class="drawer-verification">
        <div><dt>日期状态</dt><dd><span class="badge badge-status-${event.status}">${DATE_STATUS[event.status]}</span>${event.planning_window ? `<span class="badge badge-planning">建议窗口</span>` : ""}${event.needs_manual_review ? `<span class="badge badge-review">需人工复核</span>` : ""}</dd></div>
        <div><dt>日期规则</dt><dd>${escapeHTML(describeDateRule(event))}</dd></div>
        <div><dt>最近核验日期</dt><dd>${escapeHTML(event.last_verified)}</dd></div>
        <div><dt>来源名称</dt><dd>${event.source_name ? escapeHTML(event.source_name) : "数据库未记录"}</dd></div>
        <div><dt>信息来源</dt><dd><a class="source-link" href="${escapeHTML(event.source_url)}" target="_blank" rel="noopener noreferrer">查看原始来源 ↗</a><small class="source-url">${escapeHTML(event.source_url)}</small></dd></div>
        ${event.verification_note ? `<div><dt>核验说明</dt><dd>${escapeHTML(event.verification_note)}</dd></div>` : ""}
      </dl>
      ${dateNote}
    </section>`;

  closeFilterMenus();
  dom.drawerBackdrop.hidden = false;
  dom.detailDrawer.hidden = false;
  syncBodyDrawerState();
  dom.detailDrawer.scrollTop = 0;
  dom.drawerClose.focus();
}

function closeDetails() {
  if (dom.detailDrawer.hidden) return;
  dom.detailDrawer.hidden = true;
  dom.drawerBackdrop.hidden = true;
  syncBodyDrawerState();
  if (lastFocusedElement && lastFocusedElement.isConnected) lastFocusedElement.focus();
  lastFocusedElement = null;
}

function formatEventDate(event, includeWeekday = false) {
  if (!event.start) return event.status === "official_unconfirmed" ? "日期待官方公布" : "日期待人工核实";
  const start = formatSingleDate(event.start, includeWeekday);
  if (isSameDate(event.start, event.end)) return start;
  const differentYear = event.start.getFullYear() !== event.end.getFullYear();
  const end = differentYear
    ? `${event.end.getFullYear()}年${event.end.getMonth() + 1}月${event.end.getDate()}日`
    : `${event.end.getMonth() + 1}月${event.end.getDate()}日`;
  return `${start} – ${end}${event.planning_window ? "（建议窗口）" : ""}`;
}

function formatSingleDate(date, includeWeekday) {
  const base = `${date.getMonth() + 1}月${date.getDate()}日`;
  return includeWeekday ? `${base} · 周${WEEKDAYS[date.getDay()]}` : base;
}

function formatTimelineDate(event) {
  if (!event.start) return "待确认";
  const start = `${String(event.start.getMonth() + 1).padStart(2, "0")}.${String(event.start.getDate()).padStart(2, "0")}`;
  if (isSameDate(event.start, event.end)) return `${start} 周${WEEKDAYS[event.start.getDay()]}`;
  const end = `${String(event.end.getMonth() + 1).padStart(2, "0")}.${String(event.end.getDate()).padStart(2, "0")}`;
  return `${start}–${end}`;
}

function describeDateRule(event) {
  const rule = event.date_rule;
  let description;
  switch (rule.type) {
    case "fixed":
      description = `固定日期 · 每年${rule.month}月${rule.day}日`;
      break;
    case "fixed_range":
      description = `多日区间 · ${rule.start_month}月${rule.start_day}日至${rule.end_month}月${rule.end_day === "last" ? "最后一日" : `${rule.end_day}日`}`;
      if (event.planning_window) description += "（营销建议，非官方统一日期）";
      break;
    case "nth_weekday":
      description = `每年${rule.month}月第${ORDINALS[rule.nth]}个周${WEEKDAYS[rule.weekday]}`;
      break;
    case "last_weekday":
      description = `每年${rule.month}月最后一个周${WEEKDAYS[rule.weekday]}`;
      if (rule.avoid_easter_offset !== undefined) description += "；若与五旬节同日则顺延7天";
      break;
    case "easter_offset":
      description = rule.offset_days === 0 ? "按西方复活节计算规则" : `西方复活节${rule.offset_days > 0 ? "后" : "前"}${Math.abs(rule.offset_days)}天`;
      break;
    case "relative_to": {
      const reference = state.holidays.find(item => item.id === rule.holiday_id);
      description = `${reference ? reference.name_cn : rule.holiday_id}后${rule.offset_days}天`;
      break;
    }
    case "unconfirmed":
      description = event.status === "official_unconfirmed" ? "官方尚未公布当年日期，不进行推测" : "需依据当年权威年历人工核实";
      break;
    default:
      description = "待核实";
  }
  if (event.status === "official_confirmed" && rule.overrides && rule.overrides[String(state.year)]) {
    description = `${state.year}年官方确认日期 · ${description}`;
  }
  return description;
}

function handleMatchSubmit(event) {
  event.preventDefault();
  hideMatchError();
  if (!state.strategyData || !state.events.length) {
    showMatchError("节日数据库和营销策略库加载完成后才能生成推荐。");
    return;
  }
  const category = dom.matchCategory.value;
  const countries = [...dom.matchCountryOptions.querySelectorAll("input:checked")].map(input => input.value);
  if (!category) {
    showMatchError("请选择产品类别。", dom.matchCategory);
    return;
  }
  if (!countries.length) {
    showMatchError("请至少选择一个销售国家。", dom.matchCountryOptions.querySelector("input"));
    return;
  }

  state.matchInput = {
    category,
    productName: dom.matchProductName.value.trim(),
    countries,
    price: dom.matchPrice.value,
    features: dom.matchFeatures.value.trim()
  };
  state.recommendations = generateRecommendations(state.matchInput);
  renderMatchResults();
  dom.matchResults.scrollIntoView({ behavior: "smooth", block: "start" });
}

const MATCH_TIERS = {
  A: {
    label: "重点营销节点",
    className: "tier-a",
    note: "产品属性与节日消费场景高度匹配，优先准备内容、广告和营销活动。"
  },
  B: {
    label: "可选营销节点",
    className: "tier-b",
    note: "存在一定关联，但不是核心营销机会，可结合产品特点、预算和运营能力决定是否参与。"
  },
  C: {
    label: "不建议优先参与",
    className: "tier-c",
    note: "产品关联度较弱，不建议为了参与节日而盲目投入广告预算。"
  }
};
const MATCH_TIER_RANK = { A: 0, B: 1, C: 2 };

function generateRecommendations(input) {
  return state.events.map(event => scoreEventForProduct(event, input))
    .filter(recommendation => recommendation && recommendation.score >= 34)
    .map(recommendation => ({ ...recommendation, tier: getMatchTier(recommendation) }))
    .sort((a, b) =>
      MATCH_TIER_RANK[a.tier] - MATCH_TIER_RANK[b.tier]
      || b.score - a.score
      || compareByPriority(a.event, b.event))
    .slice(0, 12)
    .map(recommendation => ({
      ...recommendation,
      reason: buildRecommendationReason(recommendation, input)
    }));
}

// 分级依据：实际匹配得分 + 命中的匹配依据数量，不按推荐顺序简单分组
function getMatchTier(recommendation) {
  const { score, direct, preferred, universal, featureSpecific } = recommendation;
  const evidenceCount = [direct, preferred, universal, featureSpecific].filter(Boolean).length;
  const coreMatched = direct || preferred;
  if (score >= 75 && evidenceCount >= 2 && coreMatched) return "A";
  if (score >= 50 && (coreMatched || featureSpecific)) return "B";
  return "C";
}

function scoreEventForProduct(event, input) {
  const profile = state.strategyData.product_profiles[input.category];
  const matchedCountries = input.countries.filter(country => eventMatchesCountry(event, country));
  if (!profile || !matchedCountries.length) return null;

  const strategyKey = getEventStrategyKey(event);
  const universal = event.product_tags.some(tag => tag.includes("全品类"));
  const specificEvent = universal
    ? { ...event, product_tags: event.product_tags.filter(tag => !tag.includes("全品类")) }
    : event;
  const direct = input.category !== "other" && getEventProductKeys(specificEvent).includes(input.category);
  const preferredEvents = Array.isArray(profile.preferred_events) ? profile.preferred_events : [];
  const preferred = preferredEvents.includes(event.id) || preferredEvents.includes(strategyKey);
  const featureMatch = getFeatureMatch(profile.feature_terms, input, event, strategyKey);
  if (!direct && !preferred && !universal && !featureMatch.specific) return null;

  let score = 0;
  if (preferred) score += 46;
  if (direct) score += 38;
  if (universal) score += event.holiday_type === "commercial" ? 24 : 12;
  if (featureMatch.specific) score += 10;
  else if (featureMatch.terms.length && (direct || preferred)) score += 3;

  const gifting = getEventTypeKeys(event).includes("gifting");
  const giftAffinity = Math.max(0, Math.min(1, Number(profile.gift_affinity) || 0));
  if (gifting && (direct || preferred)) score += Math.round(giftAffinity * 12);
  score += event.priority === "high" ? 8 : event.priority === "medium" ? 4 : 1;
  if (!event.country.some(country => country.startsWith("全球"))) score += 3;
  if (event.holiday_type === "commercial" && (direct || universal)) score += 4;

  const boosts = profile.type_boosts || {};
  const rawBoost = Number(boosts[event.holiday_type] ?? boosts[strategyKey] ?? boosts[HOLIDAY_TYPE_MAP[event.holiday_type]] ?? 0);
  if (rawBoost > 0) score += Math.min(12, rawBoost * 8);

  return { event, score, direct, preferred, universal, matchedCountries, featureSpecific: featureMatch.specific, featureTerms: featureMatch.terms };
}

function getFeatureMatch(featureTerms, input, event, strategyKey) {
  const text = `${input.productName} ${input.features}`.toLowerCase();
  const result = { terms: [], specific: false };
  if (!text.trim() || !featureTerms) return result;

  if (Array.isArray(featureTerms)) {
    result.terms = featureTerms.filter(term => typeof term === "string" && text.includes(term.toLowerCase()));
    return result;
  }
  if (typeof featureTerms !== "object") return result;

  Object.entries(featureTerms).forEach(([term, rule]) => {
    const normalizedTerm = String(rule && rule.term ? rule.term : term).toLowerCase();
    if (!text.includes(normalizedTerm)) return;
    result.terms.push(normalizedTerm);
    const relatedTags = Array.isArray(rule) ? rule : Array.isArray(rule && rule.tags) ? rule.tags : [];
    const relatedEvents = !Array.isArray(rule) && rule && Array.isArray(rule.events) ? rule.events : [];
    if (relatedTags.some(tag => event.product_tags.includes(tag)) || term === event.id || term === strategyKey || relatedEvents.includes(event.id) || relatedEvents.includes(strategyKey)) {
      result.specific = true;
    }
  });
  result.terms = [...new Set(result.terms)];
  return result;
}

function buildRecommendationReason(recommendation, input) {
  const { event, direct, preferred, universal, matchedCountries, featureSpecific, featureTerms } = recommendation;
  const profile = state.strategyData.product_profiles[input.category];
  const strategy = getEventStrategy(event);
  const context = createStrategyContext(recommendation, input);
  const productReason = trimSentence(profile.reason);
  const scene = trimSentence(interpolate(strategy.scene, context));
  let reason = `${productReason}，适合${scene}。`;
  if (featureTerms.length && (direct || preferred || universal || featureSpecific)) {
    reason += ` 产品特点“${featureTerms.slice(0, 3).join("、")}”可用于强化节点内容。`;
  }
  if (direct) reason += ` 节日产品标签与${getProductLabel(input.category)}直接相关。`;
  else if (preferred) reason += ` 该节点是此类产品的重点营销场景。`;
  else if (universal) reason += ` 该节点具有明确的全品类促销场景。`;
  else if (featureSpecific) reason += ` 产品特点与节日原始产品标签相关。`;
  reason += ` 已匹配${matchedCountries.map(getCountryShortLabel).join("、")}市场。`;
  return reason;
}

function trimSentence(value) {
  return String(value || "").trim().replace(/[。；;\s]+$/g, "");
}

function getCountryShortLabel(value) {
  const option = FILTER_OPTIONS.countries.options.find(item => item.value === value);
  return option ? (value === "global" ? "全球" : option.aliases[0]) : value;
}

function renderMatchResults() {
  const input = state.matchInput;
  if (!input) return;
  const count = state.recommendations.length;
  const groups = ["A", "B", "C"]
    .map(tier => ({ tier, items: state.recommendations.filter(item => item.tier === tier) }))
    .filter(group => group.items.length);
  const product = input.productName || getProductLabel(input.category);
  dom.matchResults.hidden = false;
  dom.matchSummary.textContent = `${product} · ${input.countries.map(getCountryShortLabel).join("、")}：共 ${count} 个相关节点，按匹配得分与命中依据分为重点营销节点、可选营销节点、不建议优先参与三级，而非按推荐顺序简单分组。`;
  dom.matchYear.textContent = `${state.year} 年规划`;
  dom.matchList.innerHTML = groups.map(group => `
    <section class="match-tier-group ${MATCH_TIERS[group.tier].className}">
      <header class="match-tier-head">
        <span class="match-tier-badge">${group.tier}</span>
        <div class="match-tier-copy">
          <h4>${MATCH_TIERS[group.tier].label}<small>${group.items.length} 个节点</small></h4>
          <p>${MATCH_TIERS[group.tier].note}</p>
        </div>
      </header>
      <div class="match-tier-grid">${group.items.map(renderMatchCard).join("")}</div>
    </section>`).join("");
  dom.matchList.hidden = count === 0;
  dom.matchEmpty.hidden = count !== 0;
}

function renderMatchCard(recommendation) {
  const { event, reason } = recommendation;
  const strategy = getEventStrategy(event);
  const directions = strategy.directions.map(normalizeDirection).slice(0, 3);
  const dateText = event.start ? `${event.start.getFullYear()}年${formatEventDate(event)}` : formatEventDate(event);
  return `
    <article class="match-card">
      <div class="match-card-top">
        <span class="match-card-date">${escapeHTML(dateText)}<small>${escapeHTML(DATE_STATUS[event.status])}</small></span>
        <span class="badge badge-priority badge-priority-${event.priority}">${PRIORITY[event.priority]}</span>
      </div>
      <h4>${escapeHTML(event.name_cn)}</h4>
      <p class="match-card-name-en" lang="en">${escapeHTML(event.name_en)}</p>
      <dl class="match-card-facts">
        <div><dt>适用国家</dt><dd>${escapeHTML(event.country.join("、"))}</dd></div>
        <div><dt>距离活动</dt><dd>${escapeHTML(getEventDistance(event))}</dd></div>
      </dl>
      <div class="match-reason"><strong>推荐理由</strong><p>${escapeHTML(reason)}</p></div>
      <div class="match-directions"><strong>营销切入方向</strong><div class="match-direction-tags">${directions.map(direction => `<span>${escapeHTML(direction.title)}</span>`).join("")}</div></div>
      <div class="match-card-actions">
        <button class="match-strategy-button" type="button" data-strategy-event="${escapeHTML(event.id)}" aria-haspopup="dialog">查看完整营销策略</button>
        <button class="match-plan-button" type="button" data-plan-event="${escapeHTML(event.id)}">加入我的营销计划</button>
      </div>
    </article>`;
}

function getEventDistance(event) {
  if (!event.start) return "待官方公布后计算";
  const reference = getReferenceDate();
  const day = 24 * 60 * 60 * 1000;
  if (event.end < reference) return `本年度已结束 ${Math.floor((reference - event.end) / day)} 天`;
  if (event.start > reference) return `距开始 ${Math.ceil((event.start - reference) / day)} 天`;
  return "活动进行中";
}

function getEventStrategyKey(event) {
  const data = state.strategyData;
  if (!data) return "";
  return resolveMappedStrategyKey(data.event_strategy_map[event.id]) || resolveMappedStrategyKey(data.type_strategy_map[event.holiday_type]);
}

function getEventStrategy(event) {
  const key = getEventStrategyKey(event);
  const strategy = state.strategyData && state.strategyData.strategies[key];
  if (!strategy) throw new Error(`${event.id} 未关联完整营销策略`);
  return strategy;
}

function normalizeDirection(direction) {
  if (typeof direction === "string") return { title: direction, description: "" };
  return {
    title: direction.title || direction.name || direction.direction || direction.type || "营销方向",
    description: direction.description || direction.detail || direction.text || direction.content || ""
  };
}

function getSocialIdeas(strategy, platform) {
  if (!strategy || !strategy.social) return [];
  const option = SOCIAL_PLATFORMS.find(item => item.key === platform);
  const ideas = strategy.social[platform] || (option && strategy.social[option.label]) || [];
  return Array.isArray(ideas) ? ideas : Array.isArray(ideas.ideas) ? ideas.ideas : [];
}

function getAdValue(ads, field) {
  if (!ads) return "";
  const aliases = field.aliases || [field];
  const key = aliases.find(alias => typeof ads[alias] === "string" && ads[alias].trim());
  return key ? ads[key] : "";
}

function createStrategyContext(recommendation, input = state.matchInput) {
  const profile = state.strategyData.product_profiles[input.category];
  return {
    product: input.productName || profile.seo_product || getProductLabel(input.category),
    holiday: recommendation.event.name_cn,
    holiday_en: recommendation.event.name_en,
    country: recommendation.matchedCountries.map(getCountryShortLabel).join("、"),
    category: getProductLabel(input.category)
  };
}

function interpolate(value, context) {
  return String(value ?? "").replace(/\{(product|holiday|holiday_en|country|category)\}/g, (_, key) => context[key]);
}

function buildStrategyModel(recommendation) {
  const input = state.matchInput;
  const profile = state.strategyData.product_profiles[input.category];
  const strategy = getEventStrategy(recommendation.event);
  const context = createStrategyContext(recommendation, input);
  const ads = {};
  AD_FIELDS.forEach(field => { ads[field.key] = interpolate(getAdValue(strategy.ads, field), context); });
  if (input.price && state.strategyData.price_profiles[input.price]) {
    ads.promotion += ` 价格区间参考：${interpolate(state.strategyData.price_profiles[input.price].promotion, context)}`;
  }
  ads.audience += ` 产品核心受众：${interpolate(profile.audience, context)}`;
  const landingPage = interpolate(profile.landing_page, context);
  ads.landing_page += landingPage.startsWith("/") ? ` 产品落地页参考路径：${landingPage}` : ` 产品页面补充：${landingPage}`;

  return {
    reason: recommendation.reason,
    motivation: interpolate(strategy.motivation, context),
    productAngle: interpolate(profile.product_angle, context),
    directions: strategy.directions.map(normalizeDirection).map(direction => ({
      title: interpolate(direction.title, context),
      description: interpolate(direction.description, context)
    })),
    social: SOCIAL_PLATFORMS.map(platform => ({
      ...platform,
      ideas: getSocialIdeas(strategy, platform.key).map(idea => interpolate(idea, context))
    })),
    ads,
    seo: strategy.seo.map(keyword => interpolate(keyword, context))
  };
}

function openStrategy(id, trigger) {
  const recommendation = state.recommendations.find(item => item.event.id === id);
  if (!recommendation) return;
  const model = buildStrategyModel(recommendation);
  const event = recommendation.event;
  const input = state.matchInput;
  state.activeStrategyId = id;
  lastStrategyFocusedElement = trigger || document.activeElement;
  dom.strategyTitle.textContent = event.name_cn;
  dom.strategySubtitle.textContent = `${event.name_en} · ${input.productName || getProductLabel(input.category)}`;
  dom.strategyBody.innerHTML = `
    <section class="drawer-section">
      <h3>匹配概览</h3>
      <div class="strategy-overview">
        <p><strong>推荐产品：</strong>${escapeHTML(input.productName || getProductLabel(input.category))}　<strong>活动日期：</strong>${escapeHTML(formatEventDate(event, true))}</p>
        <p><strong>推荐理由：</strong>${escapeHTML(model.reason)}</p>
      </div>
    </section>
    <section class="drawer-section">
      <h3>A. 消费者购买动机</h3>
      <p class="drawer-copy">${escapeHTML(model.motivation)}</p>
      <p class="strategy-note"><strong>产品切入：</strong>${escapeHTML(model.productAngle)}</p>
    </section>
    <section class="drawer-section">
      <h3>B. 营销切入方向</h3>
      <ul class="strategy-direction-list">${model.directions.map(direction => `
        <li><strong>${escapeHTML(direction.title)}</strong>${direction.description ? `<p>${escapeHTML(direction.description)}</p>` : ""}</li>`).join("")}</ul>
    </section>
    <section class="drawer-section">
      <h3>C. 社媒内容创意</h3>
      <div class="strategy-social-grid">${model.social.map(platform => `
        <article class="strategy-social-card"><h4>${platform.label}</h4><ol>${platform.ideas.map(idea => `<li>${escapeHTML(idea)}</li>`).join("")}</ol></article>`).join("")}</div>
    </section>
    <section class="drawer-section">
      <h3>D. 广告营销建议</h3>
      <dl class="strategy-ads">${AD_FIELDS.map(field => `
        <div><dt>${field.label}</dt><dd>${escapeHTML(model.ads[field.key])}</dd></div>`).join("")}</dl>
      <p class="strategy-note">促销建议已结合产品价格区间（如已填写）。预算应根据客单价、毛利、转化数据和市场测试单独制定，不提供统一广告预算。</p>
    </section>
    <section class="drawer-section">
      <h3>E. SEO 关键词</h3>
      <ul class="strategy-seo-list" lang="en">${model.seo.map(keyword => `<li>${escapeHTML(keyword)}</li>`).join("")}</ul>
      <p class="strategy-note">关键词仅作为英文内容选题建议，不包含虚构的搜索量、排名或竞争程度数据。</p>
    </section>
    <div class="strategy-footer-action">
      <p>你可以将此营销机会加入个人营销计划，自动生成节日营销准备任务。</p>
      <button type="button" data-plan-event="${escapeHTML(event.id)}">加入我的营销计划</button>
    </div>`;

  closeFilterMenus();
  dom.strategyBackdrop.hidden = false;
  dom.strategyDrawer.hidden = false;
  syncBodyDrawerState();
  dom.strategyDrawer.scrollTop = 0;
  dom.strategyClose.focus();
}

function closeStrategy() {
  if (dom.strategyDrawer.hidden) return;
  dom.strategyDrawer.hidden = true;
  dom.strategyBackdrop.hidden = true;
  state.activeStrategyId = null;
  syncBodyDrawerState();
  if (lastStrategyFocusedElement && lastStrategyFocusedElement.isConnected) lastStrategyFocusedElement.focus();
  lastStrategyFocusedElement = null;
}

function syncBodyDrawerState() {
  document.body.classList.toggle("drawer-open", !dom.detailDrawer.hidden || !dom.strategyDrawer.hidden);
}

function addToMarketingPlan(eventId) {
  const recommendation = state.recommendations.find(item => item.event.id === eventId);
  if (!recommendation || !state.matchInput) return null;
  const event = recommendation.event;
  const payload = {
    eventId,
    year: state.year,
    product: { ...state.matchInput, countries: [...state.matchInput.countries] },
    date: event.start ? `${event.start.getFullYear()}-${String(event.start.getMonth() + 1).padStart(2, "0")}-${String(event.start.getDate()).padStart(2, "0")}` : null
  };
  document.dispatchEvent(new CustomEvent("marketing-plan:add", { detail: payload }));
  return payload;
}

function resetFilters() {
  state.selectedMonth = null;
  clearFilterSelections();
  renderMonths();
  renderDetails();
}

function clearFilterSelections() {
  state.search = "";
  Object.values(state.filters).forEach(selected => selected.clear());
  dom.holidaySearch.value = "";
  closeFilterMenus();
  syncFilterUI();
}

function showLoadError(error) {
  const message = escapeHTML(error.message || "未知错误");
  const markup = `
    <div class="load-error">
      <h3>节日数据库暂时无法读取</h3>
      <p>${message}</p>
      <p>请通过本地 HTTP 服务或 GitHub Pages 打开页面，不要直接双击 HTML 文件。</p>
    </div>`;
  dom.monthGrid.innerHTML = markup;
  dom.timeline.innerHTML = markup;
  dom.holidayList.innerHTML = markup;
  dom.upcomingList.innerHTML = `<p class="panel-note">数据库加载失败，请检查 holidays.json 是否与本页面位于同一目录。</p>`;
  dom.resultCount.textContent = "数据库加载失败";
  dom.dataFreshness.textContent = "数据库未连接";
  console.error(error);
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  toastTimer = setTimeout(() => dom.toast.classList.remove("show"), 2400);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

// ==================== 第四轮：倒计时、营销计划与任务管理 ====================
const DAY_MS = 24 * 60 * 60 * 1000;

function pad(num) { return String(num).padStart(2, "0"); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

function parseDate(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDateInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDateDisplay(date) {
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

function daysBetween(a, b) {
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((bMid - aMid) / DAY_MS);
}

// ============ 倒计时阶段 ============
function getCountdownInfo(startDate, endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startMid = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endMid = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (today > endMid) {
    const daysAgo = Math.floor((today - endMid) / DAY_MS);
    return { phase: "done", phaseLabel: "已结束", className: "phase-done", days: -daysAgo, text: `${daysAgo} 天前结束`, short: "-D" };
  }
  if (today >= startMid) {
    const remaining = Math.floor((endMid - today) / DAY_MS) + 1;
    return { phase: "ongoing", phaseLabel: "进行中", className: "phase-14", days: remaining, text: `进行中 · 剩 ${remaining} 天`, short: "Live" };
  }
  const daysUntil = Math.floor((startMid - today) / DAY_MS);
  for (const phase of PLAN_PHASES) {
    if (daysUntil >= phase.days) {
      return { phase: phase.label, phaseLabel: phase.label, className: phase.className, days: daysUntil, text: `${daysUntil} 天后开始`, short: `D+${daysUntil}` };
    }
  }
  return { phase: "最后转化", phaseLabel: "最后转化", className: "phase-7", days: daysUntil, text: `${daysUntil} 天后开始`, short: `D+${daysUntil}` };
}

// 节日详情中的倒计时与阶段建议（复用上方倒计时计算，不重复实现）
function getCountdownAdvice(phaseLabel) {
  const advice = {
    "提前规划": "距活动 60 天以上：确认主推产品、供应链与利润空间，并安排素材和内容排期。",
    "准备阶段": "距活动 30–60 天：完成素材拍摄、商品详情页与节日落地页，锁定促销机制。",
    "内容预热": "距活动 14–30 天：发布社媒预热内容、准备广告素材与 SEO 文章，开始积累再营销人群。",
    "营销冲刺": "距活动 7–14 天：广告开始放量，检查转化追踪、库存与物流时效。",
    "最后转化": "距活动不到 7 天：发布最后购买提醒，确认物流截止日期并监控广告表现。",
    "进行中": "活动正在进行：集中承接流量，监控广告表现与履约时效。",
    "已结束": "活动已结束：在营销计划中记录销售额、广告花费、利润和素材表现，完成复盘后再标记为已完成。"
  };
  return advice[phaseLabel] || "";
}

function buildDetailCountdown(event) {
  if (!event.start) {
    return `
      <section class="drawer-section detail-countdown is-pending" aria-labelledby="drawer-countdown-title">
        <div class="detail-countdown-head">
          <div>
            <p class="countdown-eyebrow">节日倒计时</p>
            <h3 id="drawer-countdown-title">日期待官方公布</h3>
          </div>
          <span class="countdown-phase phase-pending">待定</span>
        </div>
        <p class="countdown-advice">官方尚未公布该节点的当年日期，因此不展示推测倒计时。待官方公布后，倒计时与阶段建议会自动计算。</p>
      </section>`;
  }

  const cd = getCountdownInfo(event.start, event.end);
  const isOngoing = cd.phase === "ongoing";
  const isDone = cd.phase === "done";
  const number = isDone ? Math.abs(cd.days) : cd.days;
  const numberLabel = isDone ? "距活动结束（天）" : isOngoing ? "活动剩余（天）" : "距活动开始（天）";
  const headline = isDone ? "活动已结束" : isOngoing ? "活动进行中" : "距离活动还有";
  const advice = getCountdownAdvice(cd.phaseLabel);

  return `
    <section class="drawer-section detail-countdown ${cd.className}" aria-labelledby="drawer-countdown-title">
      <div class="detail-countdown-head">
        <div>
          <p class="countdown-eyebrow">节日倒计时</p>
          <h3 id="drawer-countdown-title">${headline}</h3>
        </div>
        <span class="countdown-phase ${cd.className}">${escapeHTML(cd.phaseLabel)}</span>
      </div>
      <div class="countdown-number">
        <strong>${number}</strong>
        <span>${numberLabel}</span>
      </div>
      <p class="countdown-advice"><strong>当前阶段建议：</strong>${escapeHTML(advice)}</p>
    </section>`;
}

// ============ LocalStorage ============
function loadPlansFromStorage() {
  try {
    const raw = localStorage.getItem(PLAN_LS_KEY);
    state.plans = raw ? JSON.parse(raw) : [];
    const tasksRaw = localStorage.getItem(PLAN_TASKS_LS_KEY);
    state.tasks = tasksRaw ? JSON.parse(tasksRaw) : [];
  } catch (e) {
    console.warn("加载营销计划失败", e);
    state.plans = [];
    state.tasks = [];
  }
  updateAutoPlanStatuses();
}

function savePlansToStorage() {
  try { localStorage.setItem(PLAN_LS_KEY, JSON.stringify(state.plans)); } catch (e) { console.warn(e); }
}

function saveTasksToStorage() {
  try { localStorage.setItem(PLAN_TASKS_LS_KEY, JSON.stringify(state.tasks)); } catch (e) { console.warn(e); }
}

// ============ 自动状态流转 ============
function updateAutoPlanStatuses() {
  const changed = [];
  const now = new Date();
  state.plans.forEach(plan => {
    if (plan.status === "done" || plan.status === "abandoned") return;
    const start = parseDate(plan.startDate);
    const end = parseDate(plan.endDate);
    if (!start || !end) return;
    const startMid = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endMid = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let newStatus = plan.status;
    if (nowMid > endMid) newStatus = "review";
    else if (nowMid >= startMid) newStatus = "ongoing";
    else {
      const daysBefore = Math.floor((startMid - nowMid) / DAY_MS);
      if (daysBefore <= 0) newStatus = "ongoing";
      else if (daysBefore <= 30) newStatus = "preparing";
      else newStatus = plan.status === "not_started" ? plan.status : "preparing";
    }
    if (newStatus !== plan.status) {
      plan.status = newStatus;
      changed.push(plan);
    }
  });
  if (changed.length) savePlansToStorage();
}

// ============ 进度统计 ============
function calculateTaskProgress(planId) {
  const planTasks = state.tasks.filter(t => t.planId === planId);
  const total = planTasks.length;
  const done = planTasks.filter(t => t.completed).length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

function renderPlanStats() {
  const plans = state.plans;
  dom.statPlanCount.textContent = plans.length;
  dom.statPlanActive.textContent = plans.filter(p => p.status === "ongoing").length;
  dom.statPlanReview.textContent = plans.filter(p => p.status === "review").length;
  dom.statPlanDone.textContent = plans.filter(p => p.status === "done").length;

  const allTasks = state.tasks;
  const total = allTasks.length;
  const done = allTasks.filter(t => t.completed).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  dom.statTaskPercent.textContent = `${percent}%`;
  dom.statTaskDetail.textContent = `${done} / ${total} 任务完成`;
  dom.taskProgressFill.style.width = `${percent}%`;
}

// ============ 任务模板生成 ============
function generatePlanTasks(plan) {
  const start = parseDate(plan.startDate);
  const end = parseDate(plan.endDate);
  if (!start || !end) return [];
  const results = [];
  TASK_TEMPLATES.forEach(tmpl => {
    let dueDate;
    if (tmpl.phase <= 0) {
      const offset = tmpl.phase === 1 ? (end - start >= 0 ? 1 : 1) : tmpl.phase;
      // phase -60, -45, -30, -14, -7 => 从 start 往回
      // phase 1 => 活动结束后，取 end + 1
      dueDate = new Date(tmpl.phase <= 0 ? start.getTime() + tmpl.phase * DAY_MS : end.getTime() + DAY_MS);
    } else {
      dueDate = new Date(end.getTime() + DAY_MS * tmpl.phase);
    }
    tmpl.items.forEach((title, idx) => {
      results.push({
        id: uid(),
        planId: plan.id,
        title,
        phase: tmpl.phaseLabel,
        phaseKey: tmpl.phase,
        dueDate: formatDateInput(dueDate),
        phaseIndex: idx,
        completed: false,
        completedAt: null,
        custom: false
      });
    });
  });
  return results;
}

// ============ 计划创建 / 打开抽屉 ============
function openPlanDrawer(plan, prefill) {
  lastPlanFocusedElement = document.activeElement;
  if (plan) {
    state.editingPlanId = plan.id;
    dom.planDrawerEyebrow.textContent = "编辑营销计划";
    dom.planDrawerTitle.textContent = plan.holidayName || "编辑营销计划";
    dom.planDrawerSubtitle.hidden = false;
    dom.planDrawerSubtitle.textContent = `创建于 ${formatDateDisplay(new Date(plan.createdAt))}`;
  } else {
    state.editingPlanId = null;
    dom.planDrawerEyebrow.textContent = "新建营销计划";
    dom.planDrawerTitle.textContent = prefill?.holidayName || "新建营销计划";
    dom.planDrawerSubtitle.hidden = true;
  }
  renderPlanForm(plan, prefill);
  dom.planBackdrop.hidden = false;
  dom.planDrawer.hidden = false;
  syncBodyDrawerState();
  dom.planDrawer.querySelector("input, select, textarea")?.focus();
}

function closePlanDrawer() {
  if (dom.planDrawer.hidden) return;
  dom.planDrawer.hidden = true;
  dom.planBackdrop.hidden = true;
  syncBodyDrawerState();
  if (lastPlanFocusedElement && lastPlanFocusedElement.isConnected) lastPlanFocusedElement.focus();
  lastPlanFocusedElement = null;
  state.editingPlanId = null;
}

function renderPlanForm(plan, prefill) {
  const data = plan || prefill || {
    holidayName: "", productName: "", countries: [],
    startDate: "", endDate: "", goal: "", promotion: "", discountRate: "",
    platforms: DEFAULT_PLATFORMS.join(", "), notes: ""
  };
  const isEdit = !!plan;
  dom.planDrawerBody.innerHTML = `
    <form class="plan-form" id="plan-form" novalidate>
      <div class="form-field">
        <label>节日名称 *</label>
        <input id="pf-holiday" type="text" value="${escapeHTML(data.holidayName || "")}" required>
      </div>
      <div class="form-field">
        <label>产品名称</label>
        <input id="pf-product" type="text" value="${escapeHTML(data.productName || "")}">
      </div>
      <div class="form-field full">
        <label>销售国家</label>
        <input id="pf-countries" type="text" value="${escapeHTML(Array.isArray(data.countries) ? data.countries.join(", ") : (data.countries || ""))}" placeholder="多个国家用逗号分隔">
      </div>
      <div class="form-field">
        <label>营销目标</label>
        <input id="pf-goal" type="text" value="${escapeHTML(data.goal || "")}" placeholder="例如：销售额提升 30%">
      </div>
      <div class="form-field">
        <label>促销方式</label>
        <input id="pf-promotion" type="text" value="${escapeHTML(data.promotion || "")}" placeholder="例如：限时 8 折">
      </div>
      <div class="form-field">
        <label>预计折扣 (%)</label>
        <input id="pf-discount" type="number" min="0" max="100" step="1" value="${escapeHTML(data.discountRate ?? "")}">
      </div>
      <div class="form-field">
        <label>推广平台</label>
        <input id="pf-platforms" type="text" value="${escapeHTML(data.platforms || "")}" placeholder="逗号分隔">
      </div>
      <div class="form-field full">
        <label>备注</label>
        <textarea id="pf-notes" placeholder="其他安排、注意事项等…">${escapeHTML(data.notes || "")}</textarea>
      </div>
      <div class="form-field full">
        <label>活动日期</label>
        <div class="plan-date-row">
          <input id="pf-start" type="date" value="${escapeHTML(data.startDate || "")}" required>
          <input id="pf-end" type="date" value="${escapeHTML(data.endDate || "")}" required>
        </div>
      </div>
      ${isEdit ? `
      <div class="plan-review-block">
        <div class="plan-review-head">
          <h3>活动复盘</h3>
          <p>完成销售额、广告花费、利润和素材复盘后，才可把计划标记为「已完成」。</p>
        </div>
        <div class="plan-review-grid">
          <div class="form-field">
            <label>销售额（USD）</label>
            <input id="pf-review-sales" type="number" min="0" step="0.01" value="${escapeHTML(String(data.reviewSales ?? ""))}" placeholder="例如：12800">
          </div>
          <div class="form-field">
            <label>广告花费（USD）</label>
            <input id="pf-review-adspend" type="number" min="0" step="0.01" value="${escapeHTML(String(data.reviewAdSpend ?? ""))}" placeholder="例如：2600">
          </div>
          <div class="form-field">
            <label>实际利润（USD）</label>
            <input id="pf-review-profit" type="number" step="0.01" value="${escapeHTML(String(data.reviewProfit ?? ""))}" placeholder="例如：4050">
          </div>
          <div class="form-field">
            <label>素材复盘</label>
            <input id="pf-review-creative" type="text" value="${escapeHTML(String(data.reviewCreative ?? ""))}" placeholder="例如：短视频素材转化最好">
          </div>
        </div>
      </div>` : ""}
      <div class="plan-save-row">
        <div class="plan-form-extra">
          ${isEdit ? `<button type="button" class="plan-del-confirm" id="plan-form-delete">🗑 删除此计划</button>` : ""}
        </div>
        <div>
          <button type="button" class="plan-cancel-btn" id="pf-cancel">取消</button>
          <button type="submit" class="plan-save-btn" id="pf-save">${isEdit ? "保存修改" : "创建计划"}</button>
        </div>
      </div>
    </form>
    <div class="task-section" id="task-section" hidden></div>`;

  dom.planForm = document.getElementById("plan-form");
  dom.planCancel = document.getElementById("pf-cancel");
  dom.planSave = document.getElementById("pf-save");
  dom.pfHoliday = document.getElementById("pf-holiday");
  dom.pfStart = document.getElementById("pf-start");
  dom.pfEnd = document.getElementById("pf-end");

  dom.planForm.addEventListener("submit", savePlanFromForm);
  dom.planCancel.addEventListener("click", closePlanDrawer);
  if (isEdit) document.getElementById("plan-form-delete").addEventListener("click", () => confirmAction(`确定删除 "${plan.holidayName}" 这个营销计划？同时删除其全部任务。`, () => { deletePlan(plan.id); closePlanDrawer(); showToast("营销计划已删除"); }));

  if (isEdit) renderTaskSection(plan);
  else document.getElementById("task-section").hidden = true;
}

function savePlanFromForm(event) {
  event.preventDefault();
  const holidayName = dom.pfHoliday.value.trim();
  const startDate = dom.pfStart.value;
  const endDate = dom.pfEnd.value;
  if (!holidayName) { showToast("请填写节日名称"); dom.pfHoliday.focus(); return; }
  if (!startDate || !endDate) { showToast("请填写活动开始和结束日期"); dom.pfStart.focus(); return; }
  if (startDate > endDate) { showToast("开始日期不能晚于结束日期"); dom.pfStart.focus(); return; }

  const data = {
    holidayName,
    productName: document.getElementById("pf-product").value.trim(),
    countries: document.getElementById("pf-countries").value.split(/[,，]/).map(s => s.trim()).filter(Boolean),
    startDate, endDate,
    goal: document.getElementById("pf-goal").value.trim(),
    promotion: document.getElementById("pf-promotion").value.trim(),
    discountRate: document.getElementById("pf-discount").value ? Number(document.getElementById("pf-discount").value) : null,
    platforms: document.getElementById("pf-platforms").value.trim(),
    notes: document.getElementById("pf-notes").value.trim()
  };

  // 复盘数据仅在编辑模式渲染，新建计划时保持空值，保证与旧数据兼容
  [["reviewSales", "pf-review-sales"], ["reviewAdSpend", "pf-review-adspend"],
   ["reviewProfit", "pf-review-profit"], ["reviewCreative", "pf-review-creative"]].forEach(([key, id]) => {
    const field = document.getElementById(id);
    if (field) data[key] = field.value.trim();
  });

  if (state.editingPlanId) {
    const plan = state.plans.find(p => p.id === state.editingPlanId);
    if (plan) {
      Object.assign(plan, data);
      savePlansToStorage();
      showToast("营销计划已更新");
    }
  } else {
    const newPlan = {
      id: uid(),
      ...data,
      reviewSales: "",
      reviewAdSpend: "",
      reviewProfit: "",
      reviewCreative: "",
      status: "not_started",
      createdAt: new Date().toISOString()
    };
    state.plans.push(newPlan);
    savePlansToStorage();
    const tasks = generatePlanTasks(newPlan);
    state.tasks.push(...tasks);
    saveTasksToStorage();
    showToast("营销计划已创建，已自动生成准备任务");
  }
  updateAutoPlanStatuses();
  renderPlanList();
  closePlanDrawer();
}

// ============ 任务区渲染 ============
function renderTaskSection(plan) {
  const taskSection = document.getElementById("task-section");
  let tasks = state.tasks.filter(t => t.planId === plan.id);
  if (!tasks.length) {
    const generated = generatePlanTasks(plan);
    if (generated.length) {
      state.tasks.push(...generated);
      saveTasksToStorage();
      tasks = generated;
    }
  }
  taskSection.hidden = false;
  taskSection.innerHTML = `
    <h3><strong>准备任务清单</strong><span class="task-phase-badge">${calculateTaskProgress(plan.id).done}/${calculateTaskProgress(plan.id).total} 已完成</span></h3>
    ${buildTaskGroupedHTML(tasks)}
    <div class="task-add-row">
      <input type="text" id="task-new-input" placeholder="添加自定义任务…">
      <button type="button" id="task-new-add">添加</button>
    </div>`;
  taskSection.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", () => toggleTask(cb.dataset.taskId, cb.checked));
  });
  taskSection.querySelectorAll(".task-edit-btn").forEach(btn => {
    btn.addEventListener("click", () => startEditTask(btn.dataset.taskId, btn));
  });
  taskSection.querySelectorAll(".task-del-btn").forEach(btn => {
    btn.addEventListener("click", () => confirmAction("删除此任务？", () => deleteTask(btn.dataset.taskId)));
  });
  document.getElementById("task-new-add").addEventListener("click", () => addCustomTask(plan.id));
  document.getElementById("task-new-input").addEventListener("keydown", e => { if (e.key === "Enter") addCustomTask(plan.id); });
}

function buildTaskGroupedHTML(tasks) {
  const groups = {};
  tasks.forEach(t => {
    if (!groups[t.phaseKey]) groups[t.phaseKey] = { label: t.phase, items: [] };
    groups[t.phaseKey].items.push(t);
  });
  const orderedKeys = Object.keys(groups).sort((a, b) => Number(a) - Number(b));
  return orderedKeys.map(key => {
    const g = groups[key];
    return `
      <div class="task-group">
        <h4>${escapeHTML(g.label)} <span class="task-count-badge">${g.items.filter(i => i.completed).length}/${g.items.length}</span></h4>
        <ul class="task-list">
          ${g.items.map(t => `
            <li class="task-item ${t.completed ? "done" : ""}">
              <input type="checkbox" id="task-${t.id}" data-task-id="${t.id}" ${t.completed ? "checked" : ""}>
              <p class="task-title">${escapeHTML(t.title)}${t.custom ? " <span class=\"task-custom-tag\">自定义</span>" : ""}</p>
              <span class="task-date">${t.dueDate ? `截止 ${t.dueDate}` : ""}</span>
              <div class="task-actions">
                <button type="button" class="task-edit-btn" data-task-id="${t.id}">编辑</button>
                <button type="button" class="task-del-btn" data-task-id="${t.id}">删</button>
              </div>
            </li>`).join("")}
        </ul>
      </div>`;
  }).join("");
}

function toggleTask(taskId, checked) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.completed = checked;
  task.completedAt = checked ? new Date().toISOString() : null;
  saveTasksToStorage();
  if (state.editingPlanId) {
    const plan = state.plans.find(p => p.id === state.editingPlanId);
    if (plan) renderTaskSection(plan);
  }
  renderPlanList();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter(t => t.id !== taskId);
  saveTasksToStorage();
  if (state.editingPlanId) {
    const plan = state.plans.find(p => p.id === state.editingPlanId);
    if (plan) renderTaskSection(plan);
  }
  renderPlanList();
}

function addCustomTask(planId) {
  const input = document.getElementById("task-new-input");
  const title = input.value.trim();
  if (!title) return;
  const task = {
    id: uid(), planId, title,
    phase: "自定义任务", phaseKey: 999, dueDate: null, phaseIndex: 0,
    completed: false, completedAt: null, custom: true
  };
  state.tasks.push(task);
  saveTasksToStorage();
  input.value = "";
  const plan = state.plans.find(p => p.id === planId);
  if (plan) renderTaskSection(plan);
  renderPlanList();
}

function startEditTask(taskId, btn) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  const li = btn.closest(".task-item");
  const titleP = li.querySelector(".task-title");
  const original = task.title;
  const input = document.createElement("input");
  input.type = "text";
  input.value = original;
  input.className = "task-edit-input";
  input.style.cssText = "flex:1;min-width:0;padding:5px 8px;border:1px solid #c2ccc5;border-radius:5px;font-size:11px;outline:none;";
  titleP.replaceWith(input);
  input.focus();
  input.select();

  const finish = () => {
    const newValue = input.value.trim();
    if (newValue && newValue !== original) {
      task.title = newValue;
      saveTasksToStorage();
      showToast("任务已更新");
    }
    if (state.editingPlanId) {
      const plan = state.plans.find(p => p.id === state.editingPlanId);
      if (plan) renderTaskSection(plan);
    } else {
      renderPlanList();
    }
  };
  input.addEventListener("blur", finish, { once: true });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") finish();
    else if (e.key === "Escape") input.value = original;
  });
}

// ============ 计划列表渲染 ============
function renderPlanList() {
  renderPlanStats();
  renderPlanFilterChips();
  updateDataStatus();
  let plans = [...state.plans];
  if (state.planStatusFilter !== "all") {
    plans = plans.filter(p => p.status === state.planStatusFilter);
  }
  plans.sort((a, b) => {
    const aStart = parseDate(a.startDate) || new Date(0);
    const bStart = parseDate(b.startDate) || new Date(0);
    return aStart - bStart;
  });

  dom.planList.hidden = plans.length === 0;
  dom.planEmpty.hidden = plans.length > 0;
  dom.planList.innerHTML = plans.map(renderPlanCard).join("");

  dom.planList.querySelectorAll("[data-plan-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      const plan = state.plans.find(p => p.id === btn.dataset.planView);
      if (plan) openPlanDrawer(plan);
    });
  });
  dom.planList.querySelectorAll("[data-plan-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const plan = state.plans.find(p => p.id === btn.dataset.planDel);
      confirmAction(`确定删除 "${plan.holidayName}"？同时删除其全部任务。`, () => {
        deletePlan(plan.id);
        showToast("营销计划已删除");
        renderPlanList();
      });
    });
  });
  dom.planList.querySelectorAll("[data-plan-status-change]").forEach(select => {
    select.addEventListener("change", () => {
      const plan = state.plans.find(p => p.id === select.dataset.planStatusChange);
      if (plan) { updatePlanStatus(plan, select.value); renderPlanList(); }
    });
  });
}

function renderPlanFilterChips() {
  dom.planFilterBar.hidden = state.plans.length === 0;
  dom.planFilterOptions.querySelectorAll("[data-plan-status]").forEach(btn => {
    const active = btn.dataset.planStatus === state.planStatusFilter;
    btn.classList.toggle("chip-on", active);
  });
}

function setPlanStatusFilter(status) {
  state.planStatusFilter = status;
  renderPlanList();
}

function renderPlanCard(plan) {
  const start = parseDate(plan.startDate);
  const end = parseDate(plan.endDate);
  const cd = getCountdownInfo(start, end);
  const progress = calculateTaskProgress(plan.id);
  const countdownClass = cd.className;

  return `
    <article class="plan-card">
      <div class="plan-card-head">
        <div>
          <h4>${escapeHTML(plan.holidayName)}</h4>
          <p class="plan-holiday-sub">${escapeHTML(plan.productName || "未指定产品")} · ${escapeHTML((plan.countries || []).join("、") || "未指定")}</p>
        </div>
        <div class="plan-countdown ${countdownClass}">
          <strong>${escapeHTML(cd.short)}</strong>
          <small>${escapeHTML(cd.text)}</small>
        </div>
      </div>

      <div class="plan-card-body">
        <dl class="plan-meta">
          <dt>活动日期</dt>
          <dd>${escapeHTML(formatDateDisplay(start))} ~ ${escapeHTML(formatDateDisplay(end))}</dd>
        </dl>
        <dl class="plan-meta">
          <dt>促销方式</dt>
          <dd>${escapeHTML(plan.promotion || "未填写")}${plan.discountRate ? ` · ${plan.discountRate}%` : ""}</dd>
        </dl>
        <dl class="plan-meta">
          <dt>推广平台</dt>
          <dd>${escapeHTML(plan.platforms || "未填写")}</dd>
        </dl>
        <dl class="plan-meta">
          <dt>营销目标</dt>
          <dd>${escapeHTML(plan.goal || "未填写")}</dd>
        </dl>
        <dl class="plan-card-goal">
          <dt>备注</dt>
          <dd>${escapeHTML(plan.notes || "无备注")}</dd>
        </dl>
        <div class="plan-card-progress">
          <span>任务进度 <strong>${progress.done}/${progress.total} · ${progress.percent}%</strong></span>
          <div class="progress-bar"><div class="progress-fill" style="width:${progress.percent}%"></div></div>
        </div>
      </div>

      <div class="plan-card-actions">
        <select class="plan-status-select ${plan.status}" data-plan-status-change="${escapeHTML(plan.id)}">
          ${PLAN_STATUSES.map(s => `<option value="${s.value}" ${s.value === plan.status ? "selected" : ""}>${s.label}</option>`).join("")}
        </select>
        <div class="plan-card-buttons">
          <button class="plan-view-btn" type="button" data-plan-view="${escapeHTML(plan.id)}">查看详情</button>
          <button class="plan-del-btn" type="button" data-plan-del="${escapeHTML(plan.id)}">删除</button>
        </div>
      </div>
    </article>`;
}

// 完成销售数据、广告花费、利润和素材复盘后，才允许标记为已完成
function isReviewComplete(plan) {
  return ["reviewSales", "reviewAdSpend", "reviewProfit", "reviewCreative"]
    .every(key => String(plan[key] ?? "").trim() !== "");
}

function updatePlanStatus(plan, newStatus) {
  if (newStatus === "done" && !isReviewComplete(plan)) {
    showToast("请先打开计划详情，在「活动复盘」中填写销售额、广告花费、利润和素材复盘，再标记为已完成");
    return false;
  }
  plan.status = newStatus;
  savePlansToStorage();
  showToast(`状态已更新为 ${PLAN_STATUSES.find(s => s.value === newStatus)?.label || newStatus}`);
  return true;
}

function deletePlan(planId) {
  state.plans = state.plans.filter(p => p.id !== planId);
  state.tasks = state.tasks.filter(t => t.planId !== planId);
  savePlansToStorage();
  saveTasksToStorage();
}

// ============ 第三轮接口打通 ============
function handlePlanAddFromMatch(event) {
  const payload = event.detail;
  if (!payload) return;
  const holiday = state.events.find(e => e.id === payload.eventId);
  if (!holiday) return;
  const start = holiday.start ? formatDateInput(holiday.start) : formatDateInput(new Date());
  const end = holiday.end ? formatDateInput(holiday.end) : formatDateInput(new Date(new Date().getTime() + DAY_MS));
  const countryLabels = (payload.product?.countries || []).map(getCountryShortLabel);

  const prefill = {
    holidayName: holiday.name_cn,
    productName: payload.product?.productName || "",
    countries: countryLabels,
    startDate: start, endDate: end,
    goal: "", promotion: "", discountRate: "",
    platforms: DEFAULT_PLATFORMS.join(", "),
    notes: `由推荐自动创建 · ${holiday.name_en}`
  };
  openPlanDrawer(null, prefill);
}

// ============ 确认对话框 ============
function confirmAction(message, onOk) {
  dom.confirmTitle.textContent = "确认操作";
  dom.confirmMessage.textContent = message;
  dom.confirmDialog.hidden = false;
  state.lastConfirm = { resolve: ok => { if (ok) onOk(); } };
}
function hideConfirm() {
  dom.confirmDialog.hidden = true;
  state.lastConfirm = null;
}

// ============ 数据管理：导出 ============
function buildUserDataExport(type) {
  const meta = {
    version: 1,
    app: "欧美全年节日营销日历",
    exportedAt: new Date().toISOString(),
    note: "本文件仅包含用户个人数据，不含节日公共数据库"
  };
  if (type === "plans") return { ...meta, type: "plans", plans: state.plans };
  if (type === "tasks") return { ...meta, type: "tasks", tasks: state.tasks };
  return { ...meta, type: "all", plans: state.plans, tasks: state.tasks };
}

function exportJson(type) {
  try {
    const data = buildUserDataExport(type);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const download = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    const names = { plans: "我的营销计划", tasks: "我的任务记录", all: "完整个人数据" };
    download.href = url;
    download.download = `gcmc-${names[type]}-${date}.json`;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
    URL.revokeObjectURL(url);
    showToast(`已导出 ${names[type]} JSON 文件`);
  } catch (e) {
    console.error("导出失败", e);
    showToast("导出失败：" + e.message);
  }
}

// ============ 数据管理：导入 ============
function validateImportData(data) {
  if (!data || typeof data !== "object") return "导入文件不是有效的 JSON 对象";
  const result = { plans: [], tasks: [] };

  const addPlans = arr => {
    if (!Array.isArray(arr)) return;
    arr.forEach(item => {
      if (!item || typeof item !== "object") return;
      if (!item.id || !item.holidayName) return;
      result.plans.push(validatePlan(item));
    });
  };
  const addTasks = arr => {
    if (!Array.isArray(arr)) return;
    arr.forEach(item => {
      if (!item || typeof item !== "object") return;
      if (!item.id || !item.planId || !item.title) return;
      result.tasks.push(validateTask(item));
    });
  };

  // 兼容三种导出格式：plans / tasks / all（完整数据）
  if (data.type === "tasks") {
    addTasks(data.tasks);
  } else {
    addPlans(data.plans);
    addTasks(data.tasks);
  }

  if (!result.plans.length && !result.tasks.length) {
    return "未找到可导入的有效计划或任务数据";
  }
  return result;
}

function validatePlan(item) {
  const rawDiscount = item.discountRate ?? item.discount ?? null;
  const discountRate = rawDiscount === null || rawDiscount === undefined || rawDiscount === "" ? null : Number(rawDiscount);
  return {
    id: String(item.id || uid()),
    holidayName: String(item.holidayName || "").trim(),
    productName: String(item.productName || "").trim(),
    countries: Array.isArray(item.countries) ? item.countries : [],
    startDate: String(item.startDate || ""),
    endDate: String(item.endDate || ""),
    goal: String(item.goal || ""),
    promotion: String(item.promotion || ""),
    discountRate: Number.isFinite(discountRate) ? discountRate : null,
    platforms: String(item.platforms || ""),
    notes: String(item.notes || ""),
    reviewSales: String(item.reviewSales ?? ""),
    reviewAdSpend: String(item.reviewAdSpend ?? ""),
    reviewProfit: String(item.reviewProfit ?? ""),
    reviewCreative: String(item.reviewCreative ?? ""),
    status: ["not_started", "preparing", "ongoing", "review", "done", "abandoned"].includes(item.status) ? item.status : "not_started",
    createdAt: item.createdAt || new Date().toISOString()
  };
}

function validateTask(item) {
  return {
    id: String(item.id || uid()),
    planId: String(item.planId || ""),
    title: String(item.title || "").trim(),
    phase: String(item.phase || "自定义任务"),
    phaseKey: Number(item.phaseKey) || 999,
    dueDate: item.dueDate || null,
    phaseIndex: Number(item.phaseIndex) || 0,
    completed: !!item.completed,
    completedAt: item.completedAt || null,
    custom: !!item.custom
  };
}

async function handleImportFile(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = "";
  if (!file) return;
  try {
    const text = await file.text();
    let data;
    try { data = JSON.parse(text); }
    catch (e) { showToast("导入失败：文件不是合法 JSON"); return; }

    const validated = validateImportData(data);
    if (typeof validated === "string") {
      showToast(`导入失败：${validated}`);
      return;
    }
    mergeImportData(validated.plans, validated.tasks);
  } catch (e) {
    console.error(e);
    showToast("导入失败：" + e.message);
  }
}

function mergeImportData(importPlans, importTasks) {
  const existingIds = new Set(state.plans.map(p => p.id));
  const addedPlans = importPlans.filter(p => !existingIds.has(p.id));

  state.plans.push(...addedPlans);

  // 任务只保留能对应到已有计划的记录，避免孤立任务混淆统计
  const validPlanIds = new Set(state.plans.map(p => p.id));
  const existingTaskIds = new Set(state.tasks.map(t => t.id));
  const addedTasks = importTasks.filter(t => validPlanIds.has(t.planId) && !existingTaskIds.has(t.id));

  state.tasks.push(...addedTasks);
  savePlansToStorage();
  saveTasksToStorage();
  updateAutoPlanStatuses();
  renderPlanList();

  const msg = `已导入 ${addedPlans.length} 个计划、${addedTasks.length} 条任务`;
  showToast(msg);
  if (addedPlans.length || addedTasks.length) {
    updateDataStatus();
  }
}

// ============ 数据管理：清空 ============
function handleClearAllData() {
  const planCount = state.plans.length;
  const taskCount = state.tasks.length;
  confirmAction(`确定要清空全部 ${planCount} 个营销计划和 ${taskCount} 条任务吗？\n此操作不可恢复。`, () => {
    state.plans = [];
    state.tasks = [];
    savePlansToStorage();
    saveTasksToStorage();
    renderPlanList();
    updateDataStatus();
    showToast("个人数据已全部清空");
  });
}

function updateDataStatus() {
  if (!dom.dataStatus) return;
  try {
    const plansCount = state.plans.length;
    const tasksCount = state.tasks.length;
    const used = localStorage.getItem(PLAN_LS_KEY)?.length + localStorage.getItem(PLAN_TASKS_LS_KEY)?.length || 0;
    dom.dataStatus.textContent = `本地存储 · ${plansCount} 计划 · ${tasksCount} 任务 · ${(used / 1024).toFixed(1)} KB`;
  } catch (e) {
    dom.dataStatus.textContent = "本地存储就绪";
  }
}

// ============ 定时器刷新倒计时（仅在浏览器环境运行）============
if (typeof setInterval !== "undefined" && typeof document !== "undefined") {
  setInterval(() => {
    updateAutoPlanStatuses();
    renderPlanList();
  }, 60 * 60 * 1000);
}
