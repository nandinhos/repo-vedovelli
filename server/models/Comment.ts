import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Comment extends Model {
    public id!: string;
    public itemId!: string;
    public userId!: string;
    public content!: string;
    public isDeleted!: boolean;
    public deletionReason?: string;
    public screenshotUrl?: string;
}

Comment.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => Date.now().toString(), // Generate ID automatically
    },
    itemId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deletionReason: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    screenshotUrl: {
        type: DataTypes.TEXT('long'), // LONGTEXT for large base64 images (up to 4GB)
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'comments',
});
