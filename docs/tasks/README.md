# 📂 Tasks - Sistema de Gestão de Desenvolvimento

> Central de controle e acompanhamento de todas as features do projeto.

---

## 🗂️ Índice de Tasks

### **Sprint 1 - Quick Wins** (1-2 semanas)

| ID | Feature | Status | Prioridade | Arquivo |
|----|---------|--------|------------|---------|
| 001 | Sistema de Tags | ⏳ Pendente | 🔴 Alta | [TASK-001-tags-system.md](./TASK-001-tags-system.md) |
| 002 | Favoritos/Bookmarks | ⏳ Pendente | 🔴 Alta | TASK-002-favorites.md |
| 003 | Dark Mode | ⏳ Pendente | 🟡 Média | TASK-003-dark-mode.md |
| 004 | Preview Markdown | ⏳ Pendente | 🟡 Média | TASK-004-markdown-preview.md |

### **Sprint 2 - Engajamento** (2-3 semanas)

| ID | Feature | Status | Prioridade | Arquivo |
|----|---------|--------|------------|---------|
| 005 | Reações (Útil/Ajudou) | 📅 Planejada | 🔴 Alta | TASK-005-reactions.md |
| 006 | Marcar Solução Aceita | 📅 Planejada | 🔴 Alta | TASK-006-accepted-solution.md |
| 007 | Sistema de Reports | 📅 Planejada | 🟡 Média | TASK-007-report-system.md |
| 008 | Rate Limiting | 📅 Planejada | 🟢 Baixa | TASK-008-rate-limiting.md |

### **Sprint 3 - Descoberta** (2-3 semanas)

| ID | Feature | Status | Prioridade | Arquivo |
|----|---------|--------|------------|---------|
| 009 | Busca Full-Text | 📅 Planejada | 🔴 Alta | TASK-009-search-optimization.md |
| 010 | Filtros Avançados | 📅 Planejada | 🟡 Média | TASK-010-advanced-filters.md |
| 011 | Ordenações Múltiplas | 📅 Planejada | 🟡 Média | TASK-011-sorting-options.md |
| 012 | Seguir Tópicos | 📅 Planejada | 🟢 Baixa | TASK-012-follow-topics.md |

### **Sprint 4 - Colaboração Avançada** (3-4 semanas)

| ID | Feature | Status | Prioridade | Arquivo |
|----|---------|--------|------------|---------|
| 013 | Fork/Clone Snippets | 📅 Planejada | 🟡 Média | TASK-013-fork-snippets.md |
| 014 | Versionamento | 📅 Planejada | 🟡 Média | TASK-014-versioning.md |
| 015 | Compartilhamento Social | 📅 Planejada | 🟢 Baixa | TASK-015-social-sharing.md |
| 016 | Exportações | 📅 Planejada | 🟢 Baixa | TASK-016-export-features.md |

---

## 📊 Status das Sprints

| Sprint | Progresso | Status | Data Início | Data Fim |
|--------|-----------|--------|-------------|----------|
| Sprint 1 | 0/4 (0%) | ⏳ Pendente | - | - |
| Sprint 2 | 0/4 (0%) | 📅 Planejada | - | - |
| Sprint 3 | 0/4 (0%) | 📅 Planejada | - | - |
| Sprint 4 | 0/4 (0%) | 📅 Planejada | - | - |

---

## 🎯 Como Usar Este Sistema

### **1. Antes de Começar uma Task:**

1. Abra o arquivo `TASK-XXX-nome.md`
2. Leia completamente a especificação
3. Verifique dependências e pré-requisitos
4. Estime se o tempo está adequado
5. Atualize o status para 🚧 Em Progresso

### **2. Durante o Desenvolvimento:**

1. Siga a "Sequência de Implementação" do documento
2. Marque checkboxes conforme avança
3. Documente problemas/descobertas na seção "Notas"
4. Mantenha commits pequenos e descritivos

### **3. Ao Concluir:**

1. Execute todos os testes (automatizados + manuais)
2. Valide com operador no navegador
3. Após aprovação, faça commit seguindo padrão
4. Atualize status para ✅ Concluída
5. Documente lição aprendida em `LESSONS_LEARNED.md`
6. Atualize `CHANGELOG.md`

---

## 🔄 Workflow de Aprovação

