# 🚀 Getting Started - Guia de Início Rápido

> Bem-vindo ao Repositório Vedovelli! Este guia vai te ajudar a entender o projeto e começar a contribuir rapidamente.

---

## 📚 Índice

1. [O Que é o Projeto](#o-que-é-o-projeto)
2. [Documentação Disponível](#documentação-disponível)
3. [Setup do Ambiente](#setup-do-ambiente)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
6. [Primeira Contribuição](#primeira-contribuição)
7. [Comandos Úteis](#comandos-úteis)
8. [FAQ](#faq)

---

## 🎯 O Que é o Projeto

O **Repositório Vedovelli** é uma plataforma colaborativa para desenvolvedores compartilharem conhecimento através de:

- 📝 **Snippets** - Blocos de código com syntax highlighting
- 📁 **Arquivos** - Recursos como Dockerfiles, PDFs, configs
- 🔗 **Links Úteis** - Referências externas organizadas
- 💬 **Discussões** - Sistema de comentários rico estilo fórum

### **Visão:**
Resgatar a nostalgia dos fóruns clássicos com uma experiência moderna, focada em compartilhamento de conhecimento entre comunidade de desenvolvedores.

---

## 📖 Documentação Disponível

### **Essencial para Começar:**
| Documento | Descrição | Quando Ler |
|-----------|-----------|------------|
| [PRD.md](./PRD.md) | Visão geral do produto | Antes de tudo |
| [FUNCIONALIDADES.md](./FUNCIONALIDADES.md) | Comportamento esperado | Antes de implementar feature |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Estrutura do banco | Ao trabalhar com models |
| [BEST_PRACTICES.md](./BEST_PRACTICES.md) | Padrões de código | Durante desenvolvimento |

### **Para Desenvolvimento:**
| Documento | Descrição | Quando Ler |
|-----------|-----------|------------|
| [tasks/ROADMAP.md](./tasks/ROADMAP.md) | Planejamento de sprints | Visão macro do projeto |
| [tasks/TASK-XXX.md](./tasks/) | Especificação de features | Antes de cada task |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Setup técnico detalhado | Setup inicial |
| [CHANGELOG.md](./CHANGELOG.md) | Histórico de mudanças | Para entender evolução |

### **Para Aprendizado:**
| Documento | Descrição | Quando Ler |
|-----------|-----------|------------|
| [LESSONS_LEARNED.md](./LESSONS_LEARNED.md) | Experiências do time | Quando enfrentar desafios |
| [BEST_PRACTICES.md](./BEST_PRACTICES.md) | Guia de boas práticas | Referência constante |

---

## 🛠️ Setup do Ambiente

### **Pré-requisitos:**
```bash
Node.js >= 18.x
PostgreSQL >= 14.x
npm >= 9.x
Git
```

### **1. Clone e Instale:**
```bash
# Clone o repositório
git clone [URL_DO_REPO]
cd vedovelli-repository

# Instale dependências do frontend
npm install

# Instale dependências do backend
cd server
npm install
cd ..
```

### **2. Configure o Banco de Dados:**
```bash
# Crie o banco PostgreSQL
createdb vedovelli_dev

# Configure variáveis de ambiente
cp .env.example .env

# Edite .env com suas credenciais
DATABASE_URL=postgresql://user:password@localhost:5432/vedovelli_dev
```

### **3. Execute Migrations/Seed:**
```bash
cd server
npm run migrate
npm run seed
cd ..
```

### **4. Inicie o Ambiente:**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev

# Acesse: http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```
vedovelli-repository/
├── 📂 components/          # Componentes React
│   ├── CodeBlock.tsx
│   ├── ItemDetail.tsx
│   └── ...
├── 📂 services/           # Integrações externas
│   └── geminiService.ts
├── 📂 server/             # Backend Node.js
│   ├── models/           # Modelos Sequelize
│   ├── controllers/      # Controladores
│   ├── routes/           # Rotas Express
│   └── index.ts
├── 📂 docs/              # Documentação
│   ├── tasks/           # Gestão de features
│   ├── PRD.md
│   └── ...
├── App.tsx              # Componente principal
├── types.ts             # Tipos TypeScript
└── package.json
```

### **Convenções:**
- **Componentes:** PascalCase (`UserProfile.tsx`)
- **Services:** camelCase (`authService.ts`)
- **Models:** PascalCase (`User.ts`, `Item.ts`)
- **Utilitários:** camelCase (`validation.ts`)

---

## 🔄 Workflow de Desenvolvimento

### **Processo Padrão:**

```
1. 📋 Escolher Task
   └─► Consultar docs/tasks/ROADMAP.md
   
2. 📖 Ler Especificação
   └─► Abrir docs/tasks/TASK-XXX.md
   
3. 🔀 Criar Branch
   └─► git checkout -b sprint-X/nome-feature
   
4. 💻 Desenvolver
   └─► Seguir especificação + Best Practices
   
5. 🧪 Testar
   ├─► Testes automatizados
   └─► Testes manuais no navegador
   
6. 👁️ Validação
   └─► Operador aprova no navegador
   
7. 📦 Commit
   └─► feat(sprint-X): descrição
   
8. 📝 Documentar
   ├─► Atualizar LESSONS_LEARNED.md
   └─► Atualizar CHANGELOG.md
   
9. ✅ Concluir
   └─► Marcar task como concluída
```

### **Regras de Ouro:**

✅ **SEMPRE:**
- Ler documentação da task antes de começar
- Seguir padrões do `BEST_PRACTICES.md`
- Testar manualmente antes de solicitar aprovação
- Aguardar validação do operador antes de commitar
- Documentar lições aprendidas

❌ **NUNCA:**
- Commitar código não testado
- Pular validação manual
- Ignorar especificações da task
- Fazer commits sem mensagem descritiva
- Modificar código sem entender impacto

---

## 🎓 Primeira Contribuição

### **Opção 1: Feature Simples (Recomendado)**

Comece com **TASK-003: Dark Mode** (relativamente isolada):

1. Leia `docs/tasks/TASK-003-dark-mode.md`
2. Implemente toggle dark/light
3. Persista preferência no localStorage
4. Ajuste estilos com Tailwind (`dark:`)
5. Teste em todos os componentes
6. Solicite validação

### **Opção 2: Bug Fix**

1. Consulte issues abertas
2. Reproduza o bug localmente
3. Identifique causa raiz
4. Implemente correção
5. Adicione teste para evitar regressão
6. Documente em `LESSONS_LEARNED.md`

### **Opção 3: Melhoria de Documentação**

1. Identifique lacuna na documentação
2. Pesquise e escreva conteúdo
3. Solicite revisão
4. Contribuição valiosa mesmo sem código!

---

## 🔧 Comandos Úteis

### **Frontend:**
```bash
npm run dev          # Desenvolvimento (Vite)
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Lint com ESLint
npm run type-check   # Verificação de tipos
```

### **Backend:**
```bash
cd server
npm run dev          # Desenvolvimento (nodemon)
npm run build        # Compilar TypeScript
npm run start        # Produção
npm run migrate      # Executar migrations
npm run seed         # Popular banco com dados
npm run test         # Executar testes
```

### **Database:**
```bash
# Acessar PostgreSQL
psql vedovelli_dev

# Reset completo (cuidado!)
npm run db:reset
```

### **Git:**
```bash
# Criar branch de feature
git checkout -b sprint-1/tags-system

# Commit seguindo padrão
git commit -m "feat(sprint-1): adiciona sistema de tags"

# Atualizar branch com develop
git pull origin develop
git rebase develop
```

---

## ❓ FAQ

### **P: Por onde começo?**
**R:** Leia PRD.md, depois FUNCIONALIDADES.md, depois escolha uma task da Sprint 1.

### **P: Posso modificar a estrutura de arquivos?**
**R:** Sim, mas documente a razão em `LESSONS_LEARNED.md` e discuta com o time.

### **P: E se eu encontrar um bug durante desenvolvimento?**
**R:** 
1. Se for crítico: pare e corrija imediatamente
2. Se for menor: anote e crie issue separada
3. Sempre documente em `LESSONS_LEARNED.md`

### **P: Posso usar outras bibliotecas além das já instaladas?**
**R:** Sim, mas:
1. Avalie se é realmente necessário
2. Verifique tamanho e licença
3. Documente a escolha na task
4. Adicione ao `package.json`

### **P: O teste manual foi reprovado, e agora?**
**R:**
1. Não desanime! Faz parte do processo
2. Anote TODOS os problemas reportados
3. Corrija um por vez
4. Teste novamente localmente
5. Solicite nova validação

### **P: Quanto tempo devo gastar em uma task?**
**R:** 
- Se exceder 50% da estimativa: comunique o bloqueio
- Se exceder 100%: reavalie abordagem ou divida a task
- Documente desvios em `LESSONS_LEARNED.md`

### **P: Posso trabalhar em múltiplas tasks simultaneamente?**
**R:** NÃO recomendado. Foque em uma task por vez para manter qualidade e velocidade.

### **P: Como faço deploy?**
**R:** Consulte `DEVELOPMENT.md` seção "Deployment". Nunca faça deploy direto da sua máquina sem aprovação.

---

## 🎉 Checklist do Primeiro Dia

- [ ] Ambiente configurado e rodando
- [ ] Consegui logar e navegar pela aplicação
- [ ] Li PRD.md e FUNCIONALIDADES.md
- [ ] Entendi estrutura de pastas
- [ ] Li BEST_PRACTICES.md
- [ ] Escolhi minha primeira task
- [ ] Criei branch de desenvolvimento
- [ ] Fiz primeiro commit (mesmo que mínimo)

---

## 📞 Precisa de Ajuda?

1. **Documentação:** Sempre consulte docs/ primeiro
2. **Issues:** Procure em issues abertas no GitHub
3. **Time:** Canal #desenvolvimento no Slack/Discord
4. **Pair Programming:** Agende sessão com colega

---

## 🌟 Dicas para Sucesso

1. **Comunique-se:** Bloqueios são normais, comunique cedo
2. **Documente:** Seu "eu do futuro" agradecerá
3. **Teste muito:** Mais testes = menos bugs
4. **Refatore:** Código limpo > código rápido
5. **Pergunte:** Não existe pergunta boba
6. **Comemore:** Cada task concluída é uma vitória! 🎉

---

**Bem-vindo ao time! Vamos construir algo incrível juntos! 🚀**

---

**Última Atualização:** {{ DATA_ATUAL }}  
**Versão:** 1.0  
**Mantenedores:** Time Vedovelli
