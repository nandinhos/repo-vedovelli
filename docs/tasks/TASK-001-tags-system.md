# 🏷️ TASK-001: Sistema de Tags

**Sprint:** 1 - Quick Wins  
**Prioridade:** 🔴 Alta  
**Status:** ⏳ Pendente  
**Estimativa:** 6-8 horas  
**Responsável:** TBD

---

## 📋 Descrição

Implementar sistema completo de tags para categorização flexível de itens (snippets, arquivos e links). Tags permitirão organização além das categorias fixas, facilitando busca e descoberta de conteúdo relacionado.

---

## 🎯 Objetivos

- Permitir múltiplas tags por item
- Interface intuitiva para adicionar/remover tags
- Autocomplete de tags existentes
- Busca e filtro por tags
- Nuvem de tags populares
- Sugestões de tags relacionadas

---

## 📐 Especificação Técnica

### **Backend**

#### 1. Modelo de Dados

**Nova tabela: `tags`**
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_usage ON tags(usage_count DESC);
```

**Tabela de relacionamento: `item_tags`**
```sql
CREATE TABLE item_tags (
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (item_id, tag_id)
);

CREATE INDEX idx_item_tags_item ON item_tags(item_id);
CREATE INDEX idx_item_tags_tag ON item_tags(tag_id);
```

#### 2. Modelo Sequelize

**`server/models/Tag.ts`**
```typescript
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface TagAttributes {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
  createdAt?: Date;
}

export class Tag extends Model<TagAttributes> implements TagAttributes {
  public id!: string;
  public name!: string;
  public slug!: string;
  public usageCount!: number;
  public readonly createdAt!: Date;
}

Tag.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 50],
      isAlphanumeric: false // permite hífens
    }
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: 'tags',
  timestamps: true,
  updatedAt: false
});
```

#### 3. Associações no `server/models/index.ts`

```typescript
import { Item } from './Item';
import { Tag } from './Tag';

Item.belongsToMany(Tag, {
  through: 'item_tags',
  as: 'tags',
  foreignKey: 'itemId'
});

Tag.belongsToMany(Item, {
  through: 'item_tags',
  as: 'items',
  foreignKey: 'tagId'
});
```

#### 4. Endpoints da API

**`POST /api/tags`** - Criar nova tag
```typescript
Request Body:
{
  "name": "react-hooks"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "react-hooks",
    "slug": "react-hooks",
    "usageCount": 0
  }
}
```

**`GET /api/tags`** - Listar todas as tags
```typescript
Query Params:
- search: string (opcional)
- limit: number (default: 50)
- sortBy: 'name' | 'usage' (default: 'usage')

Response:
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "react", "usageCount": 45 },
    { "id": "uuid", "name": "typescript", "usageCount": 38 }
  ]
}
```

**`GET /api/tags/popular`** - Top tags mais usadas
```typescript
Query Params:
- limit: number (default: 20)

Response:
{
  "success": true,
  "data": [
    { "name": "react", "usageCount": 45 },
    { "name": "typescript", "usageCount": 38 }
  ]
}
```

**`PUT /api/items/:id/tags`** - Atualizar tags de um item
```typescript
Request Body:
{
  "tags": ["react", "hooks", "typescript"]
}

Response:
{
  "success": true,
  "data": {
    "itemId": "uuid",
    "tags": [
      { "id": "uuid", "name": "react" },
      { "id": "uuid", "name": "hooks" },
      { "id": "uuid", "name": "typescript" }
    ]
  }
}
```

**`GET /api/items/by-tag/:tagSlug`** - Buscar itens por tag
```typescript
Response:
{
  "success": true,
  "data": [
    { /* item 1 */ },
    { /* item 2 */ }
  ],
  "meta": {
    "tagName": "react",
    "totalItems": 45
  }
}
```

#### 5. Service Layer

**`server/services/tagService.ts`**
```typescript
export class TagService {
  // Criar ou buscar tag existente (helper interno)
  static async findOrCreate(name: string): Promise<Tag> {
    const slug = slugify(name.toLowerCase());
    const [tag] = await Tag.findOrCreate({
      where: { slug },
      defaults: { name, slug, usageCount: 0 }
    });
    return tag;
  }

