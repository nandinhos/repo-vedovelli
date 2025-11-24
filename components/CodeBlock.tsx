import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

// Simple syntax highlighting simulation using regex for demonstration
// In a real "Tallstack" equivalent, we might use PrismJS or Highlight.js
// Here we use a custom implementation to avoid heavy dependencies for the demo
// while keeping it lightweight and React-based.

const SyntaxHighlight: React.FC<{ code: string, lang: string }> = ({ code, lang }) => {
  // Very basic tokenizer for visual effect
  const tokens = code.split(/(\s+|[(){}\[\]<>,;:"'])/g);
  
  return (
    <pre className="font-mono text-sm leading-relaxed">
      {tokens.map((token, i) => {
        let color = 'text-gray-300';
        if (/^(const|let|var|function|import|export|return|if|else|for|while|class|interface|type)$/.test(token)) color = 'text-purple-400';
        else if (/^['"`].*['"`]$/.test(token)) color = 'text-green-400';
        else if (/^[A-Z][a-zA-Z0-9]*$/.test(token)) color = 'text-yellow-400'; // Likely class/type
        else if (/^\d+$/.test(token)) color = 'text-orange-400';
        else if (/[(){}\[\]]/.test(token)) color = 'text-blue-300';
        else if (token.startsWith('//')) color = 'text-gray-500 italic';
        
        return <span key={i} className={color}>{token}</span>;
      })}
    </pre>
  );
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-[#1e1e1e] border border-gray-700 shadow-lg my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-semibold">
          <Terminal size={14} />
          {language}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <SyntaxHighlight code={code} lang={language} />
      </div>
    </div>
  );
};