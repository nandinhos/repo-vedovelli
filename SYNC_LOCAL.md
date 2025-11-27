# 🔄 Como Sincronizar o Código no Seu Computador

## 📍 Branch Atual
Nome da branch: `claude/testing-midurj5wr4vc1y6a-01TH9dhXUf9sw8FuV77x6Nyr`

## 🚀 Passo a Passo para Testar Localmente

### 1️⃣ Clone ou Atualize o Repositório

#### Se você ainda NÃO clonou o repositório:

```bash
# Clone o repositório
git clone https://github.com/nandinhos/repo-vedovelli.git
cd repo-vedovelli

# Baixe a branch de desenvolvimento
git fetch origin
git checkout claude/testing-midurj5wr4vc1y6a-01TH9dhXUf9sw8FuV77x6Nyr
```

#### Se você JÁ tem o repositório clonado:

```bash
# Entre na pasta do projeto
cd repo-vedovelli

# Baixe as atualizações
git fetch origin

# Mude para a branch correta
git checkout claude/testing-midurj5wr4vc1y6a-01TH9dhXUf9sw8FuV77x6Nyr

# Puxe as últimas alterações
git pull origin claude/testing-midurj5wr4vc1y6a-01TH9dhXUf9sw8FuV77x6Nyr
```

### 2️⃣ Instale as Dependências

```bash
# Instalar dependências do projeto
npm install

# Verificar se instalou tudo
npm list jsonwebtoken bcrypt express-validator
```

### 3️⃣ Configure o Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações (use seu editor preferido)
nano .env
# ou
code .env
# ou
vim .env
```

**Configure estas variáveis no `.env`:**

```env
# Banco de Dados
DB_NAME=vedovelli_repo
DB_USER=root
DB_PASS=sua_senha_mysql
DB_HOST=localhost
DB_PORT=3306

# JWT (MUITO IMPORTANTE - use uma chave forte!)
JWT_SECRET=troque-por-uma-chave-super-secreta-e-aleatoria

# Gemini AI (opcional para testes)
API_KEY=sua-chave-gemini

# Porta do servidor
PORT=3000
```

### 4️⃣ Suba o Banco de Dados

#### Opção A: Com Docker (Recomendado)

```bash
# Inicie o MySQL via Docker
docker-compose up -d

# Verifique se está rodando
docker-compose ps

# Ver logs (se necessário)
docker-compose logs -f mysql
```

#### Opção B: MySQL Local

```bash
# Conecte ao MySQL
mysql -u root -p

# Crie o banco de dados
CREATE DATABASE IF NOT EXISTS vedovelli_repo;

# Verifique
SHOW DATABASES;

# Saia
exit
```

### 5️⃣ Crie o SUPERADMIN

```bash
# Execute o script SQL
mysql -u root -p vedovelli_repo < create-superadmin.sql

# Verifique se foi criado
mysql -u root -p -e "SELECT id, name, email, role, status FROM vedovelli_repo.users;"
```

**Suas credenciais de SUPERADMIN:**
- Email: `admin@example.com`
- Senha: `admin123`

**⚠️ IMPORTANTE**: Mude essas credenciais depois!

### 6️⃣ Inicie o Servidor Backend

```bash
# Opção 1: Modo desenvolvimento (recomendado)
npm run dev

# Opção 2: Modo produção
npm start

# Opção 3: Com nodemon (se tiver instalado)
npx nodemon server/index.ts
```

**Você deve ver:**
```
Database connection has been established successfully.
Server is running on port 3000
```

### 7️⃣ Teste a API

#### Teste Rápido - Login

Abra outro terminal e execute:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "superadmin_001",
    "name": "Administrador",
    "email": "admin@example.com",
    "role": "SUPERADMIN",
    "status": "APPROVED"
  }
}
```

#### Teste Completo Automatizado

```bash
# Dê permissão ao script
chmod +x test-auth.sh

# Execute os testes
./test-auth.sh
```

### 8️⃣ Abra na sua IDE

#### VS Code
```bash
code .
```

#### IntelliJ/WebStorm
```bash
# Abra a pasta do projeto na IDE
# File -> Open -> Selecione a pasta repo-vedovelli
```

---

## 📁 Estrutura do Projeto

Após sincronizar, você terá:

