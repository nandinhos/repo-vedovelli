import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { hashPassword, comparePassword, generateToken, generateUserId } from '../utils/auth';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/auth/register
 * Registra um novo usuário (status PENDING por padrão)
 */
router.post(
    '/register',
    [
        body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter no mínimo 2 caracteres'),
        body('email').isEmail().withMessage('Email inválido'),
        body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
        body('bio').optional().trim(),
        body('avatar').optional().isURL().withMessage('Avatar deve ser uma URL válida'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password, bio, avatar } = req.body;

            // Verificar se email já existe
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ error: 'Email já cadastrado' });
            }

            // Hash da senha
            const hashedPassword = await hashPassword(password);

            // Avatar padrão se não fornecido
            const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

            // Criar usuário
            const user = await User.create({
                id: generateUserId(),
                name,
                email,
                password: hashedPassword,
                role: 'GUEST', // Inicia como GUEST até ser aprovado
                status: 'PENDING', // Aguarda aprovação
                avatar: avatar || defaultAvatar,
                bio: bio || '',
                isPublicProfile: false,
            });

            // Remover senha da resposta
            const { password: _, ...userWithoutPassword } = user.get({ plain: true });

            res.status(201).json({
                message: 'Cadastro realizado com sucesso! Aguarde aprovação do administrador.',
                user: userWithoutPassword,
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
    }
);

/**
 * POST /api/auth/login
 * Faz login do usuário
 */
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email inválido'),
        body('password').notEmpty().withMessage('Senha é obrigatória'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            // Buscar usuário
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Verificar senha
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Verificar se está aprovado
            if (user.status === 'REJECTED') {
                return res.status(403).json({
                    error: 'Acesso negado',
                    message: 'Seu cadastro foi rejeitado. Entre em contato com o administrador.'
                });
            }

            if (user.status === 'PENDING') {
                return res.status(403).json({
                    error: 'Aguardando aprovação',
                    message: 'Seu cadastro ainda não foi aprovado pelo administrador.'
                });
            }

            // Gerar token
            const token = generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            // Remover senha da resposta
            const { password: _, ...userWithoutPassword } = user.get({ plain: true });

            res.json({
                message: 'Login realizado com sucesso',
                token,
                user: userWithoutPassword,
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }
);

/**
 * GET /api/auth/me
 * Retorna dados do usuário logado
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.user!.userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Remover senha da resposta
        const { password, ...userWithoutPassword } = user.get({ plain: true });

        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
    }
});

/**
 * POST /api/auth/logout
 * Logout (client-side deve remover o token)
 */
router.post('/logout', (req: Request, res: Response) => {
    res.json({ message: 'Logout realizado com sucesso' });
});

export default router;
