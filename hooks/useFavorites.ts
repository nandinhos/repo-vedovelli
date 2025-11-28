import { useState, useEffect, useCallback } from 'react';

interface UseFavoritesReturn {
  favoriteIds: string[];
  isFavorited: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => Promise<void>;
  isLoading: boolean;
}

export const useFavorites = (userId: string): UseFavoritesReturn => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar favoritos ao montar
  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/favorites/user/${userId}/ids`);
      const result = await response.json();
      
      if (result.success) {
        setFavoriteIds(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorited = useCallback((itemId: string) => {
    return favoriteIds.includes(itemId);
  }, [favoriteIds]);

  const toggleFavorite = async (itemId: string) => {
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (result.data.isFavorited) {
          setFavoriteIds(prev => [...prev, itemId]);
        } else {
          setFavoriteIds(prev => prev.filter(id => id !== itemId));
        }
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
    }
  };

  return {
    favoriteIds,
    isFavorited,
    toggleFavorite,
    isLoading
  };
};
