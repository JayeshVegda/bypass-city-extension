<div align="center">

<img src="icons/icon128.png" alt="Bypass.city Extension" width="128" height="128">

# Bypass.city Chrome Extension

**Instantly bypass link shorteners and ad link services with bypass.city**

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/jayeshvegda/bypass-city-extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/chrome-v88+-brightgreen.svg)](https://www.google.com/chrome/)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing)

</div>

---

A privacy-first Chrome extension that automatically bypasses 45+ known ad link services and link shorteners using [bypass.city](https://bypass.city). Built with Manifest V3 for modern Chrome browsers.

## 📺 Tutorial
<div align="center">
  <video
    controls
    autoplay
    muted
    playsinline
    loop
    preload="metadata"
    poster="tutorial/palette.png"
    style="max-width: 100%; height: auto; border-radius: 5px;"
  >
    <source src="tutorial/main.mp4" type="video/mp4">
    <source src="https://user-images.githubusercontent.com/20689156/215357783-b69f4339-a681-410f-982a-44655986f0ce.mp4" type="video/mp4">
    Your browser does not support the video tag. You can
    <a href="tutorial/main.mp4">download the video here</a>.
  </video>
</div>

## ✨ Features

- 🚀 **Smart Auto-Bypass**: Automatically detects and bypasses 45+ known ad domains
- 🎯 **Right-Click Context Menu**: Quick bypass via right-click on any link
- 🌓 **Dark/Light Mode**: Beautiful UI with system preference detection
- ⚡ **Instant Redirect**: Auto-redirects when navigating to ad link sites
- 🔒 **Privacy-First**: No data collection, no tracking, fully local
- 🛡️ **Secure**: Validates URLs and blocks dangerous schemes
- ♿ **Accessible**: Full ARIA support and keyboard navigation

## 🎯 Supported Services

The extension automatically bypasses 45+ services including:

- **Linkvertise** & variants (linkvertise.com, linkvertise.net, link-to.net)
- **Sub Services** (sub2get.com, sub2unlock.com, unlocknow.net)
- **Boost Services** (boost.ink, bst.gg, mboost.me, etc.)
- **Loot Links** (lootlinks.com, loot-links.com, etc.)
- **URL Shorteners** (bit.ly, tinyurl.com, v.gd, etc.)
<!-- Paste sites removed from auto-bypass per project policy -->

## 📦 Installation

### Manual Installation (Developer Mode)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jayeshvegda/bypass-city-extension.git
   cd bypass-city-extension
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension directory

3. **That's it!** The extension is ready to use.

## 🚀 Usage

### Method 1: Auto-Bypass (Smart Mode)
1. Enable "Auto-bypass known ad links" in the extension popup (enabled by default)
2. Simply navigate to any supported ad link service
3. The extension automatically redirects to bypass.city

### Method 2: Right-Click Context Menu
1. Right-click on any link
2. Select **"Bypass with bypass.city"**
3. The link will be automatically processed through bypass.city

### Method 3: Extension Popup
- Click the extension icon to view settings and supported domains

## 🛠️ Development

### Prerequisites
- Node.js 16+ and npm
- Chrome browser (v88+)

### Setup
```bash
# Clone the repository
git clone https://github.com/jayeshvegda/bypass-city-extension.git
cd bypass-city-extension

# Install dependencies
npm install

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

### Project Structure
```
bypass-city-extension/
├── manifest.json              # Extension manifest (MV3)
├── service-worker.js          # Background service worker
├── popup/                     # Extension popup UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── icons/                     # Extension icons
├── _locales/                  # Internationalization
│   └── en/
│       └── messages.json
├── utils/                     # Shared utilities
│   ├── urlValidator.js
│   ├── domainMatcher.js
│   └── defaultSettings.js
├── tests/                     # Test suites
│   ├── service-worker.test.js
│   ├── popup.test.js
│   └── domainMatcher.test.js
└── scripts/                   # Build scripts
    └── package.js
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests (requires Playwright)
npm run test:e2e
```

## 🔒 Privacy & Security

This extension:

- ✅ **Does NOT collect any user data**
- ✅ **Does NOT track user behavior**
- ✅ **Does NOT send data to third-party services** (except bypass.city for bypass processing)
- ✅ **Stores only settings locally** (smart bypass toggle, theme preference)
- ✅ **No host permissions** required (maximum privacy)
- ✅ **Validates all URLs** before processing
- ✅ **Blocks dangerous schemes** (javascript:, data:, file:, etc.)

**Data flow:**
- URLs are sent to `bypass.city` for bypass processing (when you use the extension)
- All settings are stored locally in Chrome's sync storage
- No analytics, telemetry, or tracking

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for complete details.

## 🔐 Permissions

This extension requires minimal permissions:

- **`contextMenus`**: To add right-click menu option
- **`storage`**: To save user preferences (smart bypass, theme)
- **`tabs`**: To auto-redirect when navigating to ad domains

**No host permissions** - The extension never requests access to website data.

## 🌟 Features in Detail

### Smart Auto-Bypass
- Automatically detects 45+ known ad/shortener domains
- Redirects to bypass.city without user interaction
- Can be disabled via toggle in popup

### Manual Bypass
- Right-click any link to manually bypass
- Works with any link, not just known domains
- Always uses bypass.city for bypassing

### Dark/Light Mode
- Beautiful UI matching bypass.city design
- Automatic system preference detection
- Manual toggle available
- Preferences saved across sessions

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Adding New Domains

To add support for new ad/shortener domains:

1. Edit `utils/defaultSettings.js` (add to `KNOWN_AD_DOMAINS` array)
2. Also update in `service-worker.js` and `popup/popup.js`
3. Run tests to ensure domain matching works
4. Update domain count in popup

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Jayesh Vegda

## 👤 Author

**Jayesh Vegda**

- GitHub: [@jayeshvegda](https://github.com/jayeshvegda)
- Website: [bypass.city](https://bypass.city)

## 🙏 Acknowledgments

- [bypass.city](https://bypass.city) for the bypass service
- Chrome Extension Manifest V3 documentation
- All contributors and users of this extension

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/jayeshvegda/bypass-city-extension/issues)
- 💡 **Feature Requests**: [Open an issue](https://github.com/jayeshvegda/bypass-city-extension/issues)
- 📧 **Questions**: [Open a discussion](https://github.com/jayeshvegda/bypass-city-extension/discussions)

---

<div align="center">

Made with ❤️ by [Jayesh Vegda](https://github.com/jayeshvegda)

⭐ Star this repo if you find it helpful!

</div>
