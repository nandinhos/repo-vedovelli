# 🌙 TASK-003: Dark Mode

**Sprint:** 1 - Quick Wins  
**Prioridade:** 🟡 Média  
**Status:** 🚧 Em Desenvolvimento  
**Estimativa:** 4-6 horas  
**Responsável:** Time Vedovelli  
**Dependências:** Nenhuma

---

## 📋 Descrição

Implementar tema escuro (Dark Mode) completo na aplicação, permitindo que usuários alternem entre tema claro e escuro. O tema deve ser persistido no localStorage e aplicado automaticamente ao carregar a aplicação.

---

## 🎯 Objetivos

- Toggle dark/light mode com botão visível
- Persistir preferência no localStorage
- Aplicar tema automaticamente ao carregar
- Adaptar TODOS os componentes para dark mode
- Syntax highlighting adaptado para dark mode
- Transição suave entre temas
- Ícone de sol/lua no toggle

---

## 📐 Especificação Técnica

### **Abordagem: Tailwind CSS Dark Mode**

Tailwind já tem suporte nativo para dark mode usando a classe `dark:` prefix.

#### 1. Configuração do Tailwind

**`tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilita dark mode via classe
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 2. Hook Customizado para Theme

**`hooks/useTheme.ts`**
```typescript
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verificar localStorage primeiro
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Senão, verificar preferência do sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remover classes antigas
    root.classList.remove('light', 'dark');
    
    // Adicionar nova classe
    root.classList.add(theme);
    
    // Salvar no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};
```

#### 3. Componente Toggle Button

**`components/ThemeToggle.tsx`**
```typescript
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative p-2 rounded-lg
        transition-all duration-300
        ${theme === 'dark' 
          ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
      title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`
            absolute inset-0 transition-all duration-300
            ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `} 
          size={20} 
        />
        <Moon 
          className={`
            absolute inset-0 transition-all duration-300
            ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `} 
          size={20} 
        />
      </div>
    </button>
  );
};
```

---

### **Classes Dark Mode por Componente**

#### 4. Cores Base (App.tsx - Container principal)

```typescript
// Background principal
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">

// Cards
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">

// Texto
<h1 className="text-gray-900 dark:text-gray-100">
<p className="text-gray-600 dark:text-gray-400">
<span className="text-gray-500 dark:text-gray-500">
```

#### 5. Header/Navigation

```typescript
// Header
<header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">

// Botões de navegação (abas)
<button className={`
  ${activeTab === 'snippets'
    ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700'
    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
  }
`}>
```

#### 6. Inputs e Forms

```typescript
// Input text
<input className="
  bg-white dark:bg-gray-700 
  border border-gray-300 dark:border-gray-600
  text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-500
  focus:ring-blue-500 dark:focus:ring-blue-400
" />

// Select
<select className="
  bg-white dark:bg-gray-700
  border border-gray-300 dark:border-gray-600
  text-gray-900 dark:text-gray-100
">

// Textarea
<textarea className="
  bg-white dark:bg-gray-700
  text-gray-900 dark:text-gray-100
  border border-gray-300 dark:border-gray-600
" />
```

#### 7. Buttons

```typescript
// Botão primário
<button className="
  bg-indigo-600 dark:bg-indigo-500 
  hover:bg-indigo-700 dark:hover:bg-indigo-600
  text-white
">

// Botão secundário
<button className="
  bg-gray-200 dark:bg-gray-700
  hover:bg-gray-300 dark:hover:bg-gray-600
  text-gray-900 dark:text-gray-100
">

// Botão perigo
<button className="
  bg-red-600 dark:bg-red-500
  hover:bg-red-700 dark:hover:bg-red-600
  text-white
">
```

#### 8. Modals

```typescript
// Backdrop
<div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70">

// Modal content
<div className="
  bg-white dark:bg-gray-800 
  border border-gray-200 dark:border-gray-700
  shadow-xl
">

