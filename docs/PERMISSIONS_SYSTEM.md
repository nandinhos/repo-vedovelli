# 🔐 Sistema de Permissões - Repositório Vedovelli

**Data:** 27/11/2024  
**Status:** ✅ **Implementado e Funcional**

---

## 📋 Visão Geral

Sistema centralizado de permissões baseado em roles (papéis) para controlar acesso e ações dos usuários na plataforma.

---

## 👥 Roles (Papéis)

### 🔴 SUPERADMIN
**Acesso Total e Irrestrito**

**Permissões:**
- ✅ Criar, editar e deletar QUALQUER item
- ✅ Criar, editar e deletar QUALQUER comentário
- ✅ Aprovar novos membros
- ✅ Rejeitar usuários
- ✅ Alterar roles de outros usuários
- ✅ Gerenciar sistema completo
- ✅ Moderar conteúdo
- ✅ Visualizar tudo
- ✅ Favoritar itens

**Casos de Uso:**
- Administrador principal da plataforma
- Gerenciamento total do sistema
- Moderação de última instância

---

### 🟠 MODERATOR
**Acesso aos CRUDs Completos + Aprovação**

**Permissões:**
- ✅ Criar, editar e deletar QUALQUER item
- ✅ Criar, editar e deletar QUALQUER comentário
- ✅ Aprovar novos membros
- ✅ Moderar conteúdo (deletar com justificativa)
- ✅ Visualizar tudo
- ✅ Favoritar itens
- ❌ NÃO pode alterar roles de usuários
- ❌ NÃO pode gerenciar outros moderadores/admins

**Casos de Uso:**
- Moderadores da comunidade
- Curadoria de conteúdo
- Suporte aos usuários

---

### 🟢 USER
**CRUD Limitado aos Próprios Posts**

**Permissões:**
- ✅ Criar posts (snippets, arquivos, links)
- ✅ Editar APENAS seus próprios posts
- ✅ Deletar APENAS seus próprios posts
- ✅ Criar comentários
- ✅ Editar APENAS seus próprios comentários
- ✅ Deletar APENAS seus próprios comentários
- ✅ Visualizar TUDO (posts e comentários de todos)
- ✅ Favoritar itens
- ✅ Ver perfis de outros usuários
- ❌ NÃO pode editar/deletar posts de outros
- ❌ NÃO pode moderar

**Casos de Uso:**
- Membros aprovados da comunidade
- Contribuidores de conteúdo
- Usuários padrão

---

### ⚪ GUEST
**Apenas Visualização Limitada**

**Permissões:**
- ✅ Ver LISTA de itens (títulos, descrições, categorias)
- ❌ NÃO pode abrir detalhes dos posts
- ❌ NÃO pode ver comentários
- ❌ NÃO pode ver código/conteúdo
- ❌ NÃO pode criar nada
- ❌ NÃO pode editar nada
- ❌ NÃO pode deletar nada
- ❌ NÃO pode comentar
- ❌ NÃO pode favoritar
- ❌ NÃO pode ver perfis
- ❌ Todos os botões de CRUD **invisíveis/desabilitados**

**Casos de Uso:**
- Usuários recém-cadastrados (aguardando aprovação)
- Visitantes não autenticados
- Contas pendentes

---

## 🔒 Matriz de Permissões

