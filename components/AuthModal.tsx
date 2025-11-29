import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: any) => void;
}

type AuthMode = 'login' | 'register';

interface FormData {
  name: string;
  email: string;
  password: string;
  bio: string;
  howDidYouKnow: string;
  howDidYouKnowOther: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  howDidYouKnow?: string;
  general?: string;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    bio: '',
    howDidYouKnow: '',
    howDidYouKnowOther: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [rejectionInfo, setRejectionInfo] = useState<{ reason?: string; canReapply?: boolean } | null>(null);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (mode === 'register' && formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter no mínimo 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (mode === 'register' && !formData.howDidYouKnow) {
      newErrors.howDidYouKnow = 'Por favor, informe como conheceu o grupo';
    } else if (mode === 'register' && formData.howDidYouKnow === 'other' && !formData.howDidYouKnowOther.trim()) {
      newErrors.howDidYouKnow = 'Por favor, especifique como conheceu o grupo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const endpoint = mode === 'login' 
        ? 'http://localhost:3000/api/auth/login'
        : 'http://localhost:3000/api/auth/register';

      const howDidYouKnowValue = formData.howDidYouKnow === 'other' 
        ? formData.howDidYouKnowOther 
        : formData.howDidYouKnow;

      const body = mode === 'login'
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password,
            bio: formData.bio,
            howDidYouKnow: howDidYouKnowValue
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Validation errors from express-validator
          const validationErrors: FormErrors = {};
          data.errors.forEach((err: any) => {
            validationErrors[err.path as keyof FormErrors] = err.msg;
          });
          setErrors(validationErrors);
        } else {
          // Check if it's a rejection error
          if (data.canReapply && data.rejectionReason) {
            setRejectionInfo({ reason: data.rejectionReason, canReapply: data.canReapply });
          } else {
            setErrors({ general: data.error || data.message || 'Erro ao processar solicitação' });
          }
        }
        return;
      }

      if (mode === 'register') {
        // Registro bem-sucedido
        setSuccessMessage(data.message || 'Cadastro realizado! Aguarde aprovação do administrador.');
        setFormData({ name: '', email: '', password: '', bio: '', howDidYouKnow: '', howDidYouKnowOther: '' });
        
        // Mudar para modo login após 3 segundos
        setTimeout(() => {
          setMode('login');
          setSuccessMessage('');
        }, 3000);
      } else {
        // Login bem-sucedido
        if (data.token && data.user) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          onLoginSuccess(data.token, data.user);
          onClose();
        }
      }
    } catch (error) {
      setErrors({ general: 'Erro de conexão com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro do campo ao digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleReapply = async () => {
    setLoading(true);
    setRejectionInfo(null);
    setErrors({});

    try {
      const endpoint = 'http://localhost:3000/api/auth/reapply';
      const token = localStorage.getItem('authToken');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Solicitação enviada! Aguarde nova análise.');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 3000);
      } else {
        setErrors({ general: data.error || 'Erro ao processar solicitação' });
      }
    } catch (error) {
      setErrors({ general: 'Erro de conexão com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setErrors({});
    setSuccessMessage('');
    setRejectionInfo(null);
    setFormData({ name: '', email: '', password: '', bio: '', howDidYouKnow: '', howDidYouKnowOther: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
            <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
            <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
          </div>
        )}

        {/* Rejection Info */}
        {rejectionInfo && (
          <div className="mx-6 mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="text-orange-600 dark:text-orange-400 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Seu cadastro foi rejeitado
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Motivo: {rejectionInfo.reason}
                </p>
              </div>
            </div>
            {rejectionInfo.canReapply && (
              <button
                onClick={handleReapply}
                disabled={loading}
                className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Solicitar Nova Aprovação'}
              </button>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name (only for register) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                    ${errors.name 
                      ? 'border-red-300 focus:ring-red-500 dark:border-red-600' 
                      : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
                    } 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="João Silva"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                  ${errors.email 
                    ? 'border-red-300 focus:ring-red-500 dark:border-red-600' 
                    : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
                  } 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="seu@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                  ${errors.password 
                    ? 'border-red-300 focus:ring-red-500 dark:border-red-600' 
                    : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
                  } 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          {/* How did you know (only for register) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="howDidYouKnow" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Como você conheceu esse grupo? <span className="text-red-500">*</span>
              </label>
              <select
                id="howDidYouKnow"
                name="howDidYouKnow"
                value={formData.howDidYouKnow}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                  ${errors.howDidYouKnow 
                    ? 'border-red-300 focus:ring-red-500 dark:border-red-600' 
                    : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
                  } 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              >
                <option value="">Selecione uma opção</option>
                <option value="Grupo Workshop Vedovelli">Grupo Workshop Vedovelli</option>
                <option value="Amigo de Membro do Grupo">Amigo de Membro do Grupo</option>
                <option value="other">Outros</option>
              </select>
              {errors.howDidYouKnow && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.howDidYouKnow}</p>
              )}
            </div>
          )}

          {/* Other specify (only for register and if "other" is selected) */}
          {mode === 'register' && formData.howDidYouKnow === 'other' && (
            <div>
              <label htmlFor="howDidYouKnowOther" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Por favor, especifique
              </label>
              <input
                type="text"
                id="howDidYouKnowOther"
                name="howDidYouKnowOther"
                value={formData.howDidYouKnowOther}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Como você conheceu o grupo?"
              />
            </div>
          )}

          {/* Bio (only for register) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio (opcional)
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Desenvolvedor Full Stack | React & Node.js"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </>
            ) : (
              mode === 'login' ? 'Entrar' : 'Criar Conta'
            )}
          </button>

          {/* Mode Switch */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              {' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {mode === 'login' ? 'Criar conta' : 'Fazer login'}
              </button>
            </p>
          </div>

          {/* Info for Register */}
          {mode === 'register' && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                💡 Após o cadastro, sua conta ficará pendente até ser aprovada por um administrador.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
