import { buttonsData } from './data';
import { ButtonItem } from './types';

// Inject all button CSS stylesheets dynamically
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
const categoryTabs = document.getElementById('categoryTabs') as HTMLDivElement;
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

// Helper: Show toast notification
function showToast(message: string) {
  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// Generate React / JSX snippet
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

// Render filtered cards
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

  resultsCount.textContent = `Showing ${filtered.length} button${filtered.length === 1 ? '' : 's'}`;
  buttonsGrid.innerHTML = '';

  if (filtered.length === 0) {
    buttonsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-dim);">
        <p style="font-size: 16px; margin-bottom: 8px;">No button styles matched "${searchQuery}".</p>
        <p style="font-size: 13px;">Try searching for "glow", "3d", "brutalist", or selecting another category.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'button-card';

    // Stage (live button)
    const stage = document.createElement('div');
    stage.className = 'card-stage';
    item.render(stage);

    // Meta details
    const info = document.createElement('div');
    info.className = 'card-info';
    info.innerHTML = `
      <div class="card-header-line">
        <h4 class="card-title">${item.name}</h4>
        <span class="card-cat-badge">${item.category}</span>
      </div>
      <p class="card-desc">${item.description}</p>
      <div class="card-actions">
        <button class="btn-card-action copy-css" data-id="${item.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy CSS
        </button>
        <button class="btn-card-action primary inspect-code" data-id="${item.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          Get Code
        </button>
      </div>
    `;

    card.appendChild(stage);
    card.appendChild(info);
    buttonsGrid.appendChild(card);
  });
}

// Update modal content based on tab
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

// Open modal
function openModal(btnId: string) {
  const item = buttonsData.find(b => b.id === btnId);
  if (!item) return;

  activeModalButton = item;
  modalButtonName.textContent = item.name;
  modalButtonDesc.textContent = item.description;

  // Render live button preview in stage
  modalPreviewStage.innerHTML = '';
  item.render(modalPreviewStage);

  // Set default tab to CSS
  currentCodeTab = 'css';
  document.querySelectorAll('.code-tab').forEach(tab => {
    tab.classList.toggle('active', (tab as HTMLElement).dataset.tab === 'css');
  });

  updateModalSnippet();
  codeModal.classList.add('open');
}

// Close modal
function closeModal() {
  codeModal.classList.remove('open');
  activeModalButton = null;
}

// Event Listeners
categoryTabs.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement).closest('.cat-pill');
  if (!target) return;

  document.querySelectorAll('.cat-pill').forEach(pill => pill.classList.remove('active'));
  target.classList.add('active');
  currentCategory = (target as HTMLElement).dataset.category || 'all';
  renderGrid();
});

searchInput.addEventListener('input', (e) => {
  searchQuery = (e.target as HTMLInputElement).value;
  renderGrid();
});

// Grid actions: delegation
buttonsGrid.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement;

  // Direct Quick Copy CSS
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

  // Inspect Code / Modal
  const inspectBtn = target.closest('.inspect-code') as HTMLElement;
  if (inspectBtn) {
    const btnId = inspectBtn.dataset.id;
    if (btnId) openModal(btnId);
    return;
  }
});

// Modal close button & outside backdrop click
modalCloseBtn.addEventListener('click', closeModal);
codeModal.addEventListener('click', (e) => {
  if (e.target === codeModal) closeModal();
});

// Modal tab switching
document.querySelectorAll('.code-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCodeTab = (tab as HTMLElement).dataset.tab as 'css' | 'html' | 'react';
    updateModalSnippet();
  });
});

// Modal Copy Code action
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
    copyBtnText.textContent = 'Copy Code';
  }, 1800);
});

// Keyboard escape to close modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && codeModal.classList.contains('open')) {
    closeModal();
  }
});

// Initial boot
renderGrid();
