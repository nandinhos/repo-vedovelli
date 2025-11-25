import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface FavoriteAttributes {
  id: string;
  userId: string;
  itemId: string;
  createdAt?: Date;
}

export class Favorite extends Model<FavoriteAttributes> implements FavoriteAttributes {
  public id!: string;
  public userId!: string;
  public itemId!: string;
  public readonly createdAt!: Date;
}

Favorite.init({
  id: {
    type: DataTypes.STRING,
    defaultValue: () => `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'items',
      key: 'id'
    }
  }
}, {
  sequelize,
  tableName: 'favorites',
  timestamps: true,
  updatedAt: false
});

export default Favorite;
