import { buttonsData } from './data';
import { ButtonItem } from './types';

// Inject dynamic button CSS stylesheets
const styleSheet = document.createElement('style');
styleSheet.id = 'buttons-dynamic-styles';
styleSheet.textContent = buttonsData.map(b => b.css).join('\n\n');
document.head.appendChild(styleSheet);

// State
let currentCategory = 'all';
let searchQuery = '';
let activeModalButton: ButtonItem | null = null;
let currentCodeTab: 'css' | 'html' | 'react' | 'vue' = 'css';

// Customizer State
let customLabel = '';
let customScale = 1.0;
let customRadius = 8;
let radiusTouched = false;

// DOM Elements
const buttonsGrid = document.getElementById('buttonsGrid') as HTMLDivElement;
const resultsCount = document.getElementById('resultsCount') as HTMLSpanElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const categoryTabs = document.getElementById('categoryTabs') as HTMLElement;
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

// Customizer DOM Elements
const cfgButtonLabel = document.getElementById('cfgButtonLabel') as HTMLInputElement;
const cfgScaleSlider = document.getElementById('cfgScaleSlider') as HTMLInputElement;
const cfgScaleVal = document.getElementById('cfgScaleVal') as HTMLSpanElement;
const cfgRadiusSlider = document.getElementById('cfgRadiusSlider') as HTMLInputElement;
const cfgRadiusVal = document.getElementById('cfgRadiusVal') as HTMLSpanElement;
const cfgResetBtn = document.getElementById('cfgResetBtn') as HTMLButtonElement;
const cfgDownloadBtn = document.getElementById('cfgDownloadBtn') as HTMLButtonElement;
const modalPermalinkBtn = document.getElementById('modalPermalinkBtn') as HTMLButtonElement;

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

// Generate Customized HTML
function getEffectiveHtml(item: ButtonItem): string {
  let html = item.html;
  if (customLabel.trim() !== '') {
    // Replace text inside innermost <span> or direct button text
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

    return matchesCategory && matchesSearch;
  });

  resultsCount.textContent = `Displaying ${filtered.length} element${filtered.length === 1 ? '' : 's'}`;
  buttonsGrid.innerHTML = '';

  if (filtered.length === 0) {
    buttonsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-tertiary);">
        <p style="font-size: 15px; margin-bottom: 6px; color: var(--text-primary);">No element matches "${searchQuery}".</p>
        <p style="font-size: 13px;">Try selecting another category or clear the search query.</p>
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
        <button class="btn-card-action copy-css" data-id="${item.id}" type="button">
          Copy CSS
        </button>
        <button class="btn-card-action primary inspect-code" data-id="${item.id}" type="button">
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

  // Re-render live button in modal stage with custom modifiers
  modalPreviewStage.innerHTML = '';
  activeModalButton.render(modalPreviewStage);

  const renderedButton = modalPreviewStage.firstElementChild as HTMLElement;
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
}

// Open Modal
function openModal(btnId: string) {
  const item = buttonsData.find(b => b.id === btnId);
  if (!item) return;

  activeModalButton = item;
  modalButtonName.textContent = item.name;
  modalButtonDesc.textContent = item.description;

  // Reset customizer state for this button
  customLabel = '';
  customScale = 1.0;
  customRadius = 8;
  radiusTouched = false;

  cfgButtonLabel.value = '';
  cfgScaleSlider.value = '1.0';
  cfgScaleVal.textContent = '1.0x';
  cfgRadiusSlider.value = '8';
  cfgRadiusVal.textContent = 'Default';

  // Set default tab to CSS
  currentCodeTab = 'css';
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.classList.toggle('active', (tab as HTMLElement).dataset.tab === 'css');
  });

  refreshModalView();
  codeModal.classList.add('open');
  codeModal.setAttribute('aria-hidden', 'false');
  window.location.hash = `button/${item.id}`;
}

// Close Modal
function closeModal() {
  codeModal.classList.remove('open');
  codeModal.setAttribute('aria-hidden', 'true');
  activeModalButton = null;
  if (window.location.hash.startsWith('#button/')) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

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

  // Fast CSS Clipboard Export
  const copyBtn = target.closest('.copy-css') as HTMLElement;
  if (copyBtn) {
    const btnId = copyBtn.dataset.id;
    const item = buttonsData.find(b => b.id === btnId);
    if (item) {
      await navigator.clipboard.writeText(item.css);
      showToast(`Copied CSS for "${item.name}"`);
    }
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
    currentCodeTab = (tab as HTMLElement).dataset.tab as 'css' | 'html' | 'react' | 'vue';
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

// Keyboard Escape Handler (R-32)
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && codeModal.classList.contains('open')) {
    closeModal();
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
renderGrid();
handleHashChange();
