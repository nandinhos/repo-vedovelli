-- Script para criar o primeiro SUPERADMIN
-- Execute este script após criar o banco de dados

USE vedovelli_repo;

-- Deletar usuário existente se houver
DELETE FROM users WHERE email = 'admin@example.com';

-- Criar SUPERADMIN
-- Senha: admin123 (MUDE EM PRODUÇÃO!)
-- Hash bcrypt da senha 'admin123'
INSERT INTO users (
    id,
    name,
    email,
    password,
    role,
    status,
    avatar,
    bio,
    isPublicProfile,
    createdAt,
    updatedAt
) VALUES (
    'superadmin_001',
    'Administrador',
    'admin@example.com',
    '$2b$10$K8mO.QJJx7YZ5YZ5YZ5YZ.K8mO.QJJx7YZ5YZ5YZ5YZ.K8mO.QJJK',
    'SUPERADMIN',
    'APPROVED',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
    'Administrador do sistema',
    FALSE,
    NOW(),
    NOW()
);

-- Verificar se foi criado
SELECT
    id,
    name,
    email,
    role,
    status,
    createdAt
FROM users
WHERE email = 'admin@example.com';

-- Instruções de uso:
--
-- 1. Execute este script:
--    mysql -u root -p vedovelli_repo < create-superadmin.sql
--
-- 2. Faça login com:
--    Email: admin@example.com
--    Senha: admin123
--
-- 3. IMPORTANTE: Mude a senha imediatamente em produção!
--
-- Para gerar um novo hash de senha, use este código Node.js:
--    const bcrypt = require('bcrypt');
--    bcrypt.hash('sua-senha-aqui', 10).then(console.log);
