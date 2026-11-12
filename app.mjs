const entries = document.querySelector('#entries');
const resultCount = document.querySelector('#result-count');
const filters = document.querySelector('#filters');
const query = document.querySelector('#query');
const kind = document.querySelector('#kind');
const style = document.querySelector('#style');
const group = document.querySelector('#group');
const viewButtons = [...document.querySelectorAll('[data-view]')];

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function link(text, href) {
  const anchor = element('a', text);
  anchor.href = href;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

function styleButton(id, text) {
  const button = element('button', text, 'tag');
  button.type = 'button';
  button.dataset.pickStyle = id;
  return button;
}

function note(label, text) {
  const paragraph = element('p');
  paragraph.append(element('strong', label, 'label'), text);
  return paragraph;
}

function searchable(parts, terms) {
  const haystack = parts.join(' ').normalize('NFKC').toLowerCase();
  return terms.every(term => haystack.includes(term));
}

function start(catalog) {
  const styleById = new Map(catalog.styles.map(item => [item.id, item]));
  const kindById = new Map(catalog.kinds.map(item => [item.id, item.name]));
  const groupById = new Map(catalog.groups.map(item => [item.id, item.name]));
  let view = 'references';

  for (const item of catalog.kinds) kind.add(new Option(item.name, item.id));
  for (const item of catalog.styles) style.add(new Option(item.name, item.id));
  for (const item of catalog.groups) group.add(new Option(item.name, item.id));
  document.querySelector('#reference-total').textContent = catalog.references.length;
  document.querySelector('#style-total').textContent = catalog.styles.length;

  function referenceCard(item) {
    const card = element('article', '', 'entry');
    const title = element('h2');
    title.append(link(item.title, item.url));
    card.append(element('p', `${kindById.get(item.kind)} · ${item.publisher}`, 'meta'), title);
    if (item.styles.length > 0) {
      const tags = element('div', '', 'tags');
      for (const id of item.styles) tags.append(styleButton(id, styleById.get(id).name));
      card.append(tags);
    }
    card.append(note('借用', item.adapt));
    const details = element('details');
    details.append(element('summary', '观察与取舍'), note('观察', item.observe), note('取舍', item.tradeoff));
    card.append(details);
    return card;
  }

  function styleCard(item) {
    const card = element('article', '', 'entry');
    const title = item.nameZh ? `${item.name} · ${item.nameZh}` : item.name;
    card.append(element('p', groupById.get(item.group), 'meta'), element('h2', title), note('特征', item.cues), note('适用', item.use));
    const count = catalog.references.filter(reference => reference.styles.includes(item.id)).length;
    if (count) card.append(styleButton(item.id, `查看 ${count} 条相关案例`));
    return card;
  }

  function render() {
    const terms = query.value.trim().normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean);
    const showsReferences = view === 'references';
    const matches = showsReferences ? catalog.references.filter(item => {
      if (kind.value && item.kind !== kind.value) return false;
      if (style.value && !item.styles.includes(style.value)) return false;
      const styleNames = item.styles.flatMap(id => {
        const itemStyle = styleById.get(id);
        return [itemStyle.name, itemStyle.nameZh];
      });
      return searchable([item.title, item.publisher, kindById.get(item.kind), item.observe, item.adapt, item.tradeoff, ...styleNames], terms);
    }) : catalog.styles.filter(item => {
      if (group.value && item.group !== group.value) return false;
      return searchable([item.name, item.nameZh, groupById.get(item.group), item.cues, item.use], terms);
    });

    resultCount.textContent = showsReferences ? `${matches.length} 条案例` : `${matches.length} 种风格`;
    if (matches.length) {
      entries.replaceChildren(...matches.map(showsReferences ? referenceCard : styleCard));
      return;
    }
    const empty = element('div', '', 'empty');
    const clear = element('button', '清除筛选', 'tag');
    clear.type = 'button';
    clear.addEventListener('click', () => { filters.reset(); render(); query.focus(); });
    empty.append(element('p', '没有符合条件的条目。'), clear);
    entries.replaceChildren(empty);
  }

  function selectView(nextView) {
    view = nextView;
    for (const button of viewButtons) button.setAttribute('aria-pressed', String(button.dataset.view === view));
    const showsReferences = view === 'references';
    kind.closest('label').hidden = !showsReferences;
    style.closest('label').hidden = !showsReferences;
    group.closest('label').hidden = showsReferences;
    render();
  }

  for (const button of viewButtons) button.addEventListener('click', () => selectView(button.dataset.view));
  filters.addEventListener('submit', event => event.preventDefault());
  query.addEventListener('input', render);
  for (const select of [kind, style, group]) select.addEventListener('change', render);
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-pick-style]');
    if (!button) return;
    query.value = '';
    kind.value = '';
    style.value = button.dataset.pickStyle;
    selectView('references');
    style.focus();
  });
  selectView(view);
}

try {
  const response = await fetch(new URL('./catalog.json', import.meta.url));
  if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
  start(await response.json());
} catch (error) {
  resultCount.textContent = '无法读取目录。请用 HTTP 服务打开此页面，或直接查看目录数据。';
  console.error(error);
}
