// True the Glass - Content Script

const STORAGE_KEY = 'true_the_glass_enabled';

function applyFix() {
  const body = document.body;
  body.style.removeProperty('position');
  body.style.removeProperty('top');
  body.style.removeProperty('height');
  body.style.removeProperty('overflow-y');

  const hardsell = document.getElementById('LapsedContentHardsell');
  if (hardsell) hardsell.style.setProperty('display', 'none', 'important');

  const banner = document.querySelector('.restore-access-banner');
  if (banner) banner.style.setProperty('display', 'none', 'important');

  // Aside esquerdo com informações do usuário
  // const aside = document.querySelector('.EpLayout_leftRail__NtPPH');
  // if (aside) aside.style.setProperty('visibility', 'hidden', 'important');
}

// Observa inserções no DOM para pegar o hardsell quando aparecer
const observer = new MutationObserver(() => applyFix());

function enable() {
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
  applyFix();
}

function disable() {
  observer.disconnect();
}

chrome.storage.local.get([STORAGE_KEY], (result) => {
  if (result[STORAGE_KEY] !== false) enable();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'toggle') {
    message.enabled ? enable() : disable();
    sendResponse({ success: true });
  }
});