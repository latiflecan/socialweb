'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    toast.info('Déconnexion réussie');
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 fixed top-0 w-full z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1
          onClick={() => router.push('/home')}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          🌐 SocialWeb
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/explore')}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Explorer
          </button>
          <button
            onClick={() => router.push('/requests')}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Demandes
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Profil
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm transition"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
