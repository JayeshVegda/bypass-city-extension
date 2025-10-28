const { validateEndpoint } = require('../utils/urlValidator');

describe('Popup URL Validation', () => {
  describe('validateEndpoint', () => {
    it('should accept valid HTTPS templates', () => {
      const template = 'https://example.com/redirect?url=[LINK]';
      const result = validateEndpoint(template);
      expect(result.valid).toBe(true);
      expect(result.isHttp).toBe(false);
    });

    it('should accept valid HTTP templates with warning', () => {
      const template = 'http://example.com/redirect?url=[LINK]';
      const result = validateEndpoint(template);
      expect(result.valid).toBe(true);
      expect(result.isHttp).toBe(true);
    });

    it('should reject templates without [LINK] placeholder', () => {
      const template = 'https://example.com/redirect';
      const result = validateEndpoint(template);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('[LINK]');
    });

    it('should reject empty templates', () => {
      expect(validateEndpoint('').valid).toBe(false);
      expect(validateEndpoint('   ').valid).toBe(false);
      expect(validateEndpoint(null).valid).toBe(false);
    });

    it('should reject invalid URL formats', () => {
      const invalid = 'not-a-url/[LINK]';
      const result = validateEndpoint(invalid);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid URL format');
    });

    it('should reject non-HTTP/HTTPS schemes', () => {
      const ftpTemplate = 'ftp://example.com/[LINK]';
      const result = validateEndpoint(ftpTemplate);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('http:// or https://');
    });

    it('should handle templates with multiple placeholders', () => {
      const template = 'https://example.com/redirect?url=[LINK]&source=extension';
      const result = validateEndpoint(template);
      expect(result.valid).toBe(true);
    });

    it('should handle templates with special characters', () => {
      const template = 'https://example.com/api/v1/redirect?redirect_url=[LINK]&key=abc123';
      const result = validateEndpoint(template);
      expect(result.valid).toBe(true);
    });

    it('should accept templates with {link} placeholder', () => {
      const template = 'https://bypass.city/bypass?bypass={link}';
      const result = validateEndpoint(template);
      expect(result.valid).toBe(true);
      expect(result.isHttp).toBe(false);
    });

    it('should reject templates without any placeholder', () => {
      const template = 'https://example.com/redirect';
      const result = validateEndpoint(template);
      expect(result.valid).toBe(false);
      expect(result.message).toMatch(/\{link\}|\[LINK\]/);
    });
  });
});

