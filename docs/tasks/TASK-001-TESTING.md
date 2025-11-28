# 🧪 TASK-001: Checklist de Testes - Sistema de Tags

**Data:** 24/11/2024  
**Status:** 🔄 Em Validação  
**Testador:** Operador

---

## ✅ PRÉ-REQUISITOS

- [x] Servidor backend rodando (`http://localhost:3000`)
- [x] Frontend rodando (`http://localhost:3001`)
- [x] Banco de dados conectado
- [x] IDE estável (não reiniciando)

---

## 🧪 TESTES A EXECUTAR

### **1. Backend - Verificar APIs** 

#### Teste 1.1: Listar Tags Populares
```bash
# No terminal, executar:
curl http://localhost:3000/api/tags/popular

# Resultado esperado:
# { "success": true, "data": [...] }
```
- [ ] API responde
- [ ] Status 200
- [ ] Retorna array de tags

#### Teste 1.2: Buscar Todas as Tags
```bash
curl http://localhost:3000/api/tags

# Resultado esperado:
# { "success": true, "data": [...] }
```
- [ ] API responde
- [ ] Retorna todas as tags

---

### **2. Frontend - TagCloud (Página Principal)**

#### Teste 2.1: Visualizar TagCloud
**Passos:**
1. Abrir `http://localhost:3001` no navegador
2. Verificar se há uma seção com nuvem de tags

**Verificar:**
- [ ] TagCloud aparece na página
- [ ] Tags exibidas com tamanhos diferentes
- [ ] Tags maiores = mais usadas
- [ ] Hover funciona (muda cor/escala)
- [ ] Tooltip mostra contagem

#### Teste 2.2: Clicar em Tag para Filtrar
**Passos:**
1. Clicar em uma tag no TagCloud
2. Verificar se filtra os itens

**Verificar:**
- [ ] Itens são filtrados pela tag clicada
- [ ] Tag fica destacada (sublinhada)
- [ ] Apenas itens com aquela tag aparecem
- [ ] Contador de itens atualiza

#### Teste 2.3: Filtrar por Múltiplas Tags
**Passos:**
1. Clicar em uma tag
2. Clicar em outra tag (adicionar ao filtro)

**Verificar:**
- [ ] Ambas as tags ficam destacadas
- [ ] Apenas itens com TODAS as tags aparecem
- [ ] Pode limpar filtros

---

### **3. Frontend - TagInput (Criar/Editar Item)**

#### Teste 3.1: Abrir Modal de Novo Item
**Passos:**
1. Clicar em "Novo Snippet" (ou File/Link)
2. Verificar campo de Tags

**Verificar:**
- [ ] Campo TagInput aparece no formulário
- [ ] Placeholder "Adicionar tag..." visível
- [ ] Campo focável

#### Teste 3.2: Adicionar Tag Pressionando Enter
**Passos:**
1. Digitar "react" no campo
2. Pressionar Enter

**Verificar:**
- [ ] Tag "react" aparece como badge azul
- [ ] Input limpa automaticamente
- [ ] Badge tem botão X para remover

#### Teste 3.3: Adicionar Tag Pressionando Vírgula
**Passos:**
1. Digitar "typescript,"
2. Verificar resultado

**Verificar:**
- [ ] Tag adicionada ao pressionar vírgula
- [ ] Input limpa
- [ ] Funciona igual ao Enter

#### Teste 3.4: Autocomplete de Tags Existentes
**Passos:**
1. Digitar "rea" no campo
2. Observar sugestões

**Verificar:**
- [ ] Dropdown de sugestões aparece
- [ ] Mostra tags que contêm "rea" (ex: "react")
- [ ] Mostra contagem de uso ao lado
- [ ] Clicar na sugestão adiciona a tag

#### Teste 3.5: Remover Tag com X
**Passos:**
1. Adicionar 2-3 tags
2. Clicar no X de uma tag

**Verificar:**
- [ ] Tag é removida
- [ ] Outras tags permanecem
- [ ] Sem erros no console

#### Teste 3.6: Remover Tag com Backspace
**Passos:**
1. Adicionar 2 tags
2. Com input vazio, pressionar Backspace

**Verificar:**
- [ ] Última tag é removida
- [ ] Funciona igual ao clicar no X

#### Teste 3.7: Limite de 10 Tags
**Passos:**
1. Adicionar 10 tags
2. Tentar adicionar a 11ª

**Verificar:**
- [ ] Input desabilita após 10 tags
- [ ] Mensagem "Limite atingido" aparece
- [ ] Não permite adicionar mais tags
- [ ] Pode remover e adicionar novamente

#### Teste 3.8: Tags Normalizadas (lowercase)
**Passos:**
1. Digitar "REACT" (maiúsculo)
2. Adicionar

**Verificar:**
- [ ] Tag salva como "react" (minúsculo)
- [ ] Normalização automática

#### Teste 3.9: Não Permite Tags Duplicadas
**Passos:**
1. Adicionar "react"
2. Tentar adicionar "react" novamente

**Verificar:**
- [ ] Não adiciona tag duplicada
- [ ] Feedback visual (ou sem ação)

---

### **4. Frontend - Salvar Item com Tags**

#### Teste 4.1: Criar Novo Snippet com Tags
**Passos:**
1. Abrir modal "Novo Snippet"
2. Preencher:
   - Título: "Teste de Tags"
   - Categoria: Frontend
   - Linguagem: JavaScript
   - Código: `console.log("test");`
