import React, { useState, useEffect } from 'react';
import {
  X, Users, CheckCircle, XCircle, Shield, Clock, Search,
  UserCheck, UserX, Crown, Eye, AlertTriangle, TrendingUp,
  MessageSquare, FileText, Activity, ChevronDown, ChevronUp
} from 'lucide-react';
import { User, UserRole, ApprovalStatus } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

interface Stats {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  rejectedUsers: number;
  totalItems: number;
  totalComments: number;
}

export default function AdminPanel({ isOpen, onClose, currentUser }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'stats'>('pending');
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    totalItems: 0,
    totalComments: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [usersRes, pendingRes, statsRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/users/pending', { headers }),
        fetch('/api/admin/stats', { headers })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        // A API retorna {users: [...]} ao invés de array direto
        setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
      }

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        // A API retorna {users: [...]} ao invés de array direto
        setPendingUsers(Array.isArray(pendingData) ? pendingData : pendingData.users || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        // Adaptar formato da API para o formato esperado pelo componente
        if (statsData.stats) {
          setStats({
            totalUsers: statsData.stats.total || 0,
            pendingUsers: statsData.stats.byStatus?.pending || 0,
            approvedUsers: statsData.stats.byStatus?.approved || 0,
            rejectedUsers: statsData.stats.byStatus?.rejected || 0,
            totalItems: statsData.stats.totalItems || 0,
            totalComments: statsData.stats.totalComments || 0
          });
        } else {
          setStats(statsData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to approve user:', error);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to reject user:', error);
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    if (currentUser.role !== UserRole.SUPERADMIN) {
      alert('Apenas SUPERADMIN pode alterar roles');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const badges = {
      [UserRole.SUPERADMIN]: { label: 'Super Admin', icon: Crown, color: 'bg-purple-100 text-purple-800 border-purple-200' },
      [UserRole.MODERATOR]: { label: 'Moderador', icon: Shield, color: 'bg-blue-100 text-blue-800 border-blue-200' },
      [UserRole.USER]: { label: 'Usuário', icon: UserCheck, color: 'bg-green-100 text-green-800 border-green-200' },
      [UserRole.GUEST]: { label: 'Visitante', icon: Clock, color: 'bg-gray-100 text-gray-800 border-gray-200' }
    };
    return badges[role];
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    const badges = {
      [ApprovalStatus.APPROVED]: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
      [ApprovalStatus.PENDING]: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      [ApprovalStatus.REJECTED]: { label: 'Rejeitado', color: 'bg-red-100 text-red-800' }
    };
    return badges[status];
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Painel Administrativo</h2>
                <p className="text-purple-100 text-sm">Gerenciamento de usuários e sistema</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-purple-200" />
                <span className="text-xs text-purple-200">Total</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-yellow-200" />
                <span className="text-xs text-purple-200">Pendentes</span>
              </div>
              <p className="text-2xl font-bold">{stats.pendingUsers}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-green-200" />
                <span className="text-xs text-purple-200">Aprovados</span>
              </div>
              <p className="text-2xl font-bold">{stats.approvedUsers}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <XCircle size={16} className="text-red-200" />
                <span className="text-xs text-purple-200">Rejeitados</span>
              </div>
              <p className="text-2xl font-bold">{stats.rejectedUsers}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className="text-blue-200" />
                <span className="text-xs text-purple-200">Posts</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={16} className="text-cyan-200" />
                <span className="text-xs text-purple-200">Comentários</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalComments}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                activeTab === 'pending'
                  ? 'border-purple-600 text-purple-700 bg-white dark:bg-gray-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock size={18} />
              Pendentes ({pendingUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-700 bg-white dark:bg-gray-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={18} />
              Todos Usuários ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                activeTab === 'stats'
                  ? 'border-purple-600 text-purple-700 bg-white dark:bg-gray-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Activity size={18} />
              Estatísticas
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Pending Users Tab */}
              {activeTab === 'pending' && (
                <div>
                  {pendingUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-gray-400" size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário pendente</h3>
                      <p className="text-gray-500">Todos os usuários foram revisados.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingUsers.map(user => {
                        const roleBadge = getRoleBadge(user.role);
                        const RoleIcon = roleBadge.icon;
                        
                        return (
                          <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-16 h-16 rounded-full border-2 border-gray-200"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                  </div>
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color} border`}>
                                    <RoleIcon size={14} />
                                    {roleBadge.label}
                                  </span>
                                </div>
                                {user.bio && (
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{user.bio}</p>
                                )}
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                  <Clock size={14} />
                                  <span>Cadastrado em: {new Date(user.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleApproveUser(user.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                  >
                                    <CheckCircle size={16} />
                                    Aprovar
                                  </button>
                                  <button
                                    onClick={() => handleRejectUser(user.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                  >
                                    <XCircle size={16} />
                                    Rejeitar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* All Users Tab */}
              {activeTab === 'users' && (
                <div>
                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Users List */}
                  <div className="space-y-3">
                    {filteredUsers.map(user => {
                      const roleBadge = getRoleBadge(user.role);
                      const statusBadge = getStatusBadge(user.status);
                      const RoleIcon = roleBadge.icon;
                      const isExpanded = expandedUserId === user.id;
                      
                      return (
                        <div key={user.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                          <div className="p-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full border-2 border-gray-200"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge.color} border`}>
                                    <RoleIcon size={12} />
                                    {roleBadge.label}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                    {statusBadge.label}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                              </div>
                              <button
                                onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                {user.bio && (
                                  <p className="text-sm text-gray-600 mb-3">{user.bio}</p>
                                )}
                                
                                {currentUser.role === UserRole.SUPERADMIN && user.id !== currentUser.id && (
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Alterar Role:
                                    </label>
                                    <select
                                      value={user.role}
                                      onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                      <option value={UserRole.GUEST}>Visitante (GUEST)</option>
                                      <option value={UserRole.USER}>Usuário (USER)</option>
                                      <option value={UserRole.MODERATOR}>Moderador (MODERATOR)</option>
                                      <option value={UserRole.SUPERADMIN}>Super Admin (SUPERADMIN)</option>
                                    </select>
                                  </div>
                                )}

                                <div className="flex items-center gap-3">
                                  {user.status === ApprovalStatus.PENDING && (
                                    <>
                                      <button
                                        onClick={() => handleApproveUser(user.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                      >
                                        <CheckCircle size={14} />
                                        Aprovar
                                      </button>
                                      <button
                                        onClick={() => handleRejectUser(user.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                      >
                                        <XCircle size={14} />
                                        Rejeitar
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Distribution */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-purple-600" />
                        Distribuição de Usuários
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total de Usuários</span>
                          <span className="font-bold text-lg">{stats.totalUsers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Aprovados</span>
                          <span className="font-bold text-lg text-green-600">{stats.approvedUsers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Pendentes</span>
                          <span className="font-bold text-lg text-yellow-600">{stats.pendingUsers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Rejeitados</span>
                          <span className="font-bold text-lg text-red-600">{stats.rejectedUsers}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Stats */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        Estatísticas de Conteúdo
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total de Posts</span>
                          <span className="font-bold text-lg">{stats.totalItems}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total de Comentários</span>
                          <span className="font-bold text-lg">{stats.totalComments}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Média Posts/Usuário</span>
                          <span className="font-bold text-lg">
                            {stats.totalUsers > 0 ? (stats.totalItems / stats.totalUsers).toFixed(1) : 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Média Comentários/Post</span>
                          <span className="font-bold text-lg">
                            {stats.totalItems > 0 ? (stats.totalComments / stats.totalItems).toFixed(1) : 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Health */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity size={20} className="text-green-600" />
                      Saúde do Sistema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Taxa de Aprovação</p>
                          <p className="text-lg font-bold">
                            {stats.totalUsers > 0 
                              ? ((stats.approvedUsers / stats.totalUsers) * 100).toFixed(0) 
                              : 0}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="text-yellow-600" size={24} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Aguardando Revisão</p>
                          <p className="text-lg font-bold">{stats.pendingUsers}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Usuários Ativos</p>
                          <p className="text-lg font-bold">{stats.approvedUsers}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
