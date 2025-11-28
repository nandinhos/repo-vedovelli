import React from 'react';
import { X, Github, Linkedin, Instagram, MessageCircle, Briefcase, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform scale-100 transition-all">
        
        {/* Header / Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
            >
                <X size={20} />
            </button>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 -mt-16 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
                <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover bg-gray-200"
                />
                {user.role === UserRole.ADMIN && (
                    <div className="absolute bottom-1 right-1 bg-purple-100 dark:bg-gray-700 text-purple-700 dark:text-purple-400 p-1.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" title="Administrador">
                        <ShieldCheck size={18} />
                    </div>
                )}
            </div>

            {/* Name & Bio */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{user.name}</h2>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-6 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                <Briefcase size={14} />
                <span>{user.bio || 'Membro da Comunidade'}</span>
            </div>

            {/* Contact / Social Grid */}
            <div className="w-full grid grid-cols-2 gap-3">
                {user.socialLinks?.github && (
                    <a 
                        href={user.socialLinks.github} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 p-3 bg-[#24292e] text-white rounded-xl hover:bg-[#1a1e22] transition-colors shadow-sm"
                    >
                        <Github size={18} /> GitHub
                    </a>
                )}
                
                {user.socialLinks?.linkedin && (
                    <a 
                        href={user.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 p-3 bg-[#0077b5] text-white rounded-xl hover:bg-[#006399] transition-colors shadow-sm"
                    >
                        <Linkedin size={18} /> LinkedIn
                    </a>
                )}

                {user.socialLinks?.instagram && (
                    <a 
                        href={user.socialLinks.instagram} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                    >
                        <Instagram size={18} /> Instagram
                    </a>
                )}

                {user.socialLinks?.whatsapp && (
                    <a 
                        href={`https://wa.me/${user.socialLinks.whatsapp.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 p-3 bg-[#25D366] text-white rounded-xl hover:bg-[#20bd5a] transition-colors shadow-sm"
                    >
                        <MessageCircle size={18} /> WhatsApp
                    </a>
                )}
            </div>

            {/* Fallback if no socials */}
            {(!user.socialLinks || Object.values(user.socialLinks).every(v => !v)) && (
                <div className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-sm italic">
                    Este usuário ainda não compartilhou suas redes.
                </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 w-full flex justify-center">
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs">
                    <Mail size={14} />
                    <span>{user.email}</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};