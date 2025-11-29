# TASK-004: Preview Markdown em Tempo Real

## 📋 Informações Gerais

- **Prioridade:** 🟡 Média
- **Estimativa:** 6-8 horas
- **Sprint:** Sprint 1 - Quick Wins
- **Status:** ✅ Concluída
- **Tipo:** Feature
- **Dependências:** Nenhuma

---

## 🎯 Objetivo

Implementar um sistema de preview markdown em tempo real para o campo de descrição dos itens, permitindo que usuários visualizem o texto formatado enquanto digitam, melhorando a experiência de criação e edição de conteúdo.

---

## 📝 Descrição

Atualmente, os campos de descrição e comentários aceitam apenas texto simples. Esta task adiciona suporte a Markdown com preview em tempo real, permitindo formatação rica (negrito, itálico, listas, links, código inline, etc.) tanto no modal de criação/edição quanto nos comentários.

---

## ✅ Checklist de Implementação

### Subtask 1: Instalação de Dependências (30min)

#### 1.1 Instalar Bibliotecas Necessárias
- [ ] Instalar `react-markdown` para renderização
  ```bash
  npm install react-markdown
  ```
- [ ] Instalar `remark-gfm` para suporte GitHub Flavored Markdown
  ```bash
  npm install remark-gfm
  ```
- [ ] Instalar `rehype-sanitize` para segurança (prevenir XSS)
  ```bash
  npm install rehype-sanitize
  ```
- [ ] Instalar tipos TypeScript
  ```bash
  npm install --save-dev @types/react-markdown
  ```

---

### Subtask 2: Criar Componente MarkdownEditor (2h)

#### 2.1 Estrutura do Componente
- [ ] Criar arquivo `components/MarkdownEditor.tsx`
- [ ] Props:
  - `value: string` - Texto atual
  - `onChange: (value: string) => void` - Callback de mudança
  - `placeholder?: string` - Placeholder
  - `minRows?: number` - Linhas mínimas (padrão: 5)
  - `maxRows?: number` - Linhas máximas
  - `showPreview?: boolean` - Mostrar preview por padrão

