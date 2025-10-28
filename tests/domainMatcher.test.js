const { extractDomain, isKnownAdDomain } = require('../utils/domainMatcher');

describe('Domain Matcher Utilities', () => {
  describe('extractDomain', () => {
    it('should extract domain from HTTP URL', () => {
      expect(extractDomain('http://example.com/page')).toBe('example.com');
    });

    it('should extract domain from HTTPS URL', () => {
      expect(extractDomain('https://example.com/page')).toBe('example.com');
    });

    it('should remove www. prefix', () => {
      expect(extractDomain('https://www.example.com/page')).toBe('example.com');
    });

    it('should handle subdomains', () => {
      expect(extractDomain('https://sub.example.com/page')).toBe('sub.example.com');
    });

    it('should handle URLs with ports', () => {
      expect(extractDomain('https://example.com:8080/page')).toBe('example.com');
    });

    it('should handle URLs with query strings', () => {
      expect(extractDomain('https://example.com/page?param=value')).toBe('example.com');
    });

    it('should return null for invalid URLs', () => {
      expect(extractDomain('not-a-url')).toBeNull();
      expect(extractDomain('')).toBeNull();
      expect(extractDomain(null)).toBeNull();
    });

    it('should convert to lowercase', () => {
      expect(extractDomain('https://EXAMPLE.COM/page')).toBe('example.com');
    });
  });

  describe('isKnownAdDomain', () => {
    const knownDomains = ['linkvertise.com', 'bit.ly', 'tinyurl.com', 'pastebin.com'];

    it('should match exact domain', () => {
      expect(isKnownAdDomain('https://linkvertise.com/123', knownDomains)).toBe(true);
      expect(isKnownAdDomain('https://bit.ly/abc', knownDomains)).toBe(true);
    });

    it('should match with www prefix', () => {
      expect(isKnownAdDomain('https://www.linkvertise.com/123', knownDomains)).toBe(true);
    });

    it('should match subdomains', () => {
      expect(isKnownAdDomain('https://sub.linkvertise.com/123', knownDomains)).toBe(true);
    });

    it('should not match unknown domains', () => {
      expect(isKnownAdDomain('https://example.com/page', knownDomains)).toBe(false);
      expect(isKnownAdDomain('https://google.com/search', knownDomains)).toBe(false);
    });

    it('should handle case-insensitive matching', () => {
      expect(isKnownAdDomain('https://LINKVERTISE.COM/123', knownDomains)).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isKnownAdDomain('not-a-url', knownDomains)).toBe(false);
      expect(isKnownAdDomain('', knownDomains)).toBe(false);
      expect(isKnownAdDomain(null, knownDomains)).toBe(false);
    });

    it('should return false for empty known domains', () => {
      expect(isKnownAdDomain('https://linkvertise.com/123', [])).toBe(false);
      expect(isKnownAdDomain('https://linkvertise.com/123', null)).toBe(false);
    });
  });
});

