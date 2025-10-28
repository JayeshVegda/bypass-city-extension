const { isSafeUrl, constructRedirectUrl } = require('../utils/urlValidator');

describe('Service Worker URL Utilities', () => {
  describe('isSafeUrl', () => {
    it('should allow safe HTTP URLs', () => {
      expect(isSafeUrl('http://example.com')).toBe(true);
      expect(isSafeUrl('https://example.com')).toBe(true);
    });

    it('should block dangerous URL schemes', () => {
      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(isSafeUrl('file:///etc/passwd')).toBe(false);
      expect(isSafeUrl('chrome://settings')).toBe(false);
      expect(isSafeUrl('chrome-extension://abc123')).toBe(false);
    });

    it('should handle invalid URLs gracefully', () => {
      expect(isSafeUrl('not-a-url')).toBe(false);
      expect(isSafeUrl('')).toBe(false);
      expect(isSafeUrl(null)).toBe(false);
    });
  });

  describe('constructRedirectUrl', () => {
    const validTemplate = 'https://example.com/redirect?url=[LINK]';
    const testLink = 'https://test.com/page';

    it('should construct valid redirect URLs', () => {
      const result = constructRedirectUrl(validTemplate, testLink);
      expect(result).toBe('https://example.com/redirect?url=https%3A%2F%2Ftest.com%2Fpage');
    });

    it('should encode URLs properly', () => {
      const linkWithQuery = 'https://test.com?param=value&other=test';
      const result = constructRedirectUrl(validTemplate, linkWithQuery);
      expect(result).toContain(encodeURIComponent(linkWithQuery));
    });

    it('should handle complex URLs', () => {
      const complexLink = 'https://example.com/path/to/page?param=value#section';
      const result = constructRedirectUrl(validTemplate, complexLink);
      expect(result).toBe(`https://example.com/redirect?url=${encodeURIComponent(complexLink)}`);
    });

    it('should return null for dangerous URLs', () => {
      expect(constructRedirectUrl(validTemplate, 'javascript:alert(1)')).toBeNull();
      expect(constructRedirectUrl(validTemplate, 'data:text/html,test')).toBeNull();
      expect(constructRedirectUrl(validTemplate, 'file:///etc/passwd')).toBeNull();
    });

    it('should return null if template lacks placeholder', () => {
      expect(constructRedirectUrl('https://example.com', testLink)).toBeNull();
      expect(constructRedirectUrl('https://example.com?url=test', testLink)).toBeNull();
    });

    it('should return null for invalid inputs', () => {
      expect(constructRedirectUrl(null, testLink)).toBeNull();
      expect(constructRedirectUrl(validTemplate, null)).toBeNull();
      expect(constructRedirectUrl('', testLink)).toBeNull();
      expect(constructRedirectUrl(validTemplate, '')).toBeNull();
    });

    it('should handle HTTP templates', () => {
      const httpTemplate = 'http://example.com/redirect?url=[LINK]';
      const result = constructRedirectUrl(httpTemplate, testLink);
      expect(result).toBe('http://example.com/redirect?url=https%3A%2F%2Ftest.com%2Fpage');
    });

    it('should support {link} placeholder', () => {
      const bypassCityTemplate = 'https://bypass.city/bypass?bypass={link}';
      const result = constructRedirectUrl(bypassCityTemplate, testLink);
      expect(result).toBe('https://bypass.city/bypass?bypass=https%3A%2F%2Ftest.com%2Fpage');
    });

    it('should support both {link} and [LINK] placeholders', () => {
      const mixedTemplate = 'https://example.com/redirect?url={link}&backup=[LINK]';
      const result = constructRedirectUrl(mixedTemplate, testLink);
      const encoded = encodeURIComponent(testLink);
      expect(result).toBe(`https://example.com/redirect?url=${encoded}&backup=${encoded}`);
    });

    it('should support [URL] placeholder', () => {
      const urlTemplate = 'https://example.com/redirect?url=[URL]';
      const result = constructRedirectUrl(urlTemplate, testLink);
      expect(result).toBe('https://example.com/redirect?url=https%3A%2F%2Ftest.com%2Fpage');
    });
  });
});

