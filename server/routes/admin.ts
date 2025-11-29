import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { Item } from '../models/Item';
import { Comment } from '../models/Comment';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Todas as rotas de admin requerem autenticação
router.use(authenticate);

/**
 * GET /api/admin/users
 * Lista todos os usuários (apenas SUPERADMIN)
 */
router.get('/users', authorize('SUPERADMIN', 'MODERATOR'), async (req: Request, res: Response) => {
    try {
        const { status, role } = req.query;

        const where: any = {};
        if (status) where.status = status;
        if (role) where.role = role;

        const users = await User.findAll({
            where,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] }, // Não retornar senhas
        });

        res.json({ users });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

/**
 * GET /api/admin/users/pending
 * Lista usuários pendentes de aprovação (SUPERADMIN e MODERATOR)
 */
router.get('/users/pending', authorize('SUPERADMIN', 'MODERATOR'), async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            where: { status: 'PENDING' },
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] },
        });

        res.json({ users });
    } catch (error) {
        console.error('Erro ao listar usuários pendentes:', error);
        res.status(500).json({ error: 'Erro ao listar usuários pendentes' });
    }
});

/**
 * PUT /api/admin/users/:id/approve
 * Aprova um usuário (SUPERADMIN e MODERATOR)
 */
router.put('/users/:id/approve', authorize('SUPERADMIN', 'MODERATOR'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (user.status !== 'PENDING') {
            return res.status(400).json({ error: 'Usuário já foi processado' });
        }

        // Aprovar e promover para USER
        await user.update({
            status: 'APPROVED',
            role: 'USER',
        });

        const { password, ...userWithoutPassword } = user.get({ plain: true });

        res.json({
            message: 'Usuário aprovado com sucesso',
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Erro ao aprovar usuário:', error);
        res.status(500).json({ error: 'Erro ao aprovar usuário' });
    }
});

/**
 * PUT /api/admin/users/:id/reject
 * Rejeita um usuário (SUPERADMIN e MODERATOR)
 */
router.put('/users/:id/reject', authorize('SUPERADMIN', 'MODERATOR'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (user.status !== 'PENDING') {
            return res.status(400).json({ error: 'Usuário já foi processado' });
        }

        await user.update({
            status: 'REJECTED',
            rejectionReason: reason || 'Não especificado',
        });

        const { password, ...userWithoutPassword } = user.get({ plain: true });

        res.json({
            message: 'Usuário rejeitado',
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Erro ao rejeitar usuário:', error);
        res.status(500).json({ error: 'Erro ao rejeitar usuário' });
    }
});

/**
 * PUT /api/admin/users/:id/role
 * Altera o role de um usuário (apenas SUPERADMIN)
 */
router.put(
    '/users/:id/role',
    authorize('SUPERADMIN'),
    [
        body('role').isIn(['SUPERADMIN', 'MODERATOR', 'USER', 'GUEST']).withMessage('Role inválida'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { role } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Não permitir alterar o próprio role
            if (user.id === req.user!.userId) {
                return res.status(403).json({ error: 'Você não pode alterar seu próprio role' });
            }

            await user.update({ role });

            const { password, ...userWithoutPassword } = user.get({ plain: true });

            res.json({
                message: `Role alterada para ${role}`,
                user: userWithoutPassword,
            });
        } catch (error) {
            console.error('Erro ao alterar role:', error);
            res.status(500).json({ error: 'Erro ao alterar role' });
        }
    }
);

/**
 * PUT /api/admin/users/:id/password
 * Reseta a senha de um usuário (SUPERADMIN e MODERATOR)
 * IMPORTANTE: Esta rota DEVE vir ANTES da rota genérica /users/:id
 */
router.put(
    '/users/:id/password',
    authorize('SUPERADMIN', 'MODERATOR'),
    [
        body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { newPassword } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Importar função de hash
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await user.update({ password: hashedPassword });

            res.json({ message: 'Senha resetada com sucesso' });
        } catch (error) {
            console.error('Erro ao resetar senha:', error);
            res.status(500).json({ error: 'Erro ao resetar senha' });
        }
    }
);

/**
 * PUT /api/admin/users/:id
 * Edita os dados de um usuário (SUPERADMIN e MODERATOR)
 * IMPORTANTE: Esta rota DEVE vir DEPOIS das rotas específicas (/approve, /reject, /role, /password)
 */
router.put(
    '/users/:id',
    authorize('SUPERADMIN', 'MODERATOR'),
    [
        body('name').optional().trim().isLength({ min: 2 }).withMessage('Nome deve ter no mínimo 2 caracteres'),
        body('email').optional().isEmail().withMessage('Email inválido'),
        body('bio').optional().trim(),
        body('avatar').optional().isURL().withMessage('Avatar deve ser uma URL válida'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { name, email, bio, avatar } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Se está alterando email, verificar se já existe
            if (email && email !== user.email) {
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(409).json({ error: 'Email já está em uso' });
                }
            }

            // Atualizar apenas os campos fornecidos
            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (email !== undefined) updateData.email = email;
            if (bio !== undefined) updateData.bio = bio;
            if (avatar !== undefined) updateData.avatar = avatar;

            await user.update(updateData);

            const { password, ...userWithoutPassword } = user.get({ plain: true });

            res.json({
                message: 'Usuário atualizado com sucesso',
                user: userWithoutPassword,
            });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    }
);

/**
 * DELETE /api/admin/users/:id
 * Deleta um usuário (apenas SUPERADMIN)
 */
router.delete('/users/:id', authorize('SUPERADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Não permitir deletar a si mesmo
        if (id === req.user!.userId) {
            return res.status(403).json({ error: 'Você não pode deletar sua própria conta' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await user.destroy();

        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

/**
 * GET /api/admin/stats
 * Estatísticas do sistema (apenas SUPERADMIN)
 */
router.get('/stats', authorize('SUPERADMIN', 'MODERATOR'), async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.count();
        const pendingUsers = await User.count({ where: { status: 'PENDING' } });
        const approvedUsers = await User.count({ where: { status: 'APPROVED' } });
        const rejectedUsers = await User.count({ where: { status: 'REJECTED' } });

        const superadmins = await User.count({ where: { role: 'SUPERADMIN' } });
        const moderators = await User.count({ where: { role: 'MODERATOR' } });
        const users = await User.count({ where: { role: 'USER' } });
        const guests = await User.count({ where: { role: 'GUEST' } });

        // Contar items e comentários
        const totalItems = await Item.count();
        const totalComments = await Comment.count();

        res.json({
            stats: {
                total: totalUsers,
                byStatus: {
                    pending: pendingUsers,
                    approved: approvedUsers,
                    rejected: rejectedUsers,
                },
                byRole: {
                    superadmin: superadmins,
                    moderator: moderators,
                    user: users,
                    guest: guests,
                },
                totalItems,
                totalComments,
            },
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

export default router;
