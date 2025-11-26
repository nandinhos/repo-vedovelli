# 🚀 Guia de Teste - Sistema de Autenticação

Este guia mostra como testar todas as funcionalidades de autenticação e autorização implementadas.

## 📋 Pré-requisitos

1. **Banco de dados MySQL rodando** (via Docker ou local)
2. **Arquivo .env configurado**
3. **Dependências instaladas**

## 🔧 Configuração Inicial

### 1. Configurar variáveis de ambiente

```bash
# Copiar template
cp .env.example .env

# Editar .env com suas configurações
nano .env  # ou seu editor preferido
```

**Configurações mínimas no .env:**
```env
DB_NAME=vedovelli_repo
DB_USER=root
DB_PASS=password
DB_HOST=localhost
DB_PORT=3306

JWT_SECRET=minha-chave-super-secreta-mudar-em-producao

API_KEY=your-gemini-api-key-here
PORT=3000
```

### 2. Instalar dependências

```bash
# Raiz do projeto
npm install

# Backend (se necessário)
cd server && npm install && cd ..
```

### 3. Iniciar banco de dados (Docker)

```bash
docker-compose up -d
```

Ou se já tem MySQL local, certifique-se que está rodando.

### 4. Criar superadmin inicial

**IMPORTANTE**: Você precisa criar sua conta de SUPERADMIN manualmente no banco de dados:

```sql
-- Conectar ao MySQL
mysql -u root -p

USE vedovelli_repo;

-- Criar SUPERADMIN (senha: admin123)
INSERT INTO users (
    id,
    name,
    email,
    password,
    role,
    status,
    avatar,
    createdAt,
    updatedAt
) VALUES (
    'superadmin_1',
    'Seu Nome',
    'seu@email.com',
    '$2b$10$rKvK1YIf5PX/5zK5qK5qKOqK5qK5qK5qK5qK5qK5qK5qK5qK5qK5q', -- senha: admin123
    'SUPERADMIN',
    'APPROVED',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    NOW(),
    NOW()
);
```

**Nota**: O hash acima é da senha `admin123`. Em produção, use uma senha forte!

## 🧪 Testes das APIs

### Teste 1: Registrar Novo Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "bio": "Desenvolvedor Frontend"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Cadastro realizado com sucesso! Aguarde aprovação do administrador.",
  "user": {
    "id": "user_...",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "GUEST",
    "status": "PENDING",
    ...
  }
}
```

### Teste 2: Login com SUPERADMIN

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "admin123"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "superadmin_1",
    "name": "Seu Nome",
    "role": "SUPERADMIN",
    "status": "APPROVED",
    ...
  }
}
```

**🔑 IMPORTANTE**: Copie o `token` retornado! Você vai usar nas próximas requisições.

### Teste 3: Listar Usuários Pendentes

```bash
# Substitua YOUR_TOKEN pelo token obtido no login
curl -X GET http://localhost:3000/api/admin/users/pending \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Teste 4: Aprovar Usuário

```bash
# Substitua USER_ID pelo ID do usuário que você registrou
curl -X PUT http://localhost:3000/api/admin/users/USER_ID/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Resposta esperada:**
```json
{
  "message": "Usuário aprovado com sucesso",
  "user": {
    "status": "APPROVED",
    "role": "USER",
    ...
  }
}
```

### Teste 5: Login com Usuário Aprovado

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Teste 6: Criar Item (Usuário Autenticado)

```bash
# Use o token do usuário aprovado
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "snippet",
    "title": "Meu primeiro snippet",
    "description": "Um exemplo de código",
    "category": "Frontend",
    "authorId": "USER_ID",
    "authorName": "João Silva",
    "language": "javascript",
    "code": "console.log(\"Hello World\");"
  }'
```

### Teste 7: Verificar Dados do Usuário Logado

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Teste 8: Promover Usuário para MODERATOR

```bash
curl -X PUT http://localhost:3000/api/admin/users/USER_ID/role \
  -H "Authorization: Bearer SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "MODERATOR"
  }'
```

### Teste 9: Estatísticas do Sistema

```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer SUPERADMIN_TOKEN"
```

**Resposta esperada:**
```json
{
  "stats": {
    "total": 2,
    "byStatus": {
      "pending": 0,
      "approved": 2,
      "rejected": 0
    },
    "byRole": {
      "superadmin": 1,
      "moderator": 0,
      "user": 1,
      "guest": 0
    }
  }
}
```

## ✅ Checklist de Validação

### Autenticação
- [ ] Registro de usuário funciona
- [ ] Login com credenciais corretas funciona
- [ ] Login com senha errada retorna erro 401
- [ ] Login com usuário PENDING retorna erro 403
- [ ] Token JWT é gerado corretamente
- [ ] Endpoint `/api/auth/me` retorna dados do usuário

### Autorização
- [ ] SUPERADMIN consegue acessar `/api/admin/*`
- [ ] USER comum NÃO consegue acessar `/api/admin/users`
- [ ] Apenas SUPERADMIN pode alterar roles
- [ ] MODERATOR pode aprovar usuários pendentes
- [ ] Usuário não aprovado NÃO pode criar items

### Segurança
- [ ] Senhas não aparecem nas respostas da API
- [ ] Token inválido retorna erro 401
- [ ] Não é possível alterar o próprio role
- [ ] Validação de email funciona no registro

### Banco de Dados
- [ ] Usuários são salvos corretamente
- [ ] Password é salvo como hash
- [ ] Timestamps (createdAt/updatedAt) são gerados

## 🐛 Troubleshooting

### Erro: "Failed to connect to database"
```bash
# Verificar se MySQL está rodando
docker-compose ps

# Ver logs do container
docker-compose logs mysql

# Testar conexão manual
mysql -h localhost -u root -p
```

### Erro: "Token inválido"
- Verifique se está usando `Bearer TOKEN` no header
- Token expira em 7 dias, faça login novamente

### Erro: "Email já cadastrado"
- Use um email diferente ou delete o usuário do banco:
```sql
DELETE FROM users WHERE email = 'email@example.com';
```

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## 📊 Verificar no Banco de Dados

```sql
-- Listar todos os usuários
SELECT id, name, email, role, status FROM users;

-- Ver usuários pendentes
SELECT * FROM users WHERE status = 'PENDING';

-- Contar por role
SELECT role, COUNT(*) as total FROM users GROUP BY role;

-- Ver último usuário criado
SELECT * FROM users ORDER BY createdAt DESC LIMIT 1;
```

## 🎯 Próximos Passos

Após validar que o backend está funcionando:

1. **Testar no Postman** - Importe as requisições acima
2. **Criar testes automatizados** - Adicionar aos testes existentes
3. **Implementar frontend** - Páginas de login/registro
4. **Criar painel admin** - Interface para gerenciar usuários

## 📝 Notas Importantes

- **JWT_SECRET**: Mude para valor forte em produção
- **Primeiro usuário**: Deve ser criado manualmente como SUPERADMIN
- **Aprovação**: Novos usuários começam como GUEST/PENDING
- **Tokens**: Salvos no localStorage no frontend (quando implementado)
