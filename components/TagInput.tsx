import React, { useState, useRef, useEffect } from 'react';
import { Tag } from '../types';

interface TagInputProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: Tag[];
  maxTags?: number;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  selectedTags,
  onChange,
  suggestions = [],
  maxTags = 10,
  placeholder = "Adicionar tag..."
}) => {
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar sugestões baseado no input
  useEffect(() => {
    if (input.length >= 2) {
      const filtered = suggestions.filter(tag =>
        tag.name.toLowerCase().includes(input.toLowerCase()) &&
        !selectedTags.includes(tag.name)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [input, suggestions, selectedTags]);

  const addTag = (tagName: string) => {
    const normalizedTag = tagName.trim().toLowerCase();
    
    if (
      normalizedTag &&
      normalizedTag.length >= 2 &&
      normalizedTag.length <= 50 &&
      !selectedTags.includes(normalizedTag) &&
      selectedTags.length < maxTags
    ) {
      onChange([...selectedTags, normalizedTag]);
      setInput('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (input.trim()) {
        addTag(input);
      }
    } else if (e.key === 'Backspace' && !input && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && showSuggestions && filteredSuggestions.length > 0) {
      e.preventDefault();
      addTag(filteredSuggestions[activeSuggestionIndex].name);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Prevent adding comma or invalid characters
    if (!value.includes(',')) {
      setInput(value);
    } else {
      // If comma is typed, add the tag
      addTag(value.replace(',', ''));
    }
  };

  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionClick = (tag: Tag) => {
    addTag(tag.name);
  };

  const isLimitReached = selectedTags.length >= maxTags;

  return (
    <div className="relative">
      {/* Tags selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium transition-colors hover:bg-blue-200"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-blue-600 focus:outline-none ml-1 text-lg leading-none"
                aria-label={`Remover tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={handleBlur}
          placeholder={isLimitReached ? `Limite de ${maxTags} tags atingido` : placeholder}
          disabled={isLimitReached}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            isLimitReached
              ? 'bg-gray-100 cursor-not-allowed text-gray-500'
              : 'bg-white hover:border-blue-300'
          }`}
          maxLength={50}
        />
        
        {/* Tag counter */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          {selectedTags.length}/{maxTags}
        </div>
      </div>

      {/* Sugestões */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((tag, index) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleSuggestionClick(tag)}
              className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 flex justify-between items-center transition-colors ${
                index === activeSuggestionIndex ? 'bg-blue-50' : ''
              }`}
            >
              <span className="font-medium text-gray-700">#{tag.name}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {tag.usageCount || 0} {tag.usageCount === 1 ? 'uso' : 'usos'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-2">
        Pressione <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-xs">Enter</kbd> ou{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-xs">,</kbd> para adicionar.
        Use <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-xs">↑</kbd>{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded text-xs">↓</kbd> para navegar nas sugestões.
      </p>

      {/* Validation message */}
      {input.length > 0 && input.length < 2 && (
        <p className="text-xs text-amber-600 mt-1">
          Tag deve ter pelo menos 2 caracteres
        </p>
      )}
    </div>
  );
};
