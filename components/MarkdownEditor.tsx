import React, { useState } from 'react';
import { 
  Bold, Italic, Link as LinkIcon, Code, List, ListOrdered, 
  Quote, FileCode, Eye, Edit, HelpCircle 
} from 'lucide-react';
import MarkdownViewer from './MarkdownViewer';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  showPreview?: boolean;
  maxLength?: number;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Digite aqui... (Suporta Markdown)',
  minRows = 5,
  maxLength = 5000,
  showPreview = false,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>(showPreview ? 'preview' : 'edit');
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Função para inserir formatação markdown
  const insertMarkdown = (before: string, after: string = '', placeholder: string = 'texto') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);
    
    onChange(newValue);

    // Reposicionar cursor
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + textToInsert.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Negrito', action: () => insertMarkdown('**', '**', 'negrito') },
    { icon: Italic, label: 'Itálico', action: () => insertMarkdown('*', '*', 'itálico') },
    { icon: Code, label: 'Código Inline', action: () => insertMarkdown('`', '`', 'código') },
    { icon: FileCode, label: 'Bloco de Código', action: () => insertMarkdown('\n```\n', '\n```\n', 'código') },
    { icon: LinkIcon, label: 'Link', action: () => insertMarkdown('[', '](url)', 'texto do link') },
    { icon: List, label: 'Lista', action: () => insertMarkdown('- ', '', 'item') },
    { icon: ListOrdered, label: 'Lista Numerada', action: () => insertMarkdown('1. ', '', 'item') },
    { icon: Quote, label: 'Citação', action: () => insertMarkdown('> ', '', 'citação') },
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header com Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Edit size={16} />
            Editar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            title="Guia rápido de Markdown"
          >
            <HelpCircle size={18} />
          </button>

          {/* Help Tooltip */}
          {showHelp && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-50 text-sm">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Guia Rápido Markdown</h4>
              <div className="space-y-1 text-gray-600 dark:text-gray-400 font-mono text-xs">
                <div><span className="text-blue-600 dark:text-blue-400">**negrito**</span> → <strong>negrito</strong></div>
                <div><span className="text-blue-600 dark:text-blue-400">*itálico*</span> → <em>itálico</em></div>
                <div><span className="text-blue-600 dark:text-blue-400">`código`</span> → <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">código</code></div>
                <div><span className="text-blue-600 dark:text-blue-400">[link](url)</span> → link</div>
                <div><span className="text-blue-600 dark:text-blue-400">- lista</span> → • lista</div>
                <div><span className="text-blue-600 dark:text-blue-400">&gt; citação</span> → citação</div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar (apenas em modo edição) */}
      {activeTab === 'edit' && (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-wrap">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded transition-colors"
              title={button.label}
            >
              <button.icon size={18} />
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="p-3">
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={minRows}
            maxLength={maxLength}
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none resize-none"
            style={{ minHeight: `${minRows * 1.5}rem` }}
          />
        ) : (
          <div className="min-h-[7.5rem]">
            {value ? (
              <MarkdownViewer content={value} />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 italic text-sm">
                Nada para visualizar. Digite algo na aba "Editar".
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer com contador */}
      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Suporta <strong>Markdown</strong> - Use a toolbar para formatação rápida
        </span>
        <span className={`text-xs font-mono ${
          value.length > maxLength * 0.9 
            ? 'text-red-600 dark:text-red-400 font-bold' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default MarkdownEditor;
