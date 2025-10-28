# Contributing to Bypass.city Chrome Extension

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/bypass-city-extension.git
   cd bypass-city-extension
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Lint code
npm run lint
```

### Making Changes

1. Make your changes in the appropriate files
2. Write or update tests for your changes
3. Ensure all tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Test the extension manually in Chrome

### Code Style

- Follow existing code style
- Use ESLint (configured in `.eslintrc.js`)
- Write clear, descriptive commit messages
- Add JSDoc comments for functions

## Adding New Domains

To add support for new ad/shortener domains:

1. **Edit domain lists** in these files:
   - `utils/defaultSettings.js`
   - `service-worker.js` (DEFAULT_SETTINGS)
   - `popup/popup.js` (KNOWN_AD_DOMAINS)

2. **Add the domain** to the `KNOWN_AD_DOMAINS` array:
   ```javascript
   const KNOWN_AD_DOMAINS = [
     // ... existing domains
     "newsite.com"
   ];
   ```

3. **Test domain matching**:
   ```bash
   npm test
   ```

4. **Update the count** - The popup will automatically update, but verify the count is correct

5. **Test manually**:
   - Load extension in Chrome
   - Navigate to the new domain
   - Verify auto-redirect works

## Submitting Changes

1. **Commit your changes**:
   ```bash
   git commit -m "feat: Add support for newsite.com"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Describe what changes were made and why
   - Reference any related issues
   - Include screenshots if UI changes were made

## Commit Message Guidelines

Follow these conventions for commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: Add support for new-ad-site.com

- Added new-ad-site.com to known domains list
- Updated domain count in popup
- Added tests for new domain matching
```

## Pull Request Guidelines

- Keep PRs focused and small
- Ensure all tests pass
- Update documentation if needed
- Add tests for new features
- Follow the existing code style

## Reporting Issues

When reporting bugs or requesting features:

1. **Check existing issues** first
2. **Use clear titles** and descriptions
3. **Include steps to reproduce** (for bugs)
4. **Add screenshots** if applicable
5. **Include Chrome version** and OS

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion on GitHub
- Check existing issues and discussions

Thank you for contributing! 🎉

