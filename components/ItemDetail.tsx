import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Github, MessageSquare, Send, User as UserIcon, Pencil, Trash2, X, Check, Globe, Download, Youtube, Image as ImageIcon, Code, AlertCircle, Eye, Paperclip, Link as LinkIcon } from 'lucide-react';
import { RepositoryItem, Comment, User, UserRole } from '../types';
import { CodeBlock } from './CodeBlock';
import { ImageModal } from './ImageModal';
import { CodeInsertionModal } from './CodeInsertionModal';
import { permissions } from '../utils/permissions';

interface ItemDetailProps {
  item: RepositoryItem;
  currentUser: User | null;
  onAddComment: (itemId: string, text: string, screenshot?: string) => void;
  onEditComment: (itemId: string, commentId: string, text: string, screenshot?: string) => void;
  onDeleteComment: (itemId: string, commentId: string) => void;
}

export const ItemDetail: React.FC<ItemDetailProps> = ({ 
  item, 
  currentUser, 
  onAddComment,
  onEditComment,
  onDeleteComment
}) => {
  // --- NEW COMMENT STATES ---
  const [newComment, setNewComment] = useState('');
  const [newCommentScreenshot, setNewCommentScreenshot] = useState(''); 
  const [showUrlInput, setShowUrlInput] = useState(false);
  
  // --- EDIT COMMENT STATES ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [editCommentScreenshot, setEditCommentScreenshot] = useState('');
  const [showEditUrlInput, setShowEditUrlInput] = useState(false);

  // --- VIEW MODALS ---
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [targetForCode, setTargetForCode] = useState<'new' | 'edit'>('new'); // To know where to insert code
  const [viewImage, setViewImage] = useState<{isOpen: boolean, url: string}>({ isOpen: false, url: '' });

  // --- REFS ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // --- HANDLERS FOR NEW COMMENT ---

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && !newCommentScreenshot) return;
    onAddComment(item.id, newComment, newCommentScreenshot);
    setNewComment('');
    setNewCommentScreenshot('');
    setShowUrlInput(false);
  };

  const handleInsertCode = (code: string, language: string) => {
    const formattedCode = `\n\`\`\`${language}\n${code}\n\`\`\`\n`;
    
    if (targetForCode === 'new') {
        setNewComment(prev => prev + formattedCode);
        setTimeout(() => textareaRef.current?.focus(), 100);
    } else {
        setEditCommentText(prev => prev + formattedCode);
        setTimeout(() => editTextareaRef.current?.focus(), 100);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, isEdit);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, isEdit: boolean = false) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) processImageFile(blob, isEdit);
        return;
      }
    }
  };

  const processImageFile = (file: File, isEdit: boolean) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (isEdit) {
            setEditCommentScreenshot(event.target.result as string);
            setShowEditUrlInput(false);
        } else {
            setNewCommentScreenshot(event.target.result as string);
            setShowUrlInput(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // --- HANDLERS FOR EDITING ---

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
    setEditCommentScreenshot(comment.screenshotUrl || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCommentId && (editCommentText.trim() || editCommentScreenshot)) {
      onEditComment(item.id, editingCommentId, editCommentText, editCommentScreenshot);
      setIsEditModalOpen(false);
      setEditingCommentId(null);
      setEditCommentText('');
      setEditCommentScreenshot('');
    }
  };

  // --- PERMISSIONS ---
  const canEditComment = (comment: Comment) => {
    if (comment.isDeleted) return false;
    return permissions.canEditComment(currentUser, comment.userId);
  };

  const canDeleteComment = (comment: Comment) => {
    if (comment.isDeleted) return false;
    return permissions.canDeleteComment(currentUser, comment.userId);
  };

  // --- RENDER HELPER ---
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const firstLineBreak = part.indexOf('\n');
        const language = part.slice(3, firstLineBreak).trim();
        const codeContent = part.slice(firstLineBreak + 1, -3).trim();
        return <div key={index} className="my-3 text-xs"><CodeBlock code={codeContent} language={language || 'javascript'} /></div>;
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className="bg-slate-50 p-6 border-t border-gray-200 animate-fadeIn">
      <ImageModal 
        isOpen={viewImage.isOpen} 
        imageUrl={viewImage.url} 
        altText="Screenshot do resultado" 
        onClose={() => setViewImage({ isOpen: false, url: '' })} 
      />

      <CodeInsertionModal 
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onInsert={handleInsertCode}
      />

      {/* Main Vertical Layout */}
      <div className="flex flex-col gap-8">
        
        {/* SECTION 1: ITEM DETAILS & RESOURCES */}
        <div className="space-y-6 w-full">
          
          {/* Link Special Display */}
          {item.type === 'link' && (
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 flex items-center justify-between shadow-sm">
                  <div>
                      <h4 className="text-sky-900 font-semibold text-lg flex items-center gap-2 mb-1">
                          <Globe size={20} /> Recurso Externo
                      </h4>
                      <p className="text-sky-700/80 text-sm">Este conteúdo está hospedado em um site externo.</p>
                  </div>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                      Acessar Link <ExternalLink size={16} />
                  </a>
              </div>
          )}
          
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sobre este item</h4>
            <div className="prose max-w-none text-gray-700 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="leading-relaxed text-base">{item.description}</p>
            </div>
          </div>

          {/* Action Buttons / Resources */}
          {(item.repository || item.website || item.youtube || item.type === 'file') && (
              <div>
                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recursos Adicionais</h4>
                 <div className="flex flex-wrap gap-3">
                    {item.repository && (
                    <a href={item.repository} target="_blank" rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition-colors shadow-sm">
                        <Github size={16} /> Repositório GitHub
                    </a>
                    )}
                    {item.website && (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-500 transition-colors shadow-sm">
                        <ExternalLink size={16} /> Website do Projeto
                    </a>
                    )}
                    {item.youtube && (
                    <a href={item.youtube} target="_blank" rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-500 transition-colors shadow-sm">
                        <Youtube size={16} /> Ver Vídeo/Demo
                    </a>
                    )}
                    {item.type === 'file' && (
                    <a href={item.downloadUrl} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-500 transition-colors shadow-sm">
                        <Download size={16} /> Download {item.fileExtension.toUpperCase()} ({item.fileSize})
                    </a>
                    )}
                </div>
              </div>
          )}

          {/* Snippet Code Block */}
          {item.type === 'snippet' && (
            <div>
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Preview do Código</h4>
              <CodeBlock code={item.code} language={item.language} />
            </div>
          )}
        </div>

        {/* SECTION 2: DISCUSSION / COMMENTS */}
        <div className="flex flex-col border-t border-gray-300 pt-8">
          <h4 className="text-base font-bold text-gray-700 uppercase tracking-wider mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-indigo-500" /> Discussão & Soluções ({item.comments.filter(c => !c.isDeleted).length})
          </h4>
          
          {/* Comments List */}
          <div className="space-y-6 mb-8">
            {item.comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white border border-gray-200 border-dashed rounded-xl">
                  <MessageSquare size={40} className="mb-3 text-gray-300" />
                  <p className="text-gray-500 font-medium">Ainda não há contribuições.</p>
                  <p className="text-sm text-gray-400">Seja o primeiro a compartilhar uma solução ou dúvida!</p>
              </div>
            ) : (
                item.comments.map(comment => {
                  if (comment.isDeleted) {
                    if (canDeleteComment(comment)) {
                        return (
                            <div key={comment.id} className="flex gap-4 p-4 bg-red-50 border border-red-100 rounded-xl opacity-75">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase mb-1">
                                        <AlertCircle size={12} /> Mensagem Removida pela Moderação
                                    </div>
                                    <p className="text-xs text-red-600 italic">Motivo: {comment.deletionReason || "Violação das regras da comunidade."}</p>
                                </div>
                            </div>
                        )
                    } else {
                        return null; 
                    }
                  }

                  return (
                  <div key={comment.id} className="flex gap-4 group bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <img src={comment.userAvatar} alt={comment.userName} className="w-10 h-10 rounded-full bg-gray-200 object-cover shrink-0 border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">{comment.userName}</span>
                                {item.authorId === comment.userId && (
                                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-bold uppercase tracking-wider">Autor</span>
                                )}
                            </div>
                            <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()} às {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {canEditComment(comment) && (
                                <button 
                                    type="button" 
                                    onClick={() => handleStartEdit(comment)} 
                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium" 
                                    title="Editar"
                                >
                                    <Pencil size={14} /> <span className="hidden sm:inline">Editar</span>
                                </button>
                            )}
                            {canDeleteComment(comment) && (
                                <button 
                                    type="button" 
                                    onClick={() => onDeleteComment(item.id, comment.id)} 
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium" 
                                    title="Excluir"
                                >
                                    <Trash2 size={14} /> <span className="hidden sm:inline">Excluir</span>
                                </button>
                            )}
                        </div>
                      </div>

                      <div className="mt-1">
                          <div className="text-sm text-gray-700 leading-relaxed break-words">
                              {renderContent(comment.content)}
                          </div>
                          
                          {comment.screenshotUrl && (
                              <div className="mt-4">
                                  <button 
                                    onClick={() => setViewImage({ isOpen: true, url: comment.screenshotUrl! })}
                                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors group/btn hover:shadow-md w-full sm:w-auto text-left"
                                  >
                                      <div className="bg-white p-2 rounded border border-gray-200">
                                        <ImageIcon size={20} className="text-indigo-500" />
                                      </div>
                                      <div>
                                        <div className="font-semibold">Ver Resultado</div>
                                        <div className="text-xs text-gray-500">Clique para ampliar o screenshot</div>
                                      </div>
                                      <Eye size={16} className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-auto text-gray-400" />
                                  </button>
                              </div>
                          )}
                      </div>
                    </div>
                  </div>
                )})
            )}
          </div>

          {/* New Comment Form */}
          {currentUser ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <MessageSquare size={18} className="text-indigo-600" />
                    <h5 className="font-semibold text-gray-700 text-sm">Adicionar Contribuição</h5>
                </div>
                <form onSubmit={handleSubmitComment} className="p-4">
                <div className="relative mb-4">
                    <textarea
                        ref={textareaRef}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onPaste={(e) => handlePaste(e, false)}
                        placeholder={currentUser.status === 'APPROVED' ? "Escreva sua solução, dúvida ou feedback... (Cole uma imagem com Ctrl+V)" : "Aguardando aprovação para comentar"}
                        disabled={currentUser.status !== 'APPROVED'}
                        rows={showUrlInput || newCommentScreenshot ? 5 : 3}
                        className="w-full p-4 bg-slate-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm disabled:cursor-not-allowed resize-none transition-all"
                    />
                </div>

                {/* Media Preview */}
                {newCommentScreenshot && (
                    <div className="mb-4 px-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Imagem Anexada:</p>
                        <div className="relative inline-block group">
                            <img src={newCommentScreenshot} alt="Preview" className="h-24 w-auto rounded-lg border border-gray-200 shadow-sm" />
                            <button 
                                type="button"
                                onClick={() => setNewCommentScreenshot('')}
                                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Helper Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        <button 
                            type="button"
                            onClick={() => { setTargetForCode('new'); setIsCodeModalOpen(true); }}
                            className="px-3 py-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 bg-white border border-gray-200 hover:border-indigo-200 rounded-md transition-colors flex items-center gap-2 text-xs font-medium shadow-sm"
                            title="Inserir Bloco de Código"
                        >
                            <Code size={14} /> Inserir Código
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 bg-white border border-gray-200 hover:border-indigo-200 rounded-md transition-colors flex items-center gap-2 text-xs font-medium shadow-sm"
                            title="Upload Imagem"
                        >
                            <Paperclip size={14} /> Anexar Imagem
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => handleFileUpload(e, false)} 
                        />

                        <button 
                            type="button"
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 text-xs font-medium border shadow-sm ${showUrlInput ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 bg-white border-gray-200'}`}
                            title="Link de Imagem"
                        >
                            <LinkIcon size={14} /> URL
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={(!newComment.trim() && !newCommentScreenshot) || currentUser.status !== 'APPROVED'}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-all transform active:scale-95 shadow-md"
                    >
                        Enviar Contribuição <Send size={16} />
                    </button>
                </div>

                {/* URL Input Dropdown */}
                {showUrlInput && (
                    <div className="mt-3 animate-fadeIn">
                        <div className="flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-lg px-3 py-1 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all">
                            <LinkIcon size={14} className="text-gray-400" />
                            <input 
                                type="url"
                                placeholder="Cole a URL da imagem (http://...)"
                                value={newCommentScreenshot}
                                onChange={(e) => setNewCommentScreenshot(e.target.value)}
                                className="w-full py-2 bg-transparent border-none outline-none text-xs text-gray-600 placeholder-gray-400"
                            />
                        </div>
                    </div>
                )}
                </form>
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-500 font-medium mb-2">Faça login para participar da discussão.</p>
              <p className="text-sm text-gray-400">Você precisa de uma conta aprovada para postar.</p>
            </div>
          )}
        </div>

      </div>

      {/* --- FULL EDIT COMMENT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Pencil className="text-amber-500" size={20} /> Editar Contribuição
                    </h3>
                    <button 
                        onClick={() => setIsEditModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSaveEdit} className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
                    <div className="mb-4 flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
                        <textarea
                            ref={editTextareaRef}
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            onPaste={(e) => handlePaste(e, true)}
                            className="w-full h-48 p-4 bg-slate-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm resize-none"
                            placeholder="Edite seu comentário..."
                        />
                    </div>

                    {/* Edit Media Preview */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Anexada</label>
                        {editCommentScreenshot ? (
                            <div className="relative inline-block group">
                                <img src={editCommentScreenshot} alt="Preview" className="h-32 w-auto rounded-lg border border-gray-200 shadow-sm" />
                                <button 
                                    type="button"
                                    onClick={() => setEditCommentScreenshot('')}
                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                    title="Remover imagem"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-center">
                                <p className="text-xs text-gray-400">Nenhuma imagem anexada</p>
                            </div>
                        )}
                    </div>

                    {/* Edit Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <button 
                            type="button"
                            onClick={() => { setTargetForCode('edit'); setIsCodeModalOpen(true); }}
                            className="px-3 py-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 border border-gray-200 rounded-md transition-colors flex items-center gap-2 text-xs font-medium"
                        >
                            <Code size={14} /> Inserir Código
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="px-3 py-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 border border-gray-200 rounded-md transition-colors flex items-center gap-2 text-xs font-medium"
                        >
                            <Paperclip size={14} /> Anexar Imagem
                        </button>
                        <input 
                            type="file" 
                            ref={editFileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => handleFileUpload(e, true)} 
                        />

                        <button 
                            type="button"
                            onClick={() => setShowEditUrlInput(!showEditUrlInput)}
                            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 text-xs font-medium border ${showEditUrlInput ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50 border-gray-200'}`}
                        >
                            <LinkIcon size={14} /> URL
                        </button>
                    </div>

                    {/* Edit URL Input */}
                    {showEditUrlInput && (
                        <div className="mb-4 animate-fadeIn">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400">
                                <LinkIcon size={14} className="text-gray-400" />
                                <input 
                                    type="url"
                                    placeholder="Cole a URL da imagem..."
                                    value={editCommentScreenshot}
                                    onChange={(e) => setEditCommentScreenshot(e.target.value)}
                                    className="w-full py-2 bg-transparent border-none outline-none text-xs text-gray-600"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-auto">
                        <button 
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={!editCommentText.trim() && !editCommentScreenshot}
                            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 text-sm"
                        >
                            <Check size={16} /> Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};