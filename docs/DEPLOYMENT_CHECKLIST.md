# 🚀 Checklist de Deploy - Projeto Vedovelli

## 📦 Deploy Backend

### 1. Verificar Código TypeScript
```bash
cd server
npm run build
```
- [ ] ✅ Compilação sem erros
- [ ] ✅ Sem warnings críticos

### 2. Rebuildar Container
```bash
docker-compose build backend
```
- [ ] ✅ Build completo
- [ ] ✅ Sem erros de dependências

### 3. Reiniciar Serviço
```bash
docker-compose up -d backend
sleep 5
docker-compose logs backend --tail=20
```
- [ ] ✅ "Server is running on port 3000"
- [ ] ✅ "Database connection has been established"
- [ ] ✅ Sem erros no log

### 4. Validar APIs
```bash
curl http://localhost:3000/api/users
curl http://localhost:3000/api/items
curl http://localhost:3000/api/tags
curl http://localhost:3000/api/tags/popular
curl http://localhost:3000/api/favorites/user/admin_1/ids
```
- [ ] ✅ Todas retornam JSON válido
- [ ] ✅ Nenhuma retorna HTML de erro

### 5. Testar via Nginx
```bash
curl http://localhost:8080/api/users
curl http://localhost:8080/api/tags
```
- [ ] ✅ Proxy reverso funcionando
- [ ] ✅ CORS habilitado

---

## 🎨 Deploy Frontend

### 1. Build Local
```bash
npm run build
```
- [ ] ✅ Build sem erros
- [ ] ✅ Assets gerados em `dist/`

### 2. Rebuildar Container
```bash
docker-compose build frontend
```
- [ ] ✅ Build completo
- [ ] ✅ Assets copiados para Nginx

### 3. Reiniciar Serviço
```bash
docker-compose up -d frontend
```
- [ ] ✅ Container iniciado
- [ ] ✅ Nginx servindo arquivos

### 4. Validar Frontend
- [ ] ✅ Abrir http://localhost:8080
- [ ] ✅ Console sem erros 404
- [ ] ✅ Dados carregando corretamente
- [ ] ✅ Dark mode funcionando
- [ ] ✅ Todas as features operacionais

---

## 🔍 Validação Completa

### Backend
- [ ] ✅ TypeScript compilado
- [ ] ✅ Container rodando
- [ ] ✅ Conexão com MySQL
- [ ] ✅ Todas as rotas respondendo
- [ ] ✅ Sem erros no console

### Frontend
- [ ] ✅ Build atualizado
- [ ] ✅ Assets carregando
- [ ] ✅ APIs respondendo
- [ ] ✅ Features funcionando
- [ ] ✅ Dark mode OK

### Infraestrutura
- [ ] ✅ MySQL rodando
- [ ] ✅ phpMyAdmin acessível
- [ ] ✅ Nginx proxy funcionando
- [ ] ✅ Volumes persistentes

---

## ⚠️ Problemas Comuns

### "Cannot GET /api/..."
**Causa:** TypeScript não compilado ou container com código antigo  
**Solução:**
```bash
cd server && npm run build
docker-compose build backend
docker-compose up -d backend
```

### Erros 404 no frontend
**Causa:** Build antigo ou Nginx não atualizado  
**Solução:**
```bash
npm run build
docker-compose build frontend
docker-compose up -d frontend
```

### "ECONNREFUSED" no backend
**Causa:** MySQL não iniciado ou credenciais incorretas  
**Solução:**
```bash
docker-compose up -d db
# Aguardar 10 segundos
docker-compose restart backend
```

### Frontend não atualiza
**Causa:** Cache do navegador  
**Solução:**
- Ctrl + Shift + R (hard refresh)
- Limpar cache do navegador
- Verificar se build tem novo hash: `ls dist/assets/`

---

**Última atualização:** 26/11/2025
