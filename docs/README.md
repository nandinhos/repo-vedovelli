# 📚 Documentação - Repositório Vedovelli

> Central de documentação completa do projeto. Tudo que você precisa saber está aqui!

---

## 🗺️ Navegação Rápida

### **🎯 Começando**
- **[Getting Started](./GETTING_STARTED.md)** - Guia de início rápido para novos desenvolvedores
- **[PRD](./PRD.md)** - Visão geral do produto e objetivos
- **[Funcionalidades](./FUNCIONALIDADES.md)** - Comportamento esperado de cada feature

### **💻 Desenvolvimento**
- **[Development Guide](./DEVELOPMENT.md)** - Setup técnico e troubleshooting
- **[Best Practices](./BEST_PRACTICES.md)** - Padrões de código e convenções
- **[Database Schema](./DATABASE_SCHEMA.md)** - Estrutura do banco de dados

### **📋 Gestão de Tarefas**
- **[Roadmap](./tasks/ROADMAP.md)** - Planejamento de sprints e features
- **[Tasks](./tasks/README.md)** - Índice de todas as tasks
- **[Task Template](./tasks/TASK-TEMPLATE.md)** - Template para novas tasks

### **📖 Referência**
- **[Changelog](./CHANGELOG.md)** - Histórico de mudanças
- **[Lessons Learned](./LESSONS_LEARNED.md)** - Experiências e aprendizados

---

## 🎯 Para Quem é Cada Documento?

### **👨‍💻 Novo Desenvolvedor:**
1. Leia [Getting Started](./GETTING_STARTED.md)
2. Depois [PRD](./PRD.md)
3. Consulte [Best Practices](./BEST_PRACTICES.md) durante desenvolvimento

### **🎨 Designer/UX:**
1. Leia [PRD](./PRD.md)
2. Depois [Funcionalidades](./FUNCIONALIDADES.md)
3. Consulte tasks específicas em [tasks/](./tasks/)

### **📊 Product Owner:**
1. Acompanhe [Roadmap](./tasks/ROADMAP.md)
2. Revise [Changelog](./CHANGELOG.md)
3. Monitore progresso em [tasks/](./tasks/)

### **🔧 DevOps:**
1. Consulte [Development Guide](./DEVELOPMENT.md)
2. Revise [Database Schema](./DATABASE_SCHEMA.md)

---

## 📂 Estrutura da Documentação

```
docs/
├── README.md                    # Este arquivo - Índice geral
├── GETTING_STARTED.md          # Guia de início rápido
├── PRD.md                      # Product Requirements Document
├── FUNCIONALIDADES.md          # Especificação funcional
├── DATABASE_SCHEMA.md          # Schema do banco
├── DEVELOPMENT.md              # Guia técnico de desenvolvimento
├── BEST_PRACTICES.md           # Padrões e convenções
├── LESSONS_LEARNED.md          # Lições aprendidas
├── CHANGELOG.md                # Histórico de versões
└── tasks/                      # Gestão de features
    ├── README.md              # Índice de tasks
    ├── ROADMAP.md             # Roadmap de sprints
    ├── TASK-TEMPLATE.md       # Template padrão
    ├── TASK-001-tags-system.md
    ├── TASK-002-favorites.md
    └── ...
```

---

## 🚀 Quick Links por Contexto

### **Vou Implementar uma Feature:**
1. [📋 Roadmap](./tasks/ROADMAP.md) - Ver sprints
2. [📝 Task Específica](./tasks/) - Ler especificação completa
3. [🏆 Best Practices](./BEST_PRACTICES.md) - Seguir padrões
4. [📚 Lessons Learned](./LESSONS_LEARNED.md) - Evitar problemas conhecidos

### **Vou Revisar/Validar:**
1. [📝 Task Específica](./tasks/) - Critérios de aceitação
2. [⚙️ Funcionalidades](./FUNCIONALIDADES.md) - Comportamento esperado
3. [🧪 Best Practices](./BEST_PRACTICES.md) - Checklist de qualidade

### **Vou Fazer Onboarding:**
1. [🚀 Getting Started](./GETTING_STARTED.md) - Primeiro passo
2. [📋 PRD](./PRD.md) - Entender o produto
3. [🛠️ Development](./DEVELOPMENT.md) - Setup do ambiente
4. [📂 Tasks](./tasks/README.md) - Ver o que fazer

---

## 🔄 Como Manter Documentação Atualizada

### **Ao Concluir uma Task:**
- ✅ Marcar como concluída em [Roadmap](./tasks/ROADMAP.md)
- ✅ Adicionar entrada no [Changelog](./CHANGELOG.md)
- ✅ Documentar aprendizados em [Lessons Learned](./LESSONS_LEARNED.md)
- ✅ Atualizar [Best Practices](./BEST_PRACTICES.md) se aplicável

### **Ao Encontrar um Bug:**
- ✅ Documentar em [Lessons Learned](./LESSONS_LEARNED.md)
- ✅ Adicionar no [Changelog](./CHANGELOG.md) quando corrigir

### **Ao Mudar Arquitetura:**
- ✅ Atualizar [Development](./DEVELOPMENT.md)
- ✅ Atualizar [Database Schema](./DATABASE_SCHEMA.md) se aplicável
- ✅ Documentar decisão em [Lessons Learned](./LESSONS_LEARNED.md)

---

## 📊 Status Atual do Projeto

**Versão:** 0.1.0 (MVP)  
**Sprint Atual:** Sprint 1 - Quick Wins  
**Tasks Ativas:** 0/4  
**Última Atualização:** {{ DATA_ATUAL }}

---

## 🎓 Convenções deste Projeto

### **Formato de Documentos:**
- Markdown com emojis para melhor legibilidade
- Seções claras com anchors
- Code blocks com syntax highlighting
- Checkboxes para listas de ação

### **Status de Tasks:**
- ⏳ Pendente
- 🚧 Em Progresso
- 🔄 Em Revisão
- ✅ Concluída
- ❌ Bloqueada
- 📅 Planejada

### **Prioridades:**
- 🔴 Alta - Crítica
- 🟡 Média - Importante
- 🟢 Baixa - Nice to have

---

## 💡 Dicas de Uso

### **Buscar Informação:**
Use Ctrl+F ou Command+F nos arquivos markdown. Palavras-chave úteis:
- "endpoint" → Procurar APIs
- "component" → Encontrar componentes React
- "model" → Ver modelos de dados
- "test" → Localizar testes

### **Contribuir com Documentação:**
Encontrou algo desatualizado ou confuso?
1. Edite o arquivo relevante
2. Commit: `docs: atualiza [nome do arquivo]`
3. Todos agradecem! 🙏

---

## 🆘 Precisa de Ajuda?

**Não encontrou o que procura?**

1. Use a busca (Ctrl/Cmd + F) nos documentos
2. Consulte o [Getting Started](./GETTING_STARTED.md)
3. Procure em [Lessons Learned](./LESSONS_LEARNED.md)
4. Pergunte no canal #documentação

---

## 📞 Contato

**Mantenedores da Documentação:** Time Vedovelli  
**Issues de Documentação:** Tag com `documentation`  
**Sugestões:** Sempre bem-vindas!

---

**Esta documentação é um documento vivo. Contribua para mantê-la atualizada! 🌱**

---

**Última Atualização:** {{ DATA_ATUAL }}  
**Versão da Documentação:** 1.0
