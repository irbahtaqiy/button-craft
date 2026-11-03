import { buttonsData } from './data';
import { ButtonItem } from './types';

// Inject dynamic button CSS stylesheets
const styleSheet = document.createElement('style');
styleSheet.id = 'buttons-dynamic-styles';
styleSheet.textContent = buttonsData.map(b => b.css).join('\n\n');
document.head.appendChild(styleSheet);

// State
let currentCategory = 'all';
let selectedTags: string[] = [];
let searchQuery = '';
let activeModalButton: ButtonItem | null = null;
let currentCodeTab: 'css' | 'html' | 'react' | 'vue' = 'css';
let currentScene: 'isolated' | 'navbar' | 'card' | 'form' = 'isolated';

// Customizer State
let customLabel = '';
let customScale = 1.0;
let customRadius = 8;
let radiusTouched = false;

// Storage State: Compare & Favorites
let compareIds: string[] = JSON.parse(localStorage.getItem('btncraft-compare') || '[]');
let favoriteIds: string[] = JSON.parse(localStorage.getItem('btncraft-favs') || '[]');

// DOM Elements
const buttonsGrid = document.getElementById('buttonsGrid') as HTMLDivElement;
const resultsCount = document.getElementById('resultsCount') as HTMLSpanElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const categoryTabs = document.getElementById('categoryTabs') as HTMLElement;
const tagsFilterList = document.getElementById('tagsFilterList') as HTMLDivElement;
const clearTagsBtn = document.getElementById('clearTagsBtn') as HTMLButtonElement;

// Main Inspector Modal Elements
const codeModal = document.getElementById('codeModal') as HTMLDivElement;
const modalCloseBtn = document.getElementById('modalCloseBtn') as HTMLButtonElement;
const modalButtonName = document.getElementById('modalButtonName') as HTMLHeadingElement;
const modalButtonDesc = document.getElementById('modalButtonDesc') as HTMLParagraphElement;
const modalPreviewStage = document.getElementById('modalPreviewStage') as HTMLDivElement;
const codeSnippetArea = document.getElementById('codeSnippetArea') as HTMLElement;
const copyCodeBtn = document.getElementById('copyCodeBtn') as HTMLButtonElement;
const copyBtnText = document.getElementById('copyBtnText') as HTMLSpanElement;
const toast = document.getElementById('toast') as HTMLDivElement;
const toastMsg = document.getElementById('toastMsg') as HTMLSpanElement;
const themeToggleBtn = document.getElementById('themeToggleBtn') as HTMLButtonElement;
const themeLabel = document.getElementById('themeLabel') as HTMLSpanElement;
const modalFavBtn = document.getElementById('modalFavBtn') as HTMLButtonElement;
const modalPermalinkBtn = document.getElementById('modalPermalinkBtn') as HTMLButtonElement;

// Customizer Elements
const cfgButtonLabel = document.getElementById('cfgButtonLabel') as HTMLInputElement;
const cfgScaleSlider = document.getElementById('cfgScaleSlider') as HTMLInputElement;
const cfgScaleVal = document.getElementById('cfgScaleVal') as HTMLSpanElement;
const cfgRadiusSlider = document.getElementById('cfgRadiusSlider') as HTMLInputElement;
const cfgRadiusVal = document.getElementById('cfgRadiusVal') as HTMLSpanElement;
const cfgResetBtn = document.getElementById('cfgResetBtn') as HTMLButtonElement;
const cfgDownloadBtn = document.getElementById('cfgDownloadBtn') as HTMLButtonElement;

// Top Nav Drawers
const openCompareBtn = document.getElementById('openCompareBtn') as HTMLButtonElement;
const compareCountBadge = document.getElementById('compareCountBadge') as HTMLSpanElement;
const compareModal = document.getElementById('compareModal') as HTMLDivElement;
const compareGrid = document.getElementById('compareGrid') as HTMLDivElement;
const closeCompareBtn = document.getElementById('closeCompareBtn') as HTMLButtonElement;
const clearCompareBtn = document.getElementById('clearCompareBtn') as HTMLButtonElement;

