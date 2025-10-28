// Domain extraction and matching utilities for smart bypass

/**
 * Extract root domain from URL for matching
 * @param {string} url - URL to extract domain from
 * @returns {string|null} - Extracted domain or null if invalid
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname.toLowerCase();
    
    // Remove www. prefix
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
 * @param {string} url - URL to check
 * @param {Array<string>} knownDomains - Array of known ad domains
 * @returns {boolean} - true if URL matches a known ad domain
 */
function isKnownAdDomain(url, knownDomains) {
  if (!url || !knownDomains || knownDomains.length === 0) {
    return false;
  }

  try {
    const domain = extractDomain(url);
    if (!domain) {
      return false;
    }

    // Exact match or subdomain match
    return knownDomains.some(knownDomain => 
      domain === knownDomain || domain.endsWith('.' + knownDomain)
    );
  } catch (e) {
    return false; // Invalid URL
  }
}

module.exports = {
  extractDomain,
  isKnownAdDomain
};

