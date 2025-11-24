import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public role!: string;
    public status!: string;
    public avatar!: string;
    public bio?: string;
    public isPublicProfile!: boolean;
    public socialLinks?: object;
}

User.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'USER', 'GUEST'),
        defaultValue: 'USER',
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING',
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isPublicProfile: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    socialLinks: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'users',
});
