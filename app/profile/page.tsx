'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { User } from 'firebase/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.info('Déconnecté avec succès');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">🌐 SocialWeb</h1>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/home')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Accueil
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Profil
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </nav>

      <div className="min-h-screen pt-24 bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">👤 Profil utilisateur</h2>
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner mb-6">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold text-blue-600">Courriel :</span>{' '}
              {user.email}
            </p>
            <p className="text-gray-600 mt-2 break-words">
              <span className="font-semibold text-purple-600">UID :</span>{' '}
              {user.uid}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
