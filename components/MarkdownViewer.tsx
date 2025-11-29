import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          // Links abrem em nova aba
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline" />
          ),
          // Código inline
          code: ({ node, inline, ...props }: any) => (
            inline ? (
              <code {...props} className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono" />
            ) : (
              <code {...props} className="block bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono" />
            )
          ),
          // Blocos de código
          pre: ({ node, ...props }) => (
            <pre {...props} className="bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-lg overflow-x-auto my-4" />
          ),
          // Citações
          blockquote: ({ node, ...props }) => (
            <blockquote {...props} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4" />
          ),
          // Listas
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc list-inside my-2 space-y-1 text-gray-700 dark:text-gray-300" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal list-inside my-2 space-y-1 text-gray-700 dark:text-gray-300" />
          ),
          // Parágrafos
          p: ({ node, ...props }) => (
            <p {...props} className="my-2 text-gray-700 dark:text-gray-300 leading-relaxed" />
          ),
          // Headings
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-2xl font-bold my-3 text-gray-900 dark:text-gray-100" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-xl font-bold my-3 text-gray-900 dark:text-gray-100" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-lg font-bold my-2 text-gray-900 dark:text-gray-100" />
          ),
          // Linha horizontal
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-4 border-gray-300 dark:border-gray-600" />
          ),
          // Tabelas
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table {...props} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th {...props} className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800" />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700" />
          ),
          // Imagens responsivas
          img: ({ node, ...props }) => (
            <img {...props} className="max-w-full h-auto rounded-lg my-4" alt={props.alt || ''} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
