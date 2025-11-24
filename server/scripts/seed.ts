import { sequelize, connectDB } from '../config/database';
import { User, Item, Comment } from '../models';

const INITIAL_USERS_DB = [
    {
        id: 'admin_1',
        name: 'Administrador',
        email: 'admin@vedovelli.com',
        role: 'ADMIN',
        status: 'APPROVED',
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
        role: 'USER',
        status: 'APPROVED',
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
        role: 'USER',
        status: 'APPROVED',
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
        role: 'USER',
        status: 'APPROVED',
        avatar: 'https://picsum.photos/seed/ana/200',
        bio: 'Frontend Developer',
        isPublicProfile: false
    },
    {
        id: 'u4',
        name: 'Maria Ops',
        email: 'maria@example.com',
        role: 'USER',
        status: 'APPROVED',
        avatar: 'https://picsum.photos/seed/maria/200',
        bio: 'DevOps Engineer',
        isPublicProfile: true,
        socialLinks: {
            linkedin: 'https://linkedin.com'
        }
    }
];

const INITIAL_ITEMS = [
    {
        id: '1',
        type: 'snippet',
        title: 'Autenticação JWT com Laravel',
        description: 'Configuração completa do guard de API utilizando Tymon JWT Auth para proteger rotas stateless.',
        category: 'Backend',
        authorId: 'u2',
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
            { id: 'c1', userId: 'u3', content: 'Ótimo snippet! Me salvou horas.', createdAt: '2023-10-26T12:00:00Z' },
            { id: 'c2', userId: 'u1', content: 'Poderia adicionar como fazer o refresh token também?', createdAt: '2023-10-27T09:00:00Z' }
        ]
    },
    {
        id: '2',
        type: 'file',
        title: 'Docker Compose para LEMP Stack',
        description: 'Arquivo docker-compose.yml pronto para uso com Nginx, MySQL 8 e PHP 8.2.',
        category: 'DevOps',
        authorId: 'u4',
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
        authorId: 'u1',
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
        authorId: 'u5', // Note: u5 doesn't exist in users DB, might need fixing or creation
        createdAt: '2023-11-05T11:00:00Z',
        url: 'https://roadmap.sh/frontend',
        comments: []
    }
];

const seed = async () => {
    await connectDB();

    try {
        // Sync database (force: true drops tables if they exist)
        await sequelize.sync({ force: true });
        console.log('Database synced!');

        // Create Users
        for (const user of INITIAL_USERS_DB) {
            await User.create(user);
        }
        console.log('Users seeded!');

        // Create Items and Comments
        for (const itemData of INITIAL_ITEMS) {
            // Handle missing author (u5 case)
            let authorId = itemData.authorId;
            const authorExists = INITIAL_USERS_DB.find(u => u.id === authorId);
            if (!authorExists) {
                console.warn(`Author ${authorId} not found for item ${itemData.id}, assigning to admin_1`);
                authorId = 'admin_1';
            }

            const { comments, ...itemProps } = itemData;
            const item = await Item.create({ ...itemProps, authorId });

            if (comments && comments.length > 0) {
                for (const comment of comments) {
                    await Comment.create({
                        id: comment.id,
                        itemId: item.id,
                        userId: comment.userId,
                        content: comment.content,
                        createdAt: comment.createdAt
                    });
                }
            }
        }
        console.log('Items and comments seeded!');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
