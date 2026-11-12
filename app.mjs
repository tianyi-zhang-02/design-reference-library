import { demos } from './demos.mjs';

const copy = {
  zh: {
    skip: '跳到目录', brand: '设计参考库', navigation: '网站导航',
    title: '设计参考库', intro: '从网页模板和组件里找灵感。点开短 Demo，看清布局、材质和动效，再决定哪些值得带进自己的设计。',
    quickStyles: '按常用风格浏览', catalog: '设计目录', views: '目录视图',
    all: '全部案例', styles: '风格索引', style: '风格', group: '分类', allStyles: '全部风格', allGroups: '全部分类',
    search: '搜索目录', placeholder: '搜索风格、案例或做法…', data: '目录 JSON', contribute: '贡献案例',
    refsFound: count => `${count} 条案例`, stylesFound: count => `${count} 种风格`,
    demo: '6 秒 Demo', openDemo: title => `播放 ${title} 的演示`, originalDemo: '原创演示',
    source: '查看原作 ↗', close: '关闭演示', steps: '演示步骤', play: '播放', replay: '重播', pause: '暂停',
    observation: '原作观察', tradeoff: '应用取舍', notes: '观察与取舍', cues: '特征', use: '适用场景',
    related: count => `查看 ${count} 条相关案例`, empty: '没有符合条件的条目。', clear: '清除筛选',
    failed: '无法读取目录。请刷新页面，或直接打开目录 JSON。',
    loading: '正在读取目录…',
  },
  en: {
    skip: 'Skip to catalog', brand: 'Design Reference Library', navigation: 'Site navigation',
    title: 'Design Reference Library', intro: 'Explore web templates and components. Play a short demo to see how the layout, material, or motion works before you borrow it.',
    quickStyles: 'Browse popular styles', catalog: 'Design catalog', views: 'Catalog views',
    all: 'All references', styles: 'Style index', style: 'Style', group: 'Category', allStyles: 'All styles', allGroups: 'All categories',
    search: 'Search catalog', placeholder: 'Search styles, references, or ideas…', data: 'Catalog JSON', contribute: 'Contribute',
    refsFound: count => `${count} ${count === 1 ? 'reference' : 'references'}`,
    stylesFound: count => `${count} ${count === 1 ? 'style' : 'styles'}`,
    demo: '6 sec demo', openDemo: title => `Play demo for ${title}`, originalDemo: 'Original demo',
    source: 'View original ↗', close: 'Close demo', steps: 'Demo steps', play: 'Play', replay: 'Replay', pause: 'Pause',
    observation: 'What to notice', tradeoff: 'Tradeoff', notes: 'Observations & tradeoffs', cues: 'What to look for', use: 'Good for',
    related: count => `View ${count} related ${count === 1 ? 'reference' : 'references'}`,
    empty: 'No matching entries.', clear: 'Clear filters', failed: 'Could not load the catalog. Refresh the page or open the catalog JSON.',
    loading: 'Loading catalog…',
  },
};

const find = selector => document.querySelector(selector);
const entries = find('#entries');
const resultCount = find('#result-count');
const tabs = find('#catalog-tabs');
const query = find('#query');
const styleFilter = find('#style');
const groupFilter = find('#group');
const dialog = find('#demo-dialog');
const demoStage = find('#demo-stage');
const demoCaption = find('#demo-caption');
const demoSteps = find('#demo-steps');
const demoPlay = find('#demo-play');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initialLanguage() {
  const fromUrl = new URL(location.href).searchParams.get('lang');
  if (fromUrl === 'en' || fromUrl === 'zh') return fromUrl;
  try {
    const saved = localStorage.getItem('catalog-language');
    if (saved === 'en' || saved === 'zh') return saved;
  } catch {
    // Language selection also works when local storage is unavailable.
  }
  return navigator.language.startsWith('zh') ? 'zh' : 'en';
}

let language = initialLanguage();
let strings = copy[language];
const local = (zh, en) => language === 'zh' ? zh : en;
const field = (item, key) => local(item[key], item[`${key}En`] || item[key]);

