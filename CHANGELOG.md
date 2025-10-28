# Changelog

All notable changes to the Bypass.city Chrome Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-29

### Added
- ✨ Performance optimization: O(1) domain lookup using Set data structure
- ♿ Full ARIA accessibility support (aria-labels, aria-checked, aria-expanded)
- 🎨 Improved dark/light mode with better contrast
- 📝 Comprehensive README with installation and usage instructions
- 📋 CHANGELOG.md for version history tracking

### Changed
- 🚀 Optimized domain matching algorithm for better performance
- 🧹 Removed verbose console.log statements (kept error logging)
- 🔧 Updated package.json metadata with proper author and keywords
- 📦 Version bumped to 1.1.0

### Fixed
- 🐛 Fixed text visibility in blue primary card for light mode
- 🔒 Added safety checks for Chrome API availability in popup
- ♿ Improved accessibility with proper ARIA attributes

## [1.0.0] - 2025-01-29

### Added
- 🎉 Initial release
- 🚀 Smart auto-bypass for 60+ known ad domains
- 🖱️ Right-click context menu for manual bypass
- ⚡ Auto-redirect when navigating to ad link sites
- 🌓 Dark/light mode with system preference detection
- 🎨 Beautiful UI matching bypass.city design
- 📋 View all supported domains in popup
- ⚙️ Smart bypass toggle to enable/disable auto-bypass
- 📊 Last bypassed domain tracking
- 🔒 URL validation and dangerous scheme blocking
- 🌐 Internationalization support (i18n)
- 🧪 Comprehensive test suite (38 tests)
- 📱 Responsive popup design
- ♥️ Author credits and GitHub link in footer

### Security
- ✅ No data collection or tracking
- ✅ No host permissions required
- ✅ URL scheme validation (blocks javascript:, data:, etc.)
- ✅ Secure URL encoding
- ✅ Content Security Policy in manifest

### Performance
- ⚡ Fast domain matching with efficient algorithms
- 💾 Minimal storage usage
- 🔄 Optimized tab update handling
- 🛡️ Redirect loop prevention

---

[1.1.0]: https://github.com/jayeshvegda/bypass-city-extension/releases/tag/v1.1.0
[1.0.0]: https://github.com/jayeshvegda/bypass-city-extension/releases/tag/v1.0.0

