// popup.js — True the Glass - Popup Script

const STORAGE_KEY = 'true_the_glass_enabled';

const toggle = document.getElementById('toggle');
const badge = document.getElementById('status-badge');
const statusText = document.getElementById('status-text');
const card = document.getElementById('toggle-card');
const mainContent = document.getElementById('main-content');
const noticeContent = document.getElementById('notice-content');

// ── Helpers ──────────────────────────────────────────────────────────────────

function setUI(enabled) {
  toggle.checked = enabled;

  if (enabled) {
    badge.className = 'status-badge on';
    statusText.textContent = 'ATIVO';
    card.className = 'card active';
  } else {
    badge.className = 'status-badge off';
    statusText.textContent = 'INATIVO';
    card.className = 'card inactive';
  }
}

function isGlassdoor(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.includes('glassdoor.com');
  } catch {
    return false;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  const onGlassdoor = tab && isGlassdoor(tab.url || '');

  if (!onGlassdoor) {
    mainContent.style.display = 'none';
    noticeContent.style.display = 'block';
    return;
  }

  // Load saved state
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const enabled = result[STORAGE_KEY] !== false; // default: true
    setUI(enabled);
  });
});

// ── Toggle handler ────────────────────────────────────────────────────────────

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;

  // Save preference
  chrome.storage.local.set({ [STORAGE_KEY]: enabled });

  // Update UI immediately
  setUI(enabled);

  // Message the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) return;
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle', enabled }, (response) => {
      // Ignore errors if content script is not ready
      if (chrome.runtime.lastError) return;
    });
  });
});
