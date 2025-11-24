# Especificação Funcional - Repositório Vedovelli

Este documento detalha o comportamento esperado de cada funcionalidade do sistema.

## 1. Autenticação e Permissões

### 1.1. Login (Mock/Simulação)
*   **Comportamento:** O usuário pode escolher entre dois perfis para testar o sistema: "Usuário Padrão" ou "Administrador".
*   **Regras:**
    *   **Visitante:** Apenas visualiza o conteúdo. Não pode comentar ou postar.
    *   **Usuário Aprovado:** Pode criar itens, comentar em qualquer item, e editar/excluir **apenas** seus próprios itens e comentários.
    *   **Administrador:** Acesso irrestrito. Pode editar/excluir qualquer item ou comentário e gerenciar usuários.

### 1.2. Gestão de Perfil
*   **Visualização:** Modal "Meu Perfil" acessível via header.
*   **Edição:**
    *   **Avatar:** Upload de imagem local ou inserção de URL.
    *   **Bio/Cargo:** Texto curto.
    *   **Redes Sociais:** GitHub, LinkedIn, Instagram, WhatsApp.
    *   **Visibilidade:** Checkbox "Perfil Público" que define se o usuário aparece na aba "Contatos".

## 2. Navegação e Organização

### 2.1. Abas Principais
O sistema é dividido em 4 contextos principais:
1.  **Snippets:** Listagem de códigos.
2.  **Arquivos:** Listagem de downloads/recursos.
3.  **Links Úteis:** Referências externas.
4.  **Contatos/Interação:** Grid de cartões de usuários da comunidade.

### 2.2. Busca e Filtros
*   **Barra de Busca:** Filtra itens por Título, Descrição, Nome do Autor ou Linguagem (para snippets).
*   **Filtro de Categoria:** Dropdown para filtrar por áreas (Frontend, Backend, DevOps, etc.).

## 3. Gestão de Itens (CRUD)

### 3.1. Criação de Item (Upload)
*   **Botão Novo:** Abre modal dependendo da aba ativa.
*   **Campos Comuns:** Título, Categoria, Descrição Curta.
*   **Campos Específicos:**
    *   *Snippet:* Seleção de linguagem, Área de código (textarea monospaced).
    *   *Arquivo:* Upload de arquivo (simulado no frontend via objeto File).
    *   *Link:* URL do recurso externo.
*   **Recursos Adicionais (Opcionais):** Link de Repositório (GitHub), Website do Projeto, Vídeo do YouTube.

### 3.2. Visualização de Detalhes
*   **Expansão:** Ao clicar no ícone "Olho", o card se expande revelando o componente `ItemDetail`.
*   **Conteúdo:** Exibe descrição completa, botões de recursos externos e o conteúdo principal (bloco de código colorido ou botão de download).

### 3.3. Edição e Exclusão
*   **Permissão:** Apenas Autor ou Admin.
*   **Edição:** Abre o modal preenchido com os dados atuais.
*   **Exclusão:** Exige confirmação via Modal personalizado.

## 4. Sistema de Comentários e Discussão

### 4.1. Adicionar Comentário
*   **Entrada Rica:** O usuário pode digitar texto, inserir blocos de código (via modal auxiliar com seleção de linguagem) e anexar screenshot (upload ou colar URL).
*   **Preview de Imagem:** Miniatura da imagem anexada aparece antes do envio.

### 4.2. Visualização de Comentários
*   **Ordenação:** Renderização lógica: 1º Texto -> 2º Screenshot (botão "Ver Resultado") -> 3º Blocos de Código.
*   **Modal de Imagem:** Ao clicar em "Ver Resultado", a imagem abre em tela cheia (lightbox).

### 4.3. Edição de Comentário
*   **Modal Dedicado:** Permite alterar todo o conteúdo (texto e imagem) em uma janela maior, não apenas inline.
*   **Regra:** Apenas o autor do comentário pode editar.

### 4.4. Moderação (Exclusão de Comentário)
*   **Usuário Comum:** Pode excluir seus próprios comentários (confirmação simples).
*   **Administrador:** Pode excluir qualquer comentário.
    *   **Justificativa:** O sistema exige que o Admin digite um motivo para a exclusão.
    *   **Resultado:** O comentário não some totalmente; ele é substituído por um placeholder vermelho visível apenas para Admins e o Dono, informando o motivo da remoção (Soft Delete).

## 5. Aba de Contatos
*   **Listagem:** Exibe apenas usuários que marcaram `isPublicProfile: true`.
*   **Cards:** Mostra avatar, nome, bio e ícones de redes sociais clicáveis.
*   **Visualização Detalhada:** Ao clicar no card, abre um modal "Estilo Cartão de Visita" com avatar ampliado e botões de ação grandes.