function translate() {
  strings = copy[language];
  document.documentElement.lang = local('zh-CN', 'en');
  document.title = local('设计参考库 · Design Reference Library', 'Design Reference Library');
  for (const node of document.querySelectorAll('[data-text]')) node.textContent = strings[node.dataset.text];
  for (const node of document.querySelectorAll('[data-label]')) node.setAttribute('aria-label', strings[node.dataset.label]);
  for (const node of document.querySelectorAll('[data-placeholder]')) node.placeholder = strings[node.dataset.placeholder];
  for (const button of document.querySelectorAll('[data-language]')) {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  }
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(text, className) {
  const node = element('button', text, className);
  node.type = 'button';
  return node;
}

function originalLink(href) {
  const anchor = element('a', strings.source, 'source-link');
  anchor.href = href;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

function styleButton(id, text) {
  const node = button(text, 'tag');
  node.dataset.pickStyle = id;
  return node;
}

function note(label, text) {
  const paragraph = element('p', '', 'note');
  paragraph.append(element('strong', label), element('span', text));
  return paragraph;
}

function art(item, step = 0) {
  const visual = element('div', '', `scene scene-${item.id}`);
  visual.dataset.step = step;
  visual.setAttribute('aria-hidden', 'true');
  if (demos[item.id]) {
    // Scene markup is defined in the local demo module, never read from catalog data.
    visual.innerHTML = demos[item.id].scene(local);
  } else {
    const shape = element('div', '', 'case-art');
    if (item.id === 'govuk-type-scale') shape.textContent = 'Aa';
    visual.append(shape);
  }
  return visual;
}

let activeDemo;
let opener;
let timer;
let frame = 0;
let playing = false;

function setFrame(nextFrame) {
  frame = nextFrame;
  demoStage.firstElementChild.dataset.step = frame;
  const [labelZh, captionZh, labelEn, captionEn] = activeDemo.frames[frame];
  demoCaption.replaceChildren(element('strong', local(labelZh, labelEn)), element('p', local(captionZh, captionEn)));
  [...demoSteps.children].forEach((step, index) => step.setAttribute('aria-pressed', String(index === frame)));
}

function stopDemo() {
  window.clearInterval(timer);
  playing = false;
  demoPlay.textContent = frame === 2 ? strings.replay : strings.play;
}

function playDemo() {
  if (frame === 2) setFrame(0);
  playing = true;
  demoPlay.textContent = strings.pause;
  timer = window.setInterval(() => {
    if (frame === 2) stopDemo();
    else setFrame(frame + 1);
  }, 2000);
}

function openDemo(item, trigger) {
  activeDemo = demos[item.id];
  opener = trigger;
  find('#demo-title').textContent = item.title;
  find('#demo-source').href = item.url;
  demoStage.replaceChildren(art(item));
  const stepButtons = activeDemo.frames.map(([labelZh, , labelEn], index) => {
    const step = button(local(labelZh, labelEn), 'demo-step');
    step.addEventListener('click', () => {
      setFrame(index);
      stopDemo();
    });
    return step;
  });
  demoSteps.replaceChildren(...stepButtons);
  setFrame(0);
  stopDemo();
  dialog.showModal();
  find('#close-demo').focus();
  if (!motion.matches) playDemo();
}

demoPlay.addEventListener('click', () => {
  if (playing) stopDemo();
  else playDemo();
});
find('#close-demo').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  stopDemo();
  opener?.focus();
});
motion.addEventListener('change', event => {
  if (event.matches && playing) stopDemo();
});

function matchesQuery(parts, terms) {
  const haystack = parts.join(' ').normalize('NFKC').toLowerCase();
  return terms.every(term => haystack.includes(term));
}

