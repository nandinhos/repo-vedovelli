import { User } from './User';
import { Item } from './Item';
import { Comment } from './Comment';
import { Tag } from './Tag';
import { ItemTag } from './ItemTag';

// Associations
User.hasMany(Item, { foreignKey: 'authorId', as: 'items' });
Item.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Item.hasMany(Comment, { foreignKey: 'itemId', as: 'comments' });
Comment.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

// Many-to-Many: Item <-> Tag
Item.belongsToMany(Tag, {
    through: ItemTag,
    foreignKey: 'itemId',
    otherKey: 'tagId',
    as: 'tags',
});

Tag.belongsToMany(Item, {
    through: ItemTag,
    foreignKey: 'tagId',
    otherKey: 'itemId',
    as: 'items',
});

export { User, Item, Comment, Tag, ItemTag };
