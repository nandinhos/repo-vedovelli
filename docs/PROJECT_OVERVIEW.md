# 🎯 Visão Geral do Projeto - Repositório Vedovelli

> Documento visual com overview completo do projeto, arquitetura e status atual.

---

## 📊 Dashboard do Projeto

```
┌─────────────────────────────────────────────────────────────┐
│                   REPOSITÓRIO VEDOVELLI                     │
│         Plataforma Colaborativa de Conhecimento             │
└─────────────────────────────────────────────────────────────┘

📍 Status: MVP em Desenvolvimento
🎯 Versão: 0.1.0
📅 Início: 2024
👥 Time: Vedovelli Community
🚀 Sprint Atual: Sprint 1 - Quick Wins
```

---

## 🎨 O Que é o Projeto?

**Missão:**  
Criar uma plataforma colaborativa que resgata a essência dos **fóruns clássicos** com experiência moderna, focada em compartilhamento de conhecimento entre desenvolvedores.

**Público-Alvo:**
- 👨‍🎓 Desenvolvedores Juniores (buscam soluções)
- 👨‍💻 Desenvolvedores Seniores (compartilham conhecimento)
- 👨‍🏫 Mentores e Educadores
- 🏢 Times e Comunidades de Desenvolvimento

---

## 🏗️ Arquitetura do Sistema

```
┌──────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│     React + TypeScript + Tailwind CSS + Vite                │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Snippets │  │ Arquivos │  │  Links   │  │ Contatos │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Sistema de Comentários Rico                │   │
│  │     (Texto + Código + Screenshots)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                            ▼ REST API
┌──────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│          Node.js + Express + TypeScript                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Items   │  │Comments  │  │  Users   │  │  Tags    │  │
│  │Controller│  │Controller│  │Controller│  │Controller│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Sequelize ORM                          │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                            ▼ SQL
┌──────────────────────────────────────────────────────────────┐
│                       PostgreSQL                             │
│                                                              │
│     users  │  items  │  comments  │  tags  │  item_tags   │
└──────────────────────────────────────────────────────────────┘

                   ┌──────────────────┐
                   │   Integrations   │
                   ├──────────────────┤
                   │  Gemini AI API   │
                   │  Prism.js        │
                   └──────────────────┘
```

---

## 📦 Stack Tecnológica

### **Frontend:**
```typescript
React 18          // Framework UI
TypeScript 5      // Type Safety
Tailwind CSS 3    // Styling
Vite             // Build Tool
Prism.js         // Syntax Highlighting
React Icons      // Iconografia
```

### **Backend:**
```typescript
Node.js 18+      // Runtime
Express 4        // Web Framework
TypeScript 5     // Type Safety
Sequelize 6      // ORM
PostgreSQL 14+   // Database
JWT              // Authentication
```

### **DevOps:**
```bash
Docker           # Containerização
Docker Compose   # Orquestração local
Nginx            # Reverse Proxy
Git              # Version Control
```

---

## 🎯 Funcionalidades Atuais (MVP)

### ✅ **Implementado:**

#### **1. Gestão de Conteúdo**
- ✅ CRUD de Snippets (código com syntax highlighting)
- ✅ CRUD de Arquivos (upload simulado)
- ✅ CRUD de Links Úteis
- ✅ Categorização por tipo e categoria
- ✅ Busca textual básica
- ✅ Filtros por categoria

#### **2. Sistema de Usuários**
- ✅ Autenticação mock (Visitante/Usuário/Admin)
- ✅ Perfis públicos
- ✅ Links de redes sociais (GitHub, LinkedIn, etc)
- ✅ Avatar customizável
- ✅ Bio e cargo

#### **3. Sistema de Comentários**
- ✅ Comentários com texto rico
- ✅ Inserção de blocos de código nos comentários
- ✅ Upload de screenshots
- ✅ Edição de comentários (autor apenas)
- ✅ Moderação (soft delete com justificativa)

#### **4. Organização**
- ✅ Abas: Snippets, Arquivos, Links, Contatos
- ✅ Cards expansíveis
- ✅ Modais para criação/edição
- ✅ Layout responsivo

---

## 🚀 Roadmap de Desenvolvimento

