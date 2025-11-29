# TASK-101: Revisão e Validação do CRUD de Usuários (Admin Panel)

## 📋 Informações Gerais

- **Prioridade:** 🟡 Média
- **Estimativa:** 10-12 horas
- **Sprint:** Backlog - Revisão Técnica
- **Status:** ⏳ Pendente
- **Tipo:** Revisão e Validação
- **Dependências:** TASK-099 (Sistema de Autenticação)

---

## 🎯 Objetivo

Revisar, testar e validar o sistema CRUD completo de usuários no painel administrativo, incluindo edição de dados, reset de senha, exclusão de usuários e alteração de roles.

---

## 📝 Descrição

Sistema completo de gerenciamento de usuários implementado para admins e moderadores, incluindo:
- Edição completa de dados do usuário
- Reset de senha por admin/moderador
- Exclusão de usuários (SUPERADMIN)
- Alteração de roles (SUPERADMIN)
- Modal de edição com validações

---

## ✅ Checklist de Implementação

### Subtask 1: Revisão de Rotas Backend (3h)

#### 1.1 Revisar PUT /api/admin/users/:id (Editar Usuário)
- [ ] Verificar middleware de autorização (SUPERADMIN, MODERATOR)
- [ ] Validar campos editáveis:
  - [ ] name (opcional, mín. 2 caracteres)
  - [ ] email (opcional, validação de formato)
  - [ ] bio (opcional)
  - [ ] avatar (opcional, validação de URL)
- [ ] Verificar validação de email duplicado
- [ ] Confirmar que apenas campos fornecidos são atualizados
- [ ] Validar que senha não é retornada na resposta
- [ ] Testar tratamento de erros
- [ ] Verificar logs adequados

#### 1.2 Revisar PUT /api/admin/users/:id/password (Reset Senha)
- [ ] Verificar middleware de autorização (SUPERADMIN, MODERATOR)
- [ ] Validar campo newPassword (mínimo 6 caracteres)
- [ ] Confirmar hash com bcrypt (10 rounds mínimo)
- [ ] Verificar que usuário existe antes de resetar
- [ ] Validar mensagem de sucesso
- [ ] Testar tratamento de erros
- [ ] Verificar que não retorna a senha

#### 1.3 Revisar DELETE /api/admin/users/:id (Deletar Usuário)
- [ ] Verificar middleware de autorização (apenas SUPERADMIN)
- [ ] Validar proteção contra auto-exclusão
- [ ] Confirmar exclusão em cascata (se necessário)
- [ ] Verificar que usuário existe antes de deletar
- [ ] Validar mensagem de sucesso
- [ ] Testar tratamento de erros
- [ ] Considerar soft delete vs hard delete

#### 1.4 Revisar Ordem das Rotas
- [ ] Confirmar ordem correta no Express:
  1. `/users/:id/approve` (específica)
  2. `/users/:id/reject` (específica)
  3. `/users/:id/role` (específica)
  4. `/users/:id/password` (específica) ⬅️ Antes da genérica
  5. `/users/:id` (genérica) ⬅️ Por último
- [ ] Documentar importância da ordem
- [ ] Adicionar comentários no código

---

### Subtask 2: Revisão Frontend AdminPanel (3h)

#### 2.1 Revisar Modal de Edição
- [ ] Verificar `components/AdminPanel.tsx`
  - [ ] Modal abre corretamente ao clicar "Editar"
  - [ ] Campos são preenchidos com dados atuais
  - [ ] Todos os campos são editáveis
  - [ ] Validação de campos funciona
  - [ ] Loading state durante save
  - [ ] Feedback visual após sucesso/erro
  - [ ] Modal fecha após save
  - [ ] Botão "Cancelar" funciona

#### 2.2 Revisar Seção Reset de Senha
- [ ] Dentro do modal de edição:
  - [ ] Botão "Resetar senha" expande/colapsa seção
  - [ ] Campo de nova senha aparece
  - [ ] Validação de mínimo 6 caracteres
  - [ ] Botão desabilitado se senha inválida
  - [ ] Loading state durante reset
  - [ ] Feedback após sucesso
  - [ ] Senha limpa após reset
  - [ ] Seção colapsa após reset

#### 2.3 Revisar Botão Deletar
- [ ] Verificar botão "Deletar":
  - [ ] Aparece apenas para SUPERADMIN
  - [ ] Não aparece para a própria conta
  - [ ] Confirmação obrigatória (confirm dialog)
  - [ ] Mensagem clara na confirmação
  - [ ] Loading durante exclusão
  - [ ] Lista recarrega após delete
  - [ ] Feedback de sucesso/erro

#### 2.4 Revisar Exibição de Dados
- [ ] Na lista expandida:
  - [ ] Campo "Como conheceu o grupo" exibido
  - [ ] Motivo de rejeição exibido (se REJECTED)
  - [ ] Badges coloridos adequados
  - [ ] Role atual exibido
  - [ ] Status atual exibido
  - [ ] Data de cadastro exibida

#### 2.5 Revisar URLs das Requisições
- [ ] Confirmar todas as URLs apontam para backend correto:
  - [ ] `http://localhost:3000/api/admin/users/:id` (PUT - editar)
  - [ ] `http://localhost:3000/api/admin/users/:id/password` (PUT - senha)
  - [ ] `http://localhost:3000/api/admin/users/:id` (DELETE)
  - [ ] `http://localhost:3000/api/admin/users/:id/role` (PUT)
  - [ ] `http://localhost:3000/api/admin/users/:id/approve` (PUT)
  - [ ] `http://localhost:3000/api/admin/users/:id/reject` (PUT)

---

### Subtask 3: Testes Automatizados Backend (3h)

#### 3.1 Testes PUT /api/admin/users/:id
- [ ] Criar `tests/integration/api/admin-users.test.ts`
  ```typescript
  describe('PUT /api/admin/users/:id', () => {
    - [ ] Deve permitir SUPERADMIN editar usuário
    - [ ] Deve permitir MODERATOR editar usuário
    - [ ] Deve bloquear USER editar usuário
    - [ ] Deve editar nome corretamente
    - [ ] Deve editar email corretamente
    - [ ] Deve editar bio corretamente
    - [ ] Deve editar avatar corretamente
    - [ ] Deve rejeitar email duplicado
    - [ ] Deve rejeitar nome muito curto
    - [ ] Deve rejeitar avatar inválido
    - [ ] Deve atualizar apenas campos fornecidos
    - [ ] Deve retornar 404 se usuário não existe
    - [ ] Não deve retornar senha na resposta
  });
  ```

#### 3.2 Testes PUT /api/admin/users/:id/password
- [ ] Criar testes
  ```typescript
  describe('PUT /api/admin/users/:id/password', () => {
    - [ ] Deve permitir SUPERADMIN resetar senha
    - [ ] Deve permitir MODERATOR resetar senha
    - [ ] Deve bloquear USER resetar senha
    - [ ] Deve hashear senha com bcrypt
    - [ ] Deve rejeitar senha muito curta
    - [ ] Deve retornar 404 se usuário não existe
    - [ ] Deve permitir login com nova senha
    - [ ] Deve bloquear login com senha antiga
  });
  ```

#### 3.3 Testes DELETE /api/admin/users/:id
- [ ] Criar testes
  ```typescript
  describe('DELETE /api/admin/users/:id', () => {
    - [ ] Deve permitir SUPERADMIN deletar usuário
    - [ ] Deve bloquear MODERATOR deletar usuário
    - [ ] Deve bloquear USER deletar usuário
    - [ ] Deve bloquear auto-exclusão
    - [ ] Deve retornar 404 se usuário não existe
    - [ ] Deve remover usuário do banco
    - [ ] Deve retornar erro apropriado em falha
  });
  ```

#### 3.4 Testes de Ordem de Rotas
- [ ] Criar testes
  ```typescript
  describe('Ordem de rotas', () => {
    - [ ] PUT /users/:id/password deve processar antes de /users/:id
    - [ ] PUT /users/:id/role deve processar antes de /users/:id
    - [ ] PUT /users/:id não deve capturar /users/:id/password
  });
  ```

---

### Subtask 4: Testes Automatizados Frontend (2h)

#### 4.1 Testes do Modal de Edição
- [ ] Criar `tests/components/AdminPanel-edit.test.tsx`
  ```typescript
  describe('Modal de Edição de Usuário', () => {
    - [ ] Deve abrir modal ao clicar "Editar"
    - [ ] Deve preencher campos com dados atuais
    - [ ] Deve permitir editar nome
    - [ ] Deve permitir editar email
    - [ ] Deve permitir editar bio
    - [ ] Deve permitir editar avatar
    - [ ] Deve validar campos antes de salvar
    - [ ] Deve chamar API corretamente ao salvar
    - [ ] Deve fechar modal após sucesso
    - [ ] Deve exibir erro em caso de falha
    - [ ] Deve permitir cancelar edição
  });
  ```

#### 4.2 Testes de Reset de Senha
- [ ] Criar testes
  ```typescript
  describe('Reset de Senha', () => {
    - [ ] Deve expandir seção ao clicar
    - [ ] Deve colapsar seção ao clicar novamente
    - [ ] Deve validar senha mínima
    - [ ] Deve desabilitar botão se senha inválida
    - [ ] Deve chamar API corretamente
    - [ ] Deve limpar campo após sucesso
    - [ ] Deve exibir feedback de sucesso
  });
  ```

#### 4.3 Testes de Deleção
- [ ] Criar testes
  ```typescript
  describe('Deletar Usuário', () => {
    - [ ] Deve exibir botão apenas para SUPERADMIN
    - [ ] Deve ocultar botão para própria conta
    - [ ] Deve mostrar confirmação ao clicar
    - [ ] Deve cancelar se usuário não confirma
    - [ ] Deve chamar API se usuário confirma
    - [ ] Deve recarregar lista após sucesso
  });
  ```

---

### Subtask 5: Testes Manuais (2h)

#### 5.1 Fluxo de Edição Completo
- [ ] **Como SUPERADMIN:**
  - [ ] Logar como SUPERADMIN
  - [ ] Abrir painel admin
  - [ ] Expandir usuário
  - [ ] Clicar em "Editar"
  - [ ] Alterar nome
  - [ ] Alterar email
  - [ ] Alterar bio
  - [ ] Alterar avatar
  - [ ] Clicar em "Salvar Alterações"
  - [ ] Verificar feedback de sucesso
  - [ ] Verificar dados atualizados no banco
  - [ ] Verificar dados atualizados na lista

- [ ] **Como MODERATOR:**
  - [ ] Repetir processo acima
  - [ ] Confirmar que funciona igual

- [ ] **Como USER:**
  - [ ] Tentar acessar painel admin
  - [ ] Confirmar bloqueio

#### 5.2 Fluxo de Reset de Senha
- [ ] Logar como admin
- [ ] Abrir modal de edição
- [ ] Clicar em "Resetar senha do usuário"
- [ ] Digitar senha com 5 caracteres (deve bloquear)
- [ ] Digitar senha com 6+ caracteres
- [ ] Clicar em "Confirmar Reset de Senha"
- [ ] Verificar feedback de sucesso
- [ ] Fazer logout
- [ ] Tentar login com usuário editado e senha antiga (deve falhar)
- [ ] Fazer login com nova senha (deve funcionar)
- [ ] Verificar senha hasheada no banco

#### 5.3 Fluxo de Exclusão
- [ ] **Como SUPERADMIN:**
  - [ ] Criar usuário de teste
  - [ ] Tentar deletar própria conta (deve bloquear)
  - [ ] Deletar usuário de teste
  - [ ] Confirmar exclusão
  - [ ] Verificar feedback de sucesso
  - [ ] Verificar usuário removido da lista
  - [ ] Verificar usuário removido do banco
  - [ ] Tentar login com usuário deletado (deve falhar)

- [ ] **Como MODERATOR:**
  - [ ] Verificar que botão "Deletar" não aparece

#### 5.4 Testes de Validação
- [ ] Tentar editar com nome vazio
- [ ] Tentar editar com email inválido
- [ ] Tentar editar com email já existente
- [ ] Tentar editar com avatar URL inválido
- [ ] Tentar resetar senha com menos de 6 caracteres
- [ ] Verificar mensagens de erro adequadas

#### 5.5 Testes de Permissão
- [ ] SUPERADMIN pode:
  - [ ] Editar qualquer usuário
  - [ ] Resetar senha de qualquer usuário
  - [ ] Deletar qualquer usuário (exceto próprio)
  - [ ] Alterar role de qualquer usuário (exceto próprio)

- [ ] MODERATOR pode:
  - [ ] Editar qualquer usuário
  - [ ] Resetar senha de qualquer usuário
  - [ ] NÃO pode deletar usuários
  - [ ] NÃO pode alterar roles

- [ ] USER/GUEST não pode:
  - [ ] Acessar painel admin
  - [ ] Fazer nenhuma operação de admin

---

### Subtask 6: Documentação (1h)

#### 6.1 Documentar API Admin
- [ ] Criar/Atualizar `docs/API_ADMIN.md`
  ```markdown
  ## Editar Usuário
  PUT /api/admin/users/:id
  - Permissão: SUPERADMIN, MODERATOR
  - Body: { name?, email?, bio?, avatar? }
  - Response: { message, user }
  
  ## Reset Senha
  PUT /api/admin/users/:id/password
  - Permissão: SUPERADMIN, MODERATOR
  - Body: { newPassword }
  - Response: { message }
  
  ## Deletar Usuário
  DELETE /api/admin/users/:id
  - Permissão: SUPERADMIN
  - Response: { message }
  ```

#### 6.2 Documentar Interface Admin
- [ ] Atualizar `docs/ADMIN_PANEL.md`
  - [ ] Como editar usuários
  - [ ] Como resetar senhas
  - [ ] Como deletar usuários
  - [ ] Permissões necessárias
  - [ ] Screenshots (opcional)

#### 6.3 Documentar Segurança
- [ ] Atualizar `docs/SECURITY.md`
  - [ ] Proteção contra auto-exclusão
  - [ ] Proteção contra auto-alteração de role
  - [ ] Validações implementadas
  - [ ] Logs de auditoria (se houver)

---

## 📊 Critérios de Aceitação

- [ ] SUPERADMIN e MODERATOR podem editar qualquer usuário
- [ ] SUPERADMIN e MODERATOR podem resetar senha de qualquer usuário
- [ ] Apenas SUPERADMIN pode deletar usuários
- [ ] Ninguém pode deletar a própria conta
- [ ] Todas as validações funcionando corretamente
- [ ] Todos os testes automatizados passando (>85% cobertura)
- [ ] Documentação completa e atualizada
- [ ] Modal de edição funciona perfeitamente
- [ ] Feedback visual em todas as operações
- [ ] Zero bugs críticos conhecidos

---

## 🔍 Cenários de Teste

### Cenário 1: Admin Edita Usuário
```
1. Admin loga no sistema
2. Abre painel administrativo
3. Expande usuário "João"
4. Clica em "Editar"
5. Altera nome para "João Silva"
6. Altera email para "joao.silva@email.com"
7. Altera bio para "Desenvolvedor Full Stack"
8. Clica em "Salvar Alterações"
9. Vê mensagem: "Usuário atualizado com sucesso"
10. Lista recarrega automaticamente
11. Dados atualizados são exibidos
```

