# TASK-100: Revisão e Validação do Sistema de Aprovação de Usuários

## 📋 Informações Gerais

- **Prioridade:** 🟡 Média
- **Estimativa:** 8-10 horas
- **Sprint:** Backlog - Revisão Técnica
- **Status:** ⏳ Pendente
- **Tipo:** Revisão e Validação
- **Dependências:** TASK-099 (Sistema de Autenticação)

---

## 🎯 Objetivo

Revisar, testar e validar o sistema de aprovação de usuários implementado, incluindo campo "Como conheceu o grupo", sistema de rejeição com motivo e re-submissão.

---

## 📝 Descrição

Sistema de aprovação aprimorado que foi implementado com:
- Campo obrigatório "Como conheceu o grupo" no cadastro
- Motivo de rejeição visível ao usuário
- Sistema de re-submissão após rejeição
- Novos campos no banco de dados

---

## ✅ Checklist de Implementação

### Subtask 1: Revisão de Estrutura do Banco (2h)

#### 1.1 Validar Campos Adicionados
- [ ] Verificar campo `howDidYouKnow` VARCHAR(255)
  - [ ] Confirmar tipo e tamanho adequados
  - [ ] Verificar se está indexado (se necessário)
  - [ ] Validar valores possíveis
  
- [ ] Verificar campo `rejectionReason` TEXT
  - [ ] Confirmar tipo adequado para textos longos
  - [ ] Verificar se permite NULL corretamente
  - [ ] Validar encoding UTF-8

#### 1.2 Migração de Dados
- [ ] Criar script de migração formal
- [ ] Testar migração em ambiente de dev
- [ ] Documentar processo de rollback
- [ ] Validar dados existentes após migração
- [ ] Criar backup antes de aplicar em produção

---

### Subtask 2: Revisão Backend (3h)

#### 2.1 Revisar Validações no Registro
- [ ] Verificar `server/routes/auth.ts`
  - [ ] Validar campo howDidYouKnow como obrigatório
  - [ ] Verificar lista de valores aceitos
  - [ ] Validar campo "other" com texto customizado
  - [ ] Confirmar sanitização de inputs

#### 2.2 Revisar Rota de Rejeição
- [ ] Verificar `server/routes/admin.ts`
  - [ ] PUT /api/admin/users/:id/reject
  - [ ] Validar que reason está sendo salvo corretamente
  - [ ] Verificar tratamento quando reason não é fornecido
  - [ ] Confirmar atualização de status para REJECTED

#### 2.3 Revisar Rota de Re-aplicação
- [ ] Verificar endpoint POST /api/auth/reapply
  - [ ] Validar que apenas usuários REJECTED podem usar
  - [ ] Confirmar que status volta para PENDING
  - [ ] Verificar que rejectionReason é limpo
  - [ ] Validar autenticação necessária

#### 2.4 Revisar Mensagens de Login
- [ ] Verificar lógica no login
  - [ ] Confirmar que mostra rejectionReason ao usuário REJECTED
  - [ ] Validar flag canReapply na resposta
  - [ ] Verificar mensagens de erro apropriadas

---

### Subtask 3: Revisão Frontend (2h)

#### 3.1 Revisar Formulário de Cadastro
- [ ] Verificar `components/AuthModal.tsx`
  - [ ] Campo "Como conheceu o grupo" é obrigatório
  - [ ] Select com opções corretas
  - [ ] Campo adicional para "Outros" funciona
  - [ ] Validação frontend está correta
  - [ ] Mensagens de erro são claras

#### 3.2 Revisar Exibição de Rejeição
- [ ] Verificar AuthModal.tsx
  - [ ] Badge de rejeição aparece corretamente
  - [ ] Motivo da rejeição é exibido
  - [ ] Botão "Solicitar Nova Aprovação" funciona
  - [ ] Loading state durante re-aplicação
  - [ ] Feedback após sucesso

