import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { User, Item, Comment, Tag, Favorite } from './models';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import { authenticate, authorize, optionalAuth } from './middleware/auth';
import { TagService } from './services/tagService';
import { FavoriteService } from './services/favoriteService';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images

// Connect to Database
connectDB();

// Auth routes (públicas)
app.use('/api/auth', authRoutes);

// Admin routes (protegidas)
app.use('/api/admin', adminRoutes);

// Routes

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get all items with authors, comments, and tags (público, mas pode filtrar baseado em auth)
app.get('/api/items', optionalAuth, async (req, res) => {
    try {
        const items = await Item.findAll({
            include: [
                { model: User, as: 'author' },
                {
                    model: Comment,
                    as: 'comments',
                    include: [{ model: User, as: 'user' }]
                },
                { model: Tag, as: 'tags' }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Transform data to match frontend expectations if needed
        // Sequelize returns instances, we might want plain objects
        const plainItems = items.map(item => {
            const plain = item.get({ plain: true });
            // Map authorName for backward compatibility if needed, 
            // though frontend should ideally use author.name
            return {
                ...plain,
                authorName: plain.author?.name
            };
        });

        res.json(plainItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// Create a new item (requer autenticação e status APPROVED)
app.post('/api/items', authenticate, async (req, res) => {
    // Verificar se usuário está aprovado
    const user = await User.findByPk(req.user!.userId);
    if (!user || user.status !== 'APPROVED') {
        return res.status(403).json({ error: 'Apenas usuários aprovados podem criar items' });
    }
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error in POST /api/items:', error);
        res.status(500).json({ error: 'Failed to create item', details: error });
    }
});

// Update an item (apenas owner ou moderador/superadmin)
app.put('/api/items/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Item.update(req.body, { where: { id } });
        if (updated) {
            const updatedItem = await Item.findByPk(id);
            res.json(updatedItem);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// Delete an item (apenas owner ou moderador/superadmin)
app.delete('/api/items/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Item.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Add a comment (requer autenticação)
app.post('/api/comments', authenticate, async (req, res) => {
    try {
        const newComment = await Comment.create(req.body);
        // Fetch with user to return complete object
        const commentWithUser = await Comment.findByPk(newComment.id, {
            include: [{ model: User, as: 'user' }]
        });
        res.status(201).json(commentWithUser);
    } catch (error) {
        console.error('Error in POST /api/comments:', error);
        res.status(500).json({ error: 'Failed to add comment', details: error });
    }
});

// Update a comment (apenas owner ou moderador/superadmin)
app.put('/api/comments/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Comment.update(req.body, { where: { id } });
        if (updated) {
            const updatedComment = await Comment.findByPk(id, {
                include: [{ model: User, as: 'user' }]
            });
            res.json(updatedComment);
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update comment' });
    }
});

// Delete a comment (apenas owner ou moderador/superadmin)
app.delete('/api/comments/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Comment.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

// Update user profile (apenas o próprio usuário pode atualizar seu perfil)
app.put('/api/users/:id', authenticate, async (req, res) => {
    // Verificar se está tentando atualizar o próprio perfil
    if (req.params.id !== req.user!.userId) {
        return res.status(403).json({ error: 'Você só pode atualizar seu próprio perfil' });
    }

    // Não permitir alterar role ou status via esta rota
    const { role, status, password, ...allowedUpdates } = req.body;
    try {
        const { id } = req.params;
        const [updated] = await User.update(allowedUpdates, { where: { id } });
        if (updated) {
            const updatedUser = await User.findByPk(id);
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// ============= TAG ROUTES =============

// Get popular tags - MUST come before /:slug route
app.get('/api/tags/popular', async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const tags = await TagService.getPopular(Number(limit));
        
        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error in GET /api/tags/popular:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch popular tags' 
        });
    }
});

// Get items by tag slug
app.get('/api/tags/:slug/items', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await TagService.getItemsByTag(slug);
        
        res.json({
            success: true,
            data: result.items,
            meta: {
                tagName: result.tag.name,
                totalItems: result.count
            }
        });
    } catch (error) {
        console.error('Error in GET /api/tags/:slug/items:', error);
        res.status(404).json({ 
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch items by tag'
        });
    }
});

// Get all tags - comes after specific routes
app.get('/api/tags', async (req, res) => {
    try {
        const { search, limit = 50 } = req.query;
        
        let tags;
        if (search) {
            tags = await TagService.search(search as string, Number(limit));
        } else {
            tags = await TagService.getAll(Number(limit));
        }
        
        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error in GET /api/tags:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch tags' 
        });
    }
});

// Update tags for an item
app.put('/api/items/:id/tags', async (req, res) => {
    try {
        const { id } = req.params;
        const { tags } = req.body;
        
        if (!Array.isArray(tags)) {
            return res.status(400).json({
                success: false,
                error: 'Tags must be an array'
            });
        }
        
        const updatedTags = await TagService.syncItemTags(id, tags);
        
        res.json({
            success: true,
            data: {
                itemId: id,
                tags: updatedTags
            }
        });
    } catch (error) {
        console.error('Error in PUT /api/items/:id/tags:', error);
        res.status(500).json({ 
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update item tags'
        });
    }
});

// Get tags for a specific item
app.get('/api/items/:id/tags', async (req, res) => {
    try {
        const { id } = req.params;
        const tags = await TagService.getItemTags(id);
        
        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error in GET /api/items/:id/tags:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch item tags'
        });
    }
});

// ============= FAVORITE ROUTES =============

// Toggle favorito
app.post('/api/favorites/toggle', async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        
        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                error: 'userId e itemId são obrigatórios'
            });
        }
        
        const result = await FavoriteService.toggleFavorite(userId, itemId);
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in POST /api/favorites/toggle:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to toggle favorite'
        });
    }
});

// Buscar favoritos do usuário (itens completos)
app.get('/api/favorites/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const items = await FavoriteService.getUserFavorites(userId);
        
        res.json({
            success: true,
            data: items,
            meta: {
                total: items.length
            }
        });
    } catch (error) {
        console.error('Error in GET /api/favorites/user/:userId:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch user favorites'
        });
    }
});

// Buscar IDs dos favoritos do usuário (para UI)
app.get('/api/favorites/user/:userId/ids', async (req, res) => {
    try {
        const { userId } = req.params;
        const ids = await FavoriteService.getUserFavoriteIds(userId);
        
        res.json({
            success: true,
            data: ids
        });
    } catch (error) {
        console.error('Error in GET /api/favorites/user/:userId/ids:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch favorite IDs'
        });
    }
});

// Verificar se item está favoritado
app.get('/api/favorites/check/:userId/:itemId', async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        const isFavorited = await FavoriteService.isFavorited(userId, itemId);
        
        res.json({
            success: true,
            isFavorited
        });
    } catch (error) {
        console.error('Error in GET /api/favorites/check:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to check favorite status'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
