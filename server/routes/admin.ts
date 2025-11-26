import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Todas as rotas de admin requerem autenticação
router.use(authenticate);

/**
 * GET /api/admin/users
 * Lista todos os usuários (apenas SUPERADMIN)
 */
router.get('/users', authorize('SUPERADMIN'), async (req: Request, res: Response) => {
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
        const { reason } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (user.status !== 'PENDING') {
            return res.status(400).json({ error: 'Usuário já foi processado' });
        }

        await user.update({
            status: 'REJECTED',
            bio: reason ? `Rejeitado: ${reason}` : user.bio, // Opcionalmente salvar motivo
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
router.get('/stats', authorize('SUPERADMIN'), async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.count();
        const pendingUsers = await User.count({ where: { status: 'PENDING' } });
        const approvedUsers = await User.count({ where: { status: 'APPROVED' } });
        const rejectedUsers = await User.count({ where: { status: 'REJECTED' } });

        const superadmins = await User.count({ where: { role: 'SUPERADMIN' } });
        const moderators = await User.count({ where: { role: 'MODERATOR' } });
        const users = await User.count({ where: { role: 'USER' } });
        const guests = await User.count({ where: { role: 'GUEST' } });

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
            },
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

export default router;