// Modal header
<div className="border-b border-gray-200 dark:border-gray-700">
```

#### 9. Code Blocks (Syntax Highlighting)

Para o Prism.js, precisamos de temas diferentes:

**`components/CodeBlock.tsx`** (adicionar lógica de tema)

```typescript
import { useTheme } from '../hooks/useTheme';

export const CodeBlock = ({ code, language }) => {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Carregar tema do Prism baseado no tema atual
    const linkId = 'prism-theme';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    // Trocar tema do Prism
    link.href = theme === 'dark'
      ? 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
  }, [theme]);
  
  return (
    <pre className="
      bg-gray-100 dark:bg-gray-900 
      border border-gray-200 dark:border-gray-700
    ">
      <code>{code}</code>
    </pre>
  );
};
```

#### 10. Tags

```typescript
// TagCloud
<button className="
  bg-gray-100 dark:bg-gray-700 
  text-gray-600 dark:text-gray-300
  hover:bg-gray-200 dark:hover:bg-gray-600
">

// Tag selecionada
<button className="
  bg-blue-600 dark:bg-blue-500 
  text-white
">

// TagDisplay
<span className="
  bg-gray-100 dark:bg-gray-700 
  text-gray-600 dark:text-gray-300
">
```

#### 11. ItemDetail (Expanded View)

```typescript
<div className="
  bg-gray-50 dark:bg-gray-900 
  border-t border-gray-200 dark:border-gray-700
">

// Seção de comentários
<div className="
  bg-white dark:bg-gray-800 
  border border-gray-200 dark:border-gray-700
">

// Comentário individual
<div className="
  bg-gray-50 dark:bg-gray-800 
  hover:bg-gray-100 dark:hover:bg-gray-700
