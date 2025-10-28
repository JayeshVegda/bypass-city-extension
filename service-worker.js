// Service worker for Chrome Extension Manifest V3
// Handles context menu registration and link redirection with auto-bypass functionality

// Constants
const CONTEXT_MENU_ID = 'redirect-link';
// Using bypass.city API endpoint matching the userscript implementation
const BYPASS_ENDPOINT = 'https://bypass.city/bypass?bypass={link}';

// Known ad/shortener domains (based on bypass.city userscript supported sites)
const KNOWN_AD_DOMAINS = [
  // Primary ad link services
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
  // URL shorteners
  "tinyurl.com", "bit.ly", "rebrand.ly",
  "google-url.com", "justpaste.it",
  // Paste sites (supported by bypass.city for content extraction)
  "pastebin.com", "pastelink.net", "pastesite.com",
  "rentry.co", "controlc.com", "paste.work.ink",
  "privatebin.net", "paster.so", "hastebin.com",
  "bstlar.com", "pastedrop.com", "leakutopia.com",
  "leakslinks.com", "goldpaster.com", "pastes.io",
  "linkdirect.com", "n0paste.com", "pasteflash.com",
  "leaked.tools",
  // Additional from userscript
  "thedragonslayer2.github.io", "subfinal.com"
];

// Default settings structure
const DEFAULT_SETTINGS = {
  smartBypass: true,
  customEndpoint: BYPASS_ENDPOINT,
  knownDomains: KNOWN_AD_DOMAINS,
  lastBypassedDomain: null
};

// Dangerous URL schemes to block for security
const DANGEROUS_SCHEMES = ['javascript:', 'data:', 'file:', 'chrome:', 'chrome-extension:'];

// Track redirected tabs to prevent infinite loops
const redirectedTabs = new Set();

/**
 * Check if Chrome extension APIs are available
 * This ensures compatibility and prevents undefined errors
 */
function isExtensionContext() {
  return typeof chrome !== 'undefined' && 
         chrome.runtime && 
         chrome.runtime.id;
}

/**
 * Validates if a URL scheme is safe
 * @param {string} url - URL to validate
 * @returns {boolean} - true if safe, false if dangerous
 */
function isSafeUrl(url) {
  try {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol.toLowerCase();
    return !DANGEROUS_SCHEMES.includes(protocol);
  } catch (e) {
    return false;
  }
}

/**
 * Extract root domain from URL for matching
 * Removes www. prefix and returns lowercase hostname
 * @param {string} url - URL to extract domain from
 * @returns {string|null} - Extracted domain or null if invalid
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname.toLowerCase();
    
    // Remove www. prefix for consistent matching
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    
    return hostname;
  } catch (e) {
    return null;
  }
}

/**
 * Check if a URL matches any of the known ad domains
 * Optimized with Set for O(1) lookup performance
 * @param {string} url - URL to check
 * @param {Array<string>|Set<string>} knownDomains - Array or Set of known ad domains
 * @returns {boolean} - true if URL matches a known ad domain
 */
function isKnownAdDomain(url, knownDomains) {
  if (!url || !knownDomains || (Array.isArray(knownDomains) && knownDomains.length === 0)) {
    return false;
  }

  try {
    const domain = extractDomain(url);
    if (!domain) {
      return false;
    }

    // Convert to Set if array for performance
    const domainSet = knownDomains instanceof Set ? knownDomains : new Set(knownDomains);

    // Check exact match (O(1))
    if (domainSet.has(domain)) {
      return true;
    }

    // Check subdomain matches (e.g., sub.linkvertise.com -> linkvertise.com)
    const parts = domain.split('.');
    for (let i = 1; i < parts.length; i++) {
      const rootDomain = parts.slice(i).join('.');
      if (domainSet.has(rootDomain)) {
        return true;
      }
    }

    return false;
  } catch (e) {
    return false; // Invalid URL
  }
}

/**
 * Constructs redirect URL using template and original link
 * Supports multiple placeholder formats: {link}, [LINK], [URL]
 * @param {string} originalLink - The original link to redirect
 * @param {string} endpoint - Endpoint template to use
 * @returns {string|null} - Constructed URL or null if invalid
 */
