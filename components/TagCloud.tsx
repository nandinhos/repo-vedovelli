import React from 'react';
import { Tag } from '../types';

interface TagCloudProps {
  tags: Tag[];
  onTagClick: (tag: Tag) => void;
  selectedTags?: string[];
  maxTags?: number;
  className?: string;
}

export const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  onTagClick,
  selectedTags = [],
  maxTags = 30,
  className = ''
}) => {
  // Calcular tamanho da fonte baseado em usage
  const getFontSize = (usageCount: number, maxUsage: number): string => {
    if (maxUsage === 0) return 'text-base';
    
    const ratio = usageCount / maxUsage;
    if (ratio > 0.7) return 'text-2xl';
    if (ratio > 0.5) return 'text-xl';
    if (ratio > 0.3) return 'text-lg';
    return 'text-base';
  };

  const getOpacity = (usageCount: number, maxUsage: number): string => {
    if (maxUsage === 0) return 'opacity-70';
    
    const ratio = usageCount / maxUsage;
    if (ratio > 0.7) return 'opacity-100';
    if (ratio > 0.5) return 'opacity-90';
    if (ratio > 0.3) return 'opacity-80';
    return 'opacity-70';
  };

  if (tags.length === 0) {
    return null; // Não mostrar nada se não houver tags
  }

  const maxUsage = Math.max(...tags.map(t => t.usageCount || 0));
  const displayTags = tags.slice(0, maxTags);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map(tag => {
        const isSelected = selectedTags.includes(tag.name);
        
        return (
          <button
            key={tag.id}
            onClick={() => onTagClick(tag)}
            className={`
              text-xs px-2.5 py-1 rounded-full
              transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-blue-300
              ${isSelected 
                ? 'bg-blue-600 dark:bg-blue-500 text-white font-medium'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-normal'
              }
            `}
            title={`${tag.usageCount || 0} ${tag.usageCount === 1 ? 'item' : 'itens'}`}
          >
            #{tag.name}
          </button>
        );
      })}
      
      {tags.length > maxTags && (
        <span className="text-xs text-gray-400 px-2.5 py-1">
          +{tags.length - maxTags}
        </span>
      )}
    </div>
  );
};
