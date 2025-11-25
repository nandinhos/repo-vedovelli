# 🗺️ Roadmap de Desenvolvimento - Repositório Vedovelli

> **Objetivo:** Resgatar a essência dos fóruns clássicos com experiência moderna, focada em compartilhamento de conhecimento comunitário.

---

## 📋 Status Geral do Projeto

| Sprint | Status | Início | Conclusão | Progresso |
|--------|--------|--------|-----------|-----------|
| Sprint 1 - Quick Wins | ⏳ Pendente | - | - | 0/4 |
| Sprint 2 - Engajamento | 📅 Planejada | - | - | 0/4 |
| Sprint 3 - Descoberta | 📅 Planejada | - | - | 0/4 |
| Sprint 4 - Colaboração Avançada | 📅 Planejada | - | - | 0/4 |

**Legenda:**
- ⏳ Pendente
- 🚧 Em Progresso
- ✅ Concluída
- 🔄 Em Revisão
- ❌ Bloqueada

---

## 🎯 Sprints Detalhadas

### **Sprint 1 - Quick Wins** (1-2 semanas)
**Objetivo:** Melhorias visíveis rapidamente que agregam valor imediato

| # | Feature | Status | Arquivo Task | Prioridade |
|---|---------|--------|--------------|------------|
| 1.1 | Sistema de Tags básico | ⏳ Pendente | [TASK-001.md](./TASK-001-tags-system.md) | 🔴 Alta |
| 1.2 | Favoritos/Bookmarks | ⏳ Pendente | [TASK-002.md](./TASK-002-favorites.md) | 🔴 Alta |
| 1.3 | Dark Mode | ⏳ Pendente | [TASK-003.md](./TASK-003-dark-mode.md) | 🟡 Média |
| 1.4 | Preview Markdown em Tempo Real | ⏳ Pendente | [TASK-004.md](./TASK-004-markdown-preview.md) | 🟡 Média |

---

### **Sprint 2 - Engajamento** (2-3 semanas)
**Objetivo:** Aumentar interação e qualidade das discussões

| # | Feature | Status | Arquivo Task | Prioridade |
|---|---------|--------|--------------|------------|
| 2.1 | Reações (Útil/Ajudou) | 📅 Planejada | [TASK-005.md](./TASK-005-reactions.md) | 🔴 Alta |
| 2.2 | Marcar Solução Aceita | 📅 Planejada | [TASK-006.md](./TASK-006-accepted-solution.md) | 🔴 Alta |
| 2.3 | Sistema de Reports | 📅 Planejada | [TASK-007.md](./TASK-007-report-system.md) | 🟡 Média |
| 2.4 | Rate Limiting | 📅 Planejada | [TASK-008.md](./TASK-008-rate-limiting.md) | 🟢 Baixa |

---

### **Sprint 3 - Descoberta** (2-3 semanas)
**Objetivo:** Facilitar encontrar e organizar conhecimento

| # | Feature | Status | Arquivo Task | Prioridade |
|---|---------|--------|--------------|------------|
| 3.1 | Busca Full-Text Otimizada | 📅 Planejada | [TASK-009.md](./TASK-009-search-optimization.md) | 🔴 Alta |
| 3.2 | Filtros Combinados Avançados | 📅 Planejada | [TASK-010.md](./TASK-010-advanced-filters.md) | 🟡 Média |
| 3.3 | Ordenações Múltiplas | 📅 Planejada | [TASK-011.md](./TASK-011-sorting-options.md) | 🟡 Média |
| 3.4 | Seguir Tópicos/Notificações | 📅 Planejada | [TASK-012.md](./TASK-012-follow-topics.md) | 🟢 Baixa |

---

### **Sprint 4 - Colaboração Avançada** (3-4 semanas)
**Objetivo:** Features avançadas de colaboração

| # | Feature | Status | Arquivo Task | Prioridade |
|---|---------|--------|--------------|------------|
| 4.1 | Fork/Clone de Snippets | 📅 Planejada | [TASK-013.md](./TASK-013-fork-snippets.md) | 🟡 Média |
| 4.2 | Versionamento de Snippets | 📅 Planejada | [TASK-014.md](./TASK-014-versioning.md) | 🟡 Média |
| 4.3 | Compartilhamento Social | 📅 Planejada | [TASK-015.md](./TASK-015-social-sharing.md) | 🟢 Baixa |
| 4.4 | Exportações (Download/PDF/Gist) | 📅 Planejada | [TASK-016.md](./TASK-016-export-features.md) | 🟢 Baixa |

---

## 🔄 Processo de Desenvolvimento

### **Workflow por Task:**
1. ✍️ **Planejamento:** Detalhar requisitos no arquivo TASK-XXX.md
2. 🚧 **Desenvolvimento:** Implementar feature
3. 🧪 **Testes Automatizados:** Garantir qualidade
4. 👁️ **Teste Manual:** Validação pelo operador no navegador
5. ✅ **Aprovação:** Confirmação para commit
6. 📦 **Commit:** Versionamento com mensagem descritiva
7. 📝 **Documentação:** Atualizar lições aprendidas

### **Regras de Commit:**
- ✅ Apenas após aprovação manual do operador
- ✅ Uma feature completa por vez
- ✅ Mensagens descritivas seguindo padrão:
  ```
  feat(sprint-X): Descrição curta da feature
  
  - Detalhe 1
  - Detalhe 2
  - Closes #TASK-XXX
  ```

---

## 📊 Métricas de Progresso

**Sprint 1:**
- [ ] Tasks concluídas: 0/4 (0%)
- [ ] Testes passando: -
- [ ] Cobertura de código: -

**Sprint 2:**
- [ ] Tasks concluídas: 0/4 (0%)

**Sprint 3:**
- [ ] Tasks concluídas: 0/4 (0%)

**Sprint 4:**
- [ ] Tasks concluídas: 0/4 (0%)

---

## 🎉 Marcos Importantes

- [ ] **M1:** Sprint 1 completa - Melhorias fundamentais implementadas
- [ ] **M2:** Sprint 2 completa - Engajamento comunitário ativo
- [ ] **M3:** Sprint 3 completa - Descoberta de conteúdo otimizada
- [ ] **M4:** Sprint 4 completa - Colaboração avançada disponível

---

## 📝 Notas de Desenvolvimento

### Decisões Arquiteturais:
- Backend: Node.js + TypeScript + Express + Sequelize
- Frontend: React + TypeScript + Tailwind CSS
- Banco: PostgreSQL
- Sintaxe: Prism.js para highlight de código

### Branches:
- `main` - Produção estável
- `develop` - Integração de features
- `sprint-1/*` - Features da Sprint 1
- `sprint-2/*` - Features da Sprint 2

---

**Última Atualização:** {{ DATA_ATUAL }}
**Responsável:** Time Vedovelli
**Próxima Revisão:** Ao final de cada Sprint
