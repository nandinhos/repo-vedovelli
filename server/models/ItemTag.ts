import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class ItemTag extends Model {
    public itemId!: string;
    public tagId!: string;
    public readonly createdAt!: Date;
}

ItemTag.init({
    itemId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'items',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    tagId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'tags',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    sequelize,
    tableName: 'item_tags',
    timestamps: true,
    updatedAt: false,
});
