import { describe, it, expect } from 'vitest';
import {
  UserRole,
  ApprovalStatus,
  User,
  Comment,
  SnippetItem,
  FileItem,
  LinkItem,
  RepositoryItem,
  CATEGORIES,
  LANGUAGES,
} from '../../types';

describe('TypeScript Type Definitions', () => {
  describe('User Types', () => {
    it('should define UserRole enum correctly', () => {
      expect(UserRole.ADMIN).toBe('ADMIN');
      expect(UserRole.USER).toBe('USER');
      expect(UserRole.GUEST).toBe('GUEST');
    });

    it('should define ApprovalStatus enum correctly', () => {
      expect(ApprovalStatus.PENDING).toBe('PENDING');
      expect(ApprovalStatus.APPROVED).toBe('APPROVED');
      expect(ApprovalStatus.REJECTED).toBe('REJECTED');
    });

    it('should validate User interface structure', () => {
      const mockUser: User = {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.USER,
        status: ApprovalStatus.APPROVED,
        avatar: 'https://example.com/avatar.png',
      };

      expect(mockUser.id).toBeTruthy();
      expect(mockUser.role).toBe(UserRole.USER);
    });
  });

  describe('Comment Types', () => {
    it('should validate Comment interface structure', () => {
      const comment: Comment = {
        id: 'comment1',
        userId: 'user1',
        userName: 'Test User',
        userAvatar: 'avatar.png',
        content: 'Test comment',
        createdAt: new Date().toISOString(),
      };

      expect(comment.id).toBeTruthy();
      expect(comment.content).toBeTruthy();
    });
  });

  describe('Item Types', () => {
    it('should validate SnippetItem structure', () => {
      const snippet: SnippetItem = {
        id: '1',
        type: 'snippet',
        title: 'Test',
        description: 'Desc',
        authorId: 'user1',
        authorName: 'User',
        category: 'Frontend',
        createdAt: new Date().toISOString(),
        language: 'javascript',
        code: 'console.log("test");',
        comments: [],
      };

      expect(snippet.type).toBe('snippet');
      expect(snippet.language).toBeTruthy();
    });

    it('should validate FileItem structure', () => {
      const file: FileItem = {
        id: '1',
        type: 'file',
        title: 'Test',
        description: 'Desc',
        authorId: 'user1',
        authorName: 'User',
        category: 'Backend',
        createdAt: new Date().toISOString(),
        fileName: 'file.pdf',
        fileSize: '1MB',
        fileExtension: 'pdf',
        downloadUrl: 'url',
        comments: [],
      };

      expect(file.type).toBe('file');
      expect(file.fileName).toBeTruthy();
    });

    it('should validate LinkItem structure', () => {
      const link: LinkItem = {
        id: '1',
        type: 'link',
        title: 'Test',
        description: 'Desc',
        authorId: 'user1',
        authorName: 'User',
        category: 'Learning',
        createdAt: new Date().toISOString(),
        url: 'https://example.com',
        comments: [],
      };

      expect(link.type).toBe('link');
      expect(link.url).toBeTruthy();
    });

    it('should validate CATEGORIES constant', () => {
      expect(CATEGORIES).toContain('Frontend');
      expect(CATEGORIES).toContain('Backend');
      expect(CATEGORIES.length).toBeGreaterThan(0);
    });

    it('should validate LANGUAGES constant', () => {
      expect(LANGUAGES).toContain('javascript');
      expect(LANGUAGES).toContain('typescript');
      expect(LANGUAGES).toContain('python');
      expect(LANGUAGES.length).toBeGreaterThan(0);
    });
  });
});