const openFavoritesBtn = document.getElementById('openFavoritesBtn') as HTMLButtonElement;
const favoritesCountBadge = document.getElementById('favoritesCountBadge') as HTMLSpanElement;
const favoritesModal = document.getElementById('favoritesModal') as HTMLDivElement;
const favoritesGrid = document.getElementById('favoritesGrid') as HTMLDivElement;
const closeFavoritesBtn = document.getElementById('closeFavoritesBtn') as HTMLButtonElement;
const exportAllFavsCssBtn = document.getElementById('exportAllFavsCssBtn') as HTMLButtonElement;

// Theme Controller (R-21, R-34)
function initTheme() {
  const saved = localStorage.getItem('buttoncraft-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButton(saved);
}

function updateThemeButton(theme: string) {
  if (themeLabel) {
    themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
  }
}

themeToggleBtn?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('buttoncraft-theme', next);
  updateThemeButton(next);
});

// Toast Feedback Notification
function showToast(message: string) {
  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Update Badges Count
function updateBadges() {
  compareCountBadge.textContent = compareIds.length.toString();
  favoritesCountBadge.textContent = favoriteIds.length.toString();
  localStorage.setItem('btncraft-compare', JSON.stringify(compareIds));
  localStorage.setItem('btncraft-favs', JSON.stringify(favoriteIds));
}

// Extract Top Tags for Filter
function renderTagChips() {
  const tagCounts: Record<string, number> = {};
  buttonsData.forEach(b => {
    b.tags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const popularTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 10);
  tagsFilterList.innerHTML = popularTags.map(tag => `
    <button class="tag-filter-chip ${selectedTags.includes(tag) ? 'selected' : ''}" data-tag="${tag}" type="button">
      #${tag}
    </button>
  `).join('');

  clearTagsBtn.style.display = selectedTags.length > 0 ? 'inline-block' : 'none';
}

tagsFilterList.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement).closest('.tag-filter-chip') as HTMLElement;
  if (!target) return;
  const tag = target.dataset.tag;
  if (!tag) return;

  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter(t => t !== tag);
  } else {
    selectedTags.push(tag);
  }
  renderTagChips();
  renderGrid();
});

clearTagsBtn.addEventListener('click', () => {
  selectedTags = [];
  renderTagChips();
  renderGrid();
});

