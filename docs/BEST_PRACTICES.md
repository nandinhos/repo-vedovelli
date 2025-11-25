# 🏆 Melhores Práticas de Desenvolvimento - Repositório Vedovelli

> Guia de padrões, convenções e boas práticas para garantir qualidade e consistência do código.

---

## 📋 Índice

1. [Estrutura de Código](#estrutura-de-código)
2. [TypeScript](#typescript)
3. [React & Componentes](#react--componentes)
4. [Backend & API](#backend--api)
5. [Banco de Dados](#banco-de-dados)
6. [Estilização (Tailwind CSS)](#estilização-tailwind-css)
7. [Testes](#testes)
8. [Git & Commits](#git--commits)
9. [Segurança](#segurança)
10. [Performance](#performance)

---

## 🏗️ Estrutura de Código

### **Organização de Pastas**

```
/
├── components/          # Componentes React reutilizáveis
├── services/           # Integrações externas (API, Gemini, etc)
├── docs/               # Documentação do projeto
│   ├── tasks/         # Tasks detalhadas por sprint
│   ├── PRD.md
│   ├── FUNCIONALIDADES.md
│   └── ...
├── server/             # Backend Node.js
│   ├── models/        # Modelos Sequelize
│   ├── controllers/   # Controladores da API
│   ├── routes/        # Rotas Express
│   └── middleware/    # Middlewares customizados
└── types.ts           # Tipos TypeScript compartilhados
```

### **Nomenclatura de Arquivos**

✅ **Componentes React:** PascalCase
```
CodeBlock.tsx
UserProfileModal.tsx
ItemDetail.tsx
```

✅ **Services/Utils:** camelCase
```
geminiService.ts
authService.ts
validation.ts
```

✅ **Componentes de Pasta:** index.ts para exports
```typescript
// components/index.ts
export { CodeBlock } from './CodeBlock';
export { UserProfileModal } from './UserProfileModal';
```

---

## 📘 TypeScript

### **Tipos e Interfaces**

✅ **Sempre tipar explicitamente:**
```typescript
// ❌ Evitar
function createUser(data: any) { ... }

// ✅ Correto
interface CreateUserDTO {
  name: string;
  email: string;
  role: UserRole;
}

function createUser(data: CreateUserDTO): Promise<User> { ... }
```

✅ **Usar Enums para valores fixos:**
```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

enum ItemType {
  SNIPPET = 'SNIPPET',
  FILE = 'FILE',
  LINK = 'LINK'
}
```

✅ **Evitar `any` - usar `unknown` quando necessário:**
```typescript
// ❌ Evitar
const data: any = fetchData();

// ✅ Correto
const data: unknown = fetchData();
if (isValidData(data)) {
  // Type narrowing
  processData(data);
}
```

### **Type Guards**

```typescript
function isSnippet(item: Item): item is Snippet {
  return item.type === ItemType.SNIPPET;
}

// Uso
if (isSnippet(item)) {
  // TypeScript sabe que item é Snippet aqui
  console.log(item.language);
}
```

---

## ⚛️ React & Componentes

### **Estrutura de Componente**

```typescript
import React, { useState, useEffect } from 'react';

interface ComponentProps {
  title: string;
  onSave: (data: FormData) => void;
  isLoading?: boolean; // Props opcionais com ?
}

export const MyComponent: React.FC<ComponentProps> = ({
  title,
  onSave,
  isLoading = false // Default value
}) => {
  // 1. Hooks no topo
  const [data, setData] = useState<FormData | null>(null);
  
  // 2. Effects
  useEffect(() => {
    // Logic here
  }, []);
  
  // 3. Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data) onSave(data);
  };
  
  // 4. Early returns
  if (isLoading) return <LoadingSpinner />;
  
  // 5. Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};
```

### **Custom Hooks**

```typescript
// hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### **Props Composition**

✅ **Evitar prop drilling - usar Context quando necessário:**
```typescript
// ThemeContext.tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

---

## 🔌 Backend & API

### **Estrutura de Controlador**

```typescript
// controllers/itemController.ts
import { Request, Response } from 'express';
import { ItemService } from '../services/itemService';

export class ItemController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validar entrada
      const validatedData = validateItemInput(req.body);
      
      // 2. Lógica de negócio
      const item = await ItemService.create(validatedData);
      
      // 3. Resposta
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      // 4. Tratamento de erro
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}
```

### **Padrão de Response**

✅ **Sempre retornar formato consistente:**
```typescript
// ✅ Sucesso
{
  "success": true,
  "data": { /* payload */ },
  "meta": { /* paginação, etc */ }
}

// ✅ Erro
{
  "success": false,
  "error": {
    "message": "Descrição do erro",
    "code": "ERROR_CODE",
    "details": { /* opcional */ }
  }
}
```

### **Middleware Pattern**

```typescript
// middleware/auth.ts
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Token não fornecido');
    
    const user = await verifyToken(token);
    req.user = user; // Adicionar tipo customizado ao Request
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Não autorizado' });
  }
};
```

---

## 🗄️ Banco de Dados

### **Modelos Sequelize**

```typescript
// models/Item.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Item extends Model {
  public id!: string;
  public title!: string;
  public type!: ItemType;
  
  // Timestamps automáticos
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Item.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  }
  // ... outros campos
}, {
  sequelize,
  tableName: 'items',
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['category'] }
  ]
});
```

### **Migrations vs Sync**

✅ **Em produção: SEMPRE usar migrations**
```typescript
// migrations/20240101-create-items.ts
export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('items', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    // ...
  });
}
```

❌ **Nunca usar `sync({ force: true })` em produção**

---

## 🎨 Estilização (Tailwind CSS)

### **Convenções de Classes**

✅ **Ordem consistente:**
```jsx
// Layout → Display → Positioning → Spacing → Sizing → Typography → Visual
<div className="
  flex flex-col items-center justify-between
  relative z-10
  p-4 m-2 gap-4
  w-full max-w-2xl h-auto
  text-lg font-semibold text-gray-800
  bg-white rounded-lg shadow-md border border-gray-200
  hover:shadow-lg transition-all duration-200
">
```

### **Componentes Reutilizáveis**

```typescript
// Use classes dinâmicas com cuidado
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white'
};

<button className={`px-4 py-2 rounded ${buttonVariants[variant]}`}>
  {children}
</button>
```

### **Dark Mode**

```typescript
// Sempre preparar para dark mode
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
```

---

## 🧪 Testes

### **Estrutura de Teste**

```typescript
// __tests__/ItemService.test.ts
describe('ItemService', () => {
  describe('create', () => {
    it('deve criar um snippet com sucesso', async () => {
      // Arrange
      const data = { title: 'Test', type: 'SNIPPET' };
      
      // Act
      const result = await ItemService.create(data);
      
      // Assert
      expect(result.id).toBeDefined();
      expect(result.title).toBe('Test');
    });
    
    it('deve lançar erro se título estiver vazio', async () => {
      // Arrange
      const data = { title: '', type: 'SNIPPET' };
      
      // Act & Assert
      await expect(ItemService.create(data)).rejects.toThrow();
    });
  });
});
```

### **Mocking**

```typescript
// Mock de módulo
jest.mock('../services/geminiService');

// Mock de função
const mockFetch = jest.fn();
global.fetch = mockFetch;
```

---

## 🔀 Git & Commits

### **Mensagens de Commit (Conventional Commits)**

```
feat(sprint-1): adiciona sistema de tags aos items

- Cria modelo Tag no backend
- Adiciona relação many-to-many entre Item e Tag
- Implementa componente TagInput no frontend
- Adiciona filtro por tags na busca

Closes #TASK-001
```

**Tipos de commit:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

### **Branching Strategy**

```
main (produção estável)
  ├── develop (integração)
      ├── sprint-1/tags-system
      ├── sprint-1/favorites
      └── sprint-1/dark-mode
```

### **Pull Request Template**

```markdown
## Descrição
Breve descrição da mudança

## Tipo de Mudança
- [ ] Nova feature
- [ ] Bug fix
- [ ] Refatoração
- [ ] Documentação

## Checklist
- [ ] Código testado manualmente
- [ ] Testes automatizados passando
- [ ] Documentação atualizada
- [ ] Sem warnings no console

## Screenshots (se aplicável)
```

---

## 🔒 Segurança

### **Validação de Input**

✅ **Sempre validar dados do usuário:**
```typescript
import validator from 'validator';

function validateEmail(email: string): boolean {
  return validator.isEmail(email);
}

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
```

### **Prevenção de XSS**

```typescript
// ❌ Perigoso
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Seguro
<div>{sanitizedInput}</div>

// Para código: usar biblioteca específica
<SyntaxHighlighter language="javascript">
  {codeContent}
</SyntaxHighlighter>
```

### **Variáveis de Ambiente**

```typescript
// ✅ Nunca commitar .env
// ✅ Usar validação de env vars
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Variável ${key} não definida`);
  }
});
```

---

## ⚡ Performance

### **React Performance**

```typescript
// ✅ Memoização
const MemoizedComponent = React.memo(ExpensiveComponent);

// ✅ useMemo para cálculos pesados
const sortedItems = useMemo(
  () => items.sort((a, b) => a.title.localeCompare(b.title)),
  [items]
);

// ✅ useCallback para funções
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### **Lazy Loading**

```typescript
// Code splitting
const ItemDetail = React.lazy(() => import('./ItemDetail'));

// Uso
<Suspense fallback={<Loading />}>
  <ItemDetail />
</Suspense>
```

### **Database Queries**

```typescript
// ✅ Usar includes para evitar N+1
const items = await Item.findAll({
  include: [
    { model: User, as: 'author' },
    { model: Comment }
  ]
});

// ✅ Paginação
const items = await Item.findAll({
  limit: 20,
  offset: page * 20
});
```

---

## 📚 Recursos Adicionais

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)
- [Tailwind Best Practices](https://tailwindcss.com/docs/reusing-styles)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Última Atualização:** {{ DATA_ATUAL }}
**Este documento deve ser atualizado conforme o projeto evolui**
