import { Favorite } from '../models/Favorite';
import { Item } from '../models/Item';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { Tag } from '../models/Tag';

export class FavoriteService {
  
  // Toggle favorito (adiciona se não existe, remove se existe)
  static async toggleFavorite(userId: string, itemId: string): Promise<{ isFavorited: boolean }> {
    try {
      const existing = await Favorite.findOne({
        where: { userId, itemId }
      });
      
      if (existing) {
        await existing.destroy();
        return { isFavorited: false };
      } else {
        await Favorite.create({ userId, itemId });
        return { isFavorited: true };
      }
    } catch (error) {
      throw new Error(`Erro ao alternar favorito: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Buscar todos os favoritos de um usuário
  static async getUserFavorites(userId: string): Promise<any[]> {
    try {
      const favorites = await Favorite.findAll({
        where: { userId },
        include: [
          {
            model: Item,
            as: 'item',
            include: [
              { model: User, as: 'author' },
              { 
                model: Comment, 
                as: 'comments',
                include: [{ model: User, as: 'user' }]
              },
              { model: Tag, as: 'tags' }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      return favorites.map(fav => fav.get({ plain: true }).item);
    } catch (error) {
      throw new Error(`Erro ao buscar favoritos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Buscar IDs de todos os favoritos do usuário (para marcar na listagem)
  static async getUserFavoriteIds(userId: string): Promise<string[]> {
    try {
      const favorites = await Favorite.findAll({
        where: { userId },
        attributes: ['itemId']
      });
      
      return favorites.map(fav => fav.itemId);
    } catch (error) {
      return [];
    }
  }
  
  // Verificar se item está nos favoritos do usuário
  static async isFavorited(userId: string, itemId: string): Promise<boolean> {
    try {
      const favorite = await Favorite.findOne({
        where: { userId, itemId }
      });
      
      return !!favorite;
    } catch (error) {
      return false;
    }
  }
}