```
┌─────────────────┐
│  📝 Task Criada │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 🚧 Desenvolvimento│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  🧪 Testes Auto │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 👁️ Teste Manual │ ◄── VALIDAÇÃO DO OPERADOR
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
   ❌       ✅
 Reprovado  Aprovado
    │         │
    │         ▼
    │    ┌─────────┐
    │    │ 📦 Commit│
    │    └─────────┘
    │         │
    │         ▼
    │    ┌─────────────┐
    │    │ 📝 Documentar│
    │    └─────────────┘
    │         │
    │         ▼
    │    ┌─────────┐
    │    │    ✅   │
    │    │ Concluída│
    │    └─────────┘
    │
    └──► Volta para Desenvolvimento
```

---

## 📋 Template para Nova Task

Ao criar uma nova task, use o template:

```bash
cp docs/tasks/TASK-TEMPLATE.md docs/tasks/TASK-XXX-nome-feature.md
```

Em seguida, preencha todas as seções:
- Descrição e objetivos
- Especificação técnica (backend + frontend)
- Critérios de aceitação
- Plano de testes
- Dependências

---

## 🏷️ Convenções de Nomenclatura

### **Arquivos:**
```
TASK-001-tags-system.md
TASK-002-favorites.md
TASK-015-social-sharing.md
```

Padrão: `TASK-{número}-{nome-kebab-case}.md`

### **Status:**
- ⏳ **Pendente** - Não iniciada
- 🚧 **Em Progresso** - Desenvolvimento ativo
- 🔄 **Em Revisão** - Aguardando validação
- ✅ **Concluída** - Aprovada e commitada
- ❌ **Bloqueada** - Impedida por dependência
- 📅 **Planejada** - Agendada para sprint futura

### **Prioridade:**
- 🔴 **Alta** - Crítica para o sprint
- 🟡 **Média** - Importante mas não bloqueante
- 🟢 **Baixa** - Nice to have

---

## 📈 Métricas de Acompanhamento

### **Velocidade:**
- Tasks concluídas por semana
- Tempo médio por task
- Taxa de retrabalho

### **Qualidade:**
- Bugs encontrados em teste manual
- Issues pós-commit
- Cobertura de testes

### **Processo:**
- Tempo entre desenvolvimento e aprovação
- Número de iterações até aprovação
- Documentação completa (%)

---

## 🔗 Links Rápidos

### **Documentação Principal:**
- [📍 Roadmap Geral](./ROADMAP.md)
- [📚 Lições Aprendidas](../LESSONS_LEARNED.md)
- [🏆 Melhores Práticas](../BEST_PRACTICES.md)
- [📝 Changelog](../CHANGELOG.md)

### **Documentação do Projeto:**
- [📋 PRD](../PRD.md)
- [⚙️ Funcionalidades](../FUNCIONALIDADES.md)
- [🗄️ Schema de Banco](../DATABASE_SCHEMA.md)
- [🛠️ Guia de Desenvolvimento](../DEVELOPMENT.md)

---

## 💡 Dicas

### **Para Desenvolvedores:**
- ✅ Leia a task COMPLETA antes de começar
- ✅ Siga a ordem de implementação sugerida
- ✅ Teste cada parte antes de integrar
- ✅ Documente decisões não-óbvias no código
- ✅ Mantenha commits atômicos

### **Para Revisores:**
- ✅ Valide TODOS os critérios de aceitação
- ✅ Teste em diferentes resoluções (mobile/desktop)
- ✅ Teste em dark mode (quando aplicável)
- ✅ Verifique performance (console Network/Performance)
- ✅ Valide acessibilidade básica (tab navigation)

### **Para Operadores:**
- ✅ Use checklist de teste manual
- ✅ Teste cenários de erro (campos vazios, dados inválidos)
- ✅ Verifique responsividade
- ✅ Confirme que não quebrou features existentes
- ✅ Valide UX (é intuitivo? feedback claro?)

---

## 🆘 Troubleshooting

### **Task está bloqueada:**
1. Verifique dependências no arquivo da task
2. Consulte se tasks predecessoras foram concluídas
3. Considere implementação parcial se possível

### **Estimativa muito diferente da realidade:**
1. Documente no `LESSONS_LEARNED.md`
2. Ajuste estimativa de tasks similares futuras
3. Identifique o que não foi previsto

### **Teste manual reprovou:**
1. Anote TODOS os problemas encontrados
2. Priorize correções (crítico vs. nice-to-have)
3. Corrija e solicite nova validação
4. NÃO commitar código não aprovado

---

## 📞 Contato

**Dúvidas sobre tasks?** Consulte:
1. Documentação da task específica
2. `BEST_PRACTICES.md` para padrões
3. `LESSONS_LEARNED.md` para casos similares
4. Time no canal #desenvolvimento

---

**Última Atualização:** {{ DATA_ATUAL }}  
**Mantenedores:** Time Vedovelli  
**Versão do Sistema de Tasks:** 1.0
