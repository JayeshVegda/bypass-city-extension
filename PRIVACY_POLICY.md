# Privacy Policy for Bypass.city Chrome Extension

**Last Updated:** January 29, 2025

## Overview

The Bypass.city Chrome Extension ("the Extension") is a privacy-first browser extension that helps users bypass link shorteners and ad link services. We are committed to protecting your privacy and being transparent about our data practices.

## Data Collection

### What We DO NOT Collect

- ❌ We do not collect any personal information
- ❌ We do not track your browsing behavior
- ❌ We do not store the links you click or bypass
- ❌ We do not use analytics or telemetry
- ❌ We do not send data to third-party services (except bypass.city when you use the extension)
- ❌ We do not access your browsing history
- ❌ We do not collect device identifiers or IP addresses
- ❌ We do not use cookies or tracking pixels

### What We Store Locally

The Extension stores the following data **only on your device** using Chrome's sync storage:

- **Smart bypass toggle state**: Whether auto-bypass is enabled/disabled
- **Theme preference**: Your dark/light mode preference
- **Last bypassed domain**: The domain name of the last link you bypassed (for display only)

This data is stored locally in your browser and is synced across your Chrome instances (if sync is enabled). This data is **never transmitted to us or any third party**.

## How the Extension Works

### Auto-Bypass (Smart Mode)

When enabled, the extension monitors tab navigation:
1. Detects if you navigate to a known ad/shortener domain (60+ supported domains)
2. Automatically redirects to `https://bypass.city/bypass?bypass={encoded_url}`
3. The URL is sent to bypass.city for bypass processing

### Manual Bypass (Context Menu)

1. Right-click any link and select "Bypass with bypass.city"
2. The extension reads the clicked link URL
3. Opens a new tab with the bypass.city redirect URL
4. The URL is sent to bypass.city for bypass processing

**Important**: URLs are only sent to bypass.city when you:
- Navigate to a known ad domain (with auto-bypass enabled), OR
- Explicitly use the right-click context menu

## Permissions Explained

The Extension requests the following permissions:

### `contextMenus`
- **Why**: To add the "Bypass with bypass.city" option when you right-click links
- **Data Access**: Only when you right-click a link on a webpage
- **Scope**: Link URLs only

### `storage`
- **Why**: To save your preferences (smart bypass toggle, theme, last bypassed domain)
- **Data Access**: Only stores your settings locally in Chrome's sync storage
- **Scope**: Local settings only, no URLs or personal data

### `tabs`
- **Why**: To auto-redirect tabs when you navigate to ad link sites
- **Data Access**: Only checks tab URLs to detect known ad domains
- **Scope**: Tab URL checking only, no content access

**We do NOT request**:
- Host permissions (cannot access website content)
- Cookies or browsing data permissions
- Identity or personal information

## Third-Party Services

### Bypass.city Service

When you use the Extension to bypass links:
- URLs are sent to `https://bypass.city/bypass` for processing
- We have no control over or access to how bypass.city handles your data
- Please review [bypass.city's privacy policy](https://bypass.city/privacy) for details

**No other third-party services** are used. The Extension does not:
- Use analytics services
- Use advertising networks
- Send data to external services (except bypass.city for bypass processing)

## Data Sharing

We do not share, sell, or transmit any data to:
- Third-party services (except bypass.city when you bypass links)
- Analytics providers
- Advertising networks
- Any external parties

## Open Source

This Extension is open source. You can review all code at:
- GitHub: https://github.com/jayeshvegda/bypass-city-extension

## Data Deletion

You can delete all Extension data at any time by:
1. Opening Chrome Extensions (`chrome://extensions/`)
2. Finding "Bypass.city - Link Bypasser"
3. Clicking "Remove" (this deletes all stored data)

Or manually:
1. Open Chrome Settings
2. Go to Privacy and Security > Site Settings
3. Click "Extensions" > "Bypass.city"
4. Click "Clear data"

The Extension does not store data elsewhere. All data is local to your browser.

## Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be reflected by updating the "Last Updated" date. For significant changes, we may:
- Post a notice in the extension popup
- Update the GitHub repository
- Release a new version with updated policy reference

## Contact

For questions about this Privacy Policy, please:
- **Open an issue**: https://github.com/jayeshvegda/bypass-city-extension/issues
- **Contact the author**: See [README.md](README.md) for contact information

## Compliance

This Extension complies with:
- ✅ Chrome Web Store Developer Program Policies
- ✅ General Data Protection Regulation (GDPR)
- ✅ California Consumer Privacy Act (CCPA)
- ✅ Privacy-first design principles

## Security

The Extension implements security measures:
- URL validation before processing
- Dangerous scheme blocking (javascript:, data:, etc.)
- Content Security Policy in manifest
- No arbitrary code execution
- No network requests except to bypass.city

## Children's Privacy

The Extension is not intended for children under 13. We do not knowingly collect information from children.

---

**Summary**: This Extension is privacy-first and does not collect, track, or share your data. It only stores local preferences and sends URLs to bypass.city for bypass processing when you use the extension.