3. Adicionar tags: "react", "hooks", "test"
4. Clicar em Salvar

**Verificar:**
- [ ] Item criado com sucesso
- [ ] Modal fecha
- [ ] Item aparece na listagem
- [ ] Tags visíveis no card do item (TagDisplay)

#### Teste 4.2: Verificar Tags no Card
**Passos:**
1. Localizar o item criado
2. Verificar área de tags

**Verificar:**
- [ ] Tags aparecem como badges azuis
- [ ] Máximo 5 tags visíveis
- [ ] Se mais de 5, mostra "+N" 
- [ ] Tags clicáveis (filtram ao clicar)

---

### **5. Frontend - Editar Tags de Item Existente**

#### Teste 5.1: Abrir Item para Edição
**Passos:**
1. Clicar em "Editar" em um item existente
2. Verificar campo de tags

**Verificar:**
- [ ] Tags atuais carregadas no TagInput
- [ ] Tags aparecem como badges
- [ ] Pode remover tags existentes
- [ ] Pode adicionar novas tags

#### Teste 5.2: Remover uma Tag e Salvar
**Passos:**
1. Remover 1 tag (clicar no X)
2. Salvar

**Verificar:**
- [ ] Item atualizado
- [ ] Tag removida não aparece mais
- [ ] Outras tags permanecem
- [ ] UsageCount atualiza

#### Teste 5.3: Adicionar Novas Tags e Salvar
**Passos:**
1. Adicionar 2 novas tags
2. Salvar

**Verificar:**
- [ ] Item atualizado
- [ ] Novas tags aparecem
- [ ] Tags antigas mantidas
- [ ] Total de tags correto

---

### **6. Integração - TagCloud Atualiza**

#### Teste 6.1: TagCloud Reflete Mudanças
**Passos:**
1. Criar item com tag nova "nova-tag"
2. Verificar TagCloud

**Verificar:**
- [ ] Nova tag aparece no TagCloud
- [ ] UsageCount = 1
- [ ] Tag clicável

#### Teste 6.2: UsageCount Incrementa
**Passos:**
1. Criar 3 itens com tag "popular"
2. Verificar TagCloud

**Verificar:**
- [ ] Tag "popular" com usageCount = 3
- [ ] Tag aparece maior no cloud
- [ ] Tooltip mostra "3 itens"

---

### **7. Responsividade**

#### Teste 7.1: Mobile (375x667)
**Passos:**
1. Abrir DevTools (F12)
2. Mudar para resolução mobile
3. Testar todas as funcionalidades

**Verificar:**
- [ ] TagCloud responsivo
- [ ] TagInput funciona em mobile
- [ ] Tags no card legíveis
- [ ] Modal de edição usa tela toda
- [ ] Autocomplete não sai da tela

#### Teste 7.2: Tablet (768x1024)
**Passos:**
1. Testar em tablet

**Verificar:**
- [ ] Layout adequado
- [ ] Touch funciona
- [ ] Todas funcionalidades OK

---

### **8. Performance e Console**

#### Teste 8.1: Verificar Console (F12)
**Verificar:**
- [ ] Sem erros no console
- [ ] Sem warnings críticos
- [ ] Requests com status 200

#### Teste 8.2: Network Tab
**Verificar:**
- [ ] GET /api/tags/popular - 200 OK
- [ ] GET /api/items (com tags) - 200 OK
- [ ] PUT /api/items/:id/tags - 200 OK
- [ ] Payload razoável (< 100KB)

#### Teste 8.3: Performance
**Verificar:**
- [ ] TagCloud carrega rápido (< 500ms)
- [ ] Autocomplete responde rápido (< 300ms)
- [ ] Salvar com tags rápido (< 1s)
- [ ] Sem lags ou travamentos

---

## 📊 RESUMO DA VALIDAÇÃO

### **Funcionalidades Testadas:**
- [ ] Backend APIs (5 endpoints)
- [ ] TagCloud (visualização e filtro)
- [ ] TagInput (adicionar/remover/autocomplete)
- [ ] Criar item com tags
- [ ] Editar tags de item
- [ ] TagDisplay em cards
- [ ] Responsividade (mobile/tablet)
- [ ] Performance e console

### **Bugs Encontrados:**
```
1. [Descrição do bug]
   - Como reproduzir:
   - Resultado esperado:
   - Resultado atual:

2. ...
```

### **Melhorias Sugeridas (Não Bloqueantes):**
```
1. [Sugestão]
2. ...
```

---

## ✅ DECISÃO FINAL

### **Status:**
- [ ] ✅ APROVADO - Pode commitar
- [ ] ❌ REPROVADO - Necessário correções (listar acima)
- [ ] 🔄 APROVADO COM RESSALVAS - Criar issues para melhorias

### **Assinatura do Validador:**
**Nome:** ___________________  
**Data:** ___________________  
**Observações:** ___________________

---

## 🚀 PRÓXIMOS PASSOS (Após Aprovação)

1. [ ] Commitar código
2. [ ] Atualizar CHANGELOG.md
3. [ ] Atualizar LESSONS_LEARNED.md
4. [ ] Marcar TASK-001 como concluída
5. [ ] Escolher próxima task

---

**Boa sorte nos testes! 🎯**