#### 2.2 Funcionalidades
- [ ] Tabs para alternar entre "Editar" e "Preview"
- [ ] Suporte a Dark Mode
- [ ] Toolbar com botões de formatação rápida:
  - [ ] Negrito (`**texto**`)
  - [ ] Itálico (`*texto*`)
  - [ ] Link (`[texto](url)`)
  - [ ] Código inline (`` `código` ``)
  - [ ] Lista (`- item`)
  - [ ] Lista numerada (`1. item`)
  - [ ] Citação (`> texto`)
  - [ ] Código em bloco (` ``` `)
- [ ] Preview em tempo real ao trocar para aba "Preview"
- [ ] Contador de caracteres
- [ ] Validação de tamanho máximo

#### 2.3 Estilos
- [ ] Estilizar tabs com indicador ativo
- [ ] Estilizar toolbar com ícones
- [ ] Estilizar área de preview para parecer com o resultado final
- [ ] Responsivo (mobile-friendly)
- [ ] Transições suaves entre tabs

---

### Subtask 3: Criar Componente MarkdownViewer (1h)

#### 3.1 Componente de Renderização
- [ ] Criar arquivo `components/MarkdownViewer.tsx`
- [ ] Props:
  - `content: string` - Markdown a ser renderizado
  - `className?: string` - Classes adicionais

#### 3.2 Configuração
- [ ] Usar `react-markdown` com `remark-gfm`
- [ ] Adicionar `rehype-sanitize` para segurança
- [ ] Customizar componentes HTML renderizados:
  - Links abrem em nova aba (`target="_blank"`)
  - Código usa syntax highlighting (opcional)
  - Imagens responsivas

#### 3.3 Estilos Markdown
- [ ] Criar estilos para elementos markdown:
  - Headings (h1-h6)
  - Parágrafos
  - Listas
  - Blockquotes
  - Links
  - Código inline e blocos
  - Tabelas
  - Linhas horizontais
- [ ] Suporte a Dark Mode
- [ ] Espaçamento adequado

---

### Subtask 4: Integrar no Modal de Criação/Edição (1.5h)

#### 4.1 Substituir Textarea no App.tsx
- [ ] Substituir campo "Descrição Curta" por `MarkdownEditor`
- [ ] Manter compatibilidade com código existente
- [ ] Adicionar hint sobre suporte a Markdown
- [ ] Testar criação de novo item
- [ ] Testar edição de item existente

#### 4.2 Ajustar Backend (se necessário)
- [ ] Verificar se campo `description` suporta texto longo
- [ ] Aumentar tamanho do campo se necessário
- [ ] Testar salvamento de markdown com caracteres especiais

---

### Subtask 5: Integrar em Comentários (1.5h)

#### 5.1 Atualizar ItemDetail.tsx
- [ ] Substituir textarea de comentário por `MarkdownEditor`
- [ ] Usar `MarkdownViewer` para exibir comentários existentes
- [ ] Manter funcionalidade de edição
- [ ] Manter funcionalidade de screenshot

#### 5.2 Ajustar Estilos
- [ ] Comentários renderizados com markdown ficam legíveis
- [ ] Preview de edição de comentário funciona
- [ ] Dark mode funciona corretamente

---

### Subtask 6: Adicionar Guia Rápido de Markdown (30min)

#### 6.1 Tooltip ou Popover
- [ ] Criar tooltip com guia rápido
- [ ] Botão "?" ou "Ajuda" no editor
- [ ] Exemplos de sintaxe markdown:
  ```markdown
  **negrito**
  *itálico*
  [link](url)
  `código`
  - lista
  > citação
  ```

#### 6.2 Link para Documentação
- [ ] Link para guia completo de markdown
- [ ] Opcional: Modal com tutorial interativo

---

### Subtask 7: Testes e Validação (1.5h)

#### 7.1 Testes Manuais
- [ ] **Criação de Item:**
  - [ ] Criar item com descrição markdown
  - [ ] Verificar preview funciona
  - [ ] Verificar formatação salva corretamente
  - [ ] Verificar renderização na lista

- [ ] **Edição de Item:**
  - [ ] Editar item existente
  - [ ] Alterar formatação markdown
  - [ ] Verificar preview atualiza
  - [ ] Salvar e verificar mudanças

- [ ] **Comentários:**
  - [ ] Adicionar comentário com markdown
  - [ ] Verificar renderização
  - [ ] Editar comentário com markdown
  - [ ] Verificar preview na edição

- [ ] **Formatação:**
  - [ ] Negrito funciona
  - [ ] Itálico funciona
  - [ ] Links funcionam (abrem em nova aba)
  - [ ] Listas funcionam
  - [ ] Código inline funciona
  - [ ] Blocos de código funcionam
  - [ ] Citações funcionam

- [ ] **Dark Mode:**
  - [ ] Editor funciona em dark mode
  - [ ] Preview funciona em dark mode
  - [ ] Comentários renderizados funcionam em dark mode
  - [ ] Toolbar visível em dark mode

- [ ] **Responsividade:**
  - [ ] Editor funciona em mobile
  - [ ] Tabs são clicáveis em mobile
  - [ ] Toolbar é usável em mobile

#### 7.2 Casos Extremos
- [ ] Texto muito longo (5000+ caracteres)
- [ ] Markdown malformado
- [ ] HTML inline (deve ser sanitizado)
- [ ] Scripts maliciosos (XSS - deve ser bloqueado)
- [ ] Emojis e caracteres especiais
- [ ] Múltiplos níveis de lista
- [ ] Tabelas complexas

#### 7.3 Performance
- [ ] Preview não trava com texto longo
- [ ] Alternar tabs é rápido
- [ ] Não há lag ao digitar
- [ ] Múltiplos editores na mesma página funcionam

---

## 📊 Critérios de Aceitação

- [ ] MarkdownEditor funciona em modais de criação/edição
- [ ] MarkdownViewer renderiza markdown corretamente
- [ ] Comentários suportam markdown
- [ ] Toolbar com formatação rápida funciona
- [ ] Preview em tempo real funciona
- [ ] Dark mode totalmente suportado
- [ ] Responsivo e mobile-friendly
- [ ] Conteúdo é sanitizado (sem XSS)
- [ ] Guia rápido de markdown disponível
- [ ] Zero bugs conhecidos

---

## 🎨 Mockup da Interface

### Editor
```
┌─────────────────────────────────────┐
│ [Editar] [Preview]           [?]    │
├─────────────────────────────────────┤
│ [B] [I] [Link] [`] [List] [Quote]  │
├─────────────────────────────────────┤
│                                     │
│ Digite aqui...                      │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ 245/5000 caracteres                 │
└─────────────────────────────────────┘
```

### Preview
```
┌─────────────────────────────────────┐
│ [Editar] [Preview]           [?]    │
├─────────────────────────────────────┤
│                                     │
│ Isso é **negrito** e *itálico*     │
│                                     │
│ • Item 1                            │
│ • Item 2                            │
│                                     │
│ [Ver mais](https://...)             │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔍 Formatação Suportada

### Básico
- `**negrito**` → **negrito**
- `*itálico*` → *itálico*
- `~~riscado~~` → ~~riscado~~
- `[link](url)` → link clicável

### Listas
- `- item` → lista não ordenada
- `1. item` → lista ordenada
- `- [ ] task` → checkbox (GitHub Flavored)

### Código
- `` `código` `` → código inline
- ` ``` ` → bloco de código
- ` ```javascript ` → código com sintaxe

### Outros
- `> citação` → blockquote
- `---` → linha horizontal
- Tabelas (sintaxe GitHub)
- Imagens (se suportado)

---

## 🚀 Melhorias Futuras

- [ ] Syntax highlighting para blocos de código
- [ ] Suporte a emojis (`:smile:`)
- [ ] Modo split (editor e preview lado a lado)
- [ ] Atalhos de teclado (Ctrl+B para negrito, etc.)
- [ ] Upload de imagens inline
- [ ] Drag & drop de imagens
- [ ] Auto-save de rascunhos
- [ ] Templates de markdown predefinidos
- [ ] Exportar como PDF/HTML
- [ ] Diff view para edições

---

## 📝 Notas Técnicas

### Bibliotecas Escolhidas
- **react-markdown**: Biblioteca madura e bem mantida para renderizar markdown
- **remark-gfm**: Adiciona suporte a GitHub Flavored Markdown (tabelas, checkboxes, etc.)
- **rehype-sanitize**: Sanitiza HTML para prevenir XSS

### Segurança
- Todo HTML inline é sanitizado por padrão
- Scripts são removidos automaticamente
- Links externos abrem em nova aba com `rel="noopener noreferrer"`

### Performance
- Renderização de markdown é rápida (< 50ms para textos normais)
- Debounce pode ser adicionado se necessário
- Lazy loading de syntax highlighting (se implementado)

### Compatibilidade
- Funciona em todos os navegadores modernos
- Degrada gracefully em navegadores antigos
- Não quebra funcionalidade existente

---

## 📚 Recursos Úteis

- [React Markdown Docs](https://remarkjs.github.io/react-markdown/)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Remark GFM](https://github.com/remarkjs/remark-gfm)
- [Rehype Sanitize](https://github.com/rehypejs/rehype-sanitize)

---

## ⚠️ Problemas Conhecidos

- Syntax highlighting de código pode aumentar bundle size
- Tabelas complexas podem não renderizar bem em mobile
- Algumas extensões markdown não são suportadas por padrão

---

## 🎉 Benefícios

✅ **Melhor UX**: Usuários veem formatação enquanto digitam  
✅ **Documentação Rica**: Descrições e comentários mais informativos  
✅ **Profissional**: Interface moderna e profissional  
✅ **Flexibilidade**: Suporte a listas, código, links, etc.  
✅ **Segurança**: Conteúdo sanitizado contra XSS  
✅ **Padrão da Indústria**: Markdown é amplamente conhecido

---

**Status:** ⏳ Pronta para desenvolvimento  
**Responsável:** A definir  
**Revisão:** Pendente
