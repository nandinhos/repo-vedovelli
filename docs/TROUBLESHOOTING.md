# 🔧 Troubleshooting - Problemas Comuns e Soluções

> Guia de resolução de problemas frequentes no desenvolvimento

---

## 🔥 Problemas Críticos

### **IDE Reiniciando Durante Desenvolvimento**

**Sintomas:**
- IDE/Editor travando ou reiniciando
- Hot reload muito lento
- Processos node consumindo muita CPU
- TypeScript server parando de responder

**Causa:**
- **File watchers** monitorando muitos arquivos (node_modules, dist, etc)
- Limite de inotify watches atingido (Linux)
- TypeScript server sem limite de memória

**Solução Aplicada:**

#### 1. **Configuração do VSCode** (`.vscode/settings.json`)
```json
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.git/**": true
  },
  "typescript.tsserver.maxTsServerMemory": 4096,
  "typescript.tsserver.watchOptions": {
    "excludeDirectories": ["**/node_modules", "**/dist"]
  }
}
```

#### 2. **Configuração do Vite** (`vite.config.ts`)
```typescript
server: {
  watch: {
    usePolling: false,
    ignored: ['**/node_modules/**', '**/dist/**']
  }
}
```

#### 3. **Aumentar Limite de Watches no Linux** (se necessário)
```bash
# Verificar limite atual
cat /proc/sys/fs/inotify/max_user_watches

# Aumentar temporariamente
sudo sysctl fs.inotify.max_user_watches=524288

# Tornar permanente
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**Teste:**
```bash
# Reiniciar dev server
npm run dev

# Deve estar mais estável agora
```

---

## ⚠️ Problemas Comuns

### **1. Erro: "Cannot find module '@/...'"**

**Causa:** Alias não configurado corretamente

**Solução:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### **2. Hot Reload Não Funciona**

**Causa:** Vite watch não detectando mudanças

**Solução:**
```typescript
// vite.config.ts
server: {
  watch: {
    usePolling: true, // Tentar polling se fsevents falhar
  }
}
```

### **3. Erro: "Process out of memory"**

**Causa:** Node sem limite de memória suficiente

**Solução:**
```json
// package.json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--max-old-space-size=4096' vite"
  }
}
```

### **4. TypeScript Muito Lento**

**Sintomas:**
- Intellisense demorando
- Erros não aparecendo
- tsserver travando

**Solução:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true, // Já está configurado
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  },
  "exclude": ["node_modules", "dist", "dist-ssr"]
}
```

### **5. Porta 3001 Já em Uso**

**Erro:** `Error: listen EADDRINUSE: address already in use :::3001`

**Solução:**
```bash
# Encontrar processo usando a porta
lsof -i :3001

# Matar processo
kill -9 [PID]

# Ou mudar porta no vite.config.ts
server: {
  port: 3002
}
```

---

## 🐛 Debugging

### **Ver Logs do Vite**
```bash
npm run dev -- --debug
```

### **Ver Performance do TypeScript**
```bash
# Abrir DevTools do VSCode
Ctrl+Shift+P → "Developer: Toggle Developer Tools"

# Ver logs do TS Server
Output → TypeScript
```

### **Verificar File Watchers Ativos**
```bash
# Linux
lsof | grep inotify | wc -l

# Processos node ativos
ps aux | grep node
```

---

## 🔄 Resetar Ambiente

Se tudo falhar, resetar completamente:

```bash
# 1. Parar todos os processos
pkill -f node
pkill -f vite

# 2. Limpar caches
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm -rf .tsbuildinfo
rm -rf server/node_modules
rm -rf server/dist

# 3. Reinstalar
npm install
cd server && npm install && cd ..

# 4. Reiniciar
npm run dev
```

---

## 📊 Monitoramento

### **Verificar Recursos do Sistema**
```bash
# Memória
free -h

# CPU
top -o %CPU

# Espaço em disco
df -h

# Processos node
ps aux | grep node
```

### **Verificar Saúde do Projeto**
```bash
# Tamanho do node_modules
du -sh node_modules

# Número de arquivos
find . -type f | wc -l

# Arquivos sendo monitorados
find . -name "*.ts" -o -name "*.tsx" | wc -l
```

---

## 🆘 Quando Pedir Ajuda

Se o problema persistir após todas as soluções acima:

1. **Coletar informações:**
```bash
# Sistema
uname -a
node --version
npm --version

# Logs
npm run dev 2>&1 | tee error.log
```

2. **Reproduzir o problema:**
   - Passos exatos que causam o erro
   - Arquivos modificados
   - Mensagens de erro completas

3. **Abrir issue:**
   - Incluir informações coletadas
   - Screenshots se relevante
   - Contexto (o que estava fazendo)

---

## 📚 Recursos Úteis

- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)
- [VSCode Performance](https://code.visualstudio.com/docs/setup/linux#_visual-studio-code-is-unable-to-watch-for-file-changes-in-this-large-workspace)
- [Node.js Memory Management](https://nodejs.org/en/docs/guides/debugging-getting-started)

---

## ✅ Checklist de Performance

Após aplicar soluções, verificar:

- [ ] Dev server inicia em < 5 segundos
- [ ] Hot reload funciona em < 2 segundos
- [ ] TypeScript intellisense responde instantaneamente
- [ ] Nenhum processo node > 500MB de RAM
- [ ] CPU usage < 50% em idle
- [ ] IDE não trava ou reinicia
- [ ] Console sem erros ou warnings estranhos

---

**Última Atualização:** {{ DATA_ATUAL }}  
**Mantenedor:** DevOps Team

**💡 Dica:** Mantenha este documento atualizado conforme novos problemas são descobertos!
