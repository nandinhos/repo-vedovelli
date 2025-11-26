# 🚀 Quick Start - Sistema de Autenticação

Guia rápido para testar o sistema em **5 minutos**.

## ⚡ Passo a Passo

### 1. Configurar ambiente

```bash
# Copiar arquivo de configuração
cp .env.example .env

# Editar .env (mude DB_PASS se necessário)
nano .env
```

### 2. Subir banco de dados

```bash
# Com Docker
docker-compose up -d

# OU com MySQL local, certifique-se que está rodando
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS vedovelli_repo;"
```

### 3. Criar tabelas

```bash
# O Sequelize cria automaticamente na primeira execução
# Se precisar criar manualmente:
mysql -u root -p vedovelli_repo < schema.sql  # se você tiver
```

### 4. Criar SUPERADMIN

```bash
# Executar script SQL
mysql -u root -p vedovelli_repo < create-superadmin.sql

# Verificar
mysql -u root -p -e "SELECT id, name, email, role FROM vedovelli_repo.users;"
```

**Credenciais padrão:**
- Email: `admin@example.com`
- Senha: `admin123`

### 5. Instalar dependências

```bash
npm install
```

### 6. Iniciar servidor

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend (se implementado)
cd client && npm run dev
```

### 7. Testar APIs

**Opção A: Script automatizado**
```bash
./test-auth.sh
```

**Opção B: Manual com cURL**
```bash
# 1. Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 2. Copie o token da resposta

# 3. Registrar novo usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@test.com","password":"senha123"}'

# 4. Listar pendentes (use seu token)
curl http://localhost:3000/api/admin/users/pending \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 5. Aprovar usuário (substitua USER_ID)
curl -X PUT http://localhost:3000/api/admin/users/USER_ID/approve \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Opção C: Postman**
1. Importe `postman-collection.json`
2. Execute as requisições em ordem
3. Substitua os tokens conforme necessário

## ✅ Validação

Tudo funcionando se:

- ✅ Login retorna token
- ✅ `/api/auth/me` retorna seus dados
- ✅ Consegue registrar novo usuário
- ✅ Usuário aparece em `/api/admin/users/pending`
- ✅ Consegue aprovar usuário
- ✅ Usuário aprovado consegue fazer login

## 🐛 Problemas Comuns

### "Cannot connect to database"
```bash
# Verificar MySQL
docker-compose ps
# ou
systemctl status mysql
```

### "Table doesn't exist"
```bash
# Sequelize cria automaticamente ao iniciar servidor
# Se não funcionar, crie manualmente:
mysql -u root -p vedovelli_repo < create-tables.sql
```

### "Token inválido"
- Verifique se copiou o token completo
- Token expira em 7 dias
- Use formato: `Bearer seu-token-aqui`

### "Port 3000 already in use"
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# OU mudar porta no .env
PORT=3001
```

## 📚 Próximos Passos

1. ✅ Validar backend funcionando
2. 🔲 Implementar frontend (login/register)
3. 🔲 Criar painel de administração
4. 🔲 Adicionar testes automatizados
5. 🔲 Deploy em produção

## 🔗 Links Úteis

- [Documentação completa](./TESTING_AUTH.md)
- [Guia de API](./API_DOCS.md) (criar se necessário)
- [Troubleshooting](./TESTING_AUTH.md#troubleshooting)

---

**Precisa de ajuda?** Veja o arquivo `TESTING_AUTH.md` para instruções detalhadas.