function constructRedirectUrl(originalLink, endpoint) {
  if (!originalLink || !endpoint) {
    return null;
  }

  // Validate original link is safe
  if (!isSafeUrl(originalLink)) {
    console.error('Unsafe URL scheme detected:', originalLink);
    return null;
  }

  // Encode the original link for URL safety
  const encodedLink = encodeURIComponent(originalLink);

  // Replace all placeholder formats with encoded link
  let redirectUrl = endpoint.replace(/\{link\}/g, encodedLink);
  redirectUrl = redirectUrl.replace(/\[LINK\]/g, encodedLink);
  redirectUrl = redirectUrl.replace(/\[URL\]/g, encodedLink);

  // Validate the constructed URL
  try {
    new URL(redirectUrl);
    return redirectUrl;
  } catch (e) {
    console.error('Invalid redirect URL constructed:', redirectUrl);
    return null;
  }
}

/**
 * Creates the context menu item on extension install
 * Includes error handling to prevent crashes
 */
function createContextMenu() {
  // Check API availability before using
  if (!chrome.contextMenus || !chrome.contextMenus.removeAll) {
    console.error('contextMenus API not available');
    return;
  }

  chrome.contextMenus.removeAll(() => {
    // Check for errors after removeAll
    if (chrome.runtime.lastError) {
      console.error('Error removing context menus:', chrome.runtime.lastError.message);
      return;
    }

    // Create context menu item
    if (chrome.contextMenus.create) {
      try {
        chrome.contextMenus.create({
          id: CONTEXT_MENU_ID,
          title: chrome.i18n ? chrome.i18n.getMessage('contextMenuTitle') : 'Bypass with bypass.city',
          contexts: ['link']
        }, () => {
          // Check for errors after create
          if (chrome.runtime.lastError) {
            console.error('Error creating context menu:', chrome.runtime.lastError.message);
          }
        });
      } catch (e) {
        console.error('Exception creating context menu:', e);
      }
    }
  });
}

/**
 * Initialize default settings on first install
 * Includes error handling for storage operations
 */
function initializeSettings() {
  if (!chrome.storage || !chrome.storage.sync) {
    console.error('Storage API not available');
    return;
  }

  chrome.storage.sync.get(['settings'], (result) => {
    // Check for storage errors
    if (chrome.runtime.lastError) {
      console.error('Error reading settings:', chrome.runtime.lastError.message);
      return;
    }

    if (!result.settings) {
      // First install - set default settings
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting default settings:', chrome.runtime.lastError.message);
        }
      });
    } else {
      // Migrate existing settings if needed
      const currentSettings = result.settings;
      let needsUpdate = false;

      if (!currentSettings.knownDomains) {
        currentSettings.knownDomains = KNOWN_AD_DOMAINS;
        needsUpdate = true;
      }
      if (currentSettings.smartBypass === undefined) {
        currentSettings.smartBypass = true;
        needsUpdate = true;
      }

      if (needsUpdate) {
        chrome.storage.sync.set({ settings: currentSettings }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error migrating settings:', chrome.runtime.lastError.message);
          }
        });
      }
    }
  });
}

/**
 * Handles context menu click events with smart bypass logic
 * Validates URLs and redirects via bypass.city
 */
function handleContextMenuClick(info) {
  // Validate inputs
  if (!info || info.menuItemId !== CONTEXT_MENU_ID || !info.linkUrl) {
    return;
  }

  const originalUrl = info.linkUrl;

  // Validate URL is safe
  if (!isSafeUrl(originalUrl)) {
    console.error('Unsafe URL scheme detected:', originalUrl);
    return;
  }

  // Get settings with error handling
  if (!chrome.storage || !chrome.storage.sync) {
    console.error('Storage API not available');
    return;
  }

  chrome.storage.sync.get(['settings'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading settings:', chrome.runtime.lastError.message);
      return;
    }

    const settings = result.settings || DEFAULT_SETTINGS;

    // Check if domain is in known ad domains
    const isKnownDomain = isKnownAdDomain(originalUrl, settings.knownDomains || KNOWN_AD_DOMAINS);

    let redirectUrl = null;

    // SMART BYPASS: Use bypass.city for known ad domains
    if (settings.smartBypass !== false && isKnownDomain) {
      const bypassedDomain = extractDomain(originalUrl);
      redirectUrl = BYPASS_ENDPOINT.replace(/\{link\}/g, encodeURIComponent(originalUrl));
      
      // Update last bypassed domain in storage
      chrome.storage.sync.set({
        settings: { ...settings, lastBypassedDomain: bypassedDomain }
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving last bypassed domain:', chrome.runtime.lastError.message);
        }
      });
    } else {
      redirectUrl = constructRedirectUrl(originalUrl, settings.customEndpoint || BYPASS_ENDPOINT);
    }

    if (!redirectUrl) {
      console.error('Failed to construct redirect URL');
      return;
    }

    // Open new tab with redirect URL
    if (chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: redirectUrl }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error opening tab:', chrome.runtime.lastError.message);
        }
      });
    } else {
      console.error('Tabs API not available');
    }
  });
}

