import { User } from './User';
import { Item } from './Item';
import { Comment } from './Comment';

// Associations
User.hasMany(Item, { foreignKey: 'authorId', as: 'items' });
Item.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Item.hasMany(Comment, { foreignKey: 'itemId', as: 'comments' });
Comment.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

export { User, Item, Comment };