// Generate Customized HTML
function getEffectiveHtml(item: ButtonItem): string {
  let html = item.html;
  if (customLabel.trim() !== '') {
    html = html.replace(/(<span[^>]*>)(.*?)(<\/span>)/i, `$1${customLabel}$3`);
    html = html.replace(/(data-text=")[^"]*(")/i, `$1${customLabel}$2`);
  }
  return html;
}

// Generate Customized CSS
function getEffectiveCss(item: ButtonItem): string {
  let css = item.css;
  if (radiusTouched) {
    css = css.replace(/border-radius:\s*[^;]+;/g, `border-radius: ${customRadius}px;`);
  }
  if (customScale !== 1.0) {
    css += `\n\n/* Customizer Scale Modifier */\n.${item.id}-scale {\n  transform: scale(${customScale});\n  transform-origin: center;\n}`;
  }
  return css;
}

// Generate React Component Snippet
function generateReactSnippet(item: ButtonItem): string {
  const componentName = item.name.replace(/[^a-zA-Z0-9]/g, '') + 'Button';
  const cleanHtml = getEffectiveHtml(item)
    .replace(/class=/g, 'className=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/clip-path=/g, 'clipPath=');

  return `import React from 'react';
import './${item.id}.css';

export interface ${componentName}Props {
  label?: string;
  onClick?: () => void;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ onClick }) => {
  return (
    ${cleanHtml.split('\n').join('\n    ')}
  );
};

export default ${componentName};`;
}

// Generate Vue 3 Single File Component (SFC) Snippet
function generateVueSnippet(item: ButtonItem): string {
  const html = getEffectiveHtml(item);
  const css = getEffectiveCss(item);

  return `<template>
  ${html.split('\n').join('\n  ')}
</template>

<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<style scoped>
${css}
</style>`;
}

// Generate Standalone HTML Document
function generateStandaloneHtml(item: ButtonItem): string {
  const html = getEffectiveHtml(item);
  const css = getEffectiveCss(item);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.name} — ButtonCraft</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0c0e12;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

// Render Catalog Grid
function renderGrid() {
  const filtered = buttonsData.filter((item) => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      item.name.toLowerCase().includes(query) ||
      item.tags.some(t => t.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    const matchesTags = selectedTags.length === 0 || selectedTags.every(t => item.tags.includes(t));

    return matchesCategory && matchesSearch && matchesTags;
  });

  resultsCount.textContent = `Displaying ${filtered.length} element${filtered.length === 1 ? '' : 's'}`;
  buttonsGrid.innerHTML = '';

  if (filtered.length === 0) {
    buttonsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-tertiary);">
        <p style="font-size: 15px; margin-bottom: 6px; color: var(--text-primary);">No element matches the current filters.</p>
        <p style="font-size: 13px;">Try clearing tags, searching another keyword, or selecting "All Items".</p>
      </div>
    `;
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'button-card';

    // Interactive Stage
    const stage = document.createElement('div');
    stage.className = 'card-stage';
    item.render(stage);

    const isFav = favoriteIds.includes(item.id);
    const isCompared = compareIds.includes(item.id);

    // Meta details
    const info = document.createElement('div');
    info.className = 'card-info';
    info.innerHTML = `
      <div class="card-header-line">
        <h3 class="card-title">${item.name}</h3>
        <span class="card-cat-badge">${item.category}</span>
      </div>
      <p class="card-desc">${item.description}</p>
      <div class="card-actions">
        <button class="btn-card-action quick-fav" data-id="${item.id}" type="button" title="Save to Favorites">
          ${isFav ? '★ Saved' : '☆ Save'}
        </button>
        <button class="btn-card-action quick-compare" data-id="${item.id}" type="button" title="Add to Compare">
          ${isCompared ? '✓ Added' : '+ Compare'}
        </button>
      </div>
      <div style="margin-top: 8px;">
        <button class="btn-card-action primary inspect-code" data-id="${item.id}" type="button" style="width: 100%;">
          Customize & Code
        </button>
      </div>
    `;

    card.appendChild(stage);
    card.appendChild(info);
    buttonsGrid.appendChild(card);
  });
}

// Update Modal Workspace Preview & Snippet
function refreshModalView() {
  if (!activeModalButton) return;

  // Re-render live button in modal stage with custom modifiers & realistic environment
  modalPreviewStage.innerHTML = '';

  const btnContainer = document.createElement('div');
  activeModalButton.render(btnContainer);
  const renderedButton = btnContainer.firstElementChild as HTMLElement;

  if (renderedButton) {
    if (customLabel.trim() !== '') {
      const span = renderedButton.querySelector('span');
      if (span) span.textContent = customLabel;
      else renderedButton.textContent = customLabel;

      if (renderedButton.hasAttribute('data-text')) {
        renderedButton.setAttribute('data-text', customLabel);
      }
    }

    if (radiusTouched) {
      renderedButton.style.borderRadius = `${customRadius}px`;
      renderedButton.querySelectorAll('*').forEach((el) => {
        (el as HTMLElement).style.borderRadius = `${customRadius}px`;
      });
    }

    renderedButton.style.transform = `scale(${customScale})`;
    renderedButton.style.transformOrigin = 'center';
  }

  // Realistic UI Context Scene Insertion
  if (currentScene === 'isolated') {
    modalPreviewStage.appendChild(renderedButton);
  } else if (currentScene === 'navbar') {
    const env = document.createElement('div');
    env.className = 'scene-env-navbar';
    env.innerHTML = `
      <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">Acme Cloud</div>
      <div style="display: flex; gap: 14px; font-size: 13px; color: var(--text-secondary);">
        <span>Products</span>
        <span>Docs</span>
      </div>
    `;
    env.appendChild(renderedButton);
    modalPreviewStage.appendChild(env);
  } else if (currentScene === 'card') {
    const env = document.createElement('div');
    env.className = 'scene-env-card';
    env.innerHTML = `
      <div style="font-size: 12px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase;">Enterprise Tier</div>
      <div style="font-size: 26px; font-weight: 800; color: var(--text-primary);">$99<span style="font-size: 14px; font-weight: 500; color: var(--text-secondary);">/mo</span></div>
      <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">Unlimited deploy pipelines, team role access, and audit log telemetry.</p>
    `;
    env.appendChild(renderedButton);
    modalPreviewStage.appendChild(env);
  } else if (currentScene === 'form') {
    const env = document.createElement('div');
    env.className = 'scene-env-form';
    env.innerHTML = `
      <div style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Deploy New Microservice</div>
      <input type="text" placeholder="Service name (e.g. auth-gateway)" style="padding: 8px 12px; background: var(--bg-surface-elevated); border: 1px solid var(--border-hairline); border-radius: 6px; color: var(--text-primary); font-size: 13px;" disabled />
    `;
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'flex-end';
    row.style.marginTop = '6px';
    row.appendChild(renderedButton);
    env.appendChild(row);
    modalPreviewStage.appendChild(env);
  }

  // Update Snippet Area
  if (currentCodeTab === 'css') {
    codeSnippetArea.textContent = getEffectiveCss(activeModalButton);
  } else if (currentCodeTab === 'html') {
    codeSnippetArea.textContent = getEffectiveHtml(activeModalButton);
  } else if (currentCodeTab === 'react') {
    codeSnippetArea.textContent = generateReactSnippet(activeModalButton);
  } else if (currentCodeTab === 'vue') {
    codeSnippetArea.textContent = generateVueSnippet(activeModalButton);
  }

  // Modal Fav Button label
  if (modalFavBtn) {
    modalFavBtn.textContent = favoriteIds.includes(activeModalButton.id) ? '★ Saved' : '☆ Save';
  }
}

// Open Main Modal
function openModal(btnId: string) {
  const item = buttonsData.find(b => b.id === btnId);
  if (!item) return;

  activeModalButton = item;
  modalButtonName.textContent = item.name;
  modalButtonDesc.textContent = item.description;

  customLabel = '';
  customScale = 1.0;
  customRadius = 8;
  radiusTouched = false;
  currentScene = 'isolated';

  cfgButtonLabel.value = '';
  cfgScaleSlider.value = '1.0';
  cfgScaleVal.textContent = '1.0x';
  cfgRadiusSlider.value = '8';
  cfgRadiusVal.textContent = 'Default';

  document.querySelectorAll('.scene-btn').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.scene === 'isolated');
  });

  currentCodeTab = 'css';
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.classList.toggle('active', (tab as HTMLElement).dataset.tab === 'css');
  });

  refreshModalView();
  codeModal.classList.add('open');
  codeModal.setAttribute('aria-hidden', 'false');
  window.location.hash = `button/${item.id}`;
}

// Close Main Modal
function closeModal() {
  codeModal.classList.remove('open');
  codeModal.setAttribute('aria-hidden', 'true');
  activeModalButton = null;
  if (window.location.hash.startsWith('#button/')) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

// Scene Switching
document.querySelectorAll('.scene-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentScene = (btn as HTMLElement).dataset.scene as any;
    refreshModalView();
  });
});

// Customizer Listeners
cfgButtonLabel.addEventListener('input', (e) => {
  customLabel = (e.target as HTMLInputElement).value;
  refreshModalView();
});

cfgScaleSlider.addEventListener('input', (e) => {
  customScale = parseFloat((e.target as HTMLInputElement).value);
  cfgScaleVal.textContent = `${customScale.toFixed(2)}x`;
  refreshModalView();
});

cfgRadiusSlider.addEventListener('input', (e) => {
  customRadius = parseInt((e.target as HTMLInputElement).value, 10);
  radiusTouched = true;
  cfgRadiusVal.textContent = `${customRadius}px`;
  refreshModalView();
});

cfgResetBtn.addEventListener('click', () => {
  customLabel = '';
  customScale = 1.0;
  customRadius = 8;
  radiusTouched = false;

  cfgButtonLabel.value = '';
  cfgScaleSlider.value = '1.0';
  cfgScaleVal.textContent = '1.0x';
  cfgRadiusSlider.value = '8';
  cfgRadiusVal.textContent = 'Default';

  refreshModalView();
  showToast('Reset customizations');
});

// Single HTML Download Trigger
cfgDownloadBtn.addEventListener('click', () => {
  if (!activeModalButton) return;
  const doc = generateStandaloneHtml(activeModalButton);
  const blob = new Blob([doc], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${activeModalButton.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${activeModalButton.id}.html`);
});

// Modal Favorite Button
modalFavBtn?.addEventListener('click', () => {
  if (!activeModalButton) return;
  const id = activeModalButton.id;
  if (favoriteIds.includes(id)) {
    favoriteIds = favoriteIds.filter(f => f !== id);
    showToast(`Removed from saved`);
  } else {
    favoriteIds.push(id);
    showToast(`Saved to favorites`);
  }
  updateBadges();
  refreshModalView();
  renderGrid();
});

// Copy Direct Permalink
modalPermalinkBtn.addEventListener('click', async () => {
  if (!activeModalButton) return;
  const url = `${window.location.origin}${window.location.pathname}#button/${activeModalButton.id}`;
  await navigator.clipboard.writeText(url);
  showToast('Permalink copied to clipboard');
});

// Category Tabs Selection
categoryTabs.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement).closest('.filter-btn');
  if (!target) return;

  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  target.classList.add('active');
  currentCategory = (target as HTMLElement).dataset.category || 'all';
  renderGrid();
});

