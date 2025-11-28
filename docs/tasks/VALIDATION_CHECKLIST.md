# ✅ Checklist de Validação - Testes Manuais

> Use este checklist durante a validação manual de cada feature antes do commit.

---

## 📋 Como Usar Este Checklist

1. **Antes de Solicitar Validação:**
   - Execute você mesmo este checklist
   - Corrija tudo que encontrar
   - Só então solicite validação do operador

2. **Durante a Validação (Operador):**
   - Siga cada item metodicamente
   - Marque com ✅ ou ❌
   - Anote problemas encontrados
   - Reprove se houver qualquer ❌ crítico

3. **Após Aprovação:**
   - Guarde uma cópia do checklist preenchido
   - Documente issues em LESSONS_LEARNED.md
   - Prossiga com commit

---

## 🎯 Checklist Geral (Todas as Features)

### **1. Funcionalidade Básica**
- [ ] Feature funciona conforme especificado na task
- [ ] Todos os critérios de aceitação atendidos
- [ ] Não quebrou nenhuma funcionalidade existente
- [ ] Mensagens de erro são claras e úteis
- [ ] Feedback visual para ações (loading, sucesso, erro)

### **2. Interface e UX**
- [ ] Interface intuitiva e autoexplicativa
- [ ] Botões e elementos clicáveis têm hover/focus states
- [ ] Não há elementos sobrepostos ou cortados
- [ ] Textos legíveis (contraste, tamanho)
- [ ] Ícones e labels apropriados

### **3. Responsividade**
- [ ] Desktop (1920x1080) ✅
- [ ] Laptop (1366x768) ✅
- [ ] Tablet Portrait (768x1024) ✅
- [ ] Tablet Landscape (1024x768) ✅
- [ ] Mobile (375x667) ✅
- [ ] Mobile Grande (414x896) ✅

### **4. Navegação por Teclado**
- [ ] Tab percorre elementos na ordem lógica
- [ ] Enter/Space ativam botões/links
- [ ] Esc fecha modais/dropdowns
- [ ] Focus visible em todos os elementos interativos

### **5. Performance**
- [ ] Carregamento rápido (< 2s em conexão normal)
- [ ] Sem travamentos ou lags perceptíveis
- [ ] Animações suaves (60fps)
- [ ] Não há memory leaks (verificar DevTools)

### **6. Console e Erros**
- [ ] Sem erros no console (F12)
- [ ] Sem warnings críticos
- [ ] Requisições de rede bem-sucedidas (Network tab)
- [ ] Logs de debug removidos

### **7. Dados e Validação**
- [ ] Campos obrigatórios validados
- [ ] Validação de formato (email, URL, etc)
- [ ] Limites de caracteres respeitados
- [ ] Sanitização de input (segurança)
- [ ] Mensagens de validação claras

### **8. Estados**
- [ ] Estado inicial (vazio)
- [ ] Estado com dados
- [ ] Estado de loading
- [ ] Estado de erro
- [ ] Estado de sucesso

---

## 🏷️ Checklist Específico: Sistema de Tags (TASK-001)

### **Backend:**
- [ ] Endpoint POST /api/tags cria tag
- [ ] Endpoint GET /api/tags lista tags
- [ ] Endpoint GET /api/tags/popular retorna top tags
- [ ] Endpoint PUT /api/items/:id/tags atualiza tags
- [ ] Endpoint GET /api/items/by-tag/:slug busca por tag
- [ ] Tags com nomes duplicados não são criadas
- [ ] UsageCount atualizado corretamente
- [ ] Slugs gerados corretamente (lowercase, sem espaços)

### **Frontend - TagInput:**
- [ ] Digitar e adicionar tag funciona
- [ ] Pressionar Enter adiciona tag
- [ ] Pressionar vírgula adiciona tag
- [ ] Backspace remove última tag se input vazio
- [ ] Autocomplete aparece após 2 caracteres
- [ ] Sugestões filtram corretamente
- [ ] Clicar em sugestão adiciona tag
- [ ] Limite de 10 tags respeitado
- [ ] Feedback quando limite atingido
- [ ] Tags normalizadas (lowercase)
- [ ] Não permite tags duplicadas
- [ ] Botão X remove tag específica
- [ ] Input desabilitado ao atingir limite

### **Frontend - TagCloud:**
- [ ] Exibe tags populares
- [ ] Tamanho da fonte proporcional ao uso
- [ ] Clicar em tag filtra conteúdo
- [ ] Hover state visível
- [ ] Tooltip com contagem de itens

### **Integração:**
- [ ] Modal de criação exibe TagInput
- [ ] Modal de edição carrega tags existentes
- [ ] Salvar item persiste tags no banco
- [ ] Tags aparecem nos cards de item
- [ ] Filtro por tag funciona na listagem
- [ ] Múltiplas tags podem ser filtradas
- [ ] Limpar filtro remove todas as tags selecionadas

### **Cenários de Teste:**

#### **Teste 1: Criar Item com Tags**
1. [ ] Abrir modal "Novo Snippet"
2. [ ] Preencher título e código
3. [ ] Adicionar tag "react" (autocomplete sugere)
4. [ ] Adicionar tag "hooks" (nova)
5. [ ] Adicionar tag "typescript" (existente)
6. [ ] Salvar
7. [ ] Verificar: item criado com 3 tags
8. [ ] Verificar: tags aparecem no card

#### **Teste 2: Editar Tags**
1. [ ] Abrir item existente para edição
2. [ ] Verificar: tags carregadas corretamente
3. [ ] Remover 1 tag (clicar no X)
4. [ ] Adicionar 2 novas tags
5. [ ] Salvar
6. [ ] Verificar: alterações persistidas
7. [ ] Verificar: usageCount atualizado

