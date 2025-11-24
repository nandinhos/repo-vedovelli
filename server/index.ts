import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { User, Item, Comment } from './models';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images

// Connect to Database
connectDB();

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

// Get all items with authors and comments
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.findAll({
            include: [
                { model: User, as: 'author' },
                {
                    model: Comment,
                    as: 'comments',
                    include: [{ model: User, as: 'user' }]
                }
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

// Create a new item (Basic implementation)
app.post('/api/items', async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error in POST /api/items:', error);
        res.status(500).json({ error: 'Failed to create item', details: error });
    }
});

// Update an item
app.put('/api/items/:id', async (req, res) => {
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

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
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

// Add a comment
app.post('/api/comments', async (req, res) => {
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

// Update a comment
app.put('/api/comments/:id', async (req, res) => {
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

// Delete a comment
app.delete('/api/comments/:id', async (req, res) => {
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

// Update user profile
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await User.update(req.body, { where: { id } });
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
