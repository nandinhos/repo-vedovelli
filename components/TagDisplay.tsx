import React from 'react';
import { Tag } from '../types';

interface TagDisplayProps {
  tags: Tag[];
  onTagClick?: (tag: Tag) => void;
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

export const TagDisplay: React.FC<TagDisplayProps> = ({
  tags,
  onTagClick,
  maxVisible = 5,
  size = 'sm',
  clickable = true
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  const handleClick = (tag: Tag, e: React.MouseEvent) => {
    if (clickable && onTagClick) {
      e.stopPropagation();
      onTagClick(tag);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {visibleTags.map(tag => (
        <span
          key={tag.id}
          onClick={(e) => handleClick(tag, e)}
          className={`
            inline-flex items-center gap-1
            ${sizeClasses[size]}
            bg-gray-100 text-gray-600 rounded-full font-normal
            transition-all duration-200
            ${clickable && onTagClick ? 'hover:bg-gray-200 cursor-pointer' : ''}
          `}
          title={clickable ? `Filtrar por #${tag.name}` : tag.name}
        >
          #{tag.name}
        </span>
      ))}
      
      {remainingCount > 0 && (
        <span 
          className={`
            ${sizeClasses[size]}
            bg-gray-50 text-gray-400 rounded-full font-normal
          `}
          title={`${remainingCount} ${remainingCount === 1 ? 'tag a mais' : 'tags a mais'}`}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};