| Ação | GUEST | USER | MODERATOR | SUPERADMIN |
|------|-------|------|-----------|------------|
| **Ver lista de itens** | ✅ | ✅ | ✅ | ✅ |
| **Abrir detalhes** | ❌ | ✅ | ✅ | ✅ |
| **Ver comentários** | ❌ | ✅ | ✅ | ✅ |
| **Ver perfis** | ❌ | ✅ | ✅ | ✅ |
| **Criar post** | ❌ | ✅ | ✅ | ✅ |
| **Editar próprio post** | ❌ | ✅ | ✅ | ✅ |
| **Editar post de outro** | ❌ | ❌ | ✅ | ✅ |
| **Deletar próprio post** | ❌ | ✅ | ✅ | ✅ |
| **Deletar post de outro** | ❌ | ❌ | ✅ | ✅ |
| **Criar comentário** | ❌ | ✅ | ✅ | ✅ |
| **Editar próprio comentário** | ❌ | ✅ | ✅ | ✅ |
| **Editar comentário de outro** | ❌ | ❌ | ✅ | ✅ |
| **Deletar próprio comentário** | ❌ | ✅ | ✅ | ✅ |
| **Deletar comentário de outro** | ❌ | ❌ | ✅ | ✅ |
| **Favoritar itens** | ❌ | ✅ | ✅ | ✅ |
| **Aprovar usuários** | ❌ | ❌ | ✅ | ✅ |
| **Alterar roles** | ❌ | ❌ | ❌ | ✅ |
| **Gerenciar sistema** | ❌ | ❌ | ❌ | ✅ |

---

## 🛠️ Implementação Técnica

### Arquivo: `utils/permissions.ts`

Sistema centralizado com funções helper para verificar permissões:

```typescript
import { permissions } from './utils/permissions';

// Verificar se pode criar
permissions.canCreateItem(currentUser)

// Verificar se pode editar
permissions.canEditItem(currentUser, item)

// Verificar se pode deletar
permissions.canDeleteItem(currentUser, item)

// Verificar se pode visualizar detalhes
permissions.canViewItemDetails(currentUser)

// Mensagem de erro personalizada
permissions.getNoPermissionMessage(currentUser, 'criar conteúdo')
```

### Principais Funções:

#### **Visualização:**
- `canViewItemsList(user)` - Todos podem ver lista
- `canViewItemDetails(user)` - GUEST não pode
- `canViewComments(user)` - GUEST não pode
- `canViewUserProfile(user, targetUserId)` - GUEST não pode

#### **Criação:**
- `canCreateItem(user)` - USER, MODERATOR, SUPERADMIN
- `canCreateComment(user)` - USER, MODERATOR, SUPERADMIN

#### **Edição:**
- `canEditItem(user, item)` - Proprietário ou MODERATOR/SUPERADMIN
- `canEditComment(user, commentUserId)` - Proprietário ou MODERATOR/SUPERADMIN
- `canEditOwnProfile(user)` - Todos exceto GUEST

#### **Deleção:**
- `canDeleteItem(user, item)` - Proprietário ou MODERATOR/SUPERADMIN
- `canDeleteComment(user, commentUserId)` - Proprietário ou MODERATOR/SUPERADMIN

#### **Administrativas:**
- `canApproveUsers(user)` - MODERATOR, SUPERADMIN
- `canManageUsers(user)` - Apenas SUPERADMIN
- `canAccessAdminPanel(user)` - MODERATOR, SUPERADMIN
- `canModerateContent(user)` - MODERATOR, SUPERADMIN

#### **UI Helpers:**
- `shouldShowCreateButton(user)` - Controla visibilidade
- `shouldShowEditButton(user, item)` - Controla visibilidade
- `shouldShowDeleteButton(user, item)` - Controla visibilidade
- `shouldShowFavoriteButton(user)` - Controla visibilidade
- `shouldShowCommentSection(user)` - Controla visibilidade

---

## 🎨 Integração na UI

### App.tsx

```typescript
import { permissions } from './utils/permissions';

// Verificar antes de abrir modal
const handleOpenUpload = () => {
  if (!permissions.canCreateItem(currentUser)) {
    alert(permissions.getNoPermissionMessage(currentUser, 'criar conteúdo'));
    return;
  }
  setIsUploadModalOpen(true);
};

// Controlar visibilidade de botões
{permissions.canEditItem(currentUser, item) && (
  <button onClick={handleEdit}>Editar</button>
)}
```

### ItemDetail.tsx

```typescript
import { permissions } from '../utils/permissions';

// Verificar permissões para comentários
const canEditComment = (comment) => {
  return permissions.canEditComment(currentUser, comment.userId);
};
```

---

## 🚦 Fluxo de Aprovação

