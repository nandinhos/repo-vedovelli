# ⭐ TASK-002: Sistema de Favoritos/Bookmarks

**Sprint:** 1 - Quick Wins  
**Prioridade:** 🔴 Alta  
**Status:** 🚧 Em Desenvolvimento  
**Estimativa:** 6-8 horas  
**Responsável:** Time Vedovelli  
**Dependências:** Nenhuma

---

## 📋 Descrição

Implementar sistema completo de favoritos/bookmarks permitindo que usuários salvem itens (snippets, arquivos, links) para acesso rápido posterior. Sistema deve incluir persistência no banco, interface visual clara e gerenciamento de coleções.

---

## 🎯 Objetivos

- Permitir marcar/desmarcar itens como favoritos
- Visualizar todos os favoritos do usuário
- Persistir favoritos no banco de dados
- Interface visual clara (ícone de coração/estrela)
- Contador de favoritos por item (opcional)
- Coleções/pastas de favoritos (fase 2 - opcional)

---

## 📐 Especificação Técnica

### **Backend**

#### 1. Modelo de Dados

**Nova tabela: `favorites`**
```sql
CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  itemId VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_item (userId, itemId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE
);

CREATE INDEX idx_favorites_user ON favorites(userId);
CREATE INDEX idx_favorites_item ON favorites(itemId);
CREATE INDEX idx_favorites_created ON favorites(createdAt DESC);
```

**Campos opcionais para fase 2 (coleções):**
```sql
-- Adicionar depois se necessário
ALTER TABLE favorites ADD COLUMN collectionId VARCHAR(255) NULL;
ALTER TABLE favorites ADD COLUMN notes TEXT NULL;
```

#### 2. Modelo Sequelize

**`server/models/Favorite.ts`**
```typescript
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface FavoriteAttributes {
  id: string;
  userId: string;
  itemId: string;
  createdAt?: Date;
}

export class Favorite extends Model<FavoriteAttributes> implements FavoriteAttributes {
  public id!: string;
  public userId!: string;
  public itemId!: string;
  public readonly createdAt!: Date;
}

Favorite.init({
  id: {
    type: DataTypes.STRING,
    defaultValue: () => `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'items',
      key: 'id'
    }
  }
}, {
  sequelize,
  tableName: 'favorites',
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'itemId'],
      name: 'unique_user_item'
    }
  ]
});

export default Favorite;
```

#### 3. Associações no `server/models/index.ts`

```typescript
import { User } from './User';
import { Item } from './Item';
import { Favorite } from './Favorite';

// User <-> Favorite
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Item <-> Favorite
Item.hasMany(Favorite, { foreignKey: 'itemId', as: 'favorites' });
Favorite.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
```

#### 4. Service Layer

**`server/services/favoriteService.ts`**
```typescript
import { Favorite } from '../models/Favorite';
import { Item } from '../models/Item';
import { User } from '../models/User';

export class FavoriteService {
  
  // Adicionar item aos favoritos
  static async addFavorite(userId: string, itemId: string): Promise<Favorite> {
    try {
      // Verificar se já existe
      const existing = await Favorite.findOne({
        where: { userId, itemId }
      });
      
      if (existing) {
        return existing; // Já está nos favoritos
      }
      
      // Criar novo favorito
      const favorite = await Favorite.create({
        userId,
        itemId
      });
      
      return favorite;
    } catch (error) {
      throw new Error(`Erro ao adicionar favorito: ${error.message}`);
    }
  }
  
  // Remover item dos favoritos
  static async removeFavorite(userId: string, itemId: string): Promise<boolean> {
    try {
      const deleted = await Favorite.destroy({
        where: { userId, itemId }
      });
      
      return deleted > 0;
    } catch (error) {
      throw new Error(`Erro ao remover favorito: ${error.message}`);
    }
  }
  