// Search Input Listener
searchInput.addEventListener('input', (e) => {
  searchQuery = (e.target as HTMLInputElement).value;
  renderGrid();
});

// Keyboard Shortcut: Cmd/Ctrl + K to focus search
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// Grid Click Delegation
buttonsGrid.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement;

  // Toggle Favorite
  const favBtn = target.closest('.quick-fav') as HTMLElement;
  if (favBtn) {
    const id = favBtn.dataset.id!;
    if (favoriteIds.includes(id)) {
      favoriteIds = favoriteIds.filter(f => f !== id);
      showToast('Removed from saved');
    } else {
      favoriteIds.push(id);
      showToast('Saved to collection');
    }
    updateBadges();
    renderGrid();
    return;
  }

  // Toggle Compare
  const compareBtn = target.closest('.quick-compare') as HTMLElement;
  if (compareBtn) {
    const id = compareBtn.dataset.id!;
    if (compareIds.includes(id)) {
      compareIds = compareIds.filter(c => c !== id);
      showToast('Removed from compare');
    } else {
      if (compareIds.length >= 4) {
        showToast('Max 4 buttons in compare');
        return;
      }
      compareIds.push(id);
      showToast('Added to compare stage');
    }
    updateBadges();
    renderGrid();
    return;
  }

  // Inspect Modal
  const inspectBtn = target.closest('.inspect-code') as HTMLElement;
  if (inspectBtn) {
    const btnId = inspectBtn.dataset.id;
    if (btnId) openModal(btnId);
    return;
  }
});