function start(catalog) {
  const styleById = new Map(catalog.styles.map(item => [item.id, item]));
  const kindById = new Map(catalog.kinds.map(item => [item.id, item]));
  const groupById = new Map(catalog.groups.map(item => [item.id, item]));
  const references = [...catalog.references].sort((a, b) => Number(b.kind === 'template') - Number(a.kind === 'template'));
  const views = [
    { id: 'all', label: () => strings.all },
    ...catalog.kinds.map(item => ({ id: item.id, label: () => field(item, 'name') })),
    { id: 'styles', label: () => strings.styles },
  ];
  let view = 'all';

  function referenceCard(item) {
    const card = element('article', '', 'entry reference-card');
    if (demos[item.id]) {
      const preview = button('', 'entry-preview demo-trigger');
      preview.setAttribute('aria-label', strings.openDemo(item.title));
      preview.setAttribute('aria-haspopup', 'dialog');
      const badge = element('span', '', 'play-badge');
      badge.append(element('i', '', 'play-icon'), strings.demo);
      preview.append(art(item), badge);
      preview.addEventListener('click', () => openDemo(item, preview));
      card.append(preview);
    } else {
      const preview = element('div', '', 'entry-preview');
      preview.append(art(item));
      card.append(preview);
    }

    const body = element('div', '', 'entry-body');
    body.append(
      element('p', `${field(kindById.get(item.kind), 'name')} · ${item.publisher}`, 'entry-meta'),
      element('h3', item.title, 'entry-title'),
      element('p', field(item, 'adapt'), 'entry-copy'),
    );
    if (item.styles.length) {
      const tags = element('div', '', 'tags');
      for (const id of item.styles) tags.append(styleButton(id, styleById.get(id).name));
      body.append(tags);
    }
    const details = element('details', '', 'entry-details');
    details.append(element('summary', strings.notes), note(strings.observation, field(item, 'observe')), note(strings.tradeoff, field(item, 'tradeoff')));
    body.append(details);
    card.append(body, element('div', '', 'entry-footer'));
    card.lastElementChild.append(originalLink(item.url));
    return card;
  }

  function styleCard(item) {
    const card = element('article', '', `entry style-card style-${item.group}`);
    const body = element('div', '', 'entry-body');
    const name = local(item.nameZh || item.name, item.name);
    body.append(element('p', field(groupById.get(item.group), 'name'), 'entry-meta'), element('h3', name, 'entry-title'));
    if (name !== item.name) body.append(element('p', item.name, 'entry-english'));
    body.append(note(strings.cues, field(item, 'cues')), note(strings.use, field(item, 'use')));
    const count = references.filter(reference => reference.styles.includes(item.id)).length;
    if (count) body.append(styleButton(item.id, strings.related(count)));
    card.append(body);
    return card;
  }

  function clear() {
    query.value = '';
    styleFilter.value = '';
    groupFilter.value = '';
  }

  function render() {
    const terms = query.value.trim().normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean);
    const showStyles = view === 'styles';
    const matches = showStyles ? catalog.styles.filter(item => {
      if (groupFilter.value && item.group !== groupFilter.value) return false;
      const group = groupById.get(item.group);
      return matchesQuery([item.name, item.nameZh, group.name, group.nameEn, item.cues, item.cuesEn, item.use, item.useEn], terms);
    }) : references.filter(item => {
      if (view !== 'all' && item.kind !== view) return false;
      if (styleFilter.value && !item.styles.includes(styleFilter.value)) return false;
      const kind = kindById.get(item.kind);
      const styleNames = item.styles.flatMap(id => [styleById.get(id).name, styleById.get(id).nameZh]);
      return matchesQuery([item.title, item.publisher, kind.name, kind.nameEn, item.observe, item.observeEn, item.adapt, item.adaptEn, item.tradeoff, item.tradeoffEn, ...styleNames], terms);
    });

    resultCount.textContent = showStyles ? strings.stylesFound(matches.length) : strings.refsFound(matches.length);
    if (matches.length) {
      entries.replaceChildren(...matches.map(showStyles ? styleCard : referenceCard));
      return;
    }
    const empty = element('div', '', 'empty');
    const reset = button(strings.clear, 'outline-button');
    reset.addEventListener('click', () => { clear(); render(); query.focus(); });
    empty.append(element('p', strings.empty), reset);
    entries.replaceChildren(empty);
  }

  function selectView(nextView) {
    view = nextView;
    for (const tab of tabs.children) tab.setAttribute('aria-pressed', String(tab.dataset.view === view));
    find('#style-filter').hidden = view === 'styles';
    find('#group-filter').hidden = view !== 'styles';
    render();
  }

  function localizeCatalog() {
    const style = styleFilter.value;
    const group = groupFilter.value;
    styleFilter.replaceChildren(new Option(strings.allStyles, ''), ...catalog.styles.map(item => new Option(local(item.nameZh || item.name, item.name), item.id)));
    groupFilter.replaceChildren(new Option(strings.allGroups, ''), ...catalog.groups.map(item => new Option(field(item, 'name'), item.id)));
    styleFilter.value = style;
    groupFilter.value = group;
    tabs.replaceChildren(...views.map(({ id, label }) => {
      const tab = button(label(), 'catalog-tab');
      tab.dataset.view = id;
      tab.addEventListener('click', () => {
        if (view === id) return;
        // A style picked for one category shouldn't silently hide entries in another.
        styleFilter.value = '';
        selectView(id);
      });
      return tab;
    }));
    selectView(view);
  }

  query.addEventListener('input', render);
  styleFilter.addEventListener('change', render);
  groupFilter.addEventListener('change', render);
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-pick-style]');
    if (!trigger) return;
    clear();
    styleFilter.value = trigger.dataset.pickStyle;
    selectView('all');
    styleFilter.focus();
  });
  localizeCatalog();
  for (const selector of ['#filters', '#catalog-tabs', '#quick-styles']) find(selector).hidden = false;
  return localizeCatalog;
}

let refreshCatalog;
let loadFailed = false;
translate();
resultCount.textContent = strings.loading;

for (const toggle of document.querySelectorAll('[data-language]')) {
  toggle.addEventListener('click', () => {
    language = toggle.dataset.language;
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(null, '', url);
    try { localStorage.setItem('catalog-language', language); } catch { /* Optional preference. */ }
    translate();
    if (refreshCatalog) refreshCatalog();
    else resultCount.textContent = loadFailed ? strings.failed : strings.loading;
  });
}

try {
  const response = await fetch(new URL('./catalog.json', import.meta.url));
  if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
  refreshCatalog = start(await response.json());
} catch (error) {
  loadFailed = true;
  resultCount.textContent = strings.failed;
  console.error(error);
}