#### 3.3 Revisar Painel Admin
- [ ] Verificar `components/AdminPanel.tsx`
  - [ ] Campo "Como conheceu o grupo" é exibido
  - [ ] Prompt para motivo ao rejeitar funciona
  - [ ] Motivo é exibido para usuários rejeitados
  - [ ] Badge colorido adequado

---

### Subtask 4: Testes Automatizados (2h)

#### 4.1 Testes de Registro
- [ ] Criar testes em `tests/integration/api/auth.test.ts`
  ```typescript
  describe('Registro com howDidYouKnow', () => {
    - [ ] Deve rejeitar registro sem howDidYouKnow
    - [ ] Deve aceitar "Grupo Workshop Vedovelli"
    - [ ] Deve aceitar "Amigo de Membro do Grupo"
    - [ ] Deve aceitar "Outros" com texto customizado
    - [ ] Deve rejeitar "Outros" sem texto
  });
  ```

#### 4.2 Testes de Rejeição
- [ ] Criar testes em `tests/integration/api/admin.test.ts`
  ```typescript
  describe('PUT /api/admin/users/:id/reject', () => {
    - [ ] Deve rejeitar usuário com motivo
    - [ ] Deve rejeitar usuário sem motivo (usar padrão)
    - [ ] Deve salvar rejectionReason no banco
    - [ ] Deve alterar status para REJECTED
    - [ ] Deve retornar erro se usuário não está PENDING
  });
  ```

#### 4.3 Testes de Re-aplicação
- [ ] Criar testes em `tests/integration/api/auth.test.ts`
  ```typescript
  describe('POST /api/auth/reapply', () => {
    - [ ] Deve permitir re-aplicação de usuário REJECTED
    - [ ] Deve alterar status para PENDING
    - [ ] Deve limpar rejectionReason
    - [ ] Deve rejeitar se usuário não está REJECTED
    - [ ] Deve exigir autenticação
  });
  ```

#### 4.4 Testes de Login com Rejeição
- [ ] Adicionar testes em `tests/integration/api/auth.test.ts`
  ```typescript
  describe('Login de usuário rejeitado', () => {
    - [ ] Deve retornar rejectionReason
    - [ ] Deve retornar canReapply = true
    - [ ] Deve retornar status 403
    - [ ] Deve incluir mensagem apropriada
  });
  ```

---

### Subtask 5: Testes Manuais (1h)

#### 5.1 Fluxo Completo de Aprovação
- [ ] **Cadastro:**
  - [ ] Preencher todos os campos
  - [ ] Selecionar "Grupo Workshop Vedovelli"
  - [ ] Verificar cadastro com sucesso
  - [ ] Verificar howDidYouKnow salvo no banco

- [ ] **Aprovação por Admin:**
  - [ ] Logar como admin
  - [ ] Ver "Como conheceu" no painel
  - [ ] Aprovar usuário
  - [ ] Verificar status APPROVED no banco
  - [ ] Verificar que usuário pode logar

#### 5.2 Fluxo Completo de Rejeição
- [ ] **Cadastro com "Outros":**
  - [ ] Selecionar "Outros"
  - [ ] Digitar motivo customizado
  - [ ] Cadastrar
  - [ ] Verificar texto salvo corretamente

- [ ] **Rejeição por Admin:**
  - [ ] Logar como admin/moderador
  - [ ] Clicar em "Rejeitar"
  - [ ] Digitar motivo da rejeição
  - [ ] Confirmar
  - [ ] Verificar status REJECTED no banco
  - [ ] Verificar rejectionReason salvo

- [ ] **Tentativa de Login:**
  - [ ] Tentar fazer login
  - [ ] Ver mensagem de rejeição
  - [ ] Ver motivo específico
  - [ ] Ver botão "Solicitar Nova Aprovação"

- [ ] **Re-aplicação:**
  - [ ] Clicar em "Solicitar Nova Aprovação"
  - [ ] Verificar mensagem de sucesso
  - [ ] Verificar status PENDING no banco
  - [ ] Verificar rejectionReason limpo
  - [ ] Verificar usuário aparece na fila novamente