### **Sprint 1 - Quick Wins** (1-2 semanas) ⏳
```
┌─────────────────────────────────────────┐
│ ▢ Sistema de Tags                       │ 🔴 Alta
│ ▢ Favoritos/Bookmarks                   │ 🔴 Alta  
│ ▢ Dark Mode                             │ 🟡 Média
│ ▢ Preview Markdown Tempo Real           │ 🟡 Média
└─────────────────────────────────────────┘
Progresso: 0/4 (0%)
```

### **Sprint 2 - Engajamento** (2-3 semanas) 📅
```
┌─────────────────────────────────────────┐
│ ▢ Reações (Útil/Ajudou)                 │ 🔴 Alta
│ ▢ Marcar Solução Aceita                 │ 🔴 Alta
│ ▢ Sistema de Reports/Denúncias          │ 🟡 Média
│ ▢ Rate Limiting                         │ 🟢 Baixa
└─────────────────────────────────────────┘
Progresso: 0/4 (0%)
```

### **Sprint 3 - Descoberta** (2-3 semanas) 📅
```
┌─────────────────────────────────────────┐
│ ▢ Busca Full-Text Otimizada             │ 🔴 Alta
│ ▢ Filtros Combinados Avançados          │ 🟡 Média
│ ▢ Ordenações Múltiplas                  │ 🟡 Média
│ ▢ Seguir Tópicos/Notificações           │ 🟢 Baixa
└─────────────────────────────────────────┘
Progresso: 0/4 (0%)
```

### **Sprint 4 - Colaboração Avançada** (3-4 semanas) 📅
```
┌─────────────────────────────────────────┐
│ ▢ Fork/Clone de Snippets                │ 🟡 Média
│ ▢ Versionamento de Snippets             │ 🟡 Média
│ ▢ Compartilhamento Social               │ 🟢 Baixa
│ ▢ Exportações (Download/PDF/Gist)       │ 🟢 Baixa
└─────────────────────────────────────────┘
Progresso: 0/4 (0%)
```

---

## 📈 Progresso Geral

```
Total de Features Planejadas: 16
├─ Concluídas: 0  ░░░░░░░░░░ 0%
├─ Em Progresso: 0
└─ Pendentes: 16

MVP Atual: ████████░░ 80%
MVP + Sprint 1: ████████░░ 85%
MVP + Sprint 2: █████████░ 90%
MVP + Sprint 3: █████████░ 95%
MVP + Sprint 4: ██████████ 100%
```

---

## 🎭 Personas do Usuário

### **1. João - Desenvolvedor Júnior** 🎓
**Objetivo:** Aprender e encontrar soluções rápidas  
**Usa para:**
- Buscar snippets de código
- Ler comentários com soluções
- Favoritar recursos úteis

### **2. Maria - Desenvolvedora Sênior** 👩‍💻
**Objetivo:** Compartilhar conhecimento e ajudar comunidade  
**Usa para:**
- Postar snippets úteis
- Responder dúvidas nos comentários
- Compartilhar arquivos de configuração

### **3. Carlos - Administrador** 👨‍💼
**Objetivo:** Manter qualidade e moderar conteúdo  
**Usa para:**
- Revisar denúncias
- Moderar comentários inadequados
- Gerenciar usuários

---

## 🗄️ Modelo de Dados Simplificado

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │         │    Item     │         │     Tag     │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id          │◄───┐    │ id          │◄───┐    │ id          │
│ name        │    │    │ authorId    │    │    │ name        │
│ email       │    │    │ type        │    │    │ slug        │
│ role        │    │    │ category    │    │    │ usageCount  │
│ avatar      │    │    │ title       │    │    └─────────────┘
│ bio         │    │    │ description │    │           ▲
│ isPublic    │    │    │ content     │    │           │
└─────────────┘    │    │ ...         │    │           │
                   │    └─────────────┘    │    ┌──────┴──────┐
                   │           ▲           │    │  item_tags  │
                   │           │           │    ├─────────────┤
                   │           │           │    │ itemId      │
                   │    ┌──────┴──────┐    │    │ tagId       │
                   │    │   Comment   │    │    └─────────────┘
                   │    ├─────────────┤    │
                   └────┤ id          │    │
                        │ itemId      │────┘
                        │ userId      │
                        │ content     │
                        │ screenshot  │
                        │ isDeleted   │
                        └─────────────┘
