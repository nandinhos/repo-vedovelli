import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Item extends Model {
    public id!: string;
    public type!: 'snippet' | 'file' | 'link';
    public title!: string;
    public description!: string;
    public category!: string;
    public authorId!: string;
    public createdAt!: Date;

    // Snippet specific
    public language?: string;
    public code?: string;
    public repository?: string;

    // File specific
    public fileName?: string;
    public fileSize?: string;
    public fileExtension?: string;
    public downloadUrl?: string;

    // Link specific
    public url?: string;
    public website?: string;
    public youtube?: string;
}

Item.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => Date.now().toString(), // Generate ID automatically
    },
    type: {
        type: DataTypes.ENUM('snippet', 'file', 'link'),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    authorId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Snippet fields
    language: DataTypes.STRING,
    code: DataTypes.TEXT,
    repository: DataTypes.STRING,

    // File fields
    fileName: DataTypes.STRING,
    fileSize: DataTypes.STRING,
    fileExtension: DataTypes.STRING,
    downloadUrl: DataTypes.STRING,

    // Link fields
    url: DataTypes.STRING,
    website: DataTypes.STRING,
    youtube: DataTypes.STRING,
}, {
    sequelize,
    tableName: 'items',
});
