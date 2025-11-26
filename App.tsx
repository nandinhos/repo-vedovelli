import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Code,
  FileText,
  Filter,
  LogIn,
  ShieldCheck,
  Menu,
  X,
  MessageSquare,
  User as UserIcon,
  Eye,
  FilePenLine,
  Trash2,
  Lock,
  LogOut,
  CheckCircle,
  Link as LinkIcon,
  Globe,
  ExternalLink,
  Users,
  Settings,
  Github,
  Linkedin,
  Instagram,
  Briefcase,
  Youtube,
  AlertTriangle,
  MessageCircleWarning,
  MessageCircle,
  Image as ImageIcon,
  Camera,
  Upload,
  Heart
} from 'lucide-react';
import {
  User,
  UserRole,
  ApprovalStatus,
  RepositoryItem,
  CATEGORIES,
  LANGUAGES,
  LinkItem,
  SnippetItem,
  FileItem,
  Tag
} from './types';
import { ItemDetail } from './components/ItemDetail';
import { UserProfileModal } from './components/UserProfileModal';
import { TagInput } from './components/TagInput';
import { TagCloud } from './components/TagCloud';
import { TagDisplay } from './components/TagDisplay';
import { FavoriteButton } from './components/FavoriteButton';
import { useFavorites } from './hooks/useFavorites';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';

// --- MOCK DATA ---

// We create a "Database" of users to simulate the community
const INITIAL_USERS_DB: User[] = [
  {
    id: 'admin_1',
    name: 'Administrador',
    email: 'admin@vedovelli.com',
    role: UserRole.ADMIN,
    status: ApprovalStatus.APPROVED,
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff',
    bio: 'Full Stack Developer & Community Manager',
    isPublicProfile: true,
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      whatsapp: '5511999999999'
    }
  },
  {
    id: 'u1',
    name: 'Dev Vedovelli',
    email: 'vedovelli@example.com',
    role: UserRole.USER,
    status: ApprovalStatus.APPROVED,
    avatar: 'https://picsum.photos/seed/vedo/200',
    bio: 'React Specialist | UI/UX Enthusiast',
    isPublicProfile: true,
    socialLinks: {
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'u2',
    name: 'Carlos Silva',
    email: 'carlos@example.com',
    role: UserRole.USER,
    status: ApprovalStatus.APPROVED,
    avatar: 'https://picsum.photos/seed/carlos/200',
    bio: 'Backend PHP/Laravel Developer',
    isPublicProfile: true,
    socialLinks: {
      github: 'https://github.com'
    }
  },
  {
    id: 'u3',
    name: 'Ana Dev',
    email: 'ana@example.com',
    role: UserRole.USER,
    status: ApprovalStatus.APPROVED,
    avatar: 'https://picsum.photos/seed/ana/200',
    bio: 'Frontend Developer',
    isPublicProfile: false // This user won't show in the contacts tab
  },
  {
    id: 'u4',
    name: 'Maria Ops',
    email: 'maria@example.com',
    role: UserRole.USER,
    status: ApprovalStatus.APPROVED,
    avatar: 'https://picsum.photos/seed/maria/200',
    bio: 'DevOps Engineer',
    isPublicProfile: true,
    socialLinks: {
      linkedin: 'https://linkedin.com'
    }
  }
];

const INITIAL_ITEMS: RepositoryItem[] = [
  {
    id: '1',
    type: 'snippet',
    title: 'Autenticação JWT com Laravel',
    description: 'Configuração completa do guard de API utilizando Tymon JWT Auth para proteger rotas stateless.',
    category: 'Backend',
    authorId: 'u2',
    authorName: 'Carlos Silva',
    createdAt: '2023-10-25T10:00:00Z',
    language: 'php',
    repository: 'https://github.com/example/laravel-jwt',
    code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Support\\Facades\\Auth;
use App\\Http\\Controllers\\Controller;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }
}`,
    comments: [
      { id: 'c1', userId: 'u3', userName: 'Ana Dev', userAvatar: 'https://picsum.photos/seed/ana/200', content: 'Ótimo snippet! Me salvou horas.', createdAt: '2023-10-26T12:00:00Z' },
      { id: 'c2', userId: 'u1', userName: 'Dev Vedovelli', userAvatar: 'https://picsum.photos/seed/vedo/200', content: 'Poderia adicionar como fazer o refresh token também?', createdAt: '2023-10-27T09:00:00Z' }
    ]
  },
  {
    id: '2',
    type: 'file',
    title: 'Docker Compose para LEMP Stack',
    description: 'Arquivo docker-compose.yml pronto para uso com Nginx, MySQL 8 e PHP 8.2.',
    category: 'DevOps',
    authorId: 'u4',
    authorName: 'Maria Ops',
    createdAt: '2023-10-28T14:30:00Z',
    fileName: 'docker-compose.yml',
    fileExtension: 'yml',
    fileSize: '4KB',
    downloadUrl: '#',
    comments: []
  },
  {
    id: '3',
    type: 'snippet',
    title: 'React Custom Hook: useFetch',
    description: 'Um hook genérico para data fetching com tratamento de estado de loading e erro.',
    category: 'Frontend',
    language: 'typescript',
    authorId: 'u1', // Matches MOCK_USER
    authorName: 'Dev Vedovelli',
    createdAt: '2023-11-01T09:00:00Z',
    code: `import { useState, useEffect } from 'react';