">
```

---

## ✅ Critérios de Aceitação

### Funcionalidade:
- [ ] Toggle dark/light mode funciona
- [ ] Tema persiste no localStorage
- [ ] Tema aplicado automaticamente ao carregar
- [ ] Ícone muda (sol ↔ lua)
- [ ] Detecção de preferência do sistema (opcional)

### UI/UX:
- [ ] TODOS os componentes adaptados para dark mode
- [ ] Contraste adequado em ambos os temas (WCAG AA)
- [ ] Syntax highlighting funciona em ambos os temas
- [ ] Transição suave entre temas (não pisca)
- [ ] Cores consistentes em toda aplicação
- [ ] Legibilidade mantida em dark mode

### Performance:
- [ ] Troca de tema instantânea (< 100ms)
- [ ] Sem flash de conteúdo ao carregar
- [ ] Não causa re-render desnecessário

### Componentes a Adaptar:
- [ ] App.tsx (container principal)
- [ ] Header/Navigation
- [ ] Cards de itens
- [ ] Modals (todos)
- [ ] Forms (inputs, selects, textareas)
- [ ] Buttons (todos os tipos)
- [ ] CodeBlock (syntax highlighting)
- [ ] ItemDetail
- [ ] Comments
- [ ] Tags (TagCloud, TagDisplay, TagInput)
- [ ] FavoriteButton
- [ ] UserProfileModal
- [ ] ImageModal
- [ ] Contacts

---

## 🧪 Plano de Testes

### Teste 1: Toggle Básico
1. Clicar no botão de tema (sol/lua)
2. Verificar:
   - Ícone muda
   - Cores mudam instantaneamente
   - Transição suave

### Teste 2: Persistência
1. Mudar para dark mode
2. Recarregar página (F5)
3. Verificar:
   - Dark mode mantido
   - Não houve flash de light mode

### Teste 3: Todos os Componentes
1. Navegar por todas as abas
2. Abrir modals
3. Expandir itens
4. Verificar:
   - Todas as cores adaptadas
   - Nenhum elemento "branco" piscando

### Teste 4: Syntax Highlighting
1. Ver snippet de código
2. Mudar tema
3. Verificar:
   - Cores do código mudam
   - Contraste adequado
   - Legível em ambos os temas

### Teste 5: Forms
1. Abrir modal de novo item
2. Preencher campos
3. Verificar:
   - Inputs com cor correta
   - Placeholder legível
   - Focus ring visível

### Teste 6: Contraste
1. Testar com ferramenta de contraste
2. Verificar:
   - Texto principal: contraste > 4.5:1
   - Texto secundário: contraste > 3:1

---

## 📦 Dependências

### NPM Packages:
- ✅ lucide-react (já instalado - ícones Sun/Moon)
- ✅ Tailwind CSS (já configurado)
- ✅ Prism.js (já instalado - syntax highlighting)

### Arquivos a Criar:
- [ ] `hooks/useTheme.ts`
- [ ] `components/ThemeToggle.tsx`

### Arquivos a Modificar:
- [ ] `tailwind.config.js` (adicionar darkMode: 'class')
- [ ] `App.tsx` (adicionar ThemeToggle e classes dark:)
- [ ] `components/CodeBlock.tsx` (adaptar tema do Prism)
- [ ] `components/ItemDetail.tsx` (classes dark:)
- [ ] `components/UserProfileModal.tsx` (classes dark:)
- [ ] `components/ImageModal.tsx` (classes dark:)
- [ ] `components/CodeInsertionModal.tsx` (classes dark:)
- [ ] `components/TagCloud.tsx` (classes dark:)
- [ ] `components/TagInput.tsx` (classes dark:)
- [ ] `components/TagDisplay.tsx` (classes dark:)
- [ ] `components/FavoriteButton.tsx` (classes dark:)

---

## 🚀 Sequência de Implementação

### **Fase 1: Setup (1h)**
1. Criar hook useTheme.ts
2. Criar componente ThemeToggle.tsx
3. Configurar tailwind.config.js
4. Adicionar toggle no header do App.tsx
5. Testar toggle básico

### **Fase 2: Componentes Principais (2h)**
6. Adaptar App.tsx (container, header, cards)
7. Adaptar modals (todos)
8. Adaptar forms (inputs, selects, textareas)
9. Adaptar buttons (todos os tipos)
10. Testar navegação básica

### **Fase 3: Componentes Específicos (1h)**
11. Adaptar CodeBlock (Prism.js temas)
12. Adaptar ItemDetail
13. Adaptar Comments
14. Adaptar Tags (Cloud, Display, Input)
15. Adaptar FavoriteButton

### **Fase 4: Polish e Testes (1h)**
16. Ajustar cores para melhor contraste
17. Testar em todos os cenários
18. Verificar transições
19. Validar com operador
20. Commit

---

## 📝 Notas de Implementação

### Paleta de Cores Dark Mode:

**Backgrounds:**
- `dark:bg-gray-900` - Background principal
- `dark:bg-gray-800` - Cards, modals
- `dark:bg-gray-700` - Inputs, hovers

**Textos:**
- `dark:text-gray-100` - Texto principal
- `dark:text-gray-300` - Texto secundário
- `dark:text-gray-400` - Texto terciário
- `dark:text-gray-500` - Texto disabled

**Borders:**
- `dark:border-gray-700` - Borders principais
- `dark:border-gray-600` - Borders secundários

**Cores de Destaque:**
- `dark:bg-indigo-500` (azul primário)
- `dark:bg-red-500` (vermelho)
- `dark:bg-green-500` (verde)
- `dark:bg-yellow-500` (amarelo)

### Temas do Prism.js:

**Light Mode:**
- `prism.min.css` (tema padrão)

**Dark Mode:**
- `prism-tomorrow.min.css` (tema escuro)
- Ou `prism-okaidia.min.css` (alternativa)

### Dicas:

1. **Começar de dentro para fora:** Adaptar componentes menores primeiro
2. **Usar Tailwind dark: prefix:** Não criar classes CSS customizadas
3. **Testar frequentemente:** Alternar tema a cada mudança
4. **Consistência:** Usar mesma paleta em toda aplicação
5. **Acessibilidade:** Sempre verificar contraste

---

## 🔗 Referências

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Prism Themes](https://prismjs.com/themes/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)

---

**Status:** 🚧 Em Desenvolvimento  
**Próximo Passo:** Criar hook useTheme e componente ThemeToggle