```

---

## 🔐 Níveis de Permissão

```
┌────────────────────────────────────────────────────────────┐
│                      VISITANTE                             │
├────────────────────────────────────────────────────────────┤
│ ✅ Visualizar conteúdo                                     │
│ ❌ Não pode comentar                                       │
│ ❌ Não pode criar itens                                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  USUÁRIO APROVADO                          │
├────────────────────────────────────────────────────────────┤
│ ✅ Tudo do Visitante +                                     │
│ ✅ Criar itens (snippets, arquivos, links)                │
│ ✅ Comentar em qualquer item                               │
│ ✅ Editar/excluir SEUS itens                               │
│ ✅ Editar/excluir SEUS comentários                         │
│ ✅ Gerenciar seu perfil                                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    ADMINISTRADOR                           │
├────────────────────────────────────────────────────────────┤
│ ✅ Tudo do Usuário +                                       │
│ ✅ Editar/excluir QUALQUER item                            │
│ ✅ Editar/excluir QUALQUER comentário                      │
│ ✅ Moderar com justificativa (soft delete)                 │
│ ✅ Gerenciar usuários                                      │
└────────────────────────────────────────────────────────────┘
```

---

## 🎨 Paleta de Cores e Design System

```css
/* Tema Claro */
--primary: #3B82F6      /* Azul principal */
--secondary: #64748B    /* Cinza médio */
--success: #10B981      /* Verde sucesso */
--danger: #EF4444       /* Vermelho erro */
--warning: #F59E0B      /* Laranja aviso */
--background: #FFFFFF   /* Fundo branco */
--text: #1F2937         /* Texto escuro */

/* Tema Escuro (Sprint 1) */
--primary-dark: #60A5FA
--background-dark: #111827
--text-dark: #F9FAFB
```

---

## 📊 Métricas de Sucesso

### **Engajamento:**
- [ ] Número de snippets compartilhados
- [ ] Comentários por item (média)
- [ ] Usuários com perfil público ativo

### **Qualidade:**
- [ ] Snippets marcados como "Útil"
- [ ] Soluções aceitas por discussão
- [ ] Taxa de moderação (baixa é melhor)

### **Crescimento:**
- [ ] Novos usuários por mês
- [ ] Taxa de retenção (usuários ativos)
- [ ] Itens favoritos (quando implementado)

---

## 🔗 Links Importantes

### **Documentação:**
- [📖 Docs Completas](./README.md)
- [🚀 Getting Started](./GETTING_STARTED.md)
- [📋 Roadmap](./tasks/ROADMAP.md)
- [🏆 Best Practices](./BEST_PRACTICES.md)

### **Repositório:**
- GitHub: [link]
- CI/CD: [link]
- Produção: [link]
- Staging: [link]

---

## 🎯 Próximos Passos

### **Para o Time:**
1. ✅ Estrutura de documentação criada
2. ⏳ Iniciar Sprint 1 - Quick Wins
3. 📅 Implementar TASK-001: Sistema de Tags
4. 📅 Realizar testes e validações
5. 📅 Commit e deploy da Sprint 1

### **Para o Projeto:**
- Finalizar Sprint 1 até [DATA]
- Coletar feedback de early adopters
- Ajustar roadmap conforme necessário
- Manter documentação atualizada

---

## 💬 Filosofia do Projeto

```
┌────────────────────────────────────────────────────────┐
│  "Não queremos reinventar a roda.                     │
│   Queremos resgatar a magia dos fóruns clássicos      │
│   com a experiência que a tecnologia moderna          │
│   permite criar."                                     │
│                                         - Time Vedovelli│
└────────────────────────────────────────────────────────┘
```

**Valores:**
- 🤝 **Colaboração** acima de competição
- 📚 **Conhecimento** compartilhado livremente
- 🎯 **Simplicidade** sobre complexidade
- 💡 **Qualidade** sobre quantidade
- 🌱 **Crescimento** constante e sustentável

---

**Última Atualização:** {{ DATA_ATUAL }}  
**Versão:** 1.0  
**Status:** 🚀 Em desenvolvimento ativo
