export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',  // Acesso total, gerencia tudo
  MODERATOR = 'MODERATOR',    // Modera conteúdo, aprova usuários
  USER = 'USER',              // Contribuidor aprovado
  GUEST = 'GUEST'             // Visitante/aguardando aprovação
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface UserSocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hash da senha (não retornado em responses)
  role: UserRole;
  status: ApprovalStatus;
  avatar: string;
  bio?: string; // Job title or short description
  isPublicProfile?: boolean; // Whether to show in Contacts tab
  socialLinks?: UserSocialLinks;
  createdAt?: string;
  updatedAt?: string;
}

// User sem informações sensíveis (para responses)
export type PublicUser = Omit<User, 'password'>;

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  screenshotUrl?: string; // URL of the result screenshot
  isDeleted?: boolean; // Soft delete for moderation
  deletionReason?: string; // Why it was deleted (visible to owner/admin)
}

export interface BaseItem {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  category: string;
  createdAt: string;
  website?: string; // External link (optional context)
  repository?: string; // GitHub link
  youtube?: string; // YouTube video link
  comments: Comment[];
}

export interface SnippetItem extends BaseItem {
  type: 'snippet';
  language: string;
  code: string;
}

export interface FileItem extends BaseItem {
  type: 'file';
  fileName: string;
  fileSize: string;
  fileExtension: string;
  downloadUrl: string;
}

export interface LinkItem extends BaseItem {
  type: 'link';
  url: string; // The main content link
}

export type RepositoryItem = SnippetItem | FileItem | LinkItem;

export const CATEGORIES = [
  'Frontend', 
  'Backend', 
  'DevOps', 
  'Mobile', 
  'Database', 
  'Utility', 
  'UI/UX',
  'Learning',
  'Career'
];

export const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'php',
  'java',
  'csharp',
  'go',
  'rust',
  'html',
  'css',
  'sql',
  'shell'
];