### Cenário 2: Admin Reseta Senha
```
1. Admin abre modal de edição do usuário
2. Clica em "Resetar senha do usuário"
3. Seção expande
4. Digita nova senha: "novaSenha123"
5. Clica em "Confirmar Reset de Senha"
6. Vê mensagem: "Senha resetada com sucesso"
7. Campo de senha é limpo
8. Usuário pode fazer login com nova senha
9. Login com senha antiga falha
```

### Cenário 3: SUPERADMIN Deleta Usuário
```
1. SUPERADMIN loga
2. Abre painel admin
3. Expande usuário "Teste"
4. Clica em "Deletar"
5. Vê confirmação: "Tem certeza que deseja deletar o usuário 'Teste'?"
6. Confirma
7. Vê mensagem: "Usuário deletado com sucesso"
8. Lista recarrega
9. Usuário "Teste" não aparece mais
10. Tentativa de login com "Teste" falha
```

---

## 🚀 Melhorias Futuras

- [ ] Logs de auditoria para todas as ações de admin
- [ ] Histórico de alterações de cada usuário
- [ ] Bulk operations (editar/deletar múltiplos)
- [ ] Filtros avançados no painel admin
- [ ] Exportar lista de usuários (CSV/Excel)
- [ ] Soft delete com possibilidade de restaurar
- [ ] Notificar usuário quando senha é resetada
- [ ] Confirmação por email para ações críticas
- [ ] Dashboard com métricas de usuários
- [ ] Sistema de backup antes de deletar

---

## ⚠️ Problemas Conhecidos

- [ ] Ordem das rotas já corrigida (password antes da genérica)
- [ ] URLs corrigidas para apontar ao backend correto
- [ ] Sem logs de auditoria implementados
- [ ] Sem notificações ao usuário sobre mudanças
- [ ] Sem confirmação dupla para ações críticas

---

## 📝 Notas Técnicas

### Permissões por Ação:
```typescript
Editar Usuário:     SUPERADMIN ✅  MODERATOR ✅  USER ❌
Reset Senha:        SUPERADMIN ✅  MODERATOR ✅  USER ❌
Deletar Usuário:    SUPERADMIN ✅  MODERATOR ❌  USER ❌
Alterar Role:       SUPERADMIN ✅  MODERATOR ❌  USER ❌
```

### Ordem Crítica das Rotas:
```javascript
// CORRETO ✅
router.put('/users/:id/password', ...);  // Específica primeiro
router.put('/users/:id', ...);            // Genérica depois

// ERRADO ❌
router.put('/users/:id', ...);            // Genérica captura tudo
router.put('/users/:id/password', ...);  // Nunca é alcançada
```

### Validações Implementadas:
- Nome: mínimo 2 caracteres
- Email: formato válido + unicidade
- Senha: mínimo 6 caracteres + hash bcrypt
- Avatar: URL válida
- Proteção: não pode deletar/alterar própria conta

---

## 🔒 Considerações de Segurança

### Proteções Implementadas:
- ✅ Middleware de autenticação (authenticate)
- ✅ Middleware de autorização por role (authorize)
- ✅ Validação de inputs com express-validator
- ✅ Hash de senha com bcrypt (10 rounds)
- ✅ Proteção contra auto-exclusão
- ✅ Proteção contra auto-alteração de role
- ✅ Senhas nunca retornadas nas respostas
- ✅ Verificação de email duplicado

### Melhorias de Segurança Futuras:
- [ ] Rate limiting nas rotas de admin
- [ ] Logs de auditoria detalhados
- [ ] Confirmação por 2FA para ações críticas
- [ ] Sessões com timeout
- [ ] Notificação ao usuário sobre mudanças

---

**Status:** ⏳ Aguardando priorização  
**Responsável:** A definir  
**Revisão:** Pendente