- [ ] **Segunda Aprovação:**
  - [ ] Admin vê usuário novamente na fila
  - [ ] Admin aprova
  - [ ] Usuário pode fazer login

#### 5.3 Casos Extremos
- [ ] Tentar cadastrar sem selecionar "Como conheceu"
- [ ] Selecionar "Outros" e deixar campo vazio
- [ ] Rejeitar sem informar motivo (usar padrão)
- [ ] Tentar re-aplicar quando não está rejeitado
- [ ] Rejeitar usuário que já está rejeitado
- [ ] Aprovar usuário que já está aprovado

---

### Subtask 6: Documentação (1h)

#### 6.1 Documentar Fluxo
- [ ] Criar `docs/USER_APPROVAL_FLOW.md`
  - [ ] Diagrama de estados (PENDING → APPROVED/REJECTED)
  - [ ] Fluxo de re-aplicação
  - [ ] Campos necessários no cadastro
  - [ ] Permissões por role

#### 6.2 Documentar API
- [ ] Atualizar `docs/API_AUTH.md`
  - [ ] Adicionar campo howDidYouKnow no POST /register
  - [ ] Documentar POST /api/auth/reapply
  - [ ] Documentar resposta de login para REJECTED

#### 6.3 Documentar Admin
- [ ] Atualizar `docs/ADMIN_PANEL.md`
  - [ ] Como visualizar "Como conheceu"
  - [ ] Como rejeitar com motivo
  - [ ] Como ver motivo de rejeição

---

## 📊 Critérios de Aceitação

- [ ] Campo "Como conheceu o grupo" obrigatório no cadastro
- [ ] Admin/Moderador deve informar motivo ao rejeitar
- [ ] Usuário vê motivo ao tentar login após rejeição
- [ ] Usuário rejeitado pode solicitar nova aprovação
- [ ] Todos os testes automatizados passando
- [ ] Documentação completa
- [ ] Zero bugs conhecidos no fluxo

---

## 🔍 Cenários de Teste

### Cenário 1: Cadastro Normal
```
1. Usuário acessa página
2. Clica em "Registrar"
3. Preenche: nome, email, senha, bio (opcional)
4. Seleciona "Grupo Workshop Vedovelli"
5. Clica em "Cadastrar"
6. Vê mensagem: "Cadastro realizado! Aguarde aprovação"
7. Status no banco: PENDING
```

### Cenário 2: Rejeição e Re-aplicação
```
1. Admin vê usuário PENDING
2. Clica em "Rejeitar"
3. Informa: "Perfil incompleto, por favor adicione mais informações"
4. Confirma
5. Usuário tenta login
6. Vê: "Seu cadastro foi rejeitado. Motivo: Perfil incompleto..."
7. Clica em "Solicitar Nova Aprovação"
8. Vê: "Solicitação enviada! Aguarde nova análise"
9. Volta para fila de PENDING
10. Admin aprova
11. Usuário pode logar
```

---

## 🚀 Melhorias Futuras

- [ ] Histórico de aprovações/rejeições
- [ ] Notificar usuário por email sobre status
- [ ] Permitir admin editar motivo de rejeição
- [ ] Dashboard com métricas de aprovação
- [ ] Exportar relatório de usuários rejeitados
- [ ] Templates de motivos de rejeição comuns
- [ ] Sistema de appeals (apelação de rejeição)

---

## 📝 Notas Técnicas

### Valores Possíveis para howDidYouKnow:
- "Grupo Workshop Vedovelli"
- "Amigo de Membro do Grupo"
- Texto customizado (quando seleciona "Outros")

### Estados do Usuário:
- PENDING → Aguardando aprovação
- APPROVED → Aprovado, pode usar o sistema
- REJECTED → Rejeitado, pode solicitar nova aprovação

### Campos no Banco:
```sql
howDidYouKnow VARCHAR(255) - Obrigatório no cadastro
rejectionReason TEXT - Preenchido apenas se REJECTED
```

---

**Status:** ⏳ Aguardando priorização  
**Responsável:** A definir  
**Revisão:** Pendente
