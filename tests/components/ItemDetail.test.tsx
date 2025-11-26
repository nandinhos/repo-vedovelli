import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemDetail } from '../../components/ItemDetail';
import { RepositoryItem, User, UserRole, ApprovalStatus } from '../../types';

describe('ItemDetail Component', () => {
  const mockOnAddComment = vi.fn();
  const mockOnEditComment = vi.fn();
  const mockOnDeleteComment = vi.fn();

  const mockUser: User = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.USER,
    status: ApprovalStatus.APPROVED,
    avatar: 'https://example.com/avatar.png',
    isPublicProfile: true,
  };

  const mockSnippetItem: RepositoryItem = {
    id: 'item1',
    type: 'snippet',
    title: 'Test Snippet',
    description: 'A test code snippet',
    authorId: 'user1',
    authorName: 'Test User',
    category: 'Frontend',
    createdAt: new Date().toISOString(),
    language: 'javascript',
    code: 'console.log("Hello World");',
    comments: [],
  };

  const mockLinkItem: RepositoryItem = {
    id: 'item2',
    type: 'link',
    title: 'Test Link',
    description: 'A test link',
    authorId: 'user1',
    authorName: 'Test User',
    category: 'Learning',
    createdAt: new Date().toISOString(),
    url: 'https://example.com',
    comments: [],
  };

  beforeEach(() => {
    mockOnAddComment.mockClear();
    mockOnEditComment.mockClear();
    mockOnDeleteComment.mockClear();
  });

  describe('Rendering', () => {
    it('should render item description', () => {
      render(
        <ItemDetail
          item={mockSnippetItem}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.getByText(mockSnippetItem.description)).toBeInTheDocument();
    });

    it('should render code for snippet items', () => {
      render(
        <ItemDetail
          item={mockSnippetItem}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.getByText(/Preview do Código/i)).toBeInTheDocument();
    });

    it('should render external link button for link items', () => {
      render(
        <ItemDetail
          item={mockLinkItem}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      const linkButton = screen.getByText(/Acessar Link/i);
      expect(linkButton).toBeInTheDocument();
      expect(linkButton.closest('a')).toHaveAttribute('href', mockLinkItem.url);
    });

    it('should show comment count', () => {
      const itemWithComments = {
        ...mockSnippetItem,
        comments: [
          {
            id: 'c1',
            userId: 'user1',
            userName: 'Test User',
            userAvatar: 'https://example.com/avatar.png',
            content: 'Test comment',
            createdAt: new Date().toISOString(),
          },
        ],
      };

      render(
        <ItemDetail
          item={itemWithComments}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.getByText(/\(1\)/)).toBeInTheDocument();
    });
  });

  describe('Comment Submission', () => {
    it('should show comment form when user is logged in', () => {
      render(
        <ItemDetail
          item={mockSnippetItem}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.getByPlaceholderText(/Escreva sua solução/i)).toBeInTheDocument();
    });

    it('should not show comment form when user is not logged in', () => {
      render(
        <ItemDetail
          item={mockSnippetItem}
          currentUser={null}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.getByText(/Faça login para participar/i)).toBeInTheDocument();
    });

    it('should disable comment form for unapproved users', () => {
      const unapprovedUser = {
        ...mockUser,
        status: ApprovalStatus.PENDING,
      };

      render(
        <ItemDetail
          item={mockSnippetItem}
          currentUser={unapprovedUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      const textarea = screen.getByPlaceholderText(/Aguardando aprovação/i);
      expect(textarea).toBeDisabled();
    });

    it('should call onAddComment when form is submitted', () => {
      render(
        <ItemDetail
          item={mockSnippetItem}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      const textarea = screen.getByPlaceholderText(/Escreva sua solução/i);
      const submitButton = screen.getByText(/Enviar Contribuição/i);

      fireEvent.change(textarea, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);

      expect(mockOnAddComment).toHaveBeenCalledWith(
        mockSnippetItem.id,
        'Test comment',
        ''
      );
    });
  });

  describe('Comment Permissions', () => {
    it('should show edit button for own comments', () => {
      const itemWithOwnComment = {
        ...mockSnippetItem,
        comments: [
          {
            id: 'c1',
            userId: 'user1', // Same as mockUser
            userName: 'Test User',
            userAvatar: 'https://example.com/avatar.png',
            content: 'My comment',
            createdAt: new Date().toISOString(),
          },
        ],
      };

      render(
        <ItemDetail
          item={itemWithOwnComment}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.getByTitle('Editar')).toBeInTheDocument();
    });

    it('should show delete button for admin on any comment', () => {
      const adminUser = {
        ...mockUser,
        role: UserRole.ADMIN,
      };

      const itemWithComment = {
        ...mockSnippetItem,
        comments: [
          {
            id: 'c1',
            userId: 'differentUser',
            userName: 'Other User',
            userAvatar: 'https://example.com/avatar.png',
            content: 'Other comment',
            createdAt: new Date().toISOString(),
          },
        ],
      };

      render(
        <ItemDetail
          item={itemWithComment}
          currentUser={adminUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.getByTitle('Excluir')).toBeInTheDocument();
    });

    it('should not show deleted comments to regular users', () => {
      const itemWithDeletedComment = {
        ...mockSnippetItem,
        comments: [
          {
            id: 'c1',
            userId: 'user2',
            userName: 'Other User',
            userAvatar: 'https://example.com/avatar.png',
            content: 'Deleted content',
            createdAt: new Date().toISOString(),
            isDeleted: true,
            deletionReason: 'Spam',
          },
        ],
      };

      render(
        <ItemDetail
          item={itemWithDeletedComment}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.queryByText('Deleted content')).not.toBeInTheDocument();
    });
  });

  describe('Author Badge', () => {
    it('should show author badge for item author comments', () => {
      const itemWithAuthorComment = {
        ...mockSnippetItem,
        comments: [
          {
            id: 'c1',
            userId: 'user1', // Same as authorId
            userName: 'Test User',
            userAvatar: 'https://example.com/avatar.png',
            content: 'Author comment',
            createdAt: new Date().toISOString(),
          },
        ],
      };

      render(
        <ItemDetail
          item={itemWithAuthorComment}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.getByText('Autor')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no comments', () => {
      render(
        <ItemDetail
          item={mockSnippetItem}
          currentUser={mockUser}
          onAddComment={mockOnAddComment}
          onEditComment={mockOnEditComment}
          onDeleteComment={mockOnDeleteComment}
        />
      );

      expect(screen.getByText(/Ainda não há contribuições/i)).toBeInTheDocument();
    });
  });
});
