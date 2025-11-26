# Test Suite - Repositório Vedovelli

Este diretório contém a suite de testes do projeto Repositório Vedovelli.

## 📋 Estrutura de Testes

```
tests/
├── unit/
│   ├── services/        # Testes de serviços (Gemini AI, etc.)
│   └── models/          # Testes de modelos de banco de dados
├── integration/
│   └── api/             # Testes de endpoints da API REST
├── components/          # Testes de componentes React
├── __mocks__/           # Mocks globais
└── setup.ts             # Configuração global de testes
```

## 🚀 Executando os Testes

### Todos os testes (modo watch)
```bash
npm test
```

### Executar testes uma vez
```bash
npm run test:run
```

### Interface visual dos testes
```bash
npm run test:ui
```

### Cobertura de código
```bash
npm run test:coverage
```

## 📊 Cobertura Atual

### Backend
- ✅ **Gemini Service**: Testes de integração com AI, fallbacks, e error handling
- ✅ **Database Models**: Validação de schemas, constraints, e relações
- ✅ **API Endpoints**: Testes de estrutura e validação de payloads

### Frontend
- ✅ **CodeBlock**: Renderização de código com syntax highlighting
- ✅ **ImageModal**: Exibição e fechamento de modais de imagem
- ✅ **ItemDetail**: Componente complexo com comentários e permissões

## 🧪 Tecnologias de Teste

- **Vitest**: Test runner (compatível com Vite)
- **React Testing Library**: Testes de componentes
- **Happy-DOM**: Ambiente DOM rápido para testes
- **Supertest**: Testes de API HTTP
- **Vi (Vitest Mocks)**: Sistema de mocking

## ✅ Boas Práticas

### Testes de Unidade
- Testam funcionalidades isoladas
- Usam mocks para dependências externas
- Foco em casos de uso e edge cases

### Testes de Integração
- Testam interação entre módulos
- Validam fluxos de dados completos
- Usam mocks apenas para APIs externas (Gemini, DB)

### Testes de Componentes
- Testam comportamento do usuário
- Verificam renderização condicional
- Validam interações (clicks, inputs)

## 🔒 Segurança

Os testes identificam e documentam possíveis vulnerabilidades:

- ✅ SQL Injection (validação de inputs)
- ✅ XSS (escape de HTML em comentários)
- ✅ Authorization (permissões de edição/exclusão)
- ✅ File Upload (limite de 50MB)
- ⚠️ **Atenção**: Alguns testes documentam vulnerabilidades que ainda precisam ser corrigidas no código de produção

## 📝 Escrevendo Novos Testes

### Exemplo de teste unitário:
```typescript
import { describe, it, expect } from 'vitest';

describe('MyFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

### Exemplo de teste de componente:
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

it('should render text', () => {
  render(<MyComponent text="Hello" />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## 🐛 Depuração

Para debugar testes específicos:

```bash
# Executar apenas um arquivo
npm test -- tests/unit/services/geminiService.test.ts

# Executar apenas testes que correspondam ao padrão
npm test -- -t "should generate description"

# Modo verbose
npm test -- --reporter=verbose
```

## 📈 Próximos Passos

- [ ] Adicionar testes E2E com Playwright
- [ ] Integrar com CI/CD (GitHub Actions)
- [ ] Aumentar cobertura para 80%+
- [ ] Testes de performance com benchmarks
- [ ] Testes de acessibilidade (a11y)

## 🤝 Contribuindo

Ao adicionar novas funcionalidades:

1. ✅ Escreva os testes **antes** do código (TDD)
2. ✅ Mantenha cobertura acima de 70%
3. ✅ Documente edge cases nos testes
4. ✅ Execute `npm run test:coverage` antes de fazer commit

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
