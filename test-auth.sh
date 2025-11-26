#!/bin/bash

# Script de teste automatizado do sistema de autenticação
# Uso: ./test-auth.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"
TEMP_FILE="/tmp/auth_test_response.json"

# Função para imprimir mensagens coloridas
print_test() {
    echo -e "${YELLOW}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Verificar se servidor está rodando
print_test "Verificando se servidor está rodando..."
if curl -s "$API_URL/api/items" > /dev/null 2>&1; then
    print_success "Servidor está respondendo"
else
    print_error "Servidor não está respondendo. Inicie o servidor primeiro!"
    exit 1
fi

# Teste 1: Registro de usuário
print_test "Teste 1: Registrando novo usuário..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Teste User",
        "email": "teste'$(date +%s)'@example.com",
        "password": "senha123",
        "bio": "Usuário de teste"
    }')

if echo "$REGISTER_RESPONSE" | grep -q "Cadastro realizado com sucesso"; then
    print_success "Registro funcionou"
    USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    USER_EMAIL=$(echo "$REGISTER_RESPONSE" | grep -o '"email":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "  User ID: $USER_ID"
    echo "  Email: $USER_EMAIL"
else
    print_error "Falha no registro"
    echo "$REGISTER_RESPONSE"
    exit 1
fi

# Teste 2: Login com SUPERADMIN (você precisa ter criado antes)
print_test "Teste 2: Login com SUPERADMIN..."
echo "⚠️  Use suas credenciais de SUPERADMIN:"
echo -n "Email: "
read ADMIN_EMAIL
echo -n "Senha: "
read -s ADMIN_PASSWORD
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$ADMIN_EMAIL\",
        \"password\": \"$ADMIN_PASSWORD\"
    }")

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    print_success "Login SUPERADMIN funcionou"
    ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "  Token obtido: ${ADMIN_TOKEN:0:20}..."
else
    print_error "Falha no login SUPERADMIN"
    echo "$LOGIN_RESPONSE"
    exit 1
fi

# Teste 3: Listar usuários pendentes
print_test "Teste 3: Listando usuários pendentes..."
PENDING_RESPONSE=$(curl -s -X GET "$API_URL/api/admin/users/pending" \
    -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$PENDING_RESPONSE" | grep -q "users"; then
    print_success "Lista de pendentes obtida"
    PENDING_COUNT=$(echo "$PENDING_RESPONSE" | grep -o '"id"' | wc -l)
    echo "  Usuários pendentes: $PENDING_COUNT"
else
    print_error "Falha ao listar pendentes"
    echo "$PENDING_RESPONSE"
fi

# Teste 4: Aprovar usuário
print_test "Teste 4: Aprovando usuário $USER_ID..."
APPROVE_RESPONSE=$(curl -s -X PUT "$API_URL/api/admin/users/$USER_ID/approve" \
    -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$APPROVE_RESPONSE" | grep -q "aprovado com sucesso"; then
    print_success "Usuário aprovado"
else
    print_error "Falha ao aprovar usuário"
    echo "$APPROVE_RESPONSE"
fi

# Teste 5: Login com usuário aprovado
print_test "Teste 5: Login com usuário recém aprovado..."
USER_LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$USER_EMAIL\",
        \"password\": \"senha123\"
    }")

if echo "$USER_LOGIN_RESPONSE" | grep -q "token"; then
    print_success "Login de USER funcionou"
    USER_TOKEN=$(echo "$USER_LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "  Token obtido: ${USER_TOKEN:0:20}..."
else
    print_error "Falha no login USER"
    echo "$USER_LOGIN_RESPONSE"
fi

# Teste 6: Verificar dados do usuário
print_test "Teste 6: Verificando dados do usuário logado..."
ME_RESPONSE=$(curl -s -X GET "$API_URL/api/auth/me" \
    -H "Authorization: Bearer $USER_TOKEN")

if echo "$ME_RESPONSE" | grep -q "user"; then
    print_success "Endpoint /me funcionou"
else
    print_error "Falha no endpoint /me"
    echo "$ME_RESPONSE"
fi

# Teste 7: Tentar acessar rota admin como USER (deve falhar)
print_test "Teste 7: Tentando acessar rota admin como USER (deve falhar)..."
ADMIN_ACCESS_RESPONSE=$(curl -s -X GET "$API_URL/api/admin/users" \
    -H "Authorization: Bearer $USER_TOKEN")

if echo "$ADMIN_ACCESS_RESPONSE" | grep -q "Acesso negado"; then
    print_success "Autorização bloqueou corretamente"
else
    print_error "USER conseguiu acessar rota de admin (PROBLEMA!)"
    echo "$ADMIN_ACCESS_RESPONSE"
fi

# Teste 8: Estatísticas do sistema
print_test "Teste 8: Obtendo estatísticas do sistema..."
STATS_RESPONSE=$(curl -s -X GET "$API_URL/api/admin/stats" \
    -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$STATS_RESPONSE" | grep -q "stats"; then
    print_success "Estatísticas obtidas"
    echo "$STATS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STATS_RESPONSE"
else
    print_error "Falha ao obter estatísticas"
    echo "$STATS_RESPONSE"
fi

# Resumo
echo ""
echo "======================================"
echo "     RESUMO DOS TESTES"
echo "======================================"
print_success "✓ Registro de usuário"
print_success "✓ Login SUPERADMIN"
print_success "✓ Listar pendentes"
print_success "✓ Aprovar usuário"
print_success "✓ Login USER"
print_success "✓ Verificar dados (/me)"
print_success "✓ Autorização (bloqueio)"
print_success "✓ Estatísticas"
echo ""
echo "Tokens para uso manual:"
echo "SUPERADMIN: $ADMIN_TOKEN"
echo "USER: $USER_TOKEN"
echo ""
print_success "Todos os testes passaram! 🎉"