// Modal Events: Close & Backdrop
modalCloseBtn.addEventListener('click', closeModal);
codeModal.addEventListener('click', (e) => {
  if (e.target === codeModal) closeModal();
});

// Modal Tab Switching
document.querySelectorAll('.tab-item').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCodeTab = (tab as HTMLElement).dataset.tab as any;
    refreshModalView();
  });
});

// Copy Code from Modal
copyCodeBtn.addEventListener('click', async () => {
  if (!activeModalButton) return;
  let textToCopy = '';
  if (currentCodeTab === 'css') textToCopy = getEffectiveCss(activeModalButton);
  else if (currentCodeTab === 'html') textToCopy = getEffectiveHtml(activeModalButton);
  else if (currentCodeTab === 'react') textToCopy = generateReactSnippet(activeModalButton);
  else if (currentCodeTab === 'vue') textToCopy = generateVueSnippet(activeModalButton);

  await navigator.clipboard.writeText(textToCopy);
  copyBtnText.textContent = 'Copied!';
  showToast(`Copied ${currentCodeTab.toUpperCase()} snippet`);
  setTimeout(() => {
    copyBtnText.textContent = 'Copy Code';
  }, 1600);
});

// Compare Drawer Logic
openCompareBtn.addEventListener('click', () => {
  renderCompareModal();
  compareModal.classList.add('open');
  compareModal.setAttribute('aria-hidden', 'false');
});

closeCompareBtn.addEventListener('click', () => {
  compareModal.classList.remove('open');
  compareModal.setAttribute('aria-hidden', 'true');
});

clearCompareBtn.addEventListener('click', () => {
  compareIds = [];
  updateBadges();
  renderCompareModal();
  renderGrid();
  showToast('Cleared compare stage');
});