```
repo-vedovelli/
├── server/
│   ├── config/
│   │   └── database.ts
│   ├── middleware/
│   │   └── auth.ts           ← Autenticação
│   ├── models/
│   │   ├── User.ts           ← Model atualizado
│   │   ├── Item.ts
│   │   └── Comment.ts
│   ├── routes/
│   │   ├── auth.ts           ← Rotas de login/register
│   │   └── admin.ts          ← Rotas de admin
│   ├── utils/
│   │   └── auth.ts           ← JWT + bcrypt
│   └── index.ts              ← Servidor principal
├── tests/                     ← 86 testes implementados
├── .env.example
├── .env                       ← Você vai criar
├── create-superadmin.sql
├── test-auth.sh
├── QUICK_START.md
├── TESTING_AUTH.md
└── package.json
```

---

## 🔧 Testando na IDE

### 1. Abrir Terminal Integrado

**VS Code**: `` Ctrl + ` `` ou `Terminal -> New Terminal`

### 2. Executar o Servidor

```bash
npm run dev
```

### 3. Testar com REST Client

#### Instale a extensão "REST Client" no VS Code

Crie arquivo `api-tests.http`:

```http
### Login SUPERADMIN
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

### Registrar novo usuário
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "bio": "Desenvolvedor"
}

### Ver meus dados (use o token do login)
GET http://localhost:3000/api/auth/me
Authorization: Bearer SEU_TOKEN_AQUI

### Listar usuários pendentes
GET http://localhost:3000/api/admin/users/pending
Authorization: Bearer SEU_TOKEN_AQUI
```

Clique em "Send Request" acima de cada requisição!

---

## 🐛 Resolução de Problemas

### "Branch não encontrada"

```bash
# Listar todas as branches remotas
git branch -r

# A branch deve aparecer como:
# origin/claude/testing-midurj5wr4vc1y6a-01TH9dhXUf9sw8FuV77x6Nyr

# Se não aparecer, force o fetch
git fetch origin --prune
git checkout -b claude/testing-midurj5wr4vc1y6a-01TH9dhXUf9sw8FuV77x6Nyr origin/claude/testing-midurj5wr4vc1y6a-01TH9dhXUf9sw8FuV77x6Nyr
```

### "Cannot find module"

```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### "Database connection failed"

```bash
# Verificar se MySQL está rodando
# Com Docker:
docker-compose ps

# Local:
sudo systemctl status mysql

# Testar conexão
mysql -h localhost -u root -p -e "SELECT 1;"
```

### "Port 3000 already in use"

```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou mudar porta no .env
PORT=3001
```

### "Table doesn't exist"

```bash
# O Sequelize cria automaticamente na primeira vez
# Apenas certifique-se que o banco existe:
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS vedovelli_repo;"

# Depois inicie o servidor
npm run dev
```

---

## ✅ Validar que Está Tudo Funcionando

Execute esta checklist:

```bash
# 1. Banco rodando?
docker-compose ps
# ou
mysql -u root -p -e "SELECT 1;"

# 2. Superadmin criado?
mysql -u root -p -e "SELECT id, name, email, role FROM vedovelli_repo.users;"

# 3. Servidor iniciando?
npm run dev
# Deve mostrar: "Server is running on port 3000"

# 4. Login funcionando?
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 5. Testes passando?
./test-auth.sh
```

---

## 🎯 Próximos Passos Após Sincronizar

1. ✅ Validar que tudo está funcionando
2. 🔧 Testar as APIs com Postman ou REST Client
3. 📝 Criar alguns usuários de teste
4. 🎨 Aguardar implementação do frontend
5. 🚀 Deploy (quando pronto)

---

## 📞 Checklist Final

Antes de começar a desenvolver, certifique-se:

- [ ] Branch correta baixada
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env` configurado
- [ ] MySQL rodando
- [ ] SUPERADMIN criado
- [ ] Servidor iniciando sem erros
- [ ] Login retornando token
- [ ] Testes passando

---

**Tudo certo? Agora você pode:**
1. Testar todas as APIs de autenticação
2. Criar usuários e aprovar/rejeitar
3. Desenvolver/testar localmente
4. Pedir para implementar o frontend! 🎨

**Dúvidas?** Veja `TESTING_AUTH.md` para mais detalhes.
