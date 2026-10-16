const projectDetails = {
  "android": {
    "platform": "01 / ANDROID · MAP & NAVIGATION",
    "title": "司机端地图导航 · 巡航与多实例",
    "summary": "负责滴滴车主主端地图导航核心研发，覆盖接驾、等驾、送驾和拼车场景；参与多实例改造，并负责巡航寻单与热力图交互。",
    "sections": [
      [
        "业务与职责",
        "负责多路线、修改终点与途径点、乘客位置和司乘碰面等核心能力；担任国内网约公交司机端、香港司机端地图客户端 RD Owner，推进从 0 到 1 接入及长期演进。"
      ],
      [
        "多实例与状态管理",
        "参与 MapView 与 NavigationAdapter 绑定、实例栈、事件隔离及生命周期管理，支撑多页面、多订单并存。协调无路线巡航、有路线巡航和导航三态，在复用巡航视图时维护子状态。"
      ],
      [
        "地图交互与稳定性",
        "实现 Marker 差量更新、同类碰撞与选中优先级、缩放显隐和司机级偏好存储；定位崩溃、ANR、Java / Native 内存泄漏与资源释放问题，并通过状态机兜底、灰度和降级控制巡航风险。"
      ],
      [
        "交付与车机协同",
        "覆盖方案与接口协议、架构适配、联调路测、版本交付、线上维护与技术答疑；参与 Mona 车机车辆信号标准化、3D / SR 双渲染同步、导航事件缓存与 View 重建后的数据恢复。"
      ]
    ]
  },
  "harmony": {
    "platform": "02 / HARMONYOS · NATIVE MIGRATION",
    "title": "鸿蒙导航 · 能力迁移与状态联动",
    "summary": "深度参与 HarmonyOS 导航快捷设置与行中联动，将原有导航能力迁移到鸿蒙平台，并处理设置、账号和主题变化下的状态一致性。",
    "sections": [
      [
        "迁移范围",
        "围绕 ArkTS、ArkUI 开展导航快捷设置与行中联动建设；参与顺风车多路线、轻导航、全屏导航及设置弹层之间的状态协同。"
      ],
      [
        "设置生效链路",
        "接入 UI、内存、账号级持久化、服务端同步与 EventHub 实时生效链路，处理初始化时序、账号切换及日夜主题。"
      ],
      [
        "跨端一致性",
        "配合 TypeScript Spec、CodeGen、Android / ArkTS 实现与 C++ 方法注册，通过 mapRouteId 对齐实例，维护接口、参数、状态、双向事件和生命周期的一致性。"
      ],
      [
        "问题排查",
        "参与鸿蒙稳定性问题定位，定位亿级 MAS 异常；从实际调用链、初始化时序和状态边界排查平台迁移中的复杂问题。"
      ]
    ]
  },
  "react": {
    "platform": "03 / REACT NATIVE · BRIDGE & EXPERIENCE",
    "title": "车导与步导 · 跨端建设与原生桥接",
    "summary": "推进车导设置页和步行导航跨端化，连接原生导航能力与 RN 界面，关注不同平台间的接口契约、状态和 UI 行为一致性。",
    "sections": [
      [
        "业务落地",
        "推进车导设置页与步行导航跨端建设，将原生导航事件转换为 RN UI 模型，覆盖诱导卡片、TTS、自动到达、屏幕常亮与日夜间表现。"
      ],
      [
        "桥接实现",
        "开发 TypeScript Spec、CodeGen 产物、Android / ArkTS 实现与 C++ 方法注册，构建清晰的接口声明、生成与原生实现链路。"
      ],
      [
        "实例与生命周期",
        "通过 mapRouteId 对齐导航实例，维护 Native、RN 与 HarmonyOS 的接口、参数、状态、双向事件、生命周期及 UI 行为一致性。"
      ],
      [
        "工程协作",
        "结合自动打包、Crash Check、JSI 接口测试与 Native 内存分析工具支持交付；在日常工作中使用 Codex、Claude Code 辅助分析、编码、审查和排障，并实践 MCP、OpenSpec 与 AI 知识库。"
      ]
    ]
  }
};

const languageStorageKey = 'weihongwei-portfolio-language';
let language = 'zh';
let activeProject = null;
let copyStatusKey = '';
const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.project-card')];
const dialog = document.querySelector('#project-dialog');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const languageButtons = [...document.querySelectorAll('[data-language]')];

function copy(key) {
  return portfolioCopy[language][key];
}

function renderFilterStatus() {
  const selected = filters.find(button => button.getAttribute('aria-pressed') === 'true');
  const count = cards.filter(card => !card.hidden).length;
  const key = selected.dataset.filter === 'all' ? 'filter.all' : 'filter.platform';
  document.querySelector('#filter-status').textContent = copy(key)
    .replace('{count}', String(count)).replace('{platform}', selected.textContent.trim());
}

function renderProject() {
  if (!activeProject) return;
  const project = (language === 'en' ? projectDetailsEn : projectDetails)[activeProject];
  document.querySelector('#dialog-platform').textContent = project.platform;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-summary').textContent = project.summary;
  const content = document.querySelector('#dialog-content');
  content.replaceChildren();
  project.sections.forEach(([title, body], index) => {
    const section = document.createElement('section');
    const heading = document.createElement('h3');
    const paragraph = document.createElement('p');
    heading.textContent = `0${index + 1} / ${title}`;
    paragraph.textContent = body;
    section.append(heading, paragraph);
    content.append(section);
  });
}

function updateMenuLabel() {
  menuButton.setAttribute('aria-label', copy(navigation.classList.contains('is-open') ? 'menu.close' : 'menu.open'));
}

function setLanguage(nextLanguage, persist = false) {
  language = nextLanguage === 'en' ? 'en' : 'zh';
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.querySelectorAll('[data-i18n]').forEach(element => {
    // Only developer-authored local strings contain markup; no external input is rendered.
    element.innerHTML = copy(element.dataset.i18n);
  });
  ['aria-label', 'content', 'alt'].forEach(attribute => {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
      element.setAttribute(attribute, copy(element.getAttribute(`data-i18n-${attribute}`)));
    });
  });
  languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  updateMenuLabel();
  renderFilterStatus();
  renderProject();
  document.querySelector('#copy-status').textContent = copyStatusKey ? copy(copyStatusKey) : '';
  if (persist) {
    // Switching still works when storage is disabled or unavailable.
    try { localStorage.setItem(languageStorageKey, language); } catch {}
  }
}

languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language, true)));
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => { card.hidden = selected !== 'all' && card.dataset.category !== selected; });
  document.querySelector('.projects-grid').classList.toggle('filtered', selected !== 'all');
  renderFilterStatus();
}));

document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  activeProject = button.dataset.project;
  renderProject();
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  activeProject = null;
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  updateMenuLabel();
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  updateMenuLabel();
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
const navLinks = [...document.querySelectorAll('.nav-link')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, {rootMargin: '-15% 0px -60% 0px'});
  ['projects', 'about', 'experience', 'expertise'].forEach(id => observer.observe(document.getElementById(id)));
}
document.querySelector('#copy-email').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('weihongwei0586@gmail.com');
    copyStatusKey = 'copy.success';
  } catch {
    copyStatusKey = 'copy.error';
  }
  document.querySelector('#copy-status').textContent = copy(copyStatusKey);
});
let savedLanguage = 'zh';
try { savedLanguage = localStorage.getItem(languageStorageKey) || 'zh'; } catch {}
setLanguage(savedLanguage);
document.querySelector('#year').textContent = String(new Date().getFullYear());
