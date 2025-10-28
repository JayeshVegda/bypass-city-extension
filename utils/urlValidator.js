// URL validation utilities (shared between service worker and popup)

// Note: URL.protocol includes the colon but not the double slash
// e.g., 'chrome://settings' has protocol 'chrome:'
const DANGEROUS_SCHEMES = ['javascript:', 'data:', 'file:', 'chrome:', 'chrome-extension:'];

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
  } catch {
    return false;
  }
}

/**
 * Constructs the redirect URL using the template and original link
 * @param {string} template - URL template with [LINK] placeholder
 * @param {string} originalLink - The original link to redirect
 * @returns {string|null} - Constructed URL or null if invalid
 */
function constructRedirectUrl(template, originalLink) {
  if (!template || !originalLink) {
    return null;
  }

  // Validate original link is safe
  if (!isSafeUrl(originalLink)) {
    return null;
  }

  // Check template has placeholder (support {link}, [LINK], and [URL])
  const hasPlaceholder = template.includes('{link}') || template.includes('[LINK]') || template.includes('[URL]');
  if (!hasPlaceholder) {
    return null;
  }

  // Encode the original link
  const encodedLink = encodeURIComponent(originalLink);

  // Replace placeholder with encoded link (support all placeholder formats)
  let redirectUrl = template.replace(/\{link\}/g, encodedLink);
  redirectUrl = redirectUrl.replace(/\[LINK\]/g, encodedLink);
  redirectUrl = redirectUrl.replace(/\[URL\]/g, encodedLink);

  // Validate the constructed URL
  try {
    new URL(redirectUrl);
    return redirectUrl;
  } catch {
    return null;
  }
}

/**
 * Validates the redirect endpoint template
 * @param {string} template - The template string to validate
 * @returns {Object} - { valid: boolean, message: string, isHttp?: boolean }
 */
function validateEndpoint(template) {
  if (!template || template.trim() === '') {
    return { valid: false, message: 'Endpoint cannot be empty' };
  }

  // Check for placeholder ({link} or [LINK])
  if (!template.includes('{link}') && !template.includes('[LINK]')) {
    return { valid: false, message: 'Template must include {link} or [LINK] placeholder' };
  }

  // Validate URL format
  try {
    // Replace placeholder with test value for URL validation
    let testUrl = template.replace(/\{link\}/g, 'test').replace(/\[LINK\]/g, 'test');
    const url = new URL(testUrl);
    
    // Check scheme
    const scheme = url.protocol.toLowerCase();
    if (scheme !== 'http:' && scheme !== 'https:') {
      return { valid: false, message: 'URL must use http:// or https://' };
    }

    // Warn if not HTTPS
    if (scheme === 'http:') {
      return { 
        valid: true, 
        message: 'Valid (HTTPS recommended for security)', 
        isHttp: true 
      };
    }

    return { valid: true, message: 'Valid endpoint', isHttp: false };
  } catch (error) {
    return { valid: false, message: 'Invalid URL format' };
  }
}

module.exports = {
  isSafeUrl,
  constructRedirectUrl,
  validateEndpoint
};

