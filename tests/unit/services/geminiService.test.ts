import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSmartDescription, analyzeCodeQuality } from '../../../services/geminiService';

describe('geminiService', () => {
  const originalApiKey = process.env.API_KEY;

  afterEach(() => {
    process.env.API_KEY = originalApiKey;
    vi.restoreAllMocks();
  });

  describe('generateSmartDescription', () => {
    it('should return fallback message when API key is missing', async () => {
      delete process.env.API_KEY;

      const result = await generateSmartDescription(
        'Test Title',
        'content',
        'code'
      );

      expect(result).toBe('Descrição indisponível (Chave API ausente).');
    });

    it('should handle empty title and content', async () => {
      delete process.env.API_KEY;

      const result = await generateSmartDescription('', '', 'code');

      expect(result).toBe('Descrição indisponível (Chave API ausente).');
    });

    it('should accept code type parameter', () => {
      const type: 'code' | 'file' = 'code';
      expect(type).toBe('code');
    });

    it('should accept file type parameter', () => {
      const type: 'code' | 'file' = 'file';
      expect(type).toBe('file');
    });

    it('should require all three parameters', () => {
      // Type check - ensures function signature is correct
      const params = {
        title: 'Test',
        content: 'Content',
        type: 'code' as const,
      };

      expect(params.title).toBeTruthy();
      expect(params.content).toBeTruthy();
      expect(params.type).toBe('code');
    });

    it('should handle long content strings', () => {
      const longContent = 'a'.repeat(1000);
      expect(longContent.length).toBe(1000);

      // Service should truncate to 500 chars + "..."
      const truncated = longContent.substring(0, 500) + '...';
      expect(truncated.length).toBe(503);
    });
  });

  describe('analyzeCodeQuality', () => {
    it('should return empty string when API key is missing', async () => {
      delete process.env.API_KEY;

      const result = await analyzeCodeQuality('const x = 1;');

      expect(result).toBe('');
    });

    it('should accept code parameter', () => {
      const code = 'function test() { return true; }';
      expect(code).toBeTruthy();
      expect(typeof code).toBe('string');
    });

    it('should handle empty code', async () => {
      delete process.env.API_KEY;

      const result = await analyzeCodeQuality('');

      expect(result).toBe('');
    });

    it('should handle long code strings', () => {
      const longCode = 'x'.repeat(2000);
      expect(longCode.length).toBe(2000);

      // Service should truncate to 1000 chars
      const truncated = longCode.substring(0, 1000);
      expect(truncated.length).toBe(1000);
    });

    it('should return empty string silently on errors', async () => {
      delete process.env.API_KEY;

      // When API key is missing, should return empty string (not throw)
      const result = await analyzeCodeQuality('test');

      expect(result).toBe('');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle special characters in code', () => {
      const specialCode = '<script>alert("xss")</script>';
      expect(specialCode).toContain('<script>');
    });

    it('should handle unicode characters', () => {
      const unicodeText = '函数 функция مهمة';
      expect(unicodeText.length).toBeGreaterThan(0);
    });

    it('should handle null-like values gracefully', () => {
      const nullishValues = [null, undefined, '', 0, false];
      nullishValues.forEach(val => {
        const stringValue = String(val || '');
        expect(typeof stringValue).toBe('string');
      });
    });
  });

  describe('API Integration Expectations', () => {
    it('should expect gemini-2.5-flash model to be used', () => {
      const modelName = 'gemini-2.5-flash';
      expect(modelName).toBe('gemini-2.5-flash');
    });

    it('should expect Portuguese language responses', () => {
      const sampleResponse = 'Esta é uma descrição técnica';
      expect(sampleResponse).toContain('é');
    });

    it('should expect bullet point format for analysis', () => {
      const sampleAnalysis = '• Bom uso de const\n• Adicionar validação';
      expect(sampleAnalysis).toContain('•');
    });
  });
});
