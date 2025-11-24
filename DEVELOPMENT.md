# Projeto Vedovelli Repository - Documentação Completa

## 📋 Resumo do Desenvolvimento

Este documento detalha todas as mudanças realizadas no projeto, desde a migração de dados mockados para MySQL até a dockerização completa da aplicação.

---

## 🎯 Objetivos Alcançados

### 1. Migração de Dados Mock para MySQL
- ✅ Criação de backend Node.js/Express
- ✅ Implementação de modelos Sequelize (User, Item, Comment)
- ✅ Migração de dados iniciais via script de seed
- ✅ Integração completa Frontend ↔ Backend ↔ Database

### 2. Dockerização Completa
- ✅ Container MySQL 8.0
- ✅ Container Backend (Node.js/Express)
- ✅ Container Frontend (React + Nginx)
- ✅ Container phpMyAdmin para gerenciamento do banco

### 3. Funcionalidades Implementadas
- ✅ CRUD completo de itens (snippets, files, links)
- ✅ CRUD completo de comentários
- ✅ Upload de screenshots em comentários (base64)
- ✅ Edição de perfil de usuário
- ✅ Persistência de dados no MySQL

---

## 🏗️ Arquitetura Final

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Stack                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Frontend   │  │   Backend    │  │   Database   │      │
│  │              │  │              │  │              │      │
│  │ React + Vite │  │ Node.js +    │  │  MySQL 8.0   │      │
│  │   + Nginx    │  │   Express    │  │              │      │
│  │              │  │              │  │              │      │
│  │  Port: 8080  │  │  Port: 3000  │  │  Port: 3307  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │              │
│         │    /api/*       │                 │              │
│         └────────────────►│                 │              │
│                           │                 │              │
│                           │   Sequelize     │              │
│                           └────────────────►│              │
│                                                               │
│  ┌──────────────┐                                           │
│  │ phpMyAdmin   │                                           │
│  │              │                                           │
│  │  Port: 8081  │                                           │
│  └──────────────┘                                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Estrutura de Arquivos Criados/Modificados

### Backend (`/server`)
```
server/
├── config/
│   └── database.ts          # Configuração Sequelize + MySQL
├── models/
│   ├── User.ts              # Modelo de usuários
│   ├── Item.ts              # Modelo de itens (snippets/files/links)
│   ├── Comment.ts           # Modelo de comentários
│   └── index.ts             # Associações entre modelos
├── scripts/
│   └── seed.ts              # Script de população do banco
├── index.ts                 # Servidor Express + rotas API
├── Dockerfile               # Build do backend
├── package.json             # Dependências do backend
└── tsconfig.json            # Configuração TypeScript
```

### Frontend (raiz)
```
/
├── App.tsx                  # Atualizado com chamadas API
├── Dockerfile               # Build multi-stage (React + Nginx)
├── nginx.conf               # Configuração Nginx + proxy reverso
├── docker-compose.yml       # Orquestração de todos os serviços
└── .env                     # Variáveis de ambiente
```

---

## 🗄️ Esquema do Banco de Dados

### Tabela `users`
| Campo            | Tipo         | Descrição                          |
|------------------|--------------|------------------------------------|
| id               | VARCHAR(255) | PK, ID único do usuário            |
| name             | VARCHAR(255) | Nome do usuário                    |
| email            | VARCHAR(255) | Email (único)                      |
| role             | ENUM         | ADMIN, USER, GUEST                 |
| status           | ENUM         | PENDING, APPROVED, REJECTED        |
| avatar           | VARCHAR(255) | URL do avatar                      |
| bio              | TEXT         | Biografia                          |
| isPublicProfile  | BOOLEAN      | Perfil público?                    |
| socialLinks      | JSON         | Links sociais (github, linkedin...) |

### Tabela `items`
| Campo          | Tipo         | Descrição                          |
|----------------|--------------|------------------------------------|
| id             | VARCHAR(255) | PK, auto-gerado (timestamp)        |
| type           | ENUM         | snippet, file, link                |
| title          | VARCHAR(255) | Título do item                     |
| description    | TEXT         | Descrição                          |
| category       | VARCHAR(255) | Categoria (Frontend, Backend...)   |
| authorId       | VARCHAR(255) | FK → users.id                      |
| language       | VARCHAR(255) | Linguagem (para snippets)          |
| code           | TEXT         | Código (para snippets)             |
| repository     | VARCHAR(255) | URL do repositório                 |
| fileName       | VARCHAR(255) | Nome do arquivo (para files)       |
| fileSize       | VARCHAR(255) | Tamanho do arquivo                 |
| fileExtension  | VARCHAR(255) | Extensão do arquivo                |
| downloadUrl    | VARCHAR(255) | URL de download                    |
| url            | VARCHAR(255) | URL (para links)                   |
| website        | VARCHAR(255) | Website relacionado                |
| youtube        | VARCHAR(255) | URL do YouTube                     |

### Tabela `comments`
| Campo          | Tipo         | Descrição                          |
|----------------|--------------|------------------------------------|
| id             | VARCHAR(255) | PK, auto-gerado (timestamp)        |
| itemId         | VARCHAR(255) | FK → items.id                      |
| userId         | VARCHAR(255) | FK → users.id                      |
| content        | TEXT         | Conteúdo do comentário             |
| isDeleted      | BOOLEAN      | Soft delete (moderação)            |
| deletionReason | VARCHAR(255) | Motivo da exclusão (admin)         |
| screenshotUrl  | LONGTEXT     | Screenshot em base64 (até 4GB)     |

---

## 🔌 API Endpoints

### Users
- `GET /api/users` - Lista todos os usuários
- `PUT /api/users/:id` - Atualiza perfil de usuário

### Items
- `GET /api/items` - Lista todos os itens (com autor e comentários)
- `POST /api/items` - Cria novo item
- `PUT /api/items/:id` - Atualiza item existente
- `DELETE /api/items/:id` - Deleta item

### Comments
- `POST /api/comments` - Adiciona comentário
- `PUT /api/comments/:id` - Atualiza comentário
- `DELETE /api/comments/:id` - Deleta comentário

---

## 🐛 Problemas Resolvidos

### 1. Erro: "Column 'id' cannot be null"
**Causa:** Frontend não enviava `id`, e Sequelize não gerava automaticamente.  
**Solução:** Adicionado `defaultValue: () => Date.now().toString()` nos modelos.

### 2. Erro: "Unknown column 'screenshotUrl'"
**Causa:** Banco não atualizado após adicionar campo ao modelo.  
**Solução:** Re-executado script de seed com `sync({ force: true })`.

### 3. Erro: "413 Payload Too Large"
**Causa:** Imagens base64 ultrapassavam limite padrão (100kb Express, 1MB Nginx).  
**Solução:**
- Express: `app.use(express.json({ limit: '50mb' }))`
- Nginx: `client_max_body_size 50M;`

### 4. Erro: Imagens truncadas no banco
**Causa:** Coluna `TEXT` limitada a 64KB.  
**Solução:** Alterado para `LONGTEXT` (suporta até 4GB).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Docker & Docker Compose instalados
- Portas disponíveis: 8080 (frontend), 3000 (backend), 3307 (MySQL), 8081 (phpMyAdmin)

### Comandos

#### 1. Subir todos os serviços
```bash
docker compose up -d
```

#### 2. Popular o banco de dados (primeira vez)
```bash
docker compose exec backend npm run seed
```

#### 3. Acessar a aplicação
- **Frontend**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081
  - Servidor: `db`
  - Usuário: `user`
  - Senha: `password`

#### 4. Parar os serviços
```bash
docker compose down
```

#### 5. Reconstruir após mudanças
```bash
docker compose up -d --build
```

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente (`.env`)
```env
# Database
DB_HOST=localhost
DB_USER=user
DB_PASS=password
DB_NAME=vedovelli_repo
DB_PORT=3307

# Server
PORT=3000

# Gemini API (opcional)
GEMINI_API_KEY=your_api_key_here
```

### Docker Compose
- **Rede interna**: `app-network` (bridge)
- **Volume persistente**: `db_data` (dados do MySQL)

---

## 📝 Notas Técnicas

### Frontend
- **Build**: Vite compila para `/dist`
- **Serve**: Nginx serve arquivos estáticos
- **Proxy**: `/api/*` → `http://backend:3000`
- **SPA**: `try_files` redireciona para `index.html`

### Backend
- **Build**: TypeScript → JavaScript (`/dist`)
- **Runtime**: Node.js executa `dist/index.js`
- **ORM**: Sequelize com dialect MySQL
- **CORS**: Habilitado para desenvolvimento

### Database
- **Charset**: utf8mb4 (suporta emojis)
- **Collation**: utf8mb4_unicode_ci
- **Timezone**: UTC

---

## 🎨 Funcionalidades do Frontend

### Autenticação (Mock)
- Login como Admin ou User
- Controle de permissões por role

### Gestão de Itens
- Adicionar snippets (código)
- Adicionar files (arquivos)
- Adicionar links (URLs)
- Editar/Deletar próprios itens
- Admin pode deletar qualquer item

### Comentários
- Adicionar texto
- Adicionar código (syntax highlighting)
- Anexar screenshot (base64)
- Adicionar URL de imagem
- Editar/Deletar próprios comentários
- Admin pode moderar (soft delete)

### Perfil
- Editar avatar
- Editar bio
- Adicionar links sociais
- Tornar perfil público/privado

---

## 🔄 Próximos Passos Sugeridos

1. **Autenticação Real**
   - Implementar JWT
   - Hash de senhas (bcrypt)
   - Refresh tokens

2. **Upload de Arquivos**
   - Usar storage (S3, Cloudinary)
   - Evitar base64 para imagens grandes

3. **Validação**
   - Validação de entrada no backend (Joi, Zod)
   - Sanitização de dados

4. **Testes**
   - Testes unitários (Jest)
   - Testes de integração (Supertest)

5. **Performance**
   - Paginação de itens
   - Cache (Redis)
   - Compressão de imagens

6. **Deploy**
   - CI/CD (GitHub Actions)
   - Hosting (Vercel, Railway, AWS)

---

## 📚 Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Lucide Icons

### Backend
- Node.js 18
- Express
- TypeScript
- Sequelize ORM
- MySQL2

### DevOps
- Docker
- Docker Compose
- Nginx
- phpMyAdmin

---

## 🤝 Contribuindo

Para continuar o desenvolvimento em outro computador:

1. Clone o repositório
2. Execute `docker compose up -d`
3. Execute `docker compose exec backend npm run seed`
4. Acesse http://localhost:8080

**Importante:** Os dados do banco são persistidos no volume Docker `db_data`. Para resetar, execute:
```bash
docker compose down -v
docker compose up -d
docker compose exec backend npm run seed
```

---

## 📄 Licença

Este projeto é de uso educacional.

---

**Última atualização:** 24/11/2025 02:56 BRT
