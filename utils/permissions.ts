import { User, UserRole, Item } from '../types';

/**
 * Sistema de Permissões por Role
 * 
 * SUPERADMIN: Acesso total e irrestrito
 * - Criar, editar, deletar TUDO
 * - Aprovar novos membros
 * - Gerenciar usuários e roles
 * 
 * MODERATOR: Acesso aos CRUDs completos
 * - Criar, editar, deletar posts/comentários
 * - Aprovar novos membros
 * - Deletar mensagens de qualquer usuário
 * 
 * USER: CRUD limitado aos próprios posts
 * - Criar posts/comentários
 * - Editar apenas seus próprios posts/comentários
 * - Deletar apenas seus próprios posts/comentários
 * - Visualizar tudo em modo consulta
 * 
 * GUEST: Apenas visualização limitada
 * - Visualizar apenas lista de itens (sem abrir)
 * - Todos os botões de CRUD invisíveis
 * - Sem acesso a detalhes dos posts
 */

export const permissions = {
  // --- VISUALIZAÇÃO ---
  
  canViewItemsList: (user: User | null): boolean => {
    // Todos podem ver a lista de itens
    return true;
  },

  canViewItemDetails: (user: User | null): boolean => {
    // GUEST não pode abrir os itens
    if (!user || user.role === UserRole.GUEST) {
      return false;
    }
    // Outros roles podem ver detalhes
    return true;
  },

  canViewComments: (user: User | null): boolean => {
    // GUEST não pode ver comentários
    if (!user || user.role === UserRole.GUEST) {
      return false;
    }
    return true;
  },

  canViewUserProfile: (user: User | null, targetUserId: string): boolean => {
    // GUEST não pode ver perfis
    if (!user || user.role === UserRole.GUEST) {
      return false;
    }
    // Outros podem ver perfis
    return true;
  },

  // --- CRIAÇÃO ---

  canCreateItem: (user: User | null): boolean => {
    if (!user) return false;
    // GUEST não pode criar
    if (user.role === UserRole.GUEST) return false;
    // USER, MODERATOR, SUPERADMIN podem criar
    return [UserRole.USER, UserRole.MODERATOR, UserRole.SUPERADMIN].includes(user.role);
  },

  canCreateComment: (user: User | null): boolean => {
    if (!user) return false;
    // GUEST não pode comentar
    if (user.role === UserRole.GUEST) return false;
    // USER, MODERATOR, SUPERADMIN podem comentar
    return [UserRole.USER, UserRole.MODERATOR, UserRole.SUPERADMIN].includes(user.role);
  },

  // --- EDIÇÃO ---

  canEditItem: (user: User | null, item: Item): boolean => {
    if (!user) return false;
    
    // SUPERADMIN pode editar tudo
    if (user.role === UserRole.SUPERADMIN) return true;
    
    // MODERATOR pode editar tudo
    if (user.role === UserRole.MODERATOR) return true;
    
    // USER pode editar apenas seus próprios itens
    if (user.role === UserRole.USER) {
      return item.userId === user.id;
    }
    
    // GUEST não pode editar
    return false;
  },

  canEditComment: (user: User | null, commentUserId: string): boolean => {
    if (!user) return false;
    
    // SUPERADMIN pode editar tudo
    if (user.role === UserRole.SUPERADMIN) return true;
    
    // MODERATOR pode editar tudo
    if (user.role === UserRole.MODERATOR) return true;
    
    // USER pode editar apenas seus próprios comentários
    if (user.role === UserRole.USER) {
      return commentUserId === user.id;
    }
    
    // GUEST não pode editar
    return false;
  },

  canEditOwnProfile: (user: User | null): boolean => {
    if (!user) return false;
    // GUEST não pode editar perfil
    if (user.role === UserRole.GUEST) return false;
    // Outros podem editar seu próprio perfil
    return true;
  },

  // --- DELEÇÃO ---

  canDeleteItem: (user: User | null, item: Item): boolean => {
    if (!user) return false;
    
    // SUPERADMIN pode deletar tudo
    if (user.role === UserRole.SUPERADMIN) return true;
    
    // MODERATOR pode deletar tudo
    if (user.role === UserRole.MODERATOR) return true;
    
    // USER pode deletar apenas seus próprios itens
    if (user.role === UserRole.USER) {
      return item.userId === user.id;
    }
    
    // GUEST não pode deletar
    return false;
  },

  canDeleteComment: (user: User | null, commentUserId: string): boolean => {
    if (!user) return false;
    
    // SUPERADMIN pode deletar tudo
    if (user.role === UserRole.SUPERADMIN) return true;
    
    // MODERATOR pode deletar tudo
    if (user.role === UserRole.MODERATOR) return true;
    
    // USER pode deletar apenas seus próprios comentários
    if (user.role === UserRole.USER) {
      return commentUserId === user.id;
    }
    
    // GUEST não pode deletar
    return false;
  },

  // --- AÇÕES ADMINISTRATIVAS ---

  canApproveUsers: (user: User | null): boolean => {
    if (!user) return false;
    // Apenas SUPERADMIN e MODERATOR podem aprovar usuários
    return [UserRole.SUPERADMIN, UserRole.MODERATOR].includes(user.role);
  },

  canManageUsers: (user: User | null): boolean => {
    if (!user) return false;
    // Apenas SUPERADMIN pode gerenciar usuários (alterar roles, etc)
    return user.role === UserRole.SUPERADMIN;
  },

  canAccessAdminPanel: (user: User | null): boolean => {
    if (!user) return false;
    // SUPERADMIN e MODERATOR têm acesso ao painel
    return [UserRole.SUPERADMIN, UserRole.MODERATOR].includes(user.role);
  },

  canModerateContent: (user: User | null): boolean => {
    if (!user) return false;
    // SUPERADMIN e MODERATOR podem moderar
    return [UserRole.SUPERADMIN, UserRole.MODERATOR].includes(user.role);
  },

  // --- FAVORITOS ---

  canFavoriteItems: (user: User | null): boolean => {
    if (!user) return false;
    // GUEST não pode favoritar
    if (user.role === UserRole.GUEST) return false;
    // USER, MODERATOR, SUPERADMIN podem favoritar
    return [UserRole.USER, UserRole.MODERATOR, UserRole.SUPERADMIN].includes(user.role);
  },

  // --- UI HELPERS ---

  shouldShowCreateButton: (user: User | null): boolean => {
    return permissions.canCreateItem(user);
  },

  shouldShowEditButton: (user: User | null, item: Item): boolean => {
    return permissions.canEditItem(user, item);
  },

  shouldShowDeleteButton: (user: User | null, item: Item): boolean => {
    return permissions.canDeleteItem(user, item);
  },

  shouldShowFavoriteButton: (user: User | null): boolean => {
    return permissions.canFavoriteItems(user);
  },

  shouldShowCommentSection: (user: User | null): boolean => {
    return permissions.canViewComments(user);
  },

  // --- MENSAGENS PARA USUÁRIO ---

  getNoPermissionMessage: (user: User | null, action: string): string => {
    if (!user) {
      return `Você precisa fazer login para ${action}.`;
    }
    
    if (user.role === UserRole.GUEST) {
      return `Sua conta está pendente de aprovação. Aguarde a liberação de um administrador para ${action}.`;
    }
    
    return `Você não tem permissão para ${action}.`;
  }
};

// Helper function para verificar se o usuário está aprovado
export const isUserApproved = (user: User | null): boolean => {
  if (!user) return false;
  return user.status === 'APPROVED';
};

// Helper para verificar se o usuário pode interagir
export const canUserInteract = (user: User | null): boolean => {
  if (!user) return false;
  if (user.role === UserRole.GUEST) return false;
  return isUserApproved(user);
};
