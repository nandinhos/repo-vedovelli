import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Tag extends Model {
    public id!: string;
    public name!: string;
    public slug!: string;
    public usageCount!: number;
    public readonly createdAt!: Date;
}

Tag.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            len: [2, 50],
        },
    },
    slug: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    usageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize,
    tableName: 'tags',
    timestamps: true,
    updatedAt: false, // Only createdAt
});