  // Sincronizar tags de um item
  static async syncItemTags(itemId: string, tagNames: string[]): Promise<Tag[]> {
    const item = await Item.findByPk(itemId);
    if (!item) throw new Error('Item não encontrado');

    // Buscar ou criar tags
    const tags = await Promise.all(
      tagNames.map(name => this.findOrCreate(name))
    );

    // Atualizar associação
    await item.setTags(tags);

    // Atualizar contadores (incrementar novas, decrementar antigas)
    await this.updateUsageCount();

    return tags;
  }

  // Recalcular usage_count de todas as tags
  static async updateUsageCount(): Promise<void> {
    await sequelize.query(`
      UPDATE tags
      SET usage_count = (
        SELECT COUNT(*)
        FROM item_tags
        WHERE item_tags.tag_id = tags.id
      )
    `);
  }

  // Buscar tags populares
  static async getPopular(limit: number = 20): Promise<Tag[]> {
    return Tag.findAll({
      order: [['usageCount', 'DESC']],
      limit
    });
  }

  // Buscar tags com filtro
  static async search(query: string, limit: number = 50): Promise<Tag[]> {
    return Tag.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`
        }
      },
      limit,
      order: [['usageCount', 'DESC']]
    });
  }
}
```

---

### **Frontend**

#### 1. Atualizar `types.ts`

```typescript
export interface Tag {
  id: string;
  name: string;
  slug: string;
  usageCount?: number;
}

export interface Item {
  // ... campos existentes
  tags?: Tag[]; // Adicionar
}
```

#### 2. Componente `TagInput.tsx`

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { Tag } from '../types';

interface TagInputProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: Tag[];
  maxTags?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
  selectedTags,
  onChange,
  suggestions = [],
  maxTags = 10
}) => {
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar sugestões baseado no input
  useEffect(() => {
    if (input.length >= 2) {
      const filtered = suggestions.filter(tag =>
        tag.name.toLowerCase().includes(input.toLowerCase()) &&
        !selectedTags.includes(tag.name)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [input, suggestions, selectedTags]);

  const addTag = (tagName: string) => {
    const normalizedTag = tagName.trim().toLowerCase();
    
    if (
      normalizedTag &&
      !selectedTags.includes(normalizedTag) &&
      selectedTags.length < maxTags
    ) {
      onChange([...selectedTags, normalizedTag]);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  return (
    <div className="relative">
      {/* Tags selecionadas */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-blue-600 dark:hover:text-blue-300"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
        placeholder={selectedTags.length < maxTags ? "Adicionar tag..." : "Limite atingido"}
        disabled={selectedTags.length >= maxTags}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />

      {/* Sugestões */}
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag.name)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
            >
              <span>#{tag.name}</span>
              <span className="text-xs text-gray-500">
                {tag.usageCount} usos
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Pressione Enter ou vírgula para adicionar. Máximo: {maxTags} tags.
      </p>
    </div>
  );
};
```

#### 3. Componente `TagCloud.tsx`

```typescript
import React from 'react';
import { Tag } from '../types';

interface TagCloudProps {
  tags: Tag[];
  onTagClick: (tag: Tag) => void;
  maxTags?: number;
}

export const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  onTagClick,
  maxTags = 30
}) => {
  // Calcular tamanho da fonte baseado em usage
  const getFontSize = (usageCount: number, maxUsage: number): string => {
    const ratio = usageCount / maxUsage;
    if (ratio > 0.7) return 'text-2xl';
    if (ratio > 0.4) return 'text-xl';
    if (ratio > 0.2) return 'text-lg';
    return 'text-base';
  };

  const maxUsage = Math.max(...tags.map(t => t.usageCount || 0));
  const displayTags = tags.slice(0, maxTags);

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {displayTags.map(tag => (
        <button
          key={tag.id}
          onClick={() => onTagClick(tag)}
          className={`
            ${getFontSize(tag.usageCount || 0, maxUsage)}
            font-semibold text-blue-600 dark:text-blue-400
            hover:text-blue-800 dark:hover:text-blue-300
            transition-colors
          `}
          title={`${tag.usageCount} itens`}
        >
          #{tag.name}
        </button>
      ))}
    </div>
  );
};
```

#### 4. Integração no Modal de Criação/Edição

Adicionar `TagInput` aos modais existentes:

```typescript
// Em ItemModal.tsx (ou similar)
const [selectedTags, setSelectedTags] = useState<string[]>(item?.tags?.map(t => t.name) || []);

// No formulário
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">
    Tags
  </label>
  <TagInput
    selectedTags={selectedTags}
    onChange={setSelectedTags}
    suggestions={availableTags}
  />
</div>
```

#### 5. Filtro por Tags na Listagem

```typescript
// Em App.tsx ou componente principal
const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);

const filteredItems = items.filter(item => {
  if (selectedFilterTags.length === 0) return true;
  return selectedFilterTags.every(filterTag =>
    item.tags?.some(itemTag => itemTag.name === filterTag)
  );
});
```

---

## ✅ Critérios de Aceitação

### Backend:
- [ ] Modelos Tag e ItemTag criados e testados
- [ ] Endpoints CRUD de tags funcionando
- [ ] Sincronização de tags ao criar/editar item
- [ ] Contador de uso (usageCount) atualizado corretamente
- [ ] Busca de itens por tag funcionando
- [ ] Validações: nome único, limite de caracteres

### Frontend:
- [ ] Componente TagInput totalmente funcional
- [ ] Autocomplete de tags existentes
- [ ] Componente TagCloud exibindo tags populares
- [ ] Filtro por tags na listagem principal
- [ ] Tags visíveis nos cards de itens
- [ ] Modal de criação/edição integrado com tags
- [ ] Limite de 10 tags por item respeitado

### UX:
- [ ] Interface intuitiva e responsiva
- [ ] Feedback visual ao adicionar/remover tags
- [ ] Sugestões aparecem rapidamente (< 300ms)
- [ ] Tags clicáveis para filtrar conteúdo
- [ ] Dark mode funcionando

### Testes:
- [ ] Testes unitários do TagService
- [ ] Testes de integração dos endpoints
- [ ] Teste manual no navegador (aprovação do operador)

---

## 🧪 Plano de Testes

### Testes Manuais:

1. **Criar item com tags:**
   - Abrir modal de novo snippet
   - Adicionar 3-5 tags (mix de existentes e novas)
   - Verificar autocomplete funcionando
   - Salvar e verificar tags associadas

2. **Editar tags:**
   - Editar item existente
   - Adicionar 2 novas tags
   - Remover 1 tag existente
   - Salvar e verificar alterações

3. **Filtrar por tags:**
   - Clicar em tag no TagCloud
   - Verificar filtro aplicado
   - Adicionar segunda tag ao filtro
   - Limpar filtros

4. **Busca de tags:**
   - Digitar no TagInput
   - Verificar sugestões filtradas
   - Verificar contagem de uso exibida

5. **Limite de tags:**
   - Tentar adicionar 11ª tag
   - Verificar feedback de limite atingido

---

## 📦 Dependências

### NPM Packages:
```bash
# Já instaladas (provavelmente)
# Se necessário:
npm install slugify
```

### Arquivos a Modificar:
- `server/models/Tag.ts` (criar)
- `server/models/index.ts` (modificar)
- `server/services/tagService.ts` (criar)
- `server/controllers/tagController.ts` (criar)
- `server/routes/tags.ts` (criar)
- `components/TagInput.tsx` (criar)
- `components/TagCloud.tsx` (criar)
- `types.ts` (modificar)
- Modal de criação/edição de itens (modificar)
- Componente principal de listagem (modificar)

---

## 🚀 Sequência de Implementação

1. **Backend First:**
   - Criar modelos (Tag, ItemTag)
   - Criar service (TagService)
   - Criar controller e rotas
   - Testar endpoints via Postman/Insomnia

2. **Frontend Components:**
   - Criar TagInput component
   - Criar TagCloud component
   - Testar componentes isoladamente

3. **Integração:**
   - Integrar TagInput nos modais
   - Adicionar filtro por tags
   - Exibir tags nos cards

4. **Polish:**
   - Ajustes de UX/UI
   - Dark mode
   - Animações

5. **Testes & Validação:**
   - Testes automatizados
   - Teste manual completo
   - Aprovação do operador

---

## 📝 Notas de Implementação

- Tags devem ser case-insensitive (tudo lowercase)
- Slugify para URLs amigáveis
- Limite de 50 caracteres por tag
- Máximo 10 tags por item
- Autocomplete aparece após 2 caracteres digitados
- UsageCount recalculado em batch (performance)

---

## 🔗 Referências

- [Sequelize Many-to-Many](https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships)
- [React Autocomplete Pattern](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)
- [Tag Input Best Practices](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

---

**Status:** ⏳ Aguardando início  
**Última Atualização:** {{ DATA }}
