import React, { useState } from 'react';
import { X, Check, Code } from 'lucide-react';
import { LANGUAGES } from '../types';

interface CodeInsertionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (code: string, language: string) => void;
}

export const CodeInsertionModal: React.FC<CodeInsertionModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onInsert(code, language);
      setCode(''); // Reset after insert
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Code className="text-indigo-600 dark:text-indigo-400" size={20} /> Inserir Bloco de Código
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Linguagem</label>
            <select 
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
            <textarea 
              required
              className="flex-1 w-full p-4 bg-slate-900 text-blue-300 font-mono text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none custom-scrollbar resize-none"
              placeholder="// Cole seu código aqui..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={!code.trim()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 text-sm"
            >
              <Check size={16} /> Inserir Código
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};