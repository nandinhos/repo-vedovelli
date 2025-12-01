# 📝 Changelog - Repositório Vedovelli

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### ✨ Adicionado
- **TASK-003: Dark Mode Completo**
  - Toggle dark/light mode com persistência
  - Adaptação de todos os componentes (12+)
  - Syntax highlighting adaptado (Prism.js)
  - Transições suaves e ícones animados

- **TASK-004: Preview Markdown em Tempo Real**
  - Editor com suporte a Markdown
  - Preview em tempo real (aba Preview)
  - Toolbar de formatação
  - Renderização segura com sanitização

### 🚧 Em Desenvolvimento

---

## [0.3.0] - 2024-11-25

### ✨ Adicionado
- **TASK-002: Sistema de Favoritos/Bookmarks Completo**
  - Backend: Modelo Favorite com relacionamento User-Item
  - Backend: FavoriteService com 4 métodos (toggle, get, check, ids)
  - Backend: 4 endpoints REST funcionando
  - Frontend: Hook useFavorites para gerenciar estado
  - Frontend: Componente FavoriteButton com ícone de coração
  - Frontend: Aba "Favoritos" com contador dinâmico
  - Frontend: Componente FavoritesView com loading e estado vazio
  - UX: Visual minimalista (cinza → vermelho)
  - Integração: Botão em todos os cards de itens

### 🐛 Corrigido
- Coluna screenshotUrl alterada de TEXT para LONGTEXT
- Suporte para imagens grandes em comentários (até 4GB)
- API de favoritos agora retorna comments e tags completos
- TagDisplay na aba favoritos com clickable=false

---

## [0.2.0] - 2024-11-25

### ✨ Adicionado
- **TASK-001: Sistema de Tags Completo**
  - Backend: Modelos Tag e ItemTag
  - Backend: TagService com métodos de busca e sincronização
  - Backend: 5 endpoints REST para gerenciar tags
  - Frontend: Componente TagInput com autocomplete
  - Frontend: Componente TagCloud visual sutil
  - Frontend: Componente TagDisplay nos cards
  - Frontend: Filtro por múltiplas tags
  - Integração completa nos modais de criação/edição

### 🔄 Modificado
- App.tsx: Integração do sistema de tags
- types.ts: Adicionada interface Tag
- vite.config.ts: Configurado proxy para backend

### 🐛 Corrigido
- IDE reiniciando durante desenvolvimento (file watchers otimizados)
- Configurações de performance do VSCode
- Proxy do Vite para comunicação com backend

### 📚 Documentação
- Criada estrutura completa de documentação (15 arquivos)
- TASK-001-TESTING.md: Checklist de validação
- TROUBLESHOOTING.md: Guia de problemas comuns
- BEST_PRACTICES.md: Padrões de código
- GETTING_STARTED.md: Guia de início rápido

---

## [0.1.0] - 2024-XX-XX

### ✨ Adicionado
- Estrutura inicial do projeto
- Sistema de autenticação mock (Usuário/Admin)
- CRUD de itens (Snippets, Arquivos, Links)
- Sistema de comentários rico (texto + código + screenshot)
- Perfis de usuário com redes sociais
- Aba de contatos para networking
- Busca básica por título, descrição e autor
- Filtro por categoria
- Syntax highlighting com Prism.js
- Modais para criação/edição de conteúdo
- Sistema de moderação (soft delete de comentários)
- Upload de imagens para avatares
- Integração com Gemini AI

### 📚 Documentação
- PRD (Product Requirements Document)
- Especificação Funcional
- Schema de Banco de Dados
- Guia de Desenvolvimento
- Roadmap de features
- Template de tasks
- Guia de Melhores Práticas
- Documento de Lições Aprendidas

---

## Tipos de Mudanças

- **✨ Adicionado** - Para novas funcionalidades
- **🔄 Modificado** - Para mudanças em funcionalidades existentes
- **⚠️ Deprecated** - Para funcionalidades que serão removidas
- **🗑️ Removido** - Para funcionalidades removidas
- **🐛 Corrigido** - Para correções de bugs
- **🔒 Segurança** - Para correções de vulnerabilidades
- **⚡ Performance** - Para melhorias de performance
- **📚 Documentação** - Para mudanças na documentação

---

## Sprint 1 - Quick Wins (Planejado)

### ✨ Adicionado
- [x] TASK-001: Sistema de Tags básico
- [x] TASK-002: Favoritos/Bookmarks
- [x] TASK-003: Dark Mode
- [x] TASK-004: Preview Markdown em Tempo Real

---

## Sprint 2 - Engajamento (Planejado)

### ✨ Adicionado
- [ ] TASK-005: Reações (Útil/Ajudou)
- [ ] TASK-006: Marcar Solução Aceita
- [ ] TASK-007: Sistema de Reports
- [ ] TASK-008: Rate Limiting

---

## Sprint 3 - Descoberta (Planejado)

### ✨ Adicionado
- [ ] TASK-009: Busca Full-Text Otimizada
- [ ] TASK-010: Filtros Combinados Avançados
- [ ] TASK-011: Ordenações Múltiplas
- [ ] TASK-012: Seguir Tópicos/Notificações

---

## Sprint 4 - Colaboração Avançada (Planejado)

### ✨ Adicionado
- [ ] TASK-013: Fork/Clone de Snippets
- [ ] TASK-014: Versionamento de Snippets
- [ ] TASK-015: Compartilhamento Social
- [ ] TASK-016: Exportações (Download/PDF/Gist)

---

**Legenda de Status:**
- [ ] Planejado
- [⏳] Em desenvolvimento
- [✅] Concluído
- [❌] Cancelado

---

**Mantido por:** Time Vedovelli  
**Última Atualização:** {{ DATA_ATUAL }}
