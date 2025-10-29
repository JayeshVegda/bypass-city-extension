// Popup script for bypass.city extension with smart bypass controls

// Updated to match bypass.city userscript supported sites
const KNOWN_AD_DOMAINS = [
  "linkvertise.com", "linkvertise.net", "link-to.net",
  "sub2get.com", "lootlinks.com", "loot-links.com", "loot-link.com",
  "adfoc.us", "adshnk.com", "adshrink.it",
  "boost.ink", "bst.gg", "bst.wtf", "booo.st",
  "boostfusedgt.com", "boost.fusedgt.com",
  "leasurepartment.xyz", "letsboost.net", "mboost.me",
  "rekonise.com", "rkns.link",
  "shorte.st", "sh.st", "gestyy.com", "destyy.com",
  "sub2unlock.com", "sub2unlock.net",
  "v.gd", "is.gd", "empebau.eu",
  "socialwolvez.com", "social-unlock.com",
  "sub1s.com", "subtolink.com", "unlocknow.net",
  "tinyurl.com", "bit.ly", "rebrand.ly", "tinylink.onl",
  "google-url.com", "justpaste.it",
  "thedragonslayer2.github.io", "subfinal.com"
];

// Domains that should not be auto-bypassed; ensure they are removed from saved settings
const REMOVED_PASTE_DOMAINS = [
  "pastebin.com", "pastelink.net", "pastesite.com",
  "rentry.co", "controlc.com", "paste.work.ink",
  "privatebin.net", "paster.so", "hastebin.com",
  "bstlar.com", "pastedrop.com", "leakutopia.com",
  "leakslinks.com", "goldpaster.com", "pastes.io",
  "linkdirect.com", "n0paste.com", "pasteflash.com",
  "leaked.tools"
];

const smartBypassToggle = document.getElementById('smart-bypass-toggle');
const domainCount = document.getElementById('domain-count');
const lastBypass = document.getElementById('last-bypass');
const lastDomain = document.getElementById('last-domain');
const domainList = document.getElementById('domain-list');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

/**
 * Load and display current settings
 */
function loadSettings() {
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || {
      smartBypass: true,
      knownDomains: KNOWN_AD_DOMAINS,
      lastBypassedDomain: null
    };

    // Clean paste-site domains if present in saved settings
    if (Array.isArray(settings.knownDomains) && settings.knownDomains.length > 0) {
      const filtered = settings.knownDomains.filter((d) => !REMOVED_PASTE_DOMAINS.includes(d));
      if (filtered.length !== settings.knownDomains.length) {
        settings.knownDomains = filtered;
        chrome.storage.sync.set({ settings });
      }
    }

            // Update toggle
            smartBypassToggle.checked = settings.smartBypass !== false;
            const slider = document.querySelector('.toggle-slider');
            if (slider) {
              slider.setAttribute('aria-checked', smartBypassToggle.checked ? 'true' : 'false');
            }

    // Update domain count
    const count = settings.knownDomains?.length || KNOWN_AD_DOMAINS.length;
    domainCount.textContent = `${count} domains configured`;

    // Update last bypassed domain
    if (settings.lastBypassedDomain) {
      lastDomain.textContent = settings.lastBypassedDomain;
      lastBypass.classList.remove('hidden');
    } else {
      lastBypass.classList.add('hidden');
    }

    // Populate domain list
    populateDomainList(settings.knownDomains || KNOWN_AD_DOMAINS);
  });
}

/**
 * Populate the domain list view
 */
function populateDomainList(domains) {
  domainList.innerHTML = '';
  const sortedDomains = [...domains].sort();
  sortedDomains.forEach(domain => {
    const domainItem = document.createElement('div');
    domainItem.className = 'domain-item';
    domainItem.setAttribute('role', 'listitem');
    domainItem.textContent = domain;
    domainList.appendChild(domainItem);
  });
  
  // Update summary text with count
  const summary = document.querySelector('.domain-summary span:nth-child(2)');
  if (summary) {
    summary.textContent = `View Supported Domains (${sortedDomains.length})`;
  }
}

/**
 * Save smart bypass toggle state
 */
function saveSmartBypass(enabled) {
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || {
      smartBypass: true,
      customEndpoint: 'https://bypass.city/bypass?bypass={link}',
      knownDomains: KNOWN_AD_DOMAINS
    };
    
    settings.smartBypass = enabled;
    chrome.storage.sync.set({ settings });
  });
}

/**
 * Theme Management
 */
function initTheme() {
  // Get saved theme or default to system preference
  chrome.storage.sync.get(['theme'], (result) => {
    const savedTheme = result.theme;
    let theme = savedTheme;

    // If no saved theme, check system preference
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    chrome.storage.sync.get(['theme'], (result) => {
      if (!result.theme) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
  
  // Save theme preference
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.set({ theme });
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// Event listeners
smartBypassToggle.addEventListener('change', (e) => {
  const slider = document.querySelector('.toggle-slider');
  if (slider) {
    slider.setAttribute('aria-checked', e.target.checked ? 'true' : 'false');
  }
  saveSmartBypass(e.target.checked);
});

themeToggle.addEventListener('click', toggleTheme);

// Load settings when popup opens
loadSettings();
initTheme();

// Listen for storage changes to update UI
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
      if (changes.settings) {
        loadSettings();
      }
      if (changes.theme) {
        applyTheme(changes.theme.newValue);
      }
    }
  });
}

// Update details summary aria-expanded attribute
const domainDetails = document.querySelector('.domain-details');
if (domainDetails) {
  domainDetails.addEventListener('toggle', () => {
    const summary = domainDetails.querySelector('summary');
    if (summary) {
      summary.setAttribute('aria-expanded', domainDetails.open ? 'true' : 'false');
    }
  });
}