  // Toggle favorito (adiciona se não existe, remove se existe)
  static async toggleFavorite(userId: string, itemId: string): Promise<{ isFavorited: boolean }> {
    try {
      const existing = await Favorite.findOne({
        where: { userId, itemId }
      });
      
      if (existing) {
        await existing.destroy();
        return { isFavorited: false };
      } else {
        await Favorite.create({ userId, itemId });
        return { isFavorited: true };
      }
    } catch (error) {
      throw new Error(`Erro ao alternar favorito: ${error.message}`);
    }
  }
  
  // Buscar todos os favoritos de um usuário
  static async getUserFavorites(userId: string): Promise<Item[]> {
    try {
      const favorites = await Favorite.findAll({
        where: { userId },
        include: [
          {
            model: Item,
            as: 'item',
            include: [
              { model: User, as: 'author' }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      return favorites.map(fav => fav.item);
    } catch (error) {
      throw new Error(`Erro ao buscar favoritos: ${error.message}`);
    }
  }
  
  // Verificar se item está nos favoritos do usuário
  static async isFavorited(userId: string, itemId: string): Promise<boolean> {
    try {
      const favorite = await Favorite.findOne({
        where: { userId, itemId }
      });
      
      return !!favorite;
    } catch (error) {
      return false;
    }
  }
  
  // Buscar IDs de todos os favoritos do usuário (para marcar na listagem)
  static async getUserFavoriteIds(userId: string): Promise<string[]> {
    try {
      const favorites = await Favorite.findAll({
        where: { userId },
        attributes: ['itemId']
      });
      
      return favorites.map(fav => fav.itemId);
    } catch (error) {
      return [];
    }
  }
  
  // Contar favoritos de um item (quantas pessoas favoritaram)
  static async getItemFavoriteCount(itemId: string): Promise<number> {
    try {
      return await Favorite.count({
        where: { itemId }
      });
    } catch (error) {
      return 0;
    }
  }
}
```

#### 5. Endpoints da API

**`POST /api/favorites`** - Adicionar favorito
```typescript
Request Body:
{
  "userId": "user_1",
  "itemId": "item_123"
}

Response:
{
  "success": true,
  "data": {
    "id": "fav-123",
    "userId": "user_1",
    "itemId": "item_123",
    "isFavorited": true
  }
}
```

**`DELETE /api/favorites`** - Remover favorito
```typescript
Request Body:
{
  "userId": "user_1",
  "itemId": "item_123"
}

Response:
{
  "success": true,
  "message": "Favorito removido"
}
```

**`POST /api/favorites/toggle`** - Toggle favorito
```typescript
Request Body:
{
  "userId": "user_1",
  "itemId": "item_123"
}

Response:
{
  "success": true,
  "data": {
    "isFavorited": true  // ou false
  }
}
```

**`GET /api/favorites/user/:userId`** - Buscar favoritos do usuário
```typescript
Response:
{
  "success": true,
  "data": [
    { /* item completo */ },
    { /* item completo */ }
  ],
  "meta": {
    "total": 5
  }
}
```

**`GET /api/favorites/user/:userId/ids`** - IDs dos favoritos (para marcar na UI)
```typescript
Response:
{
  "success": true,
  "data": ["item_1", "item_2", "item_3"]
}
```

**`GET /api/favorites/check/:userId/:itemId`** - Verificar se está favoritado
```typescript
Response:
{
  "success": true,
  "isFavorited": true
}
```

---

### **Frontend**

#### 1. Atualizar `types.ts`

```typescript
export interface Favorite {
  id: string;
  userId: string;
  itemId: string;
  createdAt: Date;
}

// Adicionar ao User
export interface User {
  // ... campos existentes
  favorites?: Favorite[];
}

// Adicionar ao Item
export interface Item {
  // ... campos existentes
  isFavorited?: boolean;  // Para marcar na UI
  favoriteCount?: number; // Quantas pessoas favoritaram
}
```

#### 2. Componente `FavoriteButton.tsx`

```typescript
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  itemId: string;
  userId: string;
  isFavorited: boolean;
  onToggle: (itemId: string, newState: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  userId,
  isFavorited,
  onToggle,
  size = 'md',
  showLabel = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Não abrir modal ao clicar no favorito
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setFavorited(result.data.isFavorited);
        onToggle(itemId, result.data.isFavorited);
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-1.5
        px-2 py-1 rounded-lg
        transition-all duration-200
        ${favorited 
          ? 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
        }
        ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
      title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart 
        className={`${sizeClasses[size]} ${favorited ? 'fill-current' : ''}`}
      />
      {showLabel && (
        <span className="text-xs font-medium">
          {favorited ? 'Favoritado' : 'Favoritar'}
        </span>
      )}
    </button>
  );
};
```

#### 3. Hook Customizado `useFavorites.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseFavoritesReturn {
  favoriteIds: string[];
  isFavorited: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => Promise<void>;
  isLoading: boolean;
}

export const useFavorites = (userId: string): UseFavoritesReturn => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar favoritos ao montar
  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/favorites/user/${userId}/ids`);
      const result = await response.json();
      
      if (result.success) {
        setFavoriteIds(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorited = useCallback((itemId: string) => {
    return favoriteIds.includes(itemId);
  }, [favoriteIds]);

  const toggleFavorite = async (itemId: string) => {
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (result.data.isFavorited) {
          setFavoriteIds(prev => [...prev, itemId]);
        } else {
          setFavoriteIds(prev => prev.filter(id => id !== itemId));
        }
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
    }
  };

  return {
    favoriteIds,
    isFavorited,
    toggleFavorite,
    isLoading
  };
};
```

#### 4. Página "Meus Favoritos"

Adicionar nova aba no App.tsx ou criar componente separado:

```typescript
const FavoritesTab: React.FC<{ userId: string }> = ({ userId }) => {
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/favorites/user/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setFavorites(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Carregando favoritos...</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum favorito ainda
        </h3>
        <p className="text-gray-500">
          Clique no ❤️ em qualquer item para salvá-lo aqui!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        ❤️ Meus Favoritos ({favorites.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
```

#### 5. Integração no App.tsx

```typescript
// No App.tsx
const [activeTab, setActiveTab] = useState<'snippets' | 'files' | 'links' | 'favorites' | 'contacts'>('snippets');
const { favoriteIds, toggleFavorite } = useFavorites(currentUser.id);

// Adicionar botão de favorito nos cards
<FavoriteButton
  itemId={item.id}
  userId={currentUser.id}
  isFavorited={favoriteIds.includes(item.id)}
  onToggle={toggleFavorite}
  size="sm"
/>

// Nova aba
<button onClick={() => setActiveTab('favorites')}>
  ❤️ Favoritos ({favoriteIds.length})
</button>
```

---

## ✅ Critérios de Aceitação

### Backend:
- [ ] Modelo Favorite criado e testado
- [ ] Tabela `favorites` criada no banco
- [ ] 6 endpoints funcionando:
  - POST /api/favorites
  - DELETE /api/favorites
  - POST /api/favorites/toggle
  - GET /api/favorites/user/:userId
  - GET /api/favorites/user/:userId/ids
  - GET /api/favorites/check/:userId/:itemId
- [ ] Constraint UNIQUE (userId, itemId) funcionando
- [ ] Cascade delete funcionando (se deletar item ou user, remove favorito)

### Frontend:
- [ ] Componente FavoriteButton funcional
- [ ] Ícone de coração vazio/preenchido
- [ ] Click no botão toggle favorito
- [ ] Hook useFavorites funcionando
- [ ] Aba "Meus Favoritos" criada
- [ ] Listagem de favoritos funcionando
- [ ] Estado vazio com mensagem amigável
- [ ] Botão aparece em todos os cards de item

### UX:
- [ ] Visual sutil e discreto
- [ ] Animação suave ao favoritar
- [ ] Feedback visual imediato
- [ ] Não abre modal ao clicar no favorito
- [ ] Loading state enquanto processa
- [ ] Contador de favoritos (opcional)

### Performance:
- [ ] Carregar IDs dos favoritos uma vez (não a cada render)
- [ ] Toggle otimista (UI atualiza antes da resposta)
- [ ] Sem travamentos ao favoritar

---

## 🧪 Plano de Testes

### Testes Manuais:

#### Teste 1: Adicionar Favorito
1. Abrir aplicação logado
2. Ver listagem de itens
3. Clicar no ícone ❤️ de um item
4. Verificar:
   - Coração fica preenchido (vermelho)
   - Estado persiste ao recarregar página
   - Item aparece na aba "Favoritos"

#### Teste 2: Remover Favorito
1. Clicar no ❤️ de um item favoritado
2. Verificar:
   - Coração volta a ficar vazio
   - Item some da aba "Favoritos"
   - Persiste ao recarregar

#### Teste 3: Aba Meus Favoritos
1. Clicar na aba "Favoritos"
2. Ver lista de itens favoritados
3. Clicar em um item
4. Modal abre normalmente

#### Teste 4: Estado Vazio
1. Ir para aba "Favoritos" sem favoritos
2. Ver mensagem amigável
3. Mensagem tem ícone e texto claro

#### Teste 5: Múltiplos Usuários
1. Favoritar item com user1
2. Fazer logout
3. Login com user2
4. Verificar que não vê favorito do user1

#### Teste 6: Deletar Item Favoritado
1. Favoritar um item
2. Deletar o item (como admin)
3. Verificar que favorito é removido automaticamente

---

## 📦 Dependências

### NPM Packages:
- ✅ lucide-react (já instalado - ícone Heart)
- ✅ Nenhuma nova dependência necessária

### Arquivos a Criar:
- [ ] `server/models/Favorite.ts`
- [ ] `server/services/favoriteService.ts`
- [ ] `components/FavoriteButton.tsx`
- [ ] `hooks/useFavorites.ts` (criar pasta hooks/)

### Arquivos a Modificar:
- [ ] `server/models/index.ts` (adicionar associações)
- [ ] `server/index.ts` (adicionar rotas)
- [ ] `types.ts` (adicionar interface Favorite)
- [ ] `App.tsx` (integrar botão e aba)

---

## 🚀 Sequência de Implementação

### **Fase 1: Backend (2-3h)**
1. Criar modelo Favorite.ts
2. Criar tabela no banco
3. Adicionar associações
4. Criar FavoriteService.ts
5. Adicionar rotas no server/index.ts
6. Testar endpoints com curl

### **Fase 2: Frontend Básico (2-3h)**
7. Criar FavoriteButton.tsx
8. Criar useFavorites.ts hook
9. Integrar botão nos cards
10. Testar toggle no navegador

### **Fase 3: Aba Favoritos (1-2h)**
11. Criar FavoritesTab
12. Adicionar aba no menu
13. Implementar listagem
14. Estado vazio

### **Fase 4: Polish (1h)**
15. Animações
16. Loading states
17. Error handling
18. Testes finais

---

## 📝 Notas de Implementação

### Design Decisions:
- Usar ícone de ❤️ (Heart) ao invés de ⭐ (Star)
- Cor vermelha para favorito (padrão web)
- Toggle em uma chamada (POST /toggle) ao invés de duas rotas
- Carregar apenas IDs para performance (não itens completos)

### Melhorias Futuras (Fase 2):
- [ ] Coleções/Pastas de favoritos
- [ ] Notas pessoais nos favoritos
- [ ] Ordenação customizada
- [ ] Compartilhar lista de favoritos
- [ ] Exportar favoritos

---

## 🔗 Referências

- [Lucide React Icons - Heart](https://lucide.dev/icons/heart)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Optimistic UI Updates](https://www.apollographql.com/docs/react/performance/optimistic-ui/)

---

**Status:** 🚧 Em Desenvolvimento  
**Próximo Passo:** Criar modelo Favorite.ts
