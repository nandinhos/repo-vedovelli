# Vedovelli Repository - Sistema de Compartilhamento de Código

Sistema completo de gerenciamento de snippets, arquivos e links com autenticação, comentários e moderação.

## 🚀 Quick Start

### Pré-requisitos
- Docker & Docker Compose

### Executar o Projeto

```bash
# 1. Subir todos os serviços
docker compose up -d

# 2. Popular o banco de dados (primeira vez)
docker compose exec backend npm run seed

# 3. Acessar a aplicação
# Frontend: http://localhost:8080
# phpMyAdmin: http://localhost:8081 (user: user, senha: password)
```

## 📚 Documentação Completa

Para documentação detalhada sobre arquitetura, API, banco de dados e desenvolvimento, consulte [DEVELOPMENT.md](./DEVELOPMENT.md).

## 🏗️ Stack Tecnológica

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript + Sequelize
- **Database:** MySQL 8.0
- **DevOps:** Docker + Docker Compose + Nginx

## ✨ Funcionalidades

- ✅ CRUD de snippets de código
- ✅ Upload e gerenciamento de arquivos
- ✅ Compartilhamento de links
- ✅ Sistema de comentários com screenshots
- ✅ Perfis de usuário personalizáveis
- ✅ Moderação de conteúdo (Admin)
- ✅ Categorização e busca

## 🔧 Comandos Úteis

```bash
# Parar serviços
docker compose down

# Reconstruir após mudanças
docker compose up -d --build

# Ver logs
docker logs vedovelli_backend
docker logs vedovelli_frontend

# Resetar banco de dados
docker compose down -v
docker compose up -d
docker compose exec backend npm run seed
```

## 📝 Licença

Projeto educacional.