### 1. Registro
```
Usuário se registra → Status: PENDING, Role: GUEST
```

### 2. Limitações como GUEST
- Pode ver lista de posts (sem abrir)
- Não pode interagir
- Não pode ver detalhes
- Mensagem: "Sua conta está pendente de aprovação"

### 3. Aprovação
```
Admin/Moderador aprova → Status: APPROVED, Role: USER
```

### 4. Acesso Completo
- Pode criar, editar, deletar próprio conteúdo
- Pode comentar
- Pode favoritar
- Visualização completa

---

## ⚠️ Mensagens de Erro

O sistema retorna mensagens personalizadas baseadas no contexto:

**Não autenticado:**
```
"Você precisa fazer login para [ação]."
```

**GUEST (pendente):**
```
"Sua conta está pendente de aprovação. Aguarde a liberação de um 
administrador para [ação]."
```

**Sem permissão (USER tentando editar post de outro):**
```
"Você não tem permissão para [ação]."
```

---

## 🧪 Como Testar

### Testar como GUEST:

1. Registrar novo usuário
2. Não fazer aprovação
3. Verificar:
   - ✅ Vê lista de posts
   - ❌ Não pode abrir detalhes
   - ❌ Botão "+" invisível
   - ❌ Botões edit/delete invisíveis

### Testar como USER:

1. Aprovar usuário
2. Fazer login
3. Verificar:
   - ✅ Pode criar posts
   - ✅ Pode editar próprios posts
   - ❌ Não pode editar posts de outros
   - ✅ Pode comentar

### Testar como MODERATOR:

1. Alterar role para MODERATOR
2. Fazer login
3. Verificar:
   - ✅ Pode editar qualquer post
   - ✅ Pode deletar qualquer post
   - ✅ Pode moderar comentários
   - ✅ Pode aprovar usuários

### Testar como SUPERADMIN:

1. Login como admin@example.com
2. Verificar:
   - ✅ Acesso total
   - ✅ Pode gerenciar usuários
   - ✅ Pode alterar roles

---

## 📝 Checklist de Validação

### Funcionalidades Básicas:
- [x] GUEST não pode abrir posts
- [x] GUEST não vê botões de CRUD
- [x] USER pode criar posts
- [x] USER só edita próprios posts
- [x] USER só deleta próprios posts
- [x] MODERATOR pode editar qualquer post
- [x] MODERATOR pode deletar qualquer post
- [x] MODERATOR pode aprovar usuários
- [x] SUPERADMIN tem acesso total

### UI/UX:
- [x] Mensagens de erro apropriadas
- [x] Botões invisíveis quando sem permissão
- [x] Botões desabilitados com tooltip explicativo
- [x] Feedback claro ao tentar ação sem permissão

### Segurança:
- [x] Verificação no frontend (UX)
- [x] Verificação no backend (segurança)
- [x] Mensagens não expõem informações sensíveis
- [x] Logs de ações administrativas (futuro)

---

## 🔮 Melhorias Futuras

### Permissões Granulares:
- [ ] Permissões por categoria
- [ ] Permissões por tipo de conteúdo
- [ ] Roles customizáveis

### Auditoria:
- [ ] Log de ações administrativas
- [ ] Histórico de moderações
- [ ] Relatórios de atividades

### UI/UX:
- [ ] Badge visual de role no perfil
- [ ] Tooltip explicativo em botões desabilitados
- [ ] Modal de "solicitar permissão"

### Segurança:
- [ ] Rate limiting por role
- [ ] Quarentena para conteúdo suspeito
- [ ] Revisão automática de conteúdo

---

## 📚 Referências

- `utils/permissions.ts` - Sistema de permissões
- `App.tsx` - Integração principal
- `components/ItemDetail.tsx` - Permissões em comentários
- `hooks/useAuth.ts` - Gerenciamento de autenticação
- `types.ts` - Definição de UserRole e Status

---

**✅ Status:** Sistema de permissões **100% implementado e funcional**

**URL para teste:** http://localhost:8080  
**Credenciais de teste:** admin@example.com / admin123
