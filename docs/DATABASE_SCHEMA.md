# Esquema de Banco de Dados (Sugestão SQL)

Este esquema foi desenhado pensando em um banco de dados relacional (como PostgreSQL ou MySQL) para persistir os dados que atualmente são mockados no frontend.

## Tabela: `users`
Armazena os dados de autenticação e perfil dos usuários.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Not Null | Identificador único do usuário. |
| `name` | VARCHAR(255) | Not Null | Nome completo. |
| `email` | VARCHAR(255) | Unique, Not Null | Email de login. |
| `password_hash` | VARCHAR(255) | Not Null | Hash da senha (ex: bcrypt). |
| `role` | ENUM | Default 'USER' | 'ADMIN', 'USER'. |
| `status` | ENUM | Default 'PENDING'| 'PENDING', 'APPROVED', 'REJECTED'. |
| `avatar_url` | TEXT | Nullable | URL da imagem de perfil. |
| `bio` | VARCHAR(150) | Nullable | Cargo ou descrição curta. |
| `is_public_profile` | BOOLEAN | Default FALSE | Se aparece na lista de contatos. |
| `github_url` | VARCHAR(255) | Nullable | Link perfil GitHub. |
| `linkedin_url` | VARCHAR(255) | Nullable | Link perfil LinkedIn. |
| `instagram_url` | VARCHAR(255) | Nullable | Link perfil Instagram. |
| `whatsapp` | VARCHAR(20) | Nullable | Número de WhatsApp. |
| `created_at` | TIMESTAMP | Default NOW() | Data de cadastro. |

## Tabela: `items`
Armazena todos os tipos de conteúdo (Snippets, Arquivos, Links). Utiliza uma coluna `type` para diferenciar e campos anuláveis para dados específicos.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Not Null | Identificador único do item. |
| `author_id` | UUID | FK -> users.id | Quem criou o item. |
| `type` | ENUM | Not Null | 'SNIPPET', 'FILE', 'LINK'. |
| `category` | VARCHAR(50) | Not Null | Categoria (Frontend, Backend, etc). |
| `title` | VARCHAR(255) | Not Null | Título do item. |
| `description` | TEXT | Not Null | Descrição detalhada. |
| `repository_url` | VARCHAR(255) | Nullable | Link opcional para GitHub. |
| `website_url` | VARCHAR(255) | Nullable | Link opcional para demo/site. |
| `youtube_url` | VARCHAR(255) | Nullable | Link opcional para vídeo. |
| `created_at` | TIMESTAMP | Default NOW() | Data de publicação. |
| `updated_at` | TIMESTAMP | Default NOW() | Data de atualização. |
| **Campos Específicos Snippet** | | | |
| `language` | VARCHAR(50) | Nullable | Linguagem (js, php, python). |
| `code_content` | TEXT | Nullable | O código em si. |
| **Campos Específicos Arquivo** | | | |
| `file_url` | TEXT | Nullable | URL do arquivo (S3/Blob storage). |
| `file_name` | VARCHAR(255) | Nullable | Nome original do arquivo. |
| `file_size` | VARCHAR(20) | Nullable | Tamanho formatado (ex: 2MB). |
| `file_extension` | VARCHAR(10) | Nullable | Extensão (pdf, zip). |
| **Campos Específicos Link** | | | |
| `external_url` | TEXT | Nullable | A URL principal do recurso. |

## Tabela: `comments`
Armazena as interações e soluções propostas nos itens.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Not Null | Identificador do comentário. |
| `item_id` | UUID | FK -> items.id | Item ao qual pertence. |
| `user_id` | UUID | FK -> users.id | Autor do comentário. |
| `content` | TEXT | Not Null | Texto do comentário (pode conter markdown). |
| `screenshot_url` | TEXT | Nullable | URL da imagem anexada. |
| `is_deleted` | BOOLEAN | Default FALSE | Soft delete para moderação. |
| `deletion_reason` | VARCHAR(255) | Nullable | Motivo da exclusão (se houver). |
| `created_at` | TIMESTAMP | Default NOW() | Data da postagem. |
| `updated_at` | TIMESTAMP | Default NOW() | Data da última edição. |

## Índices Sugeridos
1.  `idx_items_category`: Para filtrar rapidamente por categoria.
2.  `idx_items_type`: Para filtrar pelas abas (Snippets, Files, Links).
3.  `idx_items_search`: Índice Full-text (GIN no Postgres) em `title` e `description` para a barra de busca.
4.  `idx_users_public`: `WHERE is_public_profile = true` (Para a aba de Contatos).