function renderCompareModal() {
  if (compareIds.length === 0) {
    compareGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-tertiary);">
        <p style="font-size: 15px; color: var(--text-primary); margin-bottom: 6px;">Compare stage is empty.</p>
        <p style="font-size: 13px;">Click "+ Compare" on any button card in the catalog to compare up to 4 styles side-by-side.</p>
      </div>
    `;
    return;
  }

  compareGrid.innerHTML = '';
  compareIds.forEach(id => {
    const item = buttonsData.find(b => b.id === id);
    if (!item) return;

    const card = document.createElement('div');
    card.className = 'compare-card';

    const stage = document.createElement('div');
    stage.className = 'compare-stage-mini';
    item.render(stage);

    const footer = document.createElement('div');
    footer.className = 'compare-footer';
    footer.innerHTML = `
      <span>${item.name}</span>
      <button class="remove-compare-btn" data-id="${item.id}" style="background: transparent; border: none; color: var(--text-tertiary); cursor: pointer;">Remove</button>
    `;

    card.appendChild(stage);
    card.appendChild(footer);
    compareGrid.appendChild(card);
  });
}

compareGrid.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('remove-compare-btn')) {
    const id = target.dataset.id!;
    compareIds = compareIds.filter(c => c !== id);
    updateBadges();
    renderCompareModal();
    renderGrid();
  }
});

// Favorites Drawer Logic
openFavoritesBtn.addEventListener('click', () => {
  renderFavoritesModal();
  favoritesModal.classList.add('open');
  favoritesModal.setAttribute('aria-hidden', 'false');
});

closeFavoritesBtn.addEventListener('click', () => {
  favoritesModal.classList.remove('open');
  favoritesModal.setAttribute('aria-hidden', 'true');
});

function renderFavoritesModal() {
  if (favoriteIds.length === 0) {
    favoritesGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-tertiary);">
        <p style="font-size: 15px; color: var(--text-primary); margin-bottom: 6px;">No saved buttons yet.</p>
        <p style="font-size: 13px;">Click "☆ Save" on any button to curate your design system collection.</p>
      </div>
    `;
    return;
  }

  favoritesGrid.innerHTML = '';
  favoriteIds.forEach(id => {
    const item = buttonsData.find(b => b.id === id);
    if (!item) return;

    const card = document.createElement('div');
    card.className = 'fav-card';

    const stage = document.createElement('div');
    stage.className = 'compare-stage-mini';
    item.render(stage);

    const footer = document.createElement('div');
    footer.className = 'compare-footer';
    footer.innerHTML = `
      <span>${item.name}</span>
      <button class="remove-fav-btn" data-id="${item.id}" style="background: transparent; border: none; color: var(--text-tertiary); cursor: pointer;">Remove</button>
    `;

    card.appendChild(stage);
    card.appendChild(footer);
    favoritesGrid.appendChild(card);
  });
}

favoritesGrid.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('remove-fav-btn')) {
    const id = target.dataset.id!;
    favoriteIds = favoriteIds.filter(f => f !== id);
    updateBadges();
    renderFavoritesModal();
    renderGrid();
  }
});

exportAllFavsCssBtn.addEventListener('click', async () => {
  if (favoriteIds.length === 0) return;
  const bundleCss = favoriteIds
    .map(id => buttonsData.find(b => b.id === id)?.css || '')
    .filter(Boolean)
    .join('\n\n/* ---------------------------------- */\n\n');

  await navigator.clipboard.writeText(bundleCss);
  showToast(`Exported ${favoriteIds.length} buttons CSS bundle`);
});

// Keyboard Escape Handler (R-32)
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (codeModal.classList.contains('open')) closeModal();
    if (compareModal.classList.contains('open')) {
      compareModal.classList.remove('open');
      compareModal.setAttribute('aria-hidden', 'true');
    }
    if (favoritesModal.classList.contains('open')) {
      favoritesModal.classList.remove('open');
      favoritesModal.setAttribute('aria-hidden', 'true');
    }
  }
});

// Deep Link Hash Routing (#button/:id)
function handleHashChange() {
  const hash = window.location.hash;
  if (hash.startsWith('#button/')) {
    const btnId = hash.replace('#button/', '');
    openModal(btnId);
  }
}

window.addEventListener('hashchange', handleHashChange);

// Boot
initTheme();
updateBadges();
renderTagChips();
renderGrid();
handleHashChange();
