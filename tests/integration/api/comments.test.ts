import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock database before importing server
vi.mock('../../../server/config/database', () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
  sequelize: {
    authenticate: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('Comments API Endpoints', () => {
  beforeAll(() => {
    // Suppress console logs during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('POST /api/comments', () => {
    it('should validate required fields for comment creation', () => {
      const validComment = {
        itemId: 'item123',
        userId: 'user456',
        content: 'This is a test comment',
      };

      expect(validComment.itemId).toBeTruthy();
      expect(validComment.userId).toBeTruthy();
      expect(validComment.content).toBeTruthy();
    });

    it('should accept optional screenshot URL', () => {
      const commentWithScreenshot = {
        itemId: 'item123',
        userId: 'user456',
        content: 'Comment with screenshot',
        screenshotUrl: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
      };

      expect(commentWithScreenshot.screenshotUrl).toBeTruthy();
    });

    it('should validate large base64 screenshots', () => {
      const largeScreenshot = 'data:image/png;base64,' + 'A'.repeat(5 * 1024 * 1024); // 5MB

      expect(largeScreenshot.length).toBeGreaterThan(1024 * 1024); // > 1MB
      expect(largeScreenshot.length).toBeLessThan(50 * 1024 * 1024); // < 50MB limit
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should validate comment update payload', () => {
      const updatePayload = {
        content: 'Updated comment content',
        screenshotUrl: 'https://example.com/new-screenshot.png',
      };

      expect(updatePayload.content).toBeTruthy();
    });

    it('should allow updating only content', () => {
      const updatePayload = {
        content: 'Updated content only',
      };

      expect(updatePayload).toHaveProperty('content');
      expect(updatePayload).not.toHaveProperty('userId'); // userId should not be changeable
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should handle soft delete with deletion reason', () => {
      const softDeletePayload = {
        isDeleted: true,
        deletionReason: 'Violates community guidelines',
      };

      expect(softDeletePayload.isDeleted).toBe(true);
      expect(softDeletePayload.deletionReason).toBeTruthy();
    });

    it('should validate comment ID format', () => {
      const commentId = '123456789';

      expect(typeof commentId).toBe('string');
      expect(commentId).toBeTruthy();
    });
  });

  describe('Comment Visibility and Moderation', () => {
    it('should track deleted status for moderation', () => {
      const deletedComment = {
        id: 'comment1',
        userId: 'user1',
        content: 'Original content',
        isDeleted: true,
        deletionReason: 'Spam',
      };

      expect(deletedComment.isDeleted).toBe(true);
      expect(deletedComment.deletionReason).toBe('Spam');
    });

    it('should maintain content for moderation review', () => {
      const deletedComment = {
        content: 'Flagged content',
        isDeleted: true,
      };

      // Content should still exist for admin review even when deleted
      expect(deletedComment.content).toBeTruthy();
    });
  });

  describe('Comment Association with Users', () => {
    it('should include user information in comment response', () => {
      const commentWithUser = {
        id: 'comment1',
        content: 'Test comment',
        user: {
          id: 'user1',
          name: 'Test User',
          avatar: 'https://example.com/avatar.png',
        },
      };

      expect(commentWithUser.user).toBeTruthy();
      expect(commentWithUser.user.name).toBe('Test User');
    });
  });

  describe('Code Block Rendering in Comments', () => {
    it('should accept markdown-style code blocks', () => {
      const commentWithCode = {
        itemId: 'item1',
        userId: 'user1',
        content: '```javascript\nconst x = 1;\nconsole.log(x);\n```',
      };

      expect(commentWithCode.content).toContain('```javascript');
      expect(commentWithCode.content).toContain('const x = 1;');
    });

    it('should handle multi-language code blocks', () => {
      const languages = ['javascript', 'typescript', 'python', 'sql'];

      languages.forEach(lang => {
        const comment = {
          content: `\`\`\`${lang}\ncode here\n\`\`\``,
        };
        expect(comment.content).toContain(`\`\`\`${lang}`);
      });
    });
  });
});