export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading };
};`,
    comments: []
  },
  {
    id: '4',
    type: 'link',
    title: 'Roadmap.sh - Frontend Developer',
    description: 'Um guia completo passo a passo para se tornar um desenvolvedor frontend moderno em 2024.',
    category: 'Career',
    authorId: 'u5',
    authorName: 'Lucas Learner',
    createdAt: '2023-11-05T11:00:00Z',
    url: 'https://roadmap.sh/frontend',
    comments: []
  }
];

// Favorites View Component
const FavoritesView: React.FC<any> = ({ 
  userId, 
  favoriteIds,
  onToggleFavorite,
  onItemClick,
  expandedId,
  currentUser,
  onAddComment,
  onEditComment,
  onDeleteComment,
  canEditItem,
  handleOpenEdit,
  handleDeleteItem
}) => {
  const [favorites, setFavorites] = useState<RepositoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId, favoriteIds]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/favorites/user/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setFavorites(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Carregando favoritos...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum favorito ainda
        </h3>
        <p className="text-gray-500">
          Clique no ❤️ em qualquer item para salvá-lo aqui!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="text-red-500 fill-current" size={28} />
          Meus Favoritos ({favorites.length})
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {favorites.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide
                                  ${item.type === 'snippet' ? 'bg-indigo-100 text-indigo-700' : ''}
                                  ${item.type === 'file' ? 'bg-emerald-100 text-emerald-700' : ''}
                                  ${item.type === 'link' ? 'bg-sky-100 text-sky-700' : ''}
                              `}>
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>

                  {item.tags && item.tags.length > 0 && (
                    <div className="mb-3">
                      <TagDisplay 
                        tags={item.tags} 
                        size="sm"
                        clickable={false}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <UserIcon size={14} />
                      <span>{item.authorName}</span>
                    </div>
                    <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 ml-2">
                  {currentUser && (
                    <FavoriteButton
                      itemId={item.id}
                      userId={currentUser.id}
                      isFavorited={true}
                      onToggle={onToggleFavorite}
                      size="sm"
                    />
                  )}
                  
                  <button
                    type="button"
                    onClick={() => onItemClick(item.id)}
                    className={`p-2 rounded-lg transition-colors ${expandedId === item.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    title="Visualizar detalhes"
                  >
                    <Eye size={18} />
                  </button>

                  <div className="relative group/tooltip">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(item, e)}
                      disabled={!canEditItem(item)}
                      className={`p-2 rounded-lg transition-colors ${canEditItem(item)
                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 cursor-pointer'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                      <FilePenLine size={18} />
                    </button>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      disabled={!canEditItem(item)}
                      className={`p-2 rounded-lg transition-colors ${canEditItem(item)
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {expandedId === item.id && (
              <ItemDetail
                item={item}
                currentUser={currentUser}
                onAddComment={onAddComment}
                onEditComment={onEditComment}
                onDeleteComment={onDeleteComment}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [usersDb, setUsersDb] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const [items, setItems] = useState<RepositoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'snippets' | 'files' | 'links' | 'contacts' | 'favorites'>('snippets');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Tags State
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [newItemTags, setNewItemTags] = useState<string[]>([]);
  
  // Favorites Hook
  const { favoriteIds, isFavorited, toggleFavorite } = useFavorites(currentUser?.id || '');
  
  // Theme Hook
  const { theme, toggleTheme } = useTheme();

  // Fetch Data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, itemsRes, tagsRes, popularTagsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/items'),
          fetch('/api/tags'),
          fetch('/api/tags/popular')
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsersDb(usersData);
        }

        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setItems(itemsData);
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setAllTags(tagsData.data || []);
        }

        if (popularTagsRes.ok) {
          const popularTagsData = await popularTagsRes.json();
          setPopularTags(popularTagsData.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  // Modals State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Deletion Reason Modal (For Admin Moderation)
  const [deleteReasonModal, setDeleteReasonModal] = useState({
    isOpen: false,
    itemId: '',
    commentId: '',
    reason: ''
  });

  // Edit/Upload State
  const [editingItem, setEditingItem] = useState<RepositoryItem | null>(null);
  const [uploadType, setUploadType] = useState<'snippet' | 'file' | 'link'>('snippet');

  // Profile Edit State
  const [editProfileData, setEditProfileData] = useState({
    isPublic: false,
    avatar: '',
    bio: '',
    github: '',
    linkedin: '',
    instagram: '',
    whatsapp: ''
  });

  // Form Fields
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState(''); // Code or description context
  const [newItemLanguage, setNewItemLanguage] = useState('javascript');
  const [newItemCategory, setNewItemCategory] = useState(CATEGORIES[0]);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');

  // Optional Resource Fields
  const [newItemRepo, setNewItemRepo] = useState('');
  const [newItemWebsite, setNewItemWebsite] = useState('');
  const [newItemYoutube, setNewItemYoutube] = useState('');

  // Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // --- ACTIONS ---

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const confirmLogin = (role: 'ADMIN' | 'USER') => {
    // Find mock user based on role for demonstration
    const userToLogin = role === 'ADMIN'
      ? usersDb.find(u => u.role === UserRole.ADMIN)
      : usersDb.find(u => u.id === 'u1');

    if (userToLogin) {
      setCurrentUser(userToLogin);
    }
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsUploadModalOpen(false);
    setEditingItem(null);
    setIsLoginModalOpen(false);
    setExpandedId(null);
  };

  const handleOpenProfile = () => {
    if (!currentUser) return;
    setEditProfileData({
      isPublic: currentUser.isPublicProfile || false,
      avatar: currentUser.avatar || '',
      bio: currentUser.bio || '',
      github: currentUser.socialLinks?.github || '',
      linkedin: currentUser.socialLinks?.linkedin || '',
      instagram: currentUser.socialLinks?.instagram || '',
      whatsapp: currentUser.socialLinks?.whatsapp || ''
    });
    setIsProfileModalOpen(true);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditProfileData(prev => ({ ...prev, avatar: event.target.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      isPublicProfile: editProfileData.isPublic,
      avatar: editProfileData.avatar,
      bio: editProfileData.bio,
      socialLinks: {
        github: editProfileData.github,
        linkedin: editProfileData.linkedin,
        instagram: editProfileData.instagram,
        whatsapp: editProfileData.whatsapp
      }
    };

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (response.ok) {
        const savedUser = await response.json();
        setCurrentUser(savedUser);
        setUsersDb(prev => prev.map(u => u.id === currentUser.id ? savedUser : u));
        setIsProfileModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleOpenUpload = () => {
    setEditingItem(null);
    setNewItemTitle('');
    setNewItemContent('');
    setNewItemDesc('');
    setNewItemUrl('');
    setNewItemRepo('');
    setNewItemWebsite('');
    setNewItemYoutube('');
    setNewItemCategory(CATEGORIES[0]);
    setNewItemLanguage('javascript');
    setNewItemTags([]);

    // Set default type based on active tab
    if (activeTab === 'files') setUploadType('file');
    else if (activeTab === 'links') setUploadType('link');
    else setUploadType('snippet');

    setIsUploadModalOpen(true);
  };

  const handleOpenEdit = (item: RepositoryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingItem(item);
    setNewItemTitle(item.title);
    setNewItemDesc(item.description);
    setNewItemCategory(item.category);
    setNewItemRepo(item.repository || '');
    setNewItemWebsite(item.website || '');
    setNewItemYoutube(item.youtube || '');
    setNewItemTags(item.tags?.map(t => t.name) || []);
    setUploadType(item.type);

    if (item.type === 'snippet') {
      setNewItemContent(item.code);
      setNewItemLanguage(item.language);
      setNewItemUrl('');
    } else if (item.type === 'link') {
      setNewItemUrl(item.url);
      setNewItemContent('');
    } else {
      setNewItemContent('');
      setNewItemUrl('');
    }
    setIsUploadModalOpen(true);
  };

  const handleDeleteItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Double check permission just in case
    const itemToDelete = items.find(i => i.id === id);
    if (!itemToDelete) return;

    if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.id !== itemToDelete.authorId)) {
      // No permisson, normally button is disabled but just in case
      return;
    }

    // Use Custom Modal instead of window.confirm
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Item',
      message: 'Tem certeza que deseja excluir este item permanentemente? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
          if (response.ok) {
            setItems(prev => prev.filter(i => i.id !== id));
            if (expandedId === id) setExpandedId(null);
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
          }
        } catch (error) {
          console.error('Failed to delete item:', error);
        }
      }
    });
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const baseItem = {
      title: newItemTitle,
      description: newItemDesc,
      category: newItemCategory,
      authorId: editingItem ? editingItem.authorId : currentUser.id,
      // authorName is handled by backend include
      repository: newItemRepo,
      website: newItemWebsite,
      youtube: newItemYoutube
    };

    let itemData: any = { ...baseItem };

    if (uploadType === 'snippet') {
      itemData = {
        ...itemData,
        type: 'snippet',
        code: newItemContent,
        language: newItemLanguage,
      };
    } else if (uploadType === 'link') {
      itemData = {
        ...itemData,
        type: 'link',
        url: newItemUrl,
      };
    } else {
      itemData = {
        ...itemData,
        type: 'file',
        fileName: editingItem && editingItem.type === 'file' ? editingItem.fileName : `arquivo_upload.${newItemContent ? newItemContent.split('.').pop() : 'txt'}`,
        fileSize: editingItem && editingItem.type === 'file' ? editingItem.fileSize : '1.2MB',
        fileExtension: editingItem && editingItem.type === 'file' ? editingItem.fileExtension : 'zip',
        downloadUrl: '#'
      };
    }

    try {
      let response;
      let savedItemId;
      
      if (editingItem) {
        response = await fetch(`/api/items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData)
        });
        savedItemId = editingItem.id;
      } else {
        response = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData)
        });
      }

      if (response.ok) {
        const savedItem = await response.json();
        savedItemId = savedItem.id;

        // Update tags for the item
        if (newItemTags.length > 0) {
          await fetch(`/api/items/${savedItemId}/tags`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tags: newItemTags })
          });
        }

        // Fetch updated item with tags
        const updatedItemRes = await fetch(`/api/items`);
        if (updatedItemRes.ok) {
          const allItems = await updatedItemRes.json();
          setItems(allItems);
        }

        // Refresh tags
        const tagsRes = await fetch('/api/tags');
        const popularTagsRes = await fetch('/api/tags/popular');
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setAllTags(tagsData.data || []);
        }
        if (popularTagsRes.ok) {
          const popularTagsData = await popularTagsRes.json();
          setPopularTags(popularTagsData.data || []);
        }

        setIsUploadModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleAddComment = async (itemId: string, text: string, screenshot?: string) => {
    if (!currentUser) return;

    const commentData = {
      itemId,
      userId: currentUser.id,
      content: text,
      screenshotUrl: screenshot
    };

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        const newComment = await response.json();
        // Transform for frontend if needed (backend returns included user)
        const frontendComment = {
          ...newComment,
          userName: newComment.user?.name,
          userAvatar: newComment.user?.avatar
        };

        setItems(prev => prev.map(item => {
          if (item.id === itemId) {
            return { ...item, comments: [...(item.comments || []), frontendComment] };
          }
          return item;
        }));
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // FIXED: Added screenshot support
  const handleEditComment = async (itemId: string, commentId: string, text: string, screenshot?: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, screenshotUrl: screenshot })
      });

      if (response.ok) {
        setItems(prev => prev.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              comments: item.comments.map(c => c.id === commentId ? { ...c, content: text, screenshotUrl: screenshot } : c)
            };
          }
          return item;
        }));
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleDeleteComment = (itemId: string, commentId: string) => {
    // If Admin, ask for justification
    if (currentUser?.role === UserRole.ADMIN) {
      setDeleteReasonModal({
        isOpen: true,
        itemId,
        commentId,
        reason: ''
      });
      return;
    }

    // If Owner, standard confirm
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Comentário',
      message: 'Tem certeza que deseja excluir este comentário permanentemente?',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
          if (response.ok) {
            setItems(prev => prev.map(item => {
              if (item.id === itemId) {
                return {
                  ...item,
                  comments: item.comments.filter(c => c.id !== commentId)
                };
              }
              return item;
            }));
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
          }
        } catch (error) {
          console.error('Failed to delete comment:', error);
        }
      }
    });
  }

  const confirmAdminDeletion = async () => {
    if (!deleteReasonModal.reason.trim()) {
      alert("A justificativa é obrigatória para moderação.");
      return;
    }

    // Soft delete logic for admin (update comment with isDeleted=true)
    try {
      const response = await fetch(`/api/comments/${deleteReasonModal.commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isDeleted: true,
          deletionReason: deleteReasonModal.reason
        })
      });

      if (response.ok) {
        setItems(prev => prev.map(item => {
          if (item.id === deleteReasonModal.itemId) {
            return {
              ...item,
              comments: item.comments.map(c => {
                if (c.id === deleteReasonModal.commentId) {
                  return { ...c, isDeleted: true, deletionReason: deleteReasonModal.reason };
                }
                return c;
              })
            };
          }
          return item;
        }));
        setDeleteReasonModal(prev => ({ ...prev, isOpen: false }));
      }
    } catch (error) {
      console.error('Failed to moderate comment:', error);
    }
  };


  // --- PERMISSIONS ---

  const canEditItem = (item: RepositoryItem) => {
    if (!currentUser) return false;
    return currentUser.role === UserRole.ADMIN || currentUser.id === item.authorId;
  };

  // --- FILTERING ---

  const filteredItems = items.filter(item => {
    // Tab Filter
    if (activeTab === 'snippets' && item.type !== 'snippet') return false;
    if (activeTab === 'files' && item.type !== 'file') return false;
    if (activeTab === 'links' && item.type !== 'link') return false;
    if (activeTab === 'contacts') return false; // Contacts handled separately

    // Category Filter
    if (selectedCategory !== 'Todos' && item.category !== selectedCategory) return false;

    // Tag Filter - item must have ALL selected tags
    if (selectedFilterTags.length > 0) {
      const itemTagNames = item.tags?.map(t => t.name) || [];
      const hasAllTags = selectedFilterTags.every(filterTag => 
        itemTagNames.includes(filterTag)
      );
      if (!hasAllTags) return false;
    }

    // Search Filter
    const searchLower = searchTerm.toLowerCase();
    const matchesTitle = item.title.toLowerCase().includes(searchLower);
    const matchesDesc = item.description.toLowerCase().includes(searchLower);
    const matchesAuthor = item.authorName.toLowerCase().includes(searchLower);
    const matchesLang = item.type === 'snippet' && item.language.toLowerCase().includes(searchLower);
    const matchesTags = item.tags?.some(tag => tag.name.toLowerCase().includes(searchLower));

    return matchesTitle || matchesDesc || matchesAuthor || matchesLang || matchesTags;
  });

  const filteredUsers = usersDb.filter(user => {
    if (!user.isPublicProfile) return false;

    const searchLower = searchTerm.toLowerCase();
    return user.name.toLowerCase().includes(searchLower) ||
      (user.bio && user.bio.toLowerCase().includes(searchLower));
  });

  // --- TAG HANDLERS ---

  const handleTagClick = (tag: Tag) => {
    if (selectedFilterTags.includes(tag.name)) {
      // Remove tag from filter
      setSelectedFilterTags(prev => prev.filter(t => t !== tag.name));
    } else {
      // Add tag to filter
      setSelectedFilterTags(prev => [...prev, tag.name]);
    }
  };

  const clearTagFilters = () => {
    setSelectedFilterTags([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={!!viewingUser}
        user={viewingUser}
        onClose={() => setViewingUser(null)}
      />

      {/* Header */}
      <header className="bg-indigo-900 dark:bg-gray-800 text-white shadow-lg sticky top-0 z-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <ShieldCheck size={24} className="text-indigo-300" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Repositório Vedovelli</h1>
              <p className="text-xs text-indigo-300 dark:text-gray-400 font-medium">Comunidade Dev</p>
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium">{currentUser.name}</span>
                  <span className="text-xs text-indigo-300 dark:text-gray-400 px-2 py-0.5 bg-indigo-800 dark:bg-gray-700 rounded-full uppercase tracking-wider text-[10px]">
                    {currentUser.role === UserRole.ADMIN ? 'Administrador' : 'Colaborador'}
                  </span>
                </div>
                <div className="relative group">
                  <button className="relative">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full border-2 border-indigo-400 cursor-pointer" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 text-gray-800 dark:text-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform translate-y-2 group-hover:translate-y-0 border border-gray-100 dark:border-gray-700">
                    <button
                      onClick={handleOpenProfile}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"
                    >
                      <Settings size={16} /> Meu Perfil
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-700/20 text-red-600 flex items-center gap-2 text-sm"
                    >
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleOpenLogin}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-900 dark:bg-indigo-500 dark:text-white rounded-md font-medium hover:bg-indigo-50 dark:hover:bg-indigo-600 transition-colors shadow-sm"
              >
                <LogIn size={18} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-gray-300 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('snippets')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'snippets'
              ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
          >
            <Code size={18} /> Snippets
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'files'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-gray-800'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
          >
            <FileText size={18} /> Arquivos
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'links'
              ? 'border-sky-600 text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-gray-800'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
          >
            <LinkIcon size={18} /> Links Úteis
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'contacts'
              ? 'border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-gray-800'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
          >
            <Users size={18} /> Contatos / Interação
          </button>
          {currentUser && (
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'favorites'
                ? 'border-red-600 text-red-700 dark:text-red-400 bg-red-50 dark:bg-gray-800'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
            >
              <Heart size={18} className={activeTab === 'favorites' ? 'fill-current' : ''} />
              Favoritos ({favoriteIds.length})
            </button>
          )}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder={activeTab === 'contacts' ? "Buscar usuário por nome ou cargo..." : "Buscar por título, autor ou linguagem..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 transition-all shadow-sm outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {activeTab !== 'contacts' && (
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm whitespace-nowrap">
                <Filter size={16} className="text-gray-500 dark:text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 focus:ring-0 outline-none cursor-pointer"
                >
                  <option value="Todos">Todas Categorias</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {currentUser && currentUser.status === 'APPROVED' && (
                <button
                  onClick={handleOpenUpload}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105 whitespace-nowrap
                            ${activeTab === 'snippets' ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' : ''}
                            ${activeTab === 'files' ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600' : ''}
                            ${activeTab === 'links' ? 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600' : ''}
                        `}
                >
                  <Plus size={18} />
                  Novo {activeTab === 'snippets' ? 'Snippet' : activeTab === 'files' ? 'Arquivo' : 'Link'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tag Cloud - Show popular tags */}
        {activeTab !== 'contacts' && popularTags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">Filtrar por:</span>
              <TagCloud
                tags={popularTags}
                onTagClick={handleTagClick}
                selectedTags={selectedFilterTags}
              />
              {selectedFilterTags.length > 0 && (
                <button
                  onClick={clearTagFilters}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
                >
                  Limpar ({selectedFilterTags.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content List */}
        {activeTab === 'favorites' ? (
          // FAVORITES TAB CONTENT
          <FavoritesView 
            userId={currentUser?.id || ''} 
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onItemClick={(itemId) => setExpandedId(expandedId === itemId ? null : itemId)}
            expandedId={expandedId}
            currentUser={currentUser}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            canEditItem={canEditItem}
            handleOpenEdit={handleOpenEdit}
            handleDeleteItem={handleDeleteItem}
          />
        ) : activeTab !== 'contacts' ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide
                                                ${item.type === 'snippet' ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-indigo-400' : ''}
                                                ${item.type === 'file' ? 'bg-emerald-100 text-emerald-700 dark:bg-gray-700 dark:text-emerald-400' : ''}
                                                ${item.type === 'link' ? 'bg-sky-100 text-sky-700 dark:bg-gray-700 dark:text-sky-400' : ''}
                                            `}>
                            {item.category}
                          </span>
                          {item.type === 'snippet' && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              <Code size={12} /> {item.language}
                            </span>
                          )}
                          {item.type === 'file' && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              <FileText size={12} /> {item.fileExtension}
                            </span>
                          )}
                          {item.type === 'link' && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              <Globe size={12} /> {new URL(item.url).hostname}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">{item.description}</p>

                        {/* Tags Display */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="mb-3">
                            <TagDisplay
                              tags={item.tags}
                              onTagClick={handleTagClick}
                              size="sm"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <UserIcon size={14} />
                            <span>{item.authorName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare size={14} />
                            <span>{item.comments.filter(c => !c.isDeleted).length} comentários</span>
                          </div>
                          <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 shrink-0 ml-2">
                        {/* Favorite Button - Show if user is logged in */}
                        {currentUser && (
                          <FavoriteButton
                            itemId={item.id}
                            userId={currentUser.id}
                            isFavorited={isFavorited(item.id)}
                            onToggle={toggleFavorite}
                            size="sm"
                          />
                        )}
                        
                        {/* View Button - Always Visible/Enabled */}
                        <button
                          type="button"
                          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                          className={`p-2 rounded-lg transition-colors ${expandedId === item.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600'
                            }`}
                          title="Visualizar detalhes"
                        >
                          <Eye size={18} />
                        </button>

                        {/* Edit Button */}
                        <div className="relative group/tooltip">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(item, e)}
                            disabled={!canEditItem(item)}
                            className={`p-2 rounded-lg transition-colors ${canEditItem(item)
                              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-gray-700 dark:text-amber-400 dark:hover:bg-gray-600 cursor-pointer'
                              : 'bg-gray-100 text-gray-300 dark:bg-gray-700/50 dark:text-gray-500 cursor-not-allowed'
                              }`}
                          >
                            <FilePenLine size={18} />
                          </button>
                          {!canEditItem(item) && (
                            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap pointer-events-none z-10">
                              Apenas o autor pode editar
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        <div className="relative group/tooltip">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            disabled={!canEditItem(item)}
                            className={`p-2 rounded-lg transition-colors ${canEditItem(item)
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600 cursor-pointer'
                              : 'bg-gray-100 text-gray-300 dark:bg-gray-700/50 dark:text-gray-500 cursor-not-allowed'
                              }`}
                          >
                            <Trash2 size={18} />
                          </button>
                          {!canEditItem(item) && (
                            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap pointer-events-none z-10">
                              Apenas o autor pode excluir
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === item.id && (
                    <ItemDetail
                      item={item}
                      currentUser={currentUser}
                      onAddComment={handleAddComment}
                      onEditComment={handleEditComment}
                      onDeleteComment={handleDeleteComment}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
                <div className="bg-gray-50 dark:bg-gray-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400 dark:text-gray-500" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Nenhum item encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Tente ajustar os filtros ou buscar por outro termo.</p>
              </div>
            )}
          </div>
        ) : (
          // CONTACTS TAB CONTENT
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => setViewingUser(user)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex items-start gap-4">
                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-purple-100 dark:border-gray-700 group-hover:border-purple-300 transition-colors" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">{user.name}</h3>
                      {user.role === UserRole.ADMIN && (
                        <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-gray-700 text-purple-700 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider rounded-full mb-1">Admin</span>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Briefcase size={14} />
                        {user.bio || 'Membro da Comunidade'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                    {user.socialLinks?.github && (
                      <div className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 rounded-lg group-hover:bg-gray-800 group-hover:text-white transition-colors" title="GitHub">
                        <Github size={18} />
                      </div>
                    )}
                    {user.socialLinks?.linkedin && (
                      <div className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors" title="LinkedIn">
                        <Linkedin size={18} />
                      </div>
                    )}
                    {user.socialLinks?.instagram && (
                      <div className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 rounded-lg group-hover:bg-pink-600 group-hover:text-white transition-colors" title="Instagram">
                        <Instagram size={18} />
                      </div>
                    )}
                    {user.socialLinks?.whatsapp && (
                      <div className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors" title="WhatsApp">
                        <MessageCircle size={18} />
                      </div>
                    )}
                    {(!user.socialLinks || Object.values(user.socialLinks).every(v => !v)) && (
                      <span className="text-xs text-gray-400 italic py-2">Sem redes sociais visíveis.</span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">
                    <Eye size={20} />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
                <div className="bg-gray-50 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gray-400 dark:text-gray-500" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Nenhum contato público encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Seja o primeiro a compartilhar seu perfil!</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Confirmation Modal (Replaces window.confirm) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn transform scale-100 transition-transform">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400 shadow-sm">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{confirmModal.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">{confirmModal.message}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Deletion Reason Modal */}
      {deleteReasonModal.isOpen && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn transform scale-100 transition-transform">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400">
                <MessageCircleWarning size={24} />
                <h3 className="text-lg font-bold">Moderação de Conteúdo</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Como administrador, você deve fornecer uma justificativa para a exclusão deste comentário. O usuário verá este motivo.
              </p>
              <textarea
                value={deleteReasonModal.reason}
                onChange={(e) => setDeleteReasonModal(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Ex: Linguagem ofensiva, spam, conteúdo irrelevante..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none mb-4 text-sm min-h-[100px]"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteReasonModal(prev => ({ ...prev, isOpen: false, reason: '' }))}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmAdminDeletion}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  Confirmar Moderação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Acesso Restrito</h2>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-8">Escolha um perfil para simular o acesso à plataforma:</p>

            <div className="space-y-4">
              <button
                onClick={() => confirmLogin('USER')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700/50 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 dark:bg-gray-700 p-3 rounded-full group-hover:bg-indigo-200 dark:group-hover:bg-gray-600 transition-colors">
                    <UserIcon size={24} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-gray-100">Usuário Padrão</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Edita apenas o próprio conteúdo</div>
                  </div>
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle size={20} />
                </div>
              </button>

              <button
                onClick={() => confirmLogin('ADMIN')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700/50 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 dark:bg-gray-700 p-3 rounded-full group-hover:bg-purple-200 dark:group-hover:bg-gray-600 transition-colors">
                    <ShieldCheck size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 dark:text-gray-100">Administrador</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Acesso total (Gerencia tudo)</div>
                  </div>
                </div>
                <div className="text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle size={20} />
                </div>
              </button>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
              Ambiente de teste seguro • Nenhuma senha necessária
            </div>
          </div>
        </div>
      )}

      {/* Upload/Edit Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                {editingItem ? (
                  <>
                    <FilePenLine className="text-amber-500" /> Editar {uploadType === 'snippet' ? 'Snippet' : uploadType === 'file' ? 'Arquivo' : 'Link'}
                  </>
                ) : (
                  <>
                    <Plus className="text-indigo-500" /> Novo {uploadType === 'snippet' ? 'Snippet' : uploadType === 'file' ? 'Arquivo' : 'Link'}
                  </>
                )}
              </h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitItem} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  required
                  type="text"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-shadow"
                  placeholder="Ex: Autenticação JWT em Node.js"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                  <select
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {uploadType === 'snippet' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Linguagem</label>
                    <select
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none"
                      value={newItemLanguage}
                      onChange={(e) => setNewItemLanguage(e.target.value)}
                    >
                      {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {uploadType === 'snippet' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código Fonte</label>
                  <textarea
                    required
                    rows={8}
                    className="w-full p-4 bg-slate-900 text-blue-300 font-mono text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none custom-scrollbar"
                    placeholder="// Cole seu código aqui..."
                    value={newItemContent}
                    onChange={(e) => setNewItemContent(e.target.value)}
                  />
                </div>
              )}

              {uploadType === 'file' && (
                <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center cursor-pointer group">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Clique para selecionar o arquivo</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, ZIP, PNG, JS, YML (Max 10MB)</p>
                  {/* Fake input for visual purposes */}
                  <input type="file" className="hidden" />
                </div>
              )}

              {uploadType === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL do Link</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon size={18} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      required
                      type="url"
                      className="w-full pl-10 pr-3 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-shadow"
                      placeholder="https://..."
                      value={newItemUrl}
                      onChange={(e) => setNewItemUrl(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição Curta</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-shadow resize-none"
                  placeholder="Para que serve este item? Descreva brevemente."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags <span className="text-gray-500 dark:text-gray-400 font-normal">(Opcional - facilita a busca)</span>
                </label>
                <TagInput
                  selectedTags={newItemTags}
                  onChange={setNewItemTags}
                  suggestions={allTags}
                  maxTags={10}
                  placeholder="Ex: react, typescript, api..."
                />
              </div>

              {/* Optional Resources Fields (Snippet/File only) */}
              {(uploadType === 'snippet' || uploadType === 'file') && (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Recursos Adicionais (Opcional)</h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Github size={18} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="url"
                        className="w-full pl-10 pr-3 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-shadow text-sm"
                        placeholder="Link do Repositório (GitHub/GitLab)"
                        value={newItemRepo}
                        onChange={(e) => setNewItemRepo(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe size={18} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="url"
                          className="w-full pl-10 pr-3 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-shadow text-sm"
                          placeholder="Link de Website / Demo"
                          value={newItemWebsite}
                          onChange={(e) => setNewItemWebsite(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Youtube size={18} className="text-red-500" />
                        </div>
                        <input
                          type="url"
                          className="w-full pl-10 pr-3 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-shadow text-sm"
                          placeholder="Link do YouTube (Tutorial/Demo)"
                          value={newItemYoutube}
                          onChange={(e) => setNewItemYoutube(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </form>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitItem}
                className={`px-6 py-2.5 text-white font-medium rounded-lg shadow-lg transition-all transform active:scale-95 ${uploadType === 'file' ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600' :
                  uploadType === 'link' ? 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600' :
                    'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                  }`}
              >
                {editingItem ? 'Salvar Alterações' : 'Publicar Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {isProfileModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Settings className="text-indigo-500" /> Meu Perfil
              </h2>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Public Profile Toggle */}
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-gray-700/50 border border-purple-100 dark:border-gray-700 rounded-xl">
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300">Perfil Público</h3>
                  <p className="text-xs text-purple-600/80 dark:text-purple-400/80">Exibir seu card na aba "Contatos/Interação"</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editProfileData.isPublic}
                    onChange={(e) => setEditProfileData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Avatar & Bio */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avatar</label>

                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={editProfileData.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Upload size={16} /> Carregar Imagem
                    </button>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </div>

                  <div className="relative">
                    <LinkIcon size={16} className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
                    <input
                      type="url"
                      value={editProfileData.avatar}
                      onChange={(e) => setEditProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="Ou cole uma URL de imagem..."
                      className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo / Bio Curta</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      value={editProfileData.bio}
                      onChange={(e) => setEditProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Ex: Full Stack Developer"
                      className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Redes Sociais (Opcional)</h4>

                <div className="relative">
                  <Github size={18} className="absolute top-3 left-3 text-gray-600 dark:text-gray-400" />
                  <input
                    type="url"
                    value={editProfileData.github}
                    onChange={(e) => setEditProfileData(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="https://github.com/seu-usuario"
                    className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none text-sm"
                  />
                </div>

                <div className="relative">
                  <Linkedin size={18} className="absolute top-3 left-3 text-blue-600" />
                  <input
                    type="url"
                    value={editProfileData.linkedin}
                    onChange={(e) => setEditProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/in/seu-usuario"
                    className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>

                <div className="relative">
                  <Instagram size={18} className="absolute top-3 left-3 text-pink-600" />
                  <input
                    type="url"
                    value={editProfileData.instagram}
                    onChange={(e) => setEditProfileData(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://instagram.com/seu-usuario"
                    className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                  />
                </div>

                <div className="relative">
                  <MessageCircle size={18} className="absolute top-3 left-3 text-green-500" />
                  <input
                    type="text"
                    value={editProfileData.whatsapp}
                    onChange={(e) => setEditProfileData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="WhatsApp (5511999999999)"
                    className="w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-colors"
                >
                  Salvar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}