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
let currentCodeTab: 'css' | 'html' | 'react' = 'css';

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

// Theme Controller (R-21, R-34: Working Dual Themes with Persistence)
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

// Generate React Component Snippet
function generateReactSnippet(item: ButtonItem): string {
  const componentName = item.name.replace(/[^a-zA-Z0-9]/g, '') + 'Button';
  const cleanHtml = item.html
    .replace(/class=/g, 'className=')
    .replace(/data-text=/g, 'data-text=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/clip-path=/g, 'clipPath=');

  return `import React from 'react';
import './${item.id}.css';

export const ${componentName}: React.FC = () => {
  return (
    ${cleanHtml.split('\n').join('\n    ')}
  );
};

export default ${componentName};`;
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
          Inspect Code
        </button>
      </div>
    `;

    card.appendChild(stage);
    card.appendChild(info);
    buttonsGrid.appendChild(card);
  });
}

// Update Modal Workspace Snippet
function updateModalSnippet() {
  if (!activeModalButton) return;

  if (currentCodeTab === 'css') {
    codeSnippetArea.textContent = activeModalButton.css;
  } else if (currentCodeTab === 'html') {
    codeSnippetArea.textContent = activeModalButton.html;
  } else if (currentCodeTab === 'react') {
    codeSnippetArea.textContent = generateReactSnippet(activeModalButton);
  }
}

// Open Modal
function openModal(btnId: string) {
  const item = buttonsData.find(b => b.id === btnId);
  if (!item) return;

  activeModalButton = item;
  modalButtonName.textContent = item.name;
  modalButtonDesc.textContent = item.description;

  // Render live stage
  modalPreviewStage.innerHTML = '';
  item.render(modalPreviewStage);

  // Set default tab to CSS
  currentCodeTab = 'css';
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.classList.toggle('active', (tab as HTMLElement).dataset.tab === 'css');
  });

  updateModalSnippet();
  codeModal.classList.add('open');
  codeModal.setAttribute('aria-hidden', 'false');
  modalCloseBtn.focus();
}

// Close Modal
function closeModal() {
  codeModal.classList.remove('open');
  codeModal.setAttribute('aria-hidden', 'true');
  activeModalButton = null;
}

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
    currentCodeTab = (tab as HTMLElement).dataset.tab as 'css' | 'html' | 'react';
    updateModalSnippet();
  });
});

// Copy Code from Modal
copyCodeBtn.addEventListener('click', async () => {
  if (!activeModalButton) return;
  let textToCopy = '';
  if (currentCodeTab === 'css') textToCopy = activeModalButton.css;
  else if (currentCodeTab === 'html') textToCopy = activeModalButton.html;
  else if (currentCodeTab === 'react') textToCopy = generateReactSnippet(activeModalButton);

  await navigator.clipboard.writeText(textToCopy);
  copyBtnText.textContent = 'Copied!';
  showToast(`Copied ${currentCodeTab.toUpperCase()} snippet`);
  setTimeout(() => {
    copyBtnText.textContent = 'Copy to Clipboard';
  }, 1600);
});

// Keyboard Escape Handler (R-32)
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && codeModal.classList.contains('open')) {
    closeModal();
  }
});

// Boot
initTheme();
renderGrid();
