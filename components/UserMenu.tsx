import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, Settings, Shield, ChevronDown } from 'lucide-react';
import { User, UserRole } from '../types';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  onOpenProfile?: () => void;
  onOpenAdminPanel?: () => void;
}

export default function UserMenu({ user, onLogout, onOpenProfile, onOpenAdminPanel }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getRoleBadge = (role: UserRole) => {
    const badges = {
      [UserRole.SUPERADMIN]: { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      [UserRole.MODERATOR]: { label: 'Moderador', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      [UserRole.USER]: { label: 'Usuário', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      [UserRole.GUEST]: { label: 'Visitante', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
    };
    return badges[role];
  };

  const badge = getRoleBadge(user.role);

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                {(user.role === UserRole.SUPERADMIN || user.role === UserRole.MODERATOR) && (
                  <Shield size={12} />
                )}
                {badge.label}
              </span>
              {user.status === 'PENDING' && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Pendente
                </span>
              )}
            </div>
            {user.bio && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {onOpenProfile && (
              <button
                onClick={() => {
                  onOpenProfile();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <UserIcon size={16} />
                Meu Perfil
              </button>
            )}

            {/* Admin Panel - apenas para SUPERADMIN e MODERATOR */}
            {(user.role === UserRole.SUPERADMIN || user.role === UserRole.MODERATOR) && onOpenAdminPanel && (
              <button
                onClick={() => {
                  onOpenAdminPanel();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <Shield size={16} className="text-purple-600" />
                <span className="font-medium">Painel Admin</span>
              </button>
            )}

            <button
              onClick={() => {
                // TODO: Implementar configurações
                alert('Configurações em desenvolvimento');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings size={16} />
              Configurações
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
