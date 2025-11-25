import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  itemId: string;
  userId: string;
  isFavorited: boolean;
  onToggle: (itemId: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  userId,
  isFavorited,
  onToggle,
  size = 'sm',
  showLabel = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Não abrir modal ao clicar no favorito
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      await onToggle(itemId);
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-1
        p-1.5 rounded-lg
        transition-all duration-200
        ${isFavorited 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-300 hover:text-red-500'
        }
        ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
      title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart 
        className={`${sizeClasses[size]} transition-all ${isFavorited ? 'fill-current' : ''}`}
      />
      {showLabel && (
        <span className="text-xs font-medium">
          {isFavorited ? 'Favoritado' : 'Favoritar'}
        </span>
      )}
    </button>
  );
};