/**
 * Handle automatic redirect when navigating to known ad domains
 * Monitors tab updates and redirects automatically if smart bypass is enabled
 */
function handleTabUpdate(tabId, changeInfo, tab) {
  // Only process when status is 'loading' (page is starting to load)
  if (!changeInfo || changeInfo.status !== 'loading') {
    return;
  }

  // Need valid HTTP/HTTPS URL to proceed
  if (!tab || !tab.url || !tab.url.startsWith('http')) {
    return;
  }

  const url = tab.url;
  
  // Skip if already redirected this tab (prevent loops)
  if (redirectedTabs.has(tabId)) {
    return;
  }
  
  // Skip bypass.city itself to prevent redirect loops
  if (url.includes('bypass.city')) {
    return;
  }

  // Get settings with error handling
  if (!chrome.storage || !chrome.storage.sync) {
    return;
  }

  chrome.storage.sync.get(['settings'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading settings for auto-redirect:', chrome.runtime.lastError.message);
      return;
    }

    try {
      const settings = result.settings || DEFAULT_SETTINGS;
      
      // Only auto-redirect if smart bypass is enabled
      if (settings.smartBypass === false) {
        return;
      }

      // Check if this is a known ad domain
      const knownDomains = settings.knownDomains || KNOWN_AD_DOMAINS;
      const isKnownDomain = isKnownAdDomain(url, knownDomains);
      
      if (isKnownDomain && isSafeUrl(url)) {
        const bypassUrl = BYPASS_ENDPOINT.replace(/\{link\}/g, encodeURIComponent(url));
        
        // Mark tab as redirected to prevent loops
        redirectedTabs.add(tabId);
        
        // Clean up tracking after 5 seconds
        setTimeout(() => {
          redirectedTabs.delete(tabId);
        }, 5000);
        
        // Redirect the tab
        if (chrome.tabs && chrome.tabs.update) {
          chrome.tabs.update(tabId, { url: bypassUrl }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error redirecting tab:', chrome.runtime.lastError.message);
              redirectedTabs.delete(tabId); // Clean up on error
              return;
            }
            
            // Update last bypassed domain after successful redirect
            const bypassedDomain = extractDomain(url);
            chrome.storage.sync.set({
              settings: { ...settings, lastBypassedDomain: bypassedDomain }
            }, () => {
              if (chrome.runtime.lastError) {
                console.error('Error saving last bypassed domain:', chrome.runtime.lastError.message);
              }
            });
          });
        } else {
          console.error('Tabs API not available for redirect');
          redirectedTabs.delete(tabId); // Clean up if API unavailable
        }
      }
    } catch (error) {
      console.error('Error in handleTabUpdate:', error);
      redirectedTabs.delete(tabId); // Clean up on exception
    }
  });
}

// ============================================================================
// INITIALIZATION - Only run if in Chrome Extension context
// ============================================================================

if (!isExtensionContext()) {
  console.warn('Not running in Chrome Extension context - APIs unavailable');
} else {
  // Initialize on extension install
  if (chrome.runtime && chrome.runtime.onInstalled) {
    chrome.runtime.onInstalled.addListener(() => {
      createContextMenu();
      initializeSettings();
    });
  }

  // Recreate context menu on startup (service workers can be terminated)
  if (chrome.runtime && chrome.runtime.onStartup) {
    chrome.runtime.onStartup.addListener(() => {
      createContextMenu();
    });
  }

  // Handle context menu clicks
  if (chrome.contextMenus && chrome.contextMenus.onClicked) {
    chrome.contextMenus.onClicked.addListener(handleContextMenuClick);
  }

  // Monitor tab updates to auto-redirect known ad domains
  if (chrome.tabs && chrome.tabs.onUpdated) {
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
  }
}

// Extension is fully initialized and ready