#### **Teste 3: Filtrar por Tag**
1. [ ] Ver TagCloud na página principal
2. [ ] Clicar em tag "react"
3. [ ] Verificar: apenas itens com tag "react" exibidos
4. [ ] Adicionar tag "typescript" ao filtro
5. [ ] Verificar: apenas itens com AMBAS as tags
6. [ ] Limpar filtros
7. [ ] Verificar: todos os itens voltaram

#### **Teste 4: Limite de Tags**
1. [ ] Criar novo item
2. [ ] Adicionar 10 tags
3. [ ] Tentar adicionar 11ª tag
4. [ ] Verificar: bloqueado com feedback visual
5. [ ] Remover 1 tag
6. [ ] Verificar: pode adicionar novamente

#### **Teste 5: Autocomplete**
1. [ ] Começar a digitar "rea"
2. [ ] Verificar: sugere "react" se existir
3. [ ] Verificar: mostra contagem de uso
4. [ ] Digitar tag completamente nova
5. [ ] Verificar: nenhuma sugestão
6. [ ] Adicionar mesmo assim
7. [ ] Verificar: tag criada com sucesso

---

## 📱 Checklist Mobile Específico

### **Interação Touch:**
- [ ] Tap funciona como clique
- [ ] Sem double-tap zoom indesejado
- [ ] Swipe para scroll suave
- [ ] Teclado virtual não sobrepõe campos importantes
- [ ] Autocomplete funciona com teclado mobile

### **Layout Mobile:**
- [ ] Texto legível sem zoom
- [ ] Botões grandes o suficiente (min 44x44px)
- [ ] Espaçamento adequado entre elementos
- [ ] Nenhum scroll horizontal indesejado
- [ ] Modais ocupam tela apropriadamente

---

## 🎨 Checklist Dark Mode (TASK-003)

Quando implementado:
- [ ] Toggle dark/light funciona
- [ ] Preferência persiste (localStorage)
- [ ] Todas as páginas respeitam tema
- [ ] Syntax highlighting adaptado
- [ ] Contrastes adequados (WCAG AA)
- [ ] Transição suave entre temas
- [ ] Ícone do toggle representa estado atual

---

## 🔒 Checklist de Segurança

### **Input Validation:**
- [ ] XSS: HTML malicioso sanitizado
- [ ] SQL Injection: queries parametrizadas
- [ ] Upload: tipos de arquivo validados
- [ ] URL: validação de formato
- [ ] Tamanho: limites respeitados

### **Autenticação/Autorização:**
- [ ] Visitante não pode criar/editar
- [ ] Usuário só edita próprio conteúdo
- [ ] Admin tem acesso total
- [ ] Tokens não expostos no frontend
- [ ] Permissões verificadas no backend

---

## 📊 Checklist de Performance

### **Verificar no DevTools:**
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Sem layout shifts (CLS < 0.1)
- [ ] Imagens otimizadas
- [ ] Lazy loading onde aplicável

### **Network:**
- [ ] Requisições minimizadas
- [ ] Payloads razoáveis (< 100KB)
- [ ] Compressão gzip/brotli
- [ ] Cache headers apropriados

---

## 📝 Template de Relatório de Validação

```markdown
## Relatório de Validação - TASK-XXX

**Data:** DD/MM/YYYY
**Validador:** [Nome]
**Feature:** [Nome da Feature]
**Status:** ✅ Aprovada / ❌ Reprovada

### Testes Realizados:
- [x] Funcionalidade básica
- [x] Responsividade
- [x] Performance
- [ ] Acessibilidade (parcial)

### Problemas Encontrados:

#### Críticos (Impedem aprovação):
1. [Descrição do problema]
   - Como reproduzir
   - Comportamento esperado vs. atual

#### Menores (Não impedem aprovação):
1. [Descrição do problema]
   - Sugestão de melhoria

### Observações:
[Comentários gerais, sugestões, elogios]

### Decisão Final:
[ ] Aprovado - Pode commitar
[ ] Reprovado - Necessário correções
[ ] Aprovado com ressalvas - Criar issues para melhorias

**Assinatura:** _________________
```

---

## 🎯 Critérios de Aprovação vs Reprovação

### **✅ APROVAR se:**
- Todos os critérios críticos atendidos
- Funcionalidade core funciona perfeitamente
- Não quebrou nada existente
- Problemas menores documentados para depois

### **❌ REPROVAR se:**
- Qualquer critério crítico falhou
- Bug que impede uso da feature
- Performance muito ruim (> 5s loading)
- Quebrou funcionalidade existente
- Console cheio de erros

### **🔄 APROVAR COM RESSALVAS se:**
- Feature funciona mas tem melhorias óbvias
- UX pode ser refinada
- Performance ok mas poderia ser melhor
- Criar issues para tracking

---

## 💡 Dicas para Validação Eficiente

1. **Seja Metódico:** Siga o checklist linearmente
2. **Documente Tudo:** Screenshots de bugs ajudam
3. **Teste Cenários Extremos:** Campos vazios, dados inválidos
4. **Pense como Usuário:** É intuitivo? Entendi sem ler doc?
5. **Não Assuma:** Se não testou, não marque como OK
6. **Seja Construtivo:** Critique para melhorar, não para desanimar

---

## 🔗 Recursos

- [Chrome DevTools Guide](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WCAG Checklist](https://www.a11yproject.com/checklist/)
- [Responsive Design Checker](https://responsivedesignchecker.com/)

---

**Última Atualização:** {{ DATA_ATUAL }}  
**Versão:** 1.0  
**Mantenedor:** Time de QA Vedovelli